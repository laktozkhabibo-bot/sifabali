"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Logo } from "@/components/ui/Logo";
import { ExternalIcon, LogoutIcon, SaveIcon } from "@/components/ui/Icons";
import type { Locale } from "@/lib/i18n/config";
import type { CategoryDTO, ProductDTO, SiteContent } from "@/lib/types";
import { cn } from "@/lib/utils";
import { EditLangContext } from "./fields";
import { ProductsPanel } from "./ProductsPanel";
import { CategoriesPanel } from "./CategoriesPanel";
import { ContentPanel } from "./ContentPanel";
import { ContactPanel } from "./ContactPanel";
import { AnnouncementPanel } from "./AnnouncementPanel";
import { InboxPanel } from "./InboxPanel";
import { SecurityPanel } from "./SecurityPanel";

interface Snapshot {
  products: ProductDTO[];
  categories: CategoryDTO[];
  content: SiteContent;
}

const TABS = [
  { id: "products", label: "Ürünler", icon: "🍯" },
  { id: "categories", label: "Kategoriler", icon: "🗂️" },
  { id: "content", label: "Site İçerikleri", icon: "✍️" },
  { id: "contact", label: "İletişim", icon: "📞" },
  { id: "announcement", label: "Duyuru Çubuğu", icon: "📣" },
  { id: "inbox", label: "Gelen Kutusu", icon: "✉️" },
  { id: "security", label: "Güvenlik", icon: "🔒" },
] as const;
type TabId = (typeof TABS)[number]["id"];

/** Removes blank lines from benefit lists before saving */
function clean(s: Snapshot): Snapshot {
  return {
    ...s,
    products: s.products.map((p, i) => ({
      ...p,
      sortOrder: i,
      benefits: {
        tr: p.benefits.tr.map((b) => b.trim()).filter(Boolean),
        en: p.benefits.en.map((b) => b.trim()).filter(Boolean),
        ar: p.benefits.ar.map((b) => b.trim()).filter(Boolean),
      },
    })),
    categories: s.categories.map((c, i) => ({ ...c, sortOrder: i })),
  };
}

/**
 * The host (owner) control panel.
 * All edits live in a local draft; "Değişiklikleri Kaydet" sends the whole draft to the server
 * in one transaction and the live site updates immediately.
 */
export function HostDashboard({ initial }: { initial: Snapshot }) {
  const router = useRouter();
  const [saved, setSaved] = useState<Snapshot>(initial);
  const [draft, setDraft] = useState<Snapshot>(initial);
  const [tab, setTab] = useState<TabId>("products");
  const [lang, setLang] = useState<Locale>("tr");
  const [saving, setSaving] = useState(false);
  const [unread, setUnread] = useState(0);

  const dirty = useMemo(() => JSON.stringify(clean(draft)) !== JSON.stringify(clean(saved)), [draft, saved]);

  // Warn before leaving the page with unsaved changes
  useEffect(() => {
    if (!dirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  const save = useCallback(async () => {
    if (saving) return;
    const invalid = draft.products.find((p) => !p.name.tr.trim());
    if (invalid) {
      setTab("products");
      toast.error("Her ürünün en azından Türkçe bir adı olmalı.");
      return;
    }
    const badCat = draft.categories.find((c) => !c.name.tr.trim());
    if (badCat) {
      setTab("categories");
      toast.error("Her kategorinin Türkçe bir adı olmalı.");
      return;
    }
    setSaving(true);
    const id = toast.loading("Kaydediliyor…");
    try {
      const res = await fetch("/api/admin/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(clean(draft)),
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 401) {
        toast.error("Oturumunuz sona erdi. Lütfen tekrar giriş yapın.", { id });
        router.replace("/hostpagepass");
        return;
      }
      if (!res.ok) throw new Error(data.error ?? "Kaydedilemedi.");
      const fresh: Snapshot = { products: data.products, categories: data.categories, content: data.content };
      setSaved(fresh);
      setDraft(fresh);
      toast.success("Değişiklikler kaydedildi ve sitede yayında! 🎉", { id, description: "Ziyaretçiler güncel içeriği hemen görür." });
    } catch (err) {
      toast.error((err as Error).message, { id });
    } finally {
      setSaving(false);
    }
  }, [draft, saving, router]);

  // Ctrl/Cmd + S shortcut
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        if (dirty) save();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [dirty, save]);

  const discard = () => {
    if (confirm("Kaydedilmemiş tüm değişiklikler geri alınsın mı?")) setDraft(saved);
  };

  const logout = async () => {
    if (dirty && !confirm("Kaydedilmemiş değişiklikleriniz var. Yine de çıkış yapılsın mı?")) return;
    await fetch("/api/host/logout", { method: "POST" });
    router.replace("/hostpagepass");
    router.refresh();
  };

  const setContent = <K extends keyof SiteContent>(key: K, value: SiteContent[K]) =>
    setDraft((d) => ({ ...d, content: { ...d.content, [key]: value } }));

  const hasEditableText = tab !== "inbox" && tab !== "security";

  return (
    <EditLangContext.Provider value={lang}>
      <div className="min-h-screen lg:grid lg:grid-cols-[260px_1fr]">
        {/* Sidebar */}
        <aside className="hidden border-e border-charcoal/[0.07] bg-white lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col">
          <div className="px-6 py-6">
            <Logo className="h-12" />
            <p className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-charcoal-300">Yönetim Paneli</p>
          </div>
          <nav className="flex-1 space-y-1 px-3" aria-label="Panel bölümleri">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                aria-current={tab === t.id ? "page" : undefined}
                className={cn(
                  "relative flex w-full items-center gap-3 rounded-xl px-4 py-3 text-start text-[15px] font-medium transition-colors",
                  tab === t.id ? "text-charcoal" : "text-charcoal-400 hover:bg-charcoal/[0.03] hover:text-charcoal",
                )}
              >
                {tab === t.id && <motion.span layoutId="host-tab" className="absolute inset-0 rounded-xl bg-honey-100" transition={{ type: "spring", stiffness: 400, damping: 35 }} />}
                <span className="relative">{t.icon}</span>
                <span className="relative flex-1">{t.label}</span>
                {t.id === "inbox" && unread > 0 && <span className="relative rounded-full bg-honey-500 px-2 text-xs font-bold text-charcoal">{unread}</span>}
              </button>
            ))}
          </nav>
          <div className="space-y-2 border-t border-charcoal/[0.07] p-4">
            <a href="/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-charcoal-500 hover:bg-charcoal/[0.03] hover:text-charcoal">
              <ExternalIcon width={16} /> Siteyi görüntüle
            </a>
            <button onClick={logout} className="flex w-full items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-charcoal-500 hover:bg-red-50 hover:text-red-600">
              <LogoutIcon width={16} /> Çıkış yap
            </button>
          </div>
        </aside>

        <div className="min-w-0">
          {/* Top bar: status, language, save */}
          <header className="sticky top-0 z-40 border-b border-charcoal/[0.07] bg-[#F7F4EE]/90 backdrop-blur-xl">
            <div className="flex flex-wrap items-center gap-3 px-4 py-3 md:px-8">
              <div className="flex items-center gap-3 lg:hidden">
                <Logo compact className="h-9" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="truncate text-lg font-semibold">{TABS.find((t) => t.id === tab)?.label}</h1>
                <p className={cn("flex items-center gap-1.5 text-xs", dirty ? "text-honey-700" : "text-charcoal-400")} aria-live="polite">
                  <span className={cn("h-1.5 w-1.5 rounded-full", dirty ? "animate-pulse bg-honey-500" : "bg-olive-500")} />
                  {dirty ? "Kaydedilmemiş değişiklikler var" : "Tüm değişiklikler kaydedildi"}
                </p>
              </div>

              {hasEditableText && (
                <div className="flex items-center gap-2" role="group" aria-label="Düzenleme dili">
                  <span className="hidden text-xs text-charcoal-400 md:inline">Düzenleme dili:</span>
                  <div className="flex rounded-xl bg-white p-1 ring-1 ring-charcoal/10">
                    {(["tr", "en", "ar"] as Locale[]).map((l) => (
                      <button
                        key={l}
                        onClick={() => setLang(l)}
                        aria-pressed={lang === l}
                        className={cn("rounded-lg px-3 py-1.5 text-xs font-bold transition", lang === l ? "bg-charcoal text-cream" : "text-charcoal-400 hover:text-charcoal")}
                      >
                        {l.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2">
                <AnimatePresence>
                  {dirty && (
                    <motion.button
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      onClick={discard}
                      className="rounded-xl px-3 py-2.5 text-sm font-medium text-charcoal-500 hover:bg-charcoal/5"
                    >
                      Geri al
                    </motion.button>
                  )}
                </AnimatePresence>
                <button
                  onClick={save}
                  disabled={!dirty || saving}
                  className={cn(
                    "relative inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold shadow-sm transition-colors",
                    dirty ? "bg-honey-500 text-charcoal hover:bg-honey-400" : "bg-charcoal/10 text-charcoal-400",
                  )}
                  title="Ctrl + S"
                >
                  {/* soft halo while there are unsaved changes */}
                  {dirty && !saving && <span aria-hidden className="absolute -inset-1 animate-pulse rounded-2xl ring-2 ring-honey-400/60" />}
                  <SaveIcon width={18} />
                  {saving ? "Kaydediliyor…" : "Değişiklikleri Kaydet"}
                </button>
              </div>
            </div>

            {/* Mobile tabs */}
            <nav className="no-scrollbar flex gap-1 overflow-x-auto px-4 pb-3 lg:hidden" aria-label="Panel bölümleri">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={cn("shrink-0 rounded-full px-3.5 py-2 text-sm font-medium", tab === t.id ? "bg-charcoal text-cream" : "bg-white text-charcoal-500 ring-1 ring-charcoal/10")}
                >
                  {t.icon} {t.label}
                </button>
              ))}
              <button onClick={logout} className="shrink-0 rounded-full bg-white px-3.5 py-2 text-sm font-medium text-red-600 ring-1 ring-red-200">Çıkış</button>
            </nav>
          </header>

          <main className="mx-auto max-w-5xl px-4 py-6 md:px-8 md:py-8">
            <AnimatePresence mode="wait">
              <motion.div key={tab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
                {tab === "products" && (
                  <ProductsPanel products={draft.products} categories={draft.categories} onChange={(products) => setDraft((d) => ({ ...d, products }))} />
                )}
                {tab === "categories" && (
                  <CategoriesPanel
                    categories={draft.categories}
                    products={draft.products}
                    onChange={(categories) =>
                      setDraft((d) => ({
                        ...d,
                        categories,
                        // Products of a deleted category become uncategorised
                        products: d.products.map((p) => (p.categoryId && !categories.some((c) => c.id === p.categoryId) ? { ...p, categoryId: null } : p)),
                      }))
                    }
                  />
                )}
                {tab === "content" && <ContentPanel content={draft.content} set={setContent} />}
                {tab === "contact" && <ContactPanel contact={draft.content.contact} onChange={(c) => setContent("contact", c)} />}
                {tab === "announcement" && <AnnouncementPanel value={draft.content.announcement} onChange={(v) => setContent("announcement", v)} />}
                {tab === "inbox" && <InboxPanel onUnread={setUnread} />}
                {tab === "security" && <SecurityPanel onLogout={logout} />}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </EditLangContext.Provider>
  );
}
