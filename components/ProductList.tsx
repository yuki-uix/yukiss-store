import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types/product";

export function ProductList({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return <p className="muted">暂无符合筛选的商品。</p>;
  }
  return (
    <ul className="product-grid">
      {products.map((p) => (
        <li key={p.id} className="product-card">
          <Link href={`/p/${p.slug}`}>
            <Image
              src={p.images[0]?.url ?? "/placeholder-product.svg"}
              alt={p.images[0]?.alt ?? p.name}
              width={320}
              height={200}
              unoptimized
            />
            <h2>{p.name}</h2>
            <div className="product-meta">
              ¥{p.price}
              {p.compareAtPrice ? ` · 原价 ¥${p.compareAtPrice}` : null}
            </div>
            <div className="price" />
          </Link>
        </li>
      ))}
    </ul>
  );
}
