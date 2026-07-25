import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { categories } from "@/mock/categories";

export function CategoryGrid() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 lg:grid-cols-8">
      {categories.map((c, i) => (
        <motion.div
          key={c.id}
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ delay: i * 0.04, duration: 0.3 }}
        >
          <Link
            to="/category/$slug"
            params={{ slug: c.slug }}
            className="group relative flex h-full flex-col items-center gap-3 overflow-hidden rounded-3xl bg-card p-5 text-center ring-1 ring-border/60 transition-all duration-300 hover:-translate-y-1.5 hover:ring-primary/40 hover:lift-shadow"
          >
            <div
              className={`grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br ${c.gradient} shadow-sm ring-1 ring-white/60 transition-transform duration-300 group-hover:scale-110`}
            >
              <c.icon className="h-7 w-7 text-foreground/80" strokeWidth={1.8} />
            </div>
            <div>
              <div className="text-sm font-bold text-foreground">{c.name}</div>
              <div className="mt-0.5 text-[11px] text-muted-foreground">{c.itemCount} items</div>
            </div>
            <ArrowRight className="absolute right-3 top-3 h-3.5 w-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
