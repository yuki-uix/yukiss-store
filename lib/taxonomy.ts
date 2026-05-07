import type { PrimaryForm, SceneTag } from "@/types/product";

export interface NavItem {
  slug: PrimaryForm;
  label: string;
  /** 二级：slug -> 展示名 */
  children: { slug: string; label: string }[];
}

/**
 * 主导航 + 次级导航（与 IA 文档一致）
 */
export const PRIMARY_NAV: NavItem[] = [
  {
    slug: "notebook",
    label: "手帐本",
    children: [
      { slug: "a6-planner", label: "A6 日程本" },
      { slug: "a5-grid", label: "A5 方格本" },
      { slug: "b6-blank", label: "B6 空白本" },
    ],
  },
  {
    slug: "traveler",
    label: "旅行者笔记本（TN）",
    children: [
      { slug: "regular", label: "标准尺寸" },
      { slug: "passport", label: "护照尺寸" },
    ],
  },
  {
    slug: "binder",
    label: "活页本",
    children: [
      { slug: "a5-6ring", label: "A5 六孔" },
      { slug: "b5-6ring", label: "B5 六孔" },
    ],
  },
  {
    slug: "accessories",
    label: "配件",
    children: [
      { slug: "bookmark", label: "书签" },
      { slug: "pen-loop", label: "笔夹" },
      { slug: "washi", label: "胶带" },
    ],
  },
  {
    slug: "limited",
    label: "限定",
    children: [
      { slug: "seasonal", label: "季节限定" },
      { slug: "collab", label: "联名款" },
    ],
  },
];

export const PRIMARY_FORMS = PRIMARY_NAV.map((n) => n.slug);

/** 场景：URL slug（collections） <-> SceneTag */
export const SCENE_SLUGS: Record<string, SceneTag> = {
  "daily-journal": "daily_journal",
  travel: "travel",
  "creative-sketch": "creative_sketch",
  gift: "gift",
};

export const SCENE_LABELS: Record<SceneTag, string> = {
  daily_journal: "日常记录",
  travel: "旅行随行",
  creative_sketch: "创意涂鸦",
  gift: "送礼首选",
};

export function getNavForForm(form: PrimaryForm): NavItem | undefined {
  return PRIMARY_NAV.find((n) => n.slug === form);
}

export function getSubcategoryLabel(
  form: PrimaryForm,
  subcategorySlug: string,
): string | undefined {
  const nav = getNavForForm(form);
  return nav?.children.find((c) => c.slug === subcategorySlug)?.label;
}

export function isValidSubcategory(
  form: PrimaryForm,
  subcategorySlug: string,
): boolean {
  const nav = getNavForForm(form);
  return nav?.children.some((c) => c.slug === subcategorySlug) ?? false;
}
