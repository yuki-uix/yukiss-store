import Link from "next/link";
import {
  FILTER_LABELS,
  type ProductListFilters,
  buildFilterSearchParams,
} from "@/lib/filters";
import type { Material, PriceBucket, SizeDimension, StockStatus } from "@/types/product";

function omitKey<K extends keyof ProductListFilters>(
  current: ProductListFilters,
  key: K,
): ProductListFilters {
  const next = { ...current };
  delete next[key];
  return next;
}

function Chip({
  basePath,
  next,
  label,
  active,
}: {
  basePath: string;
  next: ProductListFilters;
  label: string;
  active: boolean;
}) {
  const qs = buildFilterSearchParams(next).toString();
  const href = qs ? `${basePath}?${qs}` : basePath;
  return (
    <Link href={href} data-active={active ? "true" : undefined}>
      {label}
    </Link>
  );
}

const SIZES: SizeDimension[] = [
  "a5",
  "a6",
  "b6",
  "tn_regular",
  "tn_passport",
  "other",
];

const MATERIALS: Material[] = ["leather", "canvas", "pu", "fabric"];

const PRICES: PriceBucket[] = [
  "under_200",
  "200_400",
  "400_600",
  "over_600",
];

const STOCKS: (StockStatus | "in_stock_only")[] = [
  "in_stock_only",
  "in_stock",
  "low_stock",
  "preorder",
  "out_of_stock",
];

export function ProductFilters({
  basePath,
  current,
}: {
  basePath: string;
  current: ProductListFilters;
}) {
  return (
    <section className="filters" aria-label="商品筛选">
      <h2>筛选</h2>

      <div className="filter-row">
        <span className="filter-label">尺寸</span>
        <div className="filter-chips">
          <Chip
            basePath={basePath}
            next={omitKey(current, "size")}
            label="全部"
            active={current.size === undefined}
          />
          {SIZES.map((s) => (
            <Chip
              key={s}
              basePath={basePath}
              next={{ ...current, size: s }}
              label={FILTER_LABELS.size[s]}
              active={current.size === s}
            />
          ))}
        </div>
      </div>

      <div className="filter-row">
        <span className="filter-label">材质</span>
        <div className="filter-chips">
          <Chip
            basePath={basePath}
            next={omitKey(current, "material")}
            label="全部"
            active={current.material === undefined}
          />
          {MATERIALS.map((m) => (
            <Chip
              key={m}
              basePath={basePath}
              next={{ ...current, material: m }}
              label={FILTER_LABELS.material[m]}
              active={current.material === m}
            />
          ))}
        </div>
      </div>

      <div className="filter-row">
        <span className="filter-label">价格</span>
        <div className="filter-chips">
          <Chip
            basePath={basePath}
            next={omitKey(current, "price")}
            label="全部"
            active={current.price === undefined}
          />
          {PRICES.map((p) => (
            <Chip
              key={p}
              basePath={basePath}
              next={{ ...current, price: p }}
              label={FILTER_LABELS.price[p]}
              active={current.price === p}
            />
          ))}
        </div>
      </div>

      <div className="filter-row">
        <span className="filter-label">库存</span>
        <div className="filter-chips">
          <Chip
            basePath={basePath}
            next={omitKey(current, "stock")}
            label="全部"
            active={current.stock === undefined}
          />
          {STOCKS.map((s) => (
            <Chip
              key={s}
              basePath={basePath}
              next={{ ...current, stock: s }}
              label={FILTER_LABELS.stock[s]}
              active={current.stock === s}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
