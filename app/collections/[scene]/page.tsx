import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ProductList } from "@/components/ProductList";
import { SiteHeader } from "@/components/SiteHeader";
import { PRODUCTS } from "@/lib/products";
import { SCENE_LABELS, SCENE_SLUGS } from "@/lib/taxonomy";
import type { SceneTag } from "@/types/product";

type PageProps = { params: Promise<{ scene: string }> };

/** 阶段一：场景页存在但不对搜索引擎开放；阶段二改为 index */
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { scene } = await params;
  const tag = SCENE_SLUGS[scene];
  if (!tag) return { title: "未找到", robots: { index: false, follow: true } };
  const label = SCENE_LABELS[tag];
  return {
    title: `${label}（场景）`,
    description: `按场景浏览：${label}。阶段二启用 SEO。`,
    robots: { index: false, follow: true },
    alternates: { canonical: `/collections/${scene}` },
  };
}

export default async function SceneCollectionPage({ params }: PageProps) {
  const { scene } = await params;
  const tag = SCENE_SLUGS[scene];
  if (!tag) notFound();

  const products = PRODUCTS.filter((p) => p.sceneTags.includes(tag as SceneTag));
  const label = SCENE_LABELS[tag as SceneTag];

  return (
    <>
      <SiteHeader />
      <main>
        <Breadcrumbs
          items={[{ label: "首页", href: "/" }, { label: "场景探索" }, { label }]}
        />
        <h1>{label}</h1>
        <p className="muted">
          场景合集（数据层字段已具备）。当前阶段页面为 <code>noindex</code>，阶段二改为可收录。
        </p>
        <ProductList products={products} />
      </main>
    </>
  );
}
