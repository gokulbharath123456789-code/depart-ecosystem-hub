import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/storefront/Hero";
import { FlashSale } from "@/components/storefront/FlashSale";
import { Section } from "@/components/storefront/Section";
import { CategoryGrid } from "@/components/storefront/CategoryGrid";
import { ProductRail } from "@/components/storefront/ProductRail";
import { BrandsMarquee } from "@/components/storefront/BrandsMarquee";
import { OffersBento } from "@/components/storefront/OffersBento";
import { Testimonials } from "@/components/storefront/Testimonials";
import { DeliveryStrip } from "@/components/storefront/DeliveryStrip";
import { Newsletter } from "@/components/storefront/Newsletter";
import { products } from "@/mock/products";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SREE SUPER MART — Premium supermarket, delivered in 10 minutes" },
      { name: "description", content: "Shop fresh produce, premium pantry, household essentials and more from SREE SUPER MART." },
      { property: "og:title", content: "SREE SUPER MART — Premium supermarket, delivered in 10 minutes" },
      { property: "og:description", content: "12,000+ products. Beautifully merchandised. Delivered fast." },
    ],
  }),
  component: Index,
});

function Index() {
  const featured = products.slice(0, 10);
  const bestSellers = products.filter((p) => p.tags.includes("bestseller")).slice(0, 5);

  return (
    <div>
      <Hero />
      <FlashSale />
      <Section eyebrow="Browse" title="Shop by category" subtitle="Everything you need, organized the way you shop." to="/shop">
        <CategoryGrid />
      </Section>
      <Section eyebrow="Featured" title="Fresh today" subtitle="Hand-picked by our merchandising team." to="/shop">
        <ProductRail products={featured.slice(0, 5)} />
      </Section>
      <Section eyebrow="Offers" title="Combos & curated boxes">
        <OffersBento />
      </Section>
      <Section eyebrow="Bestsellers" title="Loved by thousands" to="/shop">
        <ProductRail products={bestSellers} />
      </Section>
      <Section eyebrow="Trusted brands" title="From the names you know">
        <BrandsMarquee />
      </Section>
      <Section eyebrow="Why SREE SUPER MART" title="Built for the way you shop">
        <DeliveryStrip />
      </Section>
      <Section eyebrow="Reviews" title="Real stories from real customers">
        <Testimonials />
      </Section>
      <section className="mx-auto mt-16 max-w-7xl px-4 lg:px-6">
        <Newsletter />
      </section>
    </div>
  );
}
