import { create } from "zustand";
import type { FulfillStatus } from "@/features/admin/mock/ops";

type OpsView = "kanban" | "table" | "timeline";

type OpsState = {
  selected: string[];
  toggleSelect: (id: string) => void;
  selectMany: (ids: string[]) => void;
  clear: () => void;

  view: OpsView;
  setView: (v: OpsView) => void;

  // Local status overrides — lets the UI feel "live" without a backend
  statusOverrides: Record<string, FulfillStatus>;
  setStatus: (id: string, s: FulfillStatus) => void;
  setStatusMany: (ids: string[], s: FulfillStatus) => void;

  // Workflow toggles
  workflowEnabled: Record<string, boolean>;
  toggleWorkflow: (id: string) => void;
};

export const useOpsStore = create<OpsState>((set) => ({
  selected: [],
  toggleSelect: (id) =>
    set((s) => ({ selected: s.selected.includes(id) ? s.selected.filter((x) => x !== id) : [...s.selected, id] })),
  selectMany: (ids) => set({ selected: ids }),
  clear: () => set({ selected: [] }),

  view: "kanban",
  setView: (view) => set({ view }),

  statusOverrides: {},
  setStatus: (id, s) => set((st) => ({ statusOverrides: { ...st.statusOverrides, [id]: s } })),
  setStatusMany: (ids, s) =>
    set((st) => ({
      statusOverrides: { ...st.statusOverrides, ...Object.fromEntries(ids.map((id) => [id, s])) },
      selected: [],
    })),

  workflowEnabled: { "WF-001": true, "WF-002": true, "WF-003": true, "WF-004": true, "WF-005": false },
  toggleWorkflow: (id) =>
    set((s) => ({ workflowEnabled: { ...s.workflowEnabled, [id]: !s.workflowEnabled[id] } })),
}));
