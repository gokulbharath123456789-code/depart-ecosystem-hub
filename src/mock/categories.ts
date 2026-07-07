import { Apple, Milk, Croissant, CupSoda, Cookie, SprayCan, Droplets, Wheat } from "lucide-react";
import type { Category } from "@/types";

export const categories: Category[] = [
  { id: "c1", slug: "fruits-veg",    name: "Fruits & Veg",   emoji: "🥬", icon: Apple,     gradient: "from-emerald-200 to-lime-100",  itemCount: 248 },
  { id: "c2", slug: "dairy-eggs",    name: "Dairy & Eggs",   emoji: "🥛", icon: Milk,      gradient: "from-sky-100 to-blue-50",       itemCount: 124 },
  { id: "c3", slug: "bakery",        name: "Bakery",         emoji: "🥐", icon: Croissant, gradient: "from-amber-100 to-orange-50",   itemCount: 86  },
  { id: "c4", slug: "beverages",     name: "Beverages",      emoji: "🥤", icon: CupSoda,   gradient: "from-rose-100 to-pink-50",      itemCount: 192 },
  { id: "c5", slug: "snacks",        name: "Snacks",         emoji: "🍿", icon: Cookie,    gradient: "from-yellow-100 to-amber-50",   itemCount: 318 },
  { id: "c6", slug: "household",     name: "Household",      emoji: "🧴", icon: SprayCan,  gradient: "from-indigo-100 to-violet-50",  itemCount: 142 },
  { id: "c7", slug: "personal-care", name: "Personal Care",  emoji: "🧖", icon: Droplets,  gradient: "from-fuchsia-100 to-pink-50",   itemCount: 168 },
  { id: "c8", slug: "pantry",        name: "Pantry",         emoji: "🥫", icon: Wheat,     gradient: "from-stone-100 to-amber-50",    itemCount: 264 },
];