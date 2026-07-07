import type { LucideIcon } from "lucide-react";

export type Category = {
  id: string;
  slug: string;
  name: string;
  emoji: string;
  icon: LucideIcon;
  gradient: string;
  itemCount: number;
};

export type Brand = {
  id: string;
  name: string;
  initial: string;
  tint: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  categorySlug: string;
  price: number;
  mrp: number;
  unit: string;
  emoji: string;
  gradient: string;
  rating: number;
  reviewCount: number;
  deliveryMins: number;
  stock: number;
  tags: ("organic" | "bestseller" | "new" | "vegan" | "imported" | "low-fat")[];
  description: string;
  nutrition?: { label: string; value: string }[];
  ingredients?: string[];
  storage?: string;
};

export type Testimonial = {
  id: string;
  name: string;
  initial: string;
  role: string;
  quote: string;
  rating: number;
};

export type CartItem = { productId: string; qty: number };