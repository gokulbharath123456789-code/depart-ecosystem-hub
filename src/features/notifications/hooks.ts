import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { listMyNotifications, markAllRead, markNotificationRead } from "./api";

export function useMyNotifications() {
  return useQuery({ queryKey: ["notifications"], queryFn: listMyNotifications });
}

export function useMarkNotificationRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => markNotificationRead(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
  });
}

export function useMarkAllRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => markAllRead(),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
  });
}