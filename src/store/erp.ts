import { create } from "zustand";

export type SavedFilter = {
  id: string;
  name: string;
  query: string;
  status: string;
  category: string;
};

type ErpState = {
  selected: string[];
  toggleSelect: (id: string) => void;
  selectMany: (ids: string[]) => void;
  clear: () => void;

  savedFilters: SavedFilter[];
  saveFilter: (f: SavedFilter) => void;
  deleteFilter: (id: string) => void;

  visibleColumns: Record<string, boolean>;
  toggleColumn: (key: string) => void;
};

const defaultColumns: Record<string, boolean> = {
  image: true,
  sku: true,
  barcode: false,
  brand: true,
  category: true,
  supplier: true,
  cost: false,
  price: true,
  margin: true,
  stock: true,
  reserved: false,
  available: true,
  status: true,
  updated: false,
};

export const useErpStore = create<ErpState>((set, get) => ({
  selected: [],
  toggleSelect: (id) =>
    set((s) => ({ selected: s.selected.includes(id) ? s.selected.filter((x) => x !== id) : [...s.selected, id] })),
  selectMany: (ids) => set({ selected: ids }),
  clear: () => set({ selected: [] }),

  savedFilters: [
    { id: "sf1", name: "Low stock — Dairy", query: "", status: "all", category: "Dairy & Eggs" },
    { id: "sf2", name: "Drafts to review", query: "", status: "draft", category: "all" },
  ],
  saveFilter: (f) => set((s) => ({ savedFilters: [...s.savedFilters, f] })),
  deleteFilter: (id) => set((s) => ({ savedFilters: s.savedFilters.filter((x) => x.id !== id) })),

  visibleColumns: defaultColumns,
  toggleColumn: (key) =>
    set((s) => ({ visibleColumns: { ...s.visibleColumns, [key]: !s.visibleColumns[key] } })),
}));