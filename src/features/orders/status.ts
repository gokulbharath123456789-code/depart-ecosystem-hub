import type { OrderStatus } from "./api";

export const ORDER_STATUSES: OrderStatus[] = [
  "pending",
  "confirmed",
  "picking",
  "packing",
  "ready_for_dispatch",
  "out_for_delivery",
  "delivered",
  "completed",
  "cancelled",
  "returned",
  "refunded",
];

export const ADMIN_FLOW: OrderStatus[] = [
  "pending",
  "confirmed",
  "picking",
  "packing",
  "ready_for_dispatch",
  "out_for_delivery",
  "delivered",
  "completed",
];

export const STATUS_LABEL: Record<OrderStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  picking: "Picking",
  packing: "Packing",
  ready_for_dispatch: "Ready for dispatch",
  out_for_delivery: "Out for delivery",
  delivered: "Delivered",
  completed: "Completed",
  cancelled: "Cancelled",
  returned: "Returned",
  refunded: "Refunded",
};

export function statusColor(s: OrderStatus): string {
  switch (s) {
    case "delivered":
    case "completed":
      return "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400";
    case "cancelled":
    case "refunded":
      return "bg-rose-500/15 text-rose-700 dark:text-rose-400";
    case "returned":
      return "bg-amber-500/15 text-amber-700 dark:text-amber-400";
    case "out_for_delivery":
      return "bg-sky-500/15 text-sky-700 dark:text-sky-400";
    case "pending":
      return "bg-muted text-muted-foreground";
    default:
      return "bg-violet-500/15 text-violet-700 dark:text-violet-400";
  }
}

export function nextStatus(s: OrderStatus): OrderStatus | null {
  const i = ADMIN_FLOW.indexOf(s);
  if (i < 0 || i >= ADMIN_FLOW.length - 1) return null;
  return ADMIN_FLOW[i + 1];
}

export function canCustomerCancel(s: OrderStatus) {
  return s === "pending" || s === "confirmed";
}

export function formatDate(s: string) {
  return new Date(s).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatTime(s: string) {
  return new Date(s).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}