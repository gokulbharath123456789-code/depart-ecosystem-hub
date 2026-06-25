import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { categories } from "@/mock/categories";

export function CategoryGrid() {
  return (
    <div className="grid grid-cols-3 gap-3 sm:grid-cols-5 sm:gap-4 lg:grid-cols-10">
      {categories.map((c, i) => (
        <motion.div
          key={c.id}
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ delay: i * 0.03, duration: 0.3 }}
        >
          <Link
            to="/category/$slug"
            params={{ slug: c.slug }}
            className={`group flex flex-col items-center gap-2 rounded-2xl bg-gradient-to-br ${c.gradient} p-4 ring-1 ring-border/40 transition hover:lift-shadow`}
          >
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-white/60 text-3xl shadow-sm transition group-hover:scale-110">
              {c.emoji}
            </div>
            <div className="text-center">
              <div className="text-xs font-bold text-foreground">{c.name}</div>
              <div className="text-[10px] text-foreground/55">{c.itemCount} items</div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}