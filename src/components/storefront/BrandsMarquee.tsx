import { brands } from "@/mock/brands";

export function BrandsMarquee() {
  const list = [...brands, ...brands];
  return (
    <div className="overflow-hidden rounded-3xl border border-border/60 bg-card p-6 soft-shadow">
      <div className="ticker flex w-max gap-4">
        {list.map((b, i) => (
          <div
            key={`${b.id}-${i}`}
            className={`flex h-20 w-44 shrink-0 items-center gap-3 rounded-2xl bg-gradient-to-br ${b.tint} px-5`}
          >
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-white font-display text-xl font-extrabold text-foreground shadow-sm">
              {b.initial}
            </div>
            <div>
              <div className="text-sm font-bold text-foreground">{b.name}</div>
              <div className="text-[10px] uppercase tracking-wider text-foreground/55">
                Trusted brand
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
