import { create } from "zustand";

interface ShellState {
  isSidebarCollapsed: boolean;
  isCommandPaletteOpen: boolean;
  zenMode: boolean;
  mechanicalSoundEnabled: boolean;
  keyboardLayout: string;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleCommandPalette: () => void;
  setCommandPaletteOpen: (open: boolean) => void;
  toggleZenMode: () => void;
  setZenMode: (enabled: boolean) => void;
  toggleMechanicalSound: () => void;
  setKeyboardLayout: (layout: string) => void;
}

const getInitialSidebarState = (): boolean => {
  if (typeof window === "undefined") return false;
  try {
    const saved = localStorage.getItem("typing_trainer_sidebar_collapsed");
    return saved ? JSON.parse(saved) : false;
  } catch {
    return false;
  }
};

export const useShellStore = create<ShellState>((set) => ({
  isSidebarCollapsed: getInitialSidebarState(),
  isCommandPaletteOpen: false,
  zenMode: false,
  mechanicalSoundEnabled: false,
  keyboardLayout: "QWERTY • US",

  toggleSidebar: () =>
    set((state) => {
      const next = !state.isSidebarCollapsed;
      try {
        localStorage.setItem(
          "typing_trainer_sidebar_collapsed",
          JSON.stringify(next),
        );
      } catch {
        // ignore localStorage errors
      }
      return { isSidebarCollapsed: next };
    }),

  setSidebarCollapsed: (collapsed: boolean) => {
    try {
      localStorage.setItem(
        "typing_trainer_sidebar_collapsed",
        JSON.stringify(collapsed),
      );
    } catch {
      // ignore localStorage errors
    }
    set({ isSidebarCollapsed: collapsed });
  },

  toggleCommandPalette: () =>
    set((state) => ({ isCommandPaletteOpen: !state.isCommandPaletteOpen })),

  setCommandPaletteOpen: (open: boolean) =>
    set({ isCommandPaletteOpen: open }),

  toggleZenMode: () =>
    set((state) => ({ zenMode: !state.zenMode })),

  setZenMode: (enabled: boolean) =>
    set({ zenMode: enabled }),

  toggleMechanicalSound: () =>
    set((state) => ({ mechanicalSoundEnabled: !state.mechanicalSoundEnabled })),

  setKeyboardLayout: (layout: string) =>
    set({ keyboardLayout: layout }),
}));
