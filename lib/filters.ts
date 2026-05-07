import type { Material, PriceBucket, Product, SizeDimension, StockStatus } from "@/types/product";

export interface ProductListFilters {
  size?: SizeDimension;
  material?: Material;
  price?: PriceBucket;
  stock?: StockStatus | "in_stock_only";
}

const SIZE_VALUES: SizeDimension[] = [
  "a5",
  "a6",
  "b6",
  "tn_regular",
  "tn_passport",
  "other",
];

const MATERIAL_VALUES: Material[] = [
  "leather",
  "canvas",
  "pu",
  "fabric",
  "paper",
  "other",
];

const PRICE_VALUES: PriceBucket[] = [
  "under_200",
  "200_400",
  "400_600",
  "over_600",
];

const STOCK_VALUES: StockStatus[] = [
  "in_stock",
  "low_stock",
  "out_of_stock",
  "preorder",
];

export function parseProductListFilters(
  searchParams: Record<string, string | string[] | undefined>,
): ProductListFilters {
  const raw = (key: string): string | undefined => {
    const v = searchParams[key];
    if (Array.isArray(v)) return v[0];
    return v;
  };

  const sizeRaw = raw("size");
  const size =
    sizeRaw && SIZE_VALUES.includes(sizeRaw as SizeDimension)
      ? (sizeRaw as SizeDimension)
      : undefined;

  const materialRaw = raw("material");
  const material =
    materialRaw && MATERIAL_VALUES.includes(materialRaw as Material)
      ? (materialRaw as Material)
      : undefined;

  const priceRaw = raw("price");
  const price =
    priceRaw && PRICE_VALUES.includes(priceRaw as PriceBucket)
      ? (priceRaw as PriceBucket)
      : undefined;

  const stockRaw = raw("stock");
  let stock: ProductListFilters["stock"];
  if (stockRaw === "in_stock_only") {
    stock = "in_stock_only";
  } else if (stockRaw && STOCK_VALUES.includes(stockRaw as StockStatus)) {
    stock = stockRaw as StockStatus;
  }

  return { size, material, price, stock };
}

function matchesStock(p: Product, stock: ProductListFilters["stock"]): boolean {
  if (!stock) return true;
  if (stock === "in_stock_only") {
    return p.stockStatus === "in_stock" || p.stockStatus === "low_stock";
  }
  return p.stockStatus === stock;
}

export function applyProductListFilters(
  products: Product[],
  filters: ProductListFilters,
): Product[] {
  return products.filter((p) => {
    if (filters.size && p.size !== filters.size) return false;
    if (filters.material && p.material !== filters.material) return false;
    const bucket = p.priceBucket ?? inferPriceBucket(p.price);
    if (filters.price && bucket !== filters.price) return false;
    if (!matchesStock(p, filters.stock)) return false;
    return true;
  });
}

function inferPriceBucket(price: number): PriceBucket {
  if (price < 200) return "under_200";
  if (price < 400) return "200_400";
  if (price < 600) return "400_600";
  return "over_600";
}

/** 用于 canonical：去掉与当前分类冗余的 size（可选优化，此处仅导出构建查询用） */
export function buildFilterSearchParams(
  filters: ProductListFilters,
): URLSearchParams {
  const q = new URLSearchParams();
  if (filters.size) q.set("size", filters.size);
  if (filters.material) q.set("material", filters.material);
  if (filters.price) q.set("price", filters.price);
  if (filters.stock) q.set("stock", filters.stock);
  return q;
}

export const FILTER_LABELS = {
  size: {
    a5: "A5",
    a6: "A6",
    b6: "B6",
    tn_regular: "TN 标准",
    tn_passport: "TN 护照",
    other: "其他",
  } as Record<SizeDimension, string>,
  material: {
    leather: "牛皮 / 真皮",
    canvas: "帆布",
    pu: "PU",
    fabric: "布面",
    paper: "纸品",
    other: "其他",
  } as Record<Material, string>,
  price: {
    under_200: "¥200 以下",
    "200_400": "¥200 – 400",
    "400_600": "¥400 – 600",
    over_600: "¥600 以上",
  } as Record<PriceBucket, string>,
  stock: {
    in_stock: "现货",
    low_stock: "库存紧张",
    out_of_stock: "缺货",
    preorder: "预售",
    in_stock_only: "仅看可购买",
  },
} as const;
