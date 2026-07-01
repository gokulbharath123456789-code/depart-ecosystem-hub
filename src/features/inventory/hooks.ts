import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  adjustInventory,
  listBatches,
  listInventory,
  listStockMovements,
  transferInventory,
  type StockMovementKind,
} from "./api";

export const invKeys = {
  inventory: (opts?: Parameters<typeof listInventory>[0]) => ["inventory", opts ?? {}] as const,
  movements: (opts?: Parameters<typeof listStockMovements>[0]) => ["stock-movements", opts ?? {}] as const,
  batches: ["batches"] as const,
};

export const useInventory = (opts?: Parameters<typeof listInventory>[0]) =>
  useQuery({ queryKey: invKeys.inventory(opts), queryFn: () => listInventory(opts) });

export const useStockMovements = (opts?: Parameters<typeof listStockMovements>[0]) =>
  useQuery({ queryKey: invKeys.movements(opts), queryFn: () => listStockMovements(opts) });

export const useBatches = () =>
  useQuery({ queryKey: invKeys.batches, queryFn: listBatches });

export function useAdjustInventory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: adjustInventory,
    onSuccess: () => {
      toast.success("Stock updated");
      qc.invalidateQueries({ queryKey: ["inventory"] });
      qc.invalidateQueries({ queryKey: ["stock-movements"] });
      qc.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useTransferInventory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: transferInventory,
    onSuccess: () => {
      toast.success("Transfer complete");
      qc.invalidateQueries({ queryKey: ["inventory"] });
      qc.invalidateQueries({ queryKey: ["stock-movements"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export type { StockMovementKind };