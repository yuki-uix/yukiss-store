import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ProductFilters } from "@/components/ProductFilters";
import { ProductList } from "@/components/ProductList";
import { SiteHeader, SiteSubnav } from "@/components/SiteHeader";
import { applyProductListFilters, parseProductListFilters } from "@/lib/filters";
import { filterProducts as filterByTaxonomy } from "@/lib/products";
import { getNavForForm } from "@/lib/taxonomy";
import type { PrimaryForm } from "@/types/product";
import { isPrimaryForm } from "@/types/product";

type PageProps = {
  params: Promise<{ form: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { form: formRaw } = await params;
  if (!isPrimaryForm(formRaw)) return { title: "未找到" };
  const nav = getNavForForm(formRaw);
  return {
    title: nav?.label ?? formRaw,
    alternates: { canonical: `/products/${formRaw}` },
  };
}

export default async function FormProductsPage({ params, searchParams }: PageProps) {
  const { form: formRaw } = await params;
  if (!isPrimaryForm(formRaw)) notFound();
  const form = formRaw as PrimaryForm;
  const nav = getNavForForm(form);
  if (!nav) notFound();

  const sp = (await searchParams) ?? {};
  const filters = parseProductListFilters(sp);
  const base = filterByTaxonomy(form);
  const products = applyProductListFilters(base, filters);
  const basePath = `/products/${form}`;

  return (
    <>
      <SiteHeader activeForm={form} />
      <SiteSubnav form={form} />
      <main>
        <Breadcrumbs
          items={[
            { label: "首页", href: "/" },
            { label: "全部商品", href: "/products" },
            { label: nav.label },
          ]}
        />
        <h1>{nav.label}</h1>
        <p className="lead">选择上方二级分类查看更细分类，或使用筛选缩小结果。</p>
        <ProductFilters basePath={basePath} current={filters} />
        <ProductList products={products} />
      </main>
    </>
  );
}
