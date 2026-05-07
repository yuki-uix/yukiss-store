import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ProductFilters } from "@/components/ProductFilters";
import { ProductList } from "@/components/ProductList";
import { SiteHeader } from "@/components/SiteHeader";
import { applyProductListFilters, parseProductListFilters } from "@/lib/filters";
import { filterProducts as filterByTaxonomy } from "@/lib/products";

export const metadata: Metadata = {
  title: "全部商品",
  alternates: { canonical: "/products" },
};

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AllProductsPage({ searchParams }: PageProps) {
  const sp = (await searchParams) ?? {};
  const filters = parseProductListFilters(sp);
  const base = filterByTaxonomy();
  const products = applyProductListFilters(base, filters);

  return (
    <>
      <SiteHeader />
      <main>
        <Breadcrumbs items={[{ label: "首页", href: "/" }, { label: "全部商品" }]} />
        <h1>全部商品</h1>
        <p className="lead">按尺寸、材质、价格、库存筛选；参数保留在 URL 中便于分享。</p>
        <ProductFilters basePath="/products" current={filters} />
        <ProductList products={products} />
      </main>
    </>
  );
}
