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
import { DeliveryInfo } from "@/components/storefront/DeliveryInfo";
import { Newsletter } from "@/components/storefront/Newsletter";
import { products } from "@/mock/products";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SREE SUPER MART | Online Grocery & Department Store in Coimbatore" },
      {
        name: "description",
        content:
          "Order fresh groceries, vegetables, fruits, dairy, bakery, beverages, household essentials and personal care products online from SREE SUPER MART, Coimbatore.",
      },
      {
        property: "og:title",
        content: "SREE SUPER MART | Online Grocery & Department Store in Coimbatore",
      },
      {
        property: "og:description",
        content: "Fresh groceries. Trusted quality. Everyday savings — delivered across Coimbatore.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const featured = products.slice(0, 5);
  const bestSellers = products.filter((p) => p.tags.includes("bestseller")).slice(0, 5);

  return (
    <div className="pb-10">
      <Hero />

      <FlashSale />

      <Section
        eyebrow="Browse"
        title="Shop by category"
        subtitle="Everything you need, organized the way you shop."
        to="/shop"
      >
        <CategoryGrid />
      </Section>

      <Section
        eyebrow="Featured"
        title="Fresh today"
        subtitle="Hand-picked by our merchandising team and restocked every morning."
        to="/shop"
      >
        <ProductRail products={featured} />
      </Section>

      <Section eyebrow="Seasonal specials" title="Combos & curated boxes">
        <OffersBento />
      </Section>

      <Section
        eyebrow="Bestsellers"
        title="Loved by thousands"
        subtitle="The Coimbatore favourites flying off our shelves."
        to="/shop"
      >
        <ProductRail products={bestSellers} />
      </Section>

      <Section eyebrow="Why SREE SUPER MART" title="Built for the way you shop">
        <DeliveryStrip />
      </Section>

      <Section eyebrow="Delivery" title="Fast, flexible, and reliable">
        <DeliveryInfo />
      </Section>

      <Section eyebrow="Trusted brands" title="From the names you know">
        <BrandsMarquee />
      </Section>

      <Section eyebrow="Reviews" title="Real stories from Coimbatore">
        <Testimonials />
      </Section>

      <section className="mx-auto mt-16 max-w-7xl px-4 lg:px-6">
        <Newsletter />
      </section>
    </div>
  );
}
