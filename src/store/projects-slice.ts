import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Project } from "@/types";
import { getSupabase } from "@/lib/services/supabase/client";

interface ErrorDetail {
  message: string;
  code?: number;
}

interface ProjectsState {
  projects: Project[];
  status: "initial" | "pending" | "fulfilled" | "rejected";
  error: ErrorDetail | null;
}

const initialState: ProjectsState = {
  projects: [],
  status: "initial",
  error: null,
};

export const getProjectsData = createAsyncThunk<
  Project[],
  void,
  { rejectValue: ErrorDetail; state: { projects: ProjectsState } }
>(
  "projects/getProjectsData",
  async (_, { rejectWithValue }) => {
    try {
      const { data: projects, error } = await getSupabase()
        .from("Project")
        .select()
        .order("date", { ascending: false });

      if (error) {
        return rejectWithValue({
          message: error.message,
          code: +error.code,
        });
      }

      if (!projects) {
        return rejectWithValue({
          message: "No projects found",
        });
      }

      return projects as Project[];
    } catch (error: any) {
      return rejectWithValue({
        message: error.message,
        code: error.response?.status,
      });
    }
  },
  {
    // Desktop dock and mobile windows both dispatch this; only fetch once.
    condition: (_, { getState }) => {
      const { status } = getState().projects;
      return status === "initial" || status === "rejected";
    },
  }
);

const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getProjectsData.pending, (state) => {
        state.status = "pending";
        state.error = null;
      })
      .addCase(
        getProjectsData.fulfilled,
        (state, action: PayloadAction<Project[]>) => {
          state.status = "fulfilled";
          state.projects = action.payload;
        }
      )

      .addCase(getProjectsData.rejected, (state, action) => {
        state.status = "rejected";
        state.error = action.payload ?? { message: "Unknown error" };
      });
  },
});

export const projectsReducer = projectsSlice.reducer;
