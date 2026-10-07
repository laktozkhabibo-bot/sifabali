"use client";

import { ProductCard } from "@/components/shop/ProductCard";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import type { CategoryDTO, ProductDTO } from "@/lib/types";

export function RelatedProducts({ products, categories, title }: { products: ProductDTO[]; categories: CategoryDTO[]; title: string }) {
  if (!products.length) return null;
  return (
    <section className="bg-cream-200 py-20 md:py-28" aria-labelledby="related-title">
      <div className="container">
        <Reveal>
          <h2 id="related-title" className="h-section">{title}</h2>
        </Reveal>
        <Stagger className="mt-12 grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
          {products.map((p) => (
            <StaggerItem key={p.id}>
              <ProductCard product={p} category={categories.find((c) => c.id === p.categoryId)} />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
