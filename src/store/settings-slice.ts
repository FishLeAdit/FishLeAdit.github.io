import { themes } from "@/themes";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type WallpaperMode = "fill" | "tile" | "center" | "stretch";
export type Language = "en" | "pt" | "es" | "fr";
export type TimeFormat = "12h" | "24h";

export interface Theme {
  desktop: string;
  window: string;
  activeTitleStart: string;
  activeTitleEnd: string;
  inactiveTitle: string;
  text: string;
  buttonFace: string;
  buttonShadow: string;
}

export interface CoreSettings {
  wallpaper: string;
  wallpaperMode: WallpaperMode;
  theme: Theme;
}

export interface SettingsState {
  applied: CoreSettings;
  draft: CoreSettings;

  language: Language;
  timeFormat: TimeFormat;
  overrideDateTime: string | null;

  sound: SoundSettings;
}

export interface SoundSettings {
  volume: number; // 0-100
  muted: boolean;
}

const defaultCore: CoreSettings = {
  wallpaper: "/wallpaper/default.jpg",
  wallpaperMode: "tile",
  theme: themes["Windows Standard"],
};

const initialState: SettingsState = {
  applied: defaultCore,
  draft: defaultCore,

  language: "en",
  timeFormat: "24h",
  overrideDateTime: null,

  sound: { volume: 50, muted: false },
};

export const loadSettings = (): SettingsState | undefined => {
  if (typeof window === "undefined") return undefined;

  try {
    const serialized = localStorage.getItem("settings");
    if (!serialized) return undefined;

    const parsed = JSON.parse(serialized);

    return {
      ...initialState,
      ...parsed,
      applied: {
        ...defaultCore,
        ...(parsed.applied || {}),
      },
      draft: {
        ...defaultCore,
        ...(parsed.applied || {}),
      },
    };
  } catch {
    return undefined;
  }
};

const clone = <T>(obj: T): T => JSON.parse(JSON.stringify(obj));

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setWallpaper(state, action: PayloadAction<string>) {
      state.draft.wallpaper = action.payload;
    },

    setWallpaperMode(state, action: PayloadAction<WallpaperMode>) {
      state.draft.wallpaperMode = action.payload;
    },

    applySettings(state) {
      state.applied = clone(state.draft);
    },

    resetSettings(state) {
      state.draft = clone(state.applied);
    },

    setLanguage(state, action: PayloadAction<Language>) {
      state.language = action.payload;
    },

    setTimeFormat(state, action: PayloadAction<TimeFormat>) {
      state.timeFormat = action.payload;
    },

    setOverrideDateTime(state, action: PayloadAction<string | null>) {
      state.overrideDateTime = action.payload;
    },

    setTheme(state, action: PayloadAction<Theme>) {
      state.draft.theme = action.payload;
    },

    setVolume(state, action: PayloadAction<number>) {
      state.sound.volume = action.payload;
      state.sound.muted = action.payload === 0;
    },

    setMuted(state, action: PayloadAction<boolean>) {
      state.sound.muted = action.payload;
      if (!action.payload && state.sound.volume === 0) {
        state.sound.volume = 50;
      }
    },
  },
});

export const {
  setWallpaper,
  setWallpaperMode,
  applySettings,
  resetSettings,
  setLanguage,
  setTimeFormat,
  setOverrideDateTime,
  setTheme,
  setVolume,
  setMuted,
} = settingsSlice.actions;

export const settingsReducer = settingsSlice.reducer;
