import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <h1>Yukiss</h1>
        <p className="lead">
          为「想探索适合自己的手帐」的探索型用户而设计。从形态开始浏览，或通过筛选缩小范围。
        </p>
        <p>
          <Link href="/products">进入全部商品</Link>
        </p>
      </main>
    </>
  );
}
