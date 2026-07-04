import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  listAddresses,
  upsertAddress,
  deleteAddress,
  setDefaultAddress,
  type AddressInput,
} from "./api";

export function useAddresses() {
  return useQuery({ queryKey: ["addresses"], queryFn: listAddresses });
}

export function useUpsertAddress() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: AddressInput) => upsertAddress(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["addresses"] }),
  });
}

export function useDeleteAddress() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteAddress(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["addresses"] }),
  });
}

export function useSetDefaultAddress() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => setDefaultAddress(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["addresses"] }),
  });
}