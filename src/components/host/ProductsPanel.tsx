"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { ProductImage } from "@/components/ui/ProductImage";
import { ArrowIcon, CloseIcon, EyeIcon, EyeOffIcon, PlusIcon, SearchIcon, StarIcon, StarOutlineIcon, TrashIcon } from "@/components/ui/Icons";
import type { CategoryDTO, ProductDTO } from "@/lib/types";
import { cn, formatPrice, slugify } from "@/lib/utils";
import { Card, L10nField, L10nListField, NumberField, TextField, Toggle, Label, useEditLang } from "./fields";
import { ImageUploader } from "./ImageUploader";

const emptyProduct = (sortOrder: number, categoryId: string | null): ProductDTO => ({
  id: `new-${Math.random().toString(36).slice(2, 10)}`,
  slug: "",
  name: { tr: "", en: "", ar: "" },
  description: { tr: "", en: "", ar: "" },
  benefits: { tr: [], en: [], ar: [] },
  weight: "",
  price: 0,
  salePrice: null,
  stock: 10,
  images: [],
  visible: true,
  featured: false,
  sortOrder,
  categoryId,
});

export function ProductsPanel({
  products,
  categories,
  onChange,
}: {
  products: ProductDTO[];
  categories: CategoryDTO[];
  onChange: (products: ProductDTO[]) => void;
}) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<string>("all");
  const editing = products.find((p) => p.id === editingId) ?? null;

  const update = (id: string, patch: Partial<ProductDTO>) => onChange(products.map((p) => (p.id === id ? { ...p, ...patch } : p)));

  const remove = (p: ProductDTO) => {
    if (!confirm(`“${p.name.tr || "İsimsiz ürün"}” silinsin mi? (Kaydet'e bastığınızda kalıcı olarak silinir)`)) return;
    onChange(products.filter((x) => x.id !== p.id));
    if (editingId === p.id) setEditingId(null);
  };

  const add = () => {
    const p = emptyProduct(products.length, categories[0]?.id ?? null);
    onChange([...products, p]);
    setEditingId(p.id);
  };

  const move = (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= products.length) return;
    const next = [...products];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next.map((p, i) => ({ ...p, sortOrder: i })));
  };

  const visibleList = useMemo(() => {
    const q = query.trim().toLocaleLowerCase("tr");
    return products
      .map((p, index) => ({ p, index }))
      .filter(({ p }) => (filter === "all" ? true : filter === "none" ? !p.categoryId : p.categoryId === filter))
      .filter(({ p }) => !q || `${p.name.tr} ${p.name.en} ${p.slug}`.toLocaleLowerCase("tr").includes(q));
  }, [products, query, filter]);

  return (
    <>
      <Card
        title={`Ürünler (${products.length})`}
        description="Ürün eklemek, düzenlemek veya kaldırmak için listeyi kullanın. Değişiklikler “Değişiklikleri Kaydet” ile yayına alınır."
        actions={
          <button onClick={add} className="inline-flex items-center gap-2 rounded-xl bg-charcoal px-4 py-2.5 text-sm font-semibold text-cream hover:bg-honey-600">
            <PlusIcon width={18} /> Yeni Ürün
          </button>
        }
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="relative flex-1">
            <span className="sr-only">Ürün ara</span>
            <SearchIcon width={18} className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-charcoal-300" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Ürün ara…" className="w-full rounded-xl border border-charcoal/10 bg-[#FBFAF7] py-2.5 pe-3 ps-10 text-sm focus:border-honey-500 focus:outline-none" />
          </label>
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="rounded-xl border border-charcoal/10 bg-[#FBFAF7] px-3 py-2.5 text-sm" aria-label="Kategori filtresi">
            <option value="all">Tüm kategoriler</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name.tr}</option>
            ))}
            <option value="none">Kategorisiz</option>
          </select>
        </div>

        <ul className="divide-y divide-charcoal/[0.06] overflow-hidden rounded-2xl border border-charcoal/[0.07]">
          {visibleList.length === 0 && <li className="p-8 text-center text-sm text-charcoal-400">Ürün bulunamadı.</li>}
          {visibleList.map(({ p, index }) => {
            const cat = categories.find((c) => c.id === p.categoryId);
            return (
              <li key={p.id} className={cn("flex items-center gap-3 bg-white p-3 transition-colors hover:bg-[#FBFAF7] sm:gap-4", !p.visible && "opacity-60")}>
                <div className="hidden flex-col sm:flex">
                  <button onClick={() => move(index, -1)} disabled={index === 0} aria-label="Yukarı taşı" className="rounded p-0.5 text-charcoal-300 hover:text-charcoal disabled:opacity-30">
                    <ArrowIcon width={14} className="-rotate-90" />
                  </button>
                  <button onClick={() => move(index, 1)} disabled={index === products.length - 1} aria-label="Aşağı taşı" className="rounded p-0.5 text-charcoal-300 hover:text-charcoal disabled:opacity-30">
                    <ArrowIcon width={14} className="rotate-90" />
                  </button>
                </div>
                <button onClick={() => setEditingId(p.id)} className="relative h-16 w-14 shrink-0 overflow-hidden rounded-xl bg-honey-50">
                  {p.images[0] ? <ProductImage src={p.images[0]} alt="" fill sizes="56px" className="object-cover" /> : <span className="grid h-full place-items-center text-xl">🍯</span>}
                </button>
                <button onClick={() => setEditingId(p.id)} className="min-w-0 flex-1 text-start">
                  <p className="truncate font-semibold">{p.name.tr || <span className="italic text-charcoal-300">İsimsiz ürün</span>}</p>
                  <p className="truncate text-xs text-charcoal-400">
                    {cat?.name.tr ?? "Kategorisiz"} · {p.weight || "—"} · Stok: <span className={p.stock <= 5 ? "font-semibold text-red-500" : ""}>{p.stock}</span>
                  </p>
                </button>
                <div className="hidden text-end sm:block">
                  <p className="font-semibold">{formatPrice(p.salePrice && p.salePrice < p.price ? p.salePrice : p.price)}</p>
                  {p.salePrice != null && p.salePrice > 0 && p.salePrice < p.price && <p className="text-xs text-charcoal-300 line-through">{formatPrice(p.price)}</p>}
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => update(p.id, { featured: !p.featured })} title={p.featured ? "Öne çıkarılan (kaldır)" : "Öne çıkar"} aria-label="Öne çıkar" aria-pressed={p.featured} className={cn("grid h-9 w-9 place-items-center rounded-lg hover:bg-honey-50", p.featured ? "text-honey-500" : "text-charcoal-300")}>
                    {p.featured ? <StarIcon width={18} /> : <StarOutlineIcon width={18} />}
                  </button>
                  <button onClick={() => update(p.id, { visible: !p.visible })} title={p.visible ? "Sitede görünüyor (gizle)" : "Gizli (göster)"} aria-label="Görünürlük" aria-pressed={p.visible} className="grid h-9 w-9 place-items-center rounded-lg text-charcoal-400 hover:bg-charcoal/5">
                    {p.visible ? <EyeIcon width={18} /> : <EyeOffIcon width={18} />}
                  </button>
                  <button onClick={() => remove(p)} title="Sil" aria-label="Sil" className="grid h-9 w-9 place-items-center rounded-lg text-charcoal-300 hover:bg-red-50 hover:text-red-600">
                    <TrashIcon width={18} />
                  </button>
                  <button onClick={() => setEditingId(p.id)} className="ms-1 hidden rounded-lg border border-charcoal/10 px-3 py-2 text-sm font-medium hover:bg-charcoal hover:text-cream md:block">
                    Düzenle
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </Card>

      <AnimatePresence>
        {editing && (
          <ProductEditor
            key={editing.id}
            product={editing}
            categories={categories}
            allProducts={products}
            onChange={(patch) => update(editing.id, patch)}
            onClose={() => setEditingId(null)}
            onDelete={() => remove(editing)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

/** Slide-over editor with every product field */
function ProductEditor({
  product: p,
  categories,
  allProducts,
  onChange,
  onClose,
  onDelete,
}: {
  product: ProductDTO;
  categories: CategoryDTO[];
  allProducts: ProductDTO[];
  onChange: (patch: Partial<ProductDTO>) => void;
  onClose: () => void;
  onDelete: () => void;
}) {
  const lang = useEditLang();
  const [slugTouched, setSlugTouched] = useState(!!p.slug && !p.id.startsWith("new-"));
  const slugTaken = !!p.slug && allProducts.some((x) => x.id !== p.id && x.slug === p.slug);
  const saleInvalid = p.salePrice != null && p.salePrice > 0 && p.salePrice >= p.price;

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Ürün düzenle">
      <motion.button aria-label="Kapat" className="absolute inset-0 h-full w-full bg-charcoal/40 backdrop-blur-[2px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
      <motion.div
        className="absolute inset-y-0 end-0 flex w-full max-w-2xl flex-col bg-[#F7F4EE] shadow-2xl"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 280, damping: 32 }}
      >
        <header className="flex items-center justify-between gap-3 border-b border-charcoal/10 bg-white px-6 py-4">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-widest text-honey-700">Ürün Düzenle · {lang.toUpperCase()}</p>
            <h3 className="truncate text-lg font-semibold">{p.name.tr || "Yeni ürün"}</h3>
          </div>
          <button onClick={onClose} className="inline-flex items-center gap-2 rounded-xl bg-charcoal px-4 py-2 text-sm font-semibold text-cream">
            Tamam <CloseIcon width={16} />
          </button>
        </header>

        <div className="flex-1 space-y-5 overflow-y-auto p-6">
          <Card title="Temel Bilgiler">
            <L10nField
              label="Ürün adı"
              value={p.name}
              onChange={(name) => onChange({ name, ...(!slugTouched && lang === "tr" ? { slug: slugify(name.tr) } : {}) })}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <TextField
                  label="Adres (URL)"
                  value={p.slug}
                  onChange={(v) => {
                    setSlugTouched(true);
                    onChange({ slug: slugify(v) || v.toLowerCase() });
                  }}
                  hint={`/urun/${p.slug || "…"}`}
                  dir="ltr"
                />
                {slugTaken && <p className="mt-1 text-xs text-red-500">Bu adres başka bir üründe kullanılıyor; kaydederken otomatik numaralandırılır.</p>}
              </div>
              <div>
                <Label htmlFor="pe-cat">Kategori</Label>
                <select id="pe-cat" value={p.categoryId ?? ""} onChange={(e) => onChange({ categoryId: e.target.value || null })} className="w-full rounded-xl border border-charcoal/10 bg-[#FBFAF7] px-3.5 py-2.5 text-[15px]">
                  <option value="">Kategorisiz</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name.tr}</option>
                  ))}
                </select>
              </div>
            </div>
            <TextField label="Ağırlık / Hacim" value={p.weight} onChange={(weight) => onChange({ weight })} placeholder="örn. 850 g, 1 kg, 30 ml" />
          </Card>

          <Card title="Fiyat ve Stok">
            <div className="grid gap-4 sm:grid-cols-3">
              <NumberField label="Fiyat" value={p.price} onChange={(v) => onChange({ price: v ?? 0 })} suffix="₺" step={0.01} />
              <div>
                <NumberField label="İndirimli fiyat" hint="isteğe bağlı" value={p.salePrice} onChange={(v) => onChange({ salePrice: v })} suffix="₺" step={0.01} allowEmpty />
                {saleInvalid && <p className="mt-1 text-xs text-red-500">İndirimli fiyat normal fiyattan düşük olmalı.</p>}
              </div>
              <NumberField label="Stok adedi" value={p.stock} onChange={(v) => onChange({ stock: Math.max(0, Math.round(v ?? 0)) })} />
            </div>
          </Card>

          <Card title="Görseller">
            <ImageUploader images={p.images} onChange={(images) => onChange({ images })} />
          </Card>

          <Card title="Açıklama ve Faydalar" description="Üstteki dil seçiciden TR / EN / AR arasında geçiş yapın.">
            <L10nField label="Açıklama" value={p.description} onChange={(description) => onChange({ description })} multiline rows={5} />
            <L10nListField label="Faydaları" value={p.benefits} onChange={(benefits) => onChange({ benefits })} />
          </Card>

          <Card title="Yayın Ayarları">
            <Toggle label="Sitede göster" description="Kapalıysa ürün mağazada görünmez." checked={p.visible} onChange={(visible) => onChange({ visible })} />
            <Toggle label="Öne çıkan ürün" description="Ana sayfadaki “Öne Çıkan Ürünler” bölümünde gösterilir." checked={p.featured} onChange={(featured) => onChange({ featured })} />
          </Card>

          <button onClick={onDelete} className="flex w-full items-center justify-center gap-2 rounded-2xl border border-red-200 py-3 text-sm font-semibold text-red-600 hover:bg-red-50">
            <TrashIcon width={18} /> Bu ürünü sil
          </button>
        </div>
      </motion.div>
    </div>
  );
}
