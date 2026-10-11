import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

// Lets other windows ask Internet Explorer to load a page.
interface BrowserState {
  pendingUrl: string | null;
}

const initialState: BrowserState = {
  pendingUrl: null,
};

const browserSlice = createSlice({
  name: "browser",
  initialState,
  reducers: {
    openUrl(state, action: PayloadAction<string>) {
      state.pendingUrl = action.payload;
    },
    clearPendingUrl(state) {
      state.pendingUrl = null;
    },
  },
});

export const { openUrl, clearPendingUrl } = browserSlice.actions;

export const browserReducer = browserSlice.reducer;
