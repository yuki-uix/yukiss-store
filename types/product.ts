/** 库存与上架 */
export type StockStatus = "in_stock" | "low_stock" | "out_of_stock" | "preorder";

/** 形态：对齐主导航 / 分类 taxonomy（阶段一） */
export type PrimaryForm =
  | "notebook"
  | "traveler"
  | "binder"
  | "accessories"
  | "limited";

/** 二级分类 slug：与路径 `/products/[form]/[subcategory]` 一致 */
export type SubcategorySlug = string;

/** 尺寸：筛选器与规格 */
export type SizeDimension =
  | "a5"
  | "a6"
  | "b6"
  | "tn_regular"
  | "tn_passport"
  | "other";

/** 材质：筛选器 */
export type Material =
  | "leather"
  | "canvas"
  | "pu"
  | "fabric"
  | "paper"
  | "other";

/**
 * 场景标签：阶段一仅在 PDP / 内链 / 数据层使用；
 * 阶段二可生成 `/collections/[scene]` 且改 index 策略
 */
export type SceneTag =
  | "daily_journal"
  | "travel"
  | "creative_sketch"
  | "gift";

/** 人群：阶段一不对外筛选，字段预留 */
export type AudienceTag = "beginner" | "intermediate" | "enthusiast";

export type PriceBucket =
  | "under_200"
  | "200_400"
  | "400_600"
  | "over_600";

export interface ProductImage {
  url: string;
  alt: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  primaryForm: PrimaryForm;
  subcategorySlug: SubcategorySlug;
  sceneTags: SceneTag[];
  audienceTags: AudienceTag[];
  size: SizeDimension;
  material: Material;
  price: number;
  compareAtPrice?: number;
  priceBucket?: PriceBucket;
  stockStatus: StockStatus;
  seoTitle?: string;
  seoDescription?: string;
  images: ProductImage[];
  createdAt: string;
  updatedAt: string;
}

export function isPrimaryForm(value: string): value is PrimaryForm {
  return (
    value === "notebook" ||
    value === "traveler" ||
    value === "binder" ||
    value === "accessories" ||
    value === "limited"
  );
}
