import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SiteHeader } from "@/components/SiteHeader";
import { FILTER_LABELS } from "@/lib/filters";
import { getProductBySlug } from "@/lib/products";
import {
  SCENE_LABELS,
  SCENE_SLUGS,
  getNavForForm,
  getSubcategoryLabel,
} from "@/lib/taxonomy";
import type { SceneTag } from "@/types/product";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "未找到" };
  return {
    title: product.seoTitle ?? product.name,
    description: product.seoDescription ?? product.description,
    alternates: { canonical: `/p/${product.slug}` },
  };
}

function sceneSlugForTag(tag: SceneTag): string | undefined {
  const entry = Object.entries(SCENE_SLUGS).find(([, v]) => v === tag);
  return entry?.[0];
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const formNav = getNavForForm(product.primaryForm);
  const formLabel = formNav?.label ?? product.primaryForm;
  const subLabel = getSubcategoryLabel(
    product.primaryForm,
    product.subcategorySlug,
  );

  const crumbs = [
    { label: "首页", href: "/" },
    { label: "全部商品", href: "/products" },
    { label: formLabel, href: `/products/${product.primaryForm}` },
    ...(subLabel
      ? [
          {
            label: subLabel,
            href: `/products/${product.primaryForm}/${product.subcategorySlug}`,
          },
        ]
      : []),
    { label: product.name },
  ];

  const stockLabel = FILTER_LABELS.stock[product.stockStatus];

  return (
    <>
      <SiteHeader activeForm={product.primaryForm} />
      <main>
        <Breadcrumbs items={crumbs} />
        <div className="pdp-layout">
          <div>
            <Image
              src={product.images[0]?.url ?? "/placeholder-product.svg"}
              alt={product.images[0]?.alt ?? product.name}
              width={480}
              height={300}
              unoptimized
            />
          </div>
          <div className="pdp-detail">
            <h1>{product.name}</h1>
            <p>{product.description}</p>
            <p className="price">¥{product.price}</p>
            <p className="muted">
              尺寸：{FILTER_LABELS.size[product.size]} · 材质：
              {FILTER_LABELS.material[product.material]} · 库存：{stockLabel}
            </p>
            <ul className="scene-tags" aria-label="场景标签（阶段二可升为导航）">
              {product.sceneTags.map((tag) => {
                const scenePath = sceneSlugForTag(tag);
                return (
                  <li key={tag}>
                    {scenePath ? (
                      <Link href={`/collections/${scenePath}`}>{SCENE_LABELS[tag]}</Link>
                    ) : (
                      <span>{SCENE_LABELS[tag]}</span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </main>
    </>
  );
}
