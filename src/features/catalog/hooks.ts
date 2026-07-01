import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  archiveProduct,
  createBrand,
  createCategory,
  createProduct,
  createSupplier,
  createWarehouse,
  deleteProduct,
  getProductBySlug,
  listBrands,
  listCategories,
  listProducts,
  listSuppliers,
  listWarehouses,
  updateCategory,
  updateProduct,
  updateSupplier,
  type CreateProductInput,
  type ProductListFilters,
} from "./api";

export const qk = {
  categories: ["categories"] as const,
  brands: ["brands"] as const,
  suppliers: ["suppliers"] as const,
  warehouses: ["warehouses"] as const,
  products: (f?: ProductListFilters) => ["products", f ?? {}] as const,
  product: (slug: string) => ["product", slug] as const,
};

export const useCategories = () =>
  useQuery({ queryKey: qk.categories, queryFn: listCategories });
export const useBrands = () =>
  useQuery({ queryKey: qk.brands, queryFn: listBrands });
export const useSuppliers = () =>
  useQuery({ queryKey: qk.suppliers, queryFn: listSuppliers });
export const useWarehouses = () =>
  useQuery({ queryKey: qk.warehouses, queryFn: listWarehouses });

export const useProducts = (filters?: ProductListFilters) =>
  useQuery({ queryKey: qk.products(filters), queryFn: () => listProducts(filters) });

export const useProduct = (slug: string) =>
  useQuery({ queryKey: qk.product(slug), queryFn: () => getProductBySlug(slug), enabled: !!slug });

export function useCreateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateProductInput) => createProduct(input),
    onSuccess: () => {
      toast.success("Product created");
      qc.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useUpdateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (v: { id: string; patch: Parameters<typeof updateProduct>[1] }) =>
      updateProduct(v.id, v.patch),
    onSuccess: () => {
      toast.success("Product updated");
      qc.invalidateQueries({ queryKey: ["products"] });
      qc.invalidateQueries({ queryKey: ["product"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useArchiveProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => archiveProduct(id),
    onSuccess: () => {
      toast.success("Archived");
      qc.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useDeleteProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: () => {
      toast.success("Deleted");
      qc.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useCreateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      toast.success("Category added");
      qc.invalidateQueries({ queryKey: qk.categories });
    },
    onError: (e: Error) => toast.error(e.message),
  });
}
export function useUpdateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (v: { id: string; patch: Parameters<typeof updateCategory>[1] }) =>
      updateCategory(v.id, v.patch),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.categories }),
    onError: (e: Error) => toast.error(e.message),
  });
}
export function useCreateBrand() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createBrand,
    onSuccess: () => {
      toast.success("Brand added");
      qc.invalidateQueries({ queryKey: qk.brands });
    },
    onError: (e: Error) => toast.error(e.message),
  });
}
export function useCreateSupplier() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createSupplier,
    onSuccess: () => {
      toast.success("Supplier added");
      qc.invalidateQueries({ queryKey: qk.suppliers });
    },
    onError: (e: Error) => toast.error(e.message),
  });
}
export function useUpdateSupplier() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (v: { id: string; patch: Parameters<typeof updateSupplier>[1] }) =>
      updateSupplier(v.id, v.patch),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.suppliers }),
    onError: (e: Error) => toast.error(e.message),
  });
}
export function useCreateWarehouse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createWarehouse,
    onSuccess: () => {
      toast.success("Warehouse added");
      qc.invalidateQueries({ queryKey: qk.warehouses });
    },
    onError: (e: Error) => toast.error(e.message),
  });
}