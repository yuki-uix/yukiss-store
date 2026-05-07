import Link from "next/link";
import { PRIMARY_NAV } from "@/lib/taxonomy";
import type { PrimaryForm } from "@/types/product";

export function SiteHeader({ activeForm }: { activeForm?: PrimaryForm }) {
  return (
    <header className="nav">
      <div className="nav-inner">
        <Link href="/" className="brand">
          Yukiss
        </Link>
        <ul className="nav-links">
          <li>
            <Link href="/products">全部商品</Link>
          </li>
          {PRIMARY_NAV.map((item) => (
            <li key={item.slug}>
              <Link
                href={`/products/${item.slug}`}
                aria-current={activeForm === item.slug ? "page" : undefined}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}

export function SiteSubnav({
  form,
  activeSubcategory,
}: {
  form: PrimaryForm;
  activeSubcategory?: string;
}) {
  const nav = PRIMARY_NAV.find((n) => n.slug === form);
  if (!nav) return null;
  return (
    <div className="subnav">
      <div className="subnav-inner">
        {nav.children.map((c) => (
          <Link
            key={c.slug}
            href={`/products/${form}/${c.slug}`}
            data-active={activeSubcategory === c.slug ? "true" : undefined}
          >
            {c.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
