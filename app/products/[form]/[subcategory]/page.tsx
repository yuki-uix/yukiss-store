import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ProductFilters } from "@/components/ProductFilters";
import { ProductList } from "@/components/ProductList";
import { SiteHeader, SiteSubnav } from "@/components/SiteHeader";
import { applyProductListFilters, parseProductListFilters } from "@/lib/filters";
import { filterProducts as filterByTaxonomy } from "@/lib/products";
import {
  getNavForForm,
  getSubcategoryLabel,
  isValidSubcategory,
} from "@/lib/taxonomy";
import type { PrimaryForm } from "@/types/product";
import { isPrimaryForm } from "@/types/product";

type PageProps = {
  params: Promise<{ form: string; subcategory: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { form: formRaw, subcategory } = await params;
  if (!isPrimaryForm(formRaw)) return { title: "未找到" };
  const form = formRaw as PrimaryForm;
  if (!isValidSubcategory(form, subcategory)) return { title: "未找到" };
  const formLabel = getNavForForm(form)?.label ?? form;
  const subLabel = getSubcategoryLabel(form, subcategory) ?? subcategory;
  return {
    title: `${subLabel} · ${formLabel}`,
    alternates: { canonical: `/products/${form}/${subcategory}` },
  };
}

export default async function SubcategoryProductsPage({
  params,
  searchParams,
}: PageProps) {
  const { form: formRaw, subcategory } = await params;
  if (!isPrimaryForm(formRaw)) notFound();
  const form = formRaw as PrimaryForm;
  if (!isValidSubcategory(form, subcategory)) notFound();

  const nav = getNavForForm(form);
  const subLabel = getSubcategoryLabel(form, subcategory);
  if (!nav || !subLabel) notFound();

  const sp = (await searchParams) ?? {};
  const filters = parseProductListFilters(sp);
  const base = filterByTaxonomy(form, subcategory);
  const products = applyProductListFilters(base, filters);
  const basePath = `/products/${form}/${subcategory}`;

  return (
    <>
      <SiteHeader activeForm={form} />
      <SiteSubnav form={form} activeSubcategory={subcategory} />
      <main>
        <Breadcrumbs
          items={[
            { label: "首页", href: "/" },
            { label: "全部商品", href: "/products" },
            { label: nav.label, href: `/products/${form}` },
            { label: subLabel },
          ]}
        />
        <h1>{subLabel}</h1>
        <p className="muted">
          {nav.label} · 筛选条件通过 URL 参数传递，便于分享与收录。
        </p>
        <ProductFilters basePath={basePath} current={filters} />
        <ProductList products={products} />
      </main>
    </>
  );
}
