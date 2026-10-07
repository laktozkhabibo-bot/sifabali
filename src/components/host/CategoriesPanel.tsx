"use client";

import { ArrowIcon, PlusIcon, TrashIcon } from "@/components/ui/Icons";
import type { CategoryDTO, ProductDTO } from "@/lib/types";
import { slugify } from "@/lib/utils";
import { Card, L10nField, TextField } from "./fields";

export function CategoriesPanel({
  categories,
  products,
  onChange,
}: {
  categories: CategoryDTO[];
  products: ProductDTO[];
  onChange: (categories: CategoryDTO[]) => void;
}) {
  const update = (id: string, patch: Partial<CategoryDTO>) => onChange(categories.map((c) => (c.id === id ? { ...c, ...patch } : c)));

  const add = () =>
    onChange([...categories, { id: `new-${Math.random().toString(36).slice(2, 10)}`, slug: "", name: { tr: "", en: "", ar: "" }, sortOrder: categories.length }]);

  const remove = (c: CategoryDTO) => {
    const count = products.filter((p) => p.categoryId === c.id).length;
    const msg = count
      ? `“${c.name.tr}” kategorisinde ${count} ürün var. Kategori silinirse bu ürünler “Kategorisiz” olur. Devam edilsin mi?`
      : `“${c.name.tr || "İsimsiz"}” kategorisi silinsin mi?`;
    if (confirm(msg)) onChange(categories.filter((x) => x.id !== c.id));
  };

  const move = (index: number, dir: -1 | 1) => {
    const t = index + dir;
    if (t < 0 || t >= categories.length) return;
    const next = [...categories];
    [next[index], next[t]] = [next[t], next[index]];
    onChange(next.map((c, i) => ({ ...c, sortOrder: i })));
  };

  return (
    <Card
      title={`Kategoriler (${categories.length})`}
      description="Mağazadaki filtre sekmeleri bu kategorilerden oluşur. Sıralama mağazadaki sırayı belirler."
      actions={
        <button onClick={add} className="inline-flex items-center gap-2 rounded-xl bg-charcoal px-4 py-2.5 text-sm font-semibold text-cream hover:bg-honey-600">
          <PlusIcon width={18} /> Yeni Kategori
        </button>
      }
    >
      {categories.length === 0 && <p className="rounded-2xl bg-[#FBFAF7] p-6 text-center text-sm text-charcoal-400">Henüz kategori yok.</p>}
      {categories.map((c, i) => {
        const count = products.filter((p) => p.categoryId === c.id).length;
        return (
          <div key={c.id} className="rounded-2xl border border-charcoal/[0.07] bg-[#FBFAF7] p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <p className="text-sm font-semibold">
                {c.name.tr || <span className="italic text-charcoal-300">İsimsiz kategori</span>} <span className="font-normal text-charcoal-400">· {count} ürün</span>
              </p>
              <div className="flex items-center gap-1">
                <button onClick={() => move(i, -1)} disabled={i === 0} aria-label="Yukarı" className="grid h-8 w-8 place-items-center rounded-lg text-charcoal-400 hover:bg-white disabled:opacity-30"><ArrowIcon width={14} className="-rotate-90" /></button>
                <button onClick={() => move(i, 1)} disabled={i === categories.length - 1} aria-label="Aşağı" className="grid h-8 w-8 place-items-center rounded-lg text-charcoal-400 hover:bg-white disabled:opacity-30"><ArrowIcon width={14} className="rotate-90" /></button>
                <button onClick={() => remove(c)} aria-label="Sil" className="grid h-8 w-8 place-items-center rounded-lg text-charcoal-300 hover:bg-red-50 hover:text-red-600"><TrashIcon width={16} /></button>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-[1.4fr_1fr]">
              <L10nField
                label="Kategori adı"
                value={c.name}
                onChange={(name) => update(c.id, { name, ...(c.id.startsWith("new-") ? { slug: slugify(name.tr) } : {}) })}
              />
              <TextField label="Adres kodu" value={c.slug} onChange={(v) => update(c.id, { slug: slugify(v) || v })} hint={`?kategori=${c.slug || "…"}`} dir="ltr" />
            </div>
          </div>
        );
      })}
    </Card>
  );
}
