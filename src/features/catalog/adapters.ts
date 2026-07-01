import type { Product } from "@/types";
import type { ProductWithRefs } from "./api";

const GRADIENTS = [
  "from-amber-100 to-orange-50",
  "from-emerald-100 to-lime-50",
  "from-sky-100 to-cyan-50",
  "from-rose-100 to-pink-50",
  "from-violet-100 to-fuchsia-50",
  "from-yellow-100 to-amber-50",
];
const EMOJI_BY_CAT: Record<string, string> = {
  "fruits-vegetables": "🥦",
  "dairy-eggs": "🥛",
  "bakery": "🥖",
  "meat-seafood": "🐟",
  "beverages": "🥤",
  "snacks": "🍿",
  "pantry": "🌾",
  "frozen": "🧊",
  "household": "🧴",
  "personal-care": "🧼",
  "baby-care": "🍼",
};

const TAG_WHITELIST = new Set([
  "organic",
  "bestseller",
  "new",
  "vegan",
  "imported",
  "low-fat",
]);

function hash(str: string) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function toUiProduct(p: ProductWithRefs): Product & {
  imageUrl?: string | null;
} {
  const primaryImg =
    p.images.find((i) => i.is_primary)?.url ?? p.images[0]?.url ?? null;
  const stock = p.inventory.reduce((s, i) => s + (i.on_hand - i.reserved), 0);
  const catSlug = p.category?.slug ?? "pantry";
  const gradient = GRADIENTS[hash(p.id) % GRADIENTS.length];
  const emoji = EMOJI_BY_CAT[catSlug] ?? "🛒";
  const tags = (p.tags ?? []).filter((t): t is Product["tags"][number] =>
    TAG_WHITELIST.has(t),
  );

  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    brand: p.brand?.name ?? "Depart",
    categorySlug: catSlug,
    price: Number(p.price),
    mrp: Number(p.compare_at_price ?? p.price),
    unit: p.unit ?? "each",
    emoji,
    gradient,
    rating: 4.3 + (hash(p.id) % 7) / 10,
    reviewCount: 40 + (hash(p.slug) % 900),
    deliveryMins: 15 + (hash(p.id) % 20),
    stock,
    tags,
    description: p.description ?? "",
    imageUrl: primaryImg,
  };
}