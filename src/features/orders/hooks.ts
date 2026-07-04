import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  listMyOrders,
  listAllOrders,
  getOrderById,
  getOrderByNumber,
  placeOrder,
  updateOrderStatus,
  listActiveCoupons,
  type PlaceOrderInput,
  type OrderStatus,
} from "./api";

export function useMyOrders() {
  return useQuery({ queryKey: ["my-orders"], queryFn: listMyOrders });
}

export function useOrder(id: string | null | undefined) {
  return useQuery({
    queryKey: ["order", id],
    queryFn: () => getOrderById(id!),
    enabled: !!id,
  });
}

export function useOrderByNumber(number: string | null | undefined) {
  return useQuery({
    queryKey: ["order-number", number],
    queryFn: () => getOrderByNumber(number!),
    enabled: !!number,
  });
}

export function useAdminOrders(filters: Parameters<typeof listAllOrders>[0] = {}) {
  return useQuery({
    queryKey: ["admin-orders", filters],
    queryFn: () => listAllOrders(filters),
  });
}

export function usePlaceOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: PlaceOrderInput) => placeOrder(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my-orders"] });
      qc.invalidateQueries({ queryKey: ["admin-orders"] });
      qc.invalidateQueries({ queryKey: ["inventory"] });
      qc.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

export function useUpdateOrderStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (v: { orderId: string; status: OrderStatus; note?: string }) =>
      updateOrderStatus(v.orderId, v.status, v.note),
    onSuccess: (_data, v) => {
      qc.invalidateQueries({ queryKey: ["my-orders"] });
      qc.invalidateQueries({ queryKey: ["admin-orders"] });
      qc.invalidateQueries({ queryKey: ["order", v.orderId] });
      qc.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

export function useActiveCoupons() {
  return useQuery({ queryKey: ["coupons-active"], queryFn: listActiveCoupons });
}