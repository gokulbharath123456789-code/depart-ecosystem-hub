import { create } from "zustand";
import { persist } from "zustand/middleware";

type Theme = "light" | "dark" | "system";

type AdminState = {
  sidebarCollapsed: boolean;
  theme: Theme;
  commandOpen: boolean;
  notificationsOpen: boolean;
  favorites: string[];
  recents: string[];
  toggleSidebar: () => void;
  setTheme: (t: Theme) => void;
  setCommandOpen: (v: boolean) => void;
  setNotificationsOpen: (v: boolean) => void;
  toggleFavorite: (path: string) => void;
  pushRecent: (path: string) => void;
};

export const useAdminStore = create<AdminState>()(
  persist(
    (set, get) => ({
      sidebarCollapsed: false,
      theme: "system",
      commandOpen: false,
      notificationsOpen: false,
      favorites: ["/admin/orders", "/admin/products"],
      recents: [],
      toggleSidebar: () => set({ sidebarCollapsed: !get().sidebarCollapsed }),
      setTheme: (theme) => {
        set({ theme });
        applyTheme(theme);
      },
      setCommandOpen: (commandOpen) => set({ commandOpen }),
      setNotificationsOpen: (notificationsOpen) => set({ notificationsOpen }),
      toggleFavorite: (path) => {
        const fav = get().favorites;
        set({
          favorites: fav.includes(path) ? fav.filter((p) => p !== path) : [path, ...fav].slice(0, 8),
        });
      },
      pushRecent: (path) => {
        const rec = get().recents.filter((p) => p !== path);
        set({ recents: [path, ...rec].slice(0, 6) });
      },
    }),
    { name: "depart-admin" },
  ),
);

export function applyTheme(theme: Theme) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  const dark =
    theme === "dark" ||
    (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  root.classList.toggle("dark", dark);
}