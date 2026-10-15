"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { ProductImage } from "@/components/ui/ProductImage";
import { TrashIcon, UploadIcon } from "@/components/ui/Icons";
import { cn } from "@/lib/utils";
import { uploadImage } from "./ImageUploader";

/**
 * One replaceable site picture: preview + "Değiştir" (upload), "Kaldır" (removes it from the site)
 * and "Varsayılana dön" (restores the original picture). Drag & drop also works.
 */
export function ImageSlot({
  label,
  hint,
  value,
  fallback,
  onChange,
  tall = false,
}: {
  label: string;
  hint?: string;
  value: string;
  /** the original picture shipped with the site */
  fallback: string;
  onChange: (url: string) => void;
  tall?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [dragging, setDragging] = useState(false);

  const upload = async (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) return toast.error("Lütfen bir görsel dosyası seçin.");
    setBusy(true);
    try {
      onChange(await uploadImage(file));
      toast.success("Görsel yüklendi — yayına almak için “Değişiklikleri Kaydet”e basın.");
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="rounded-2xl border border-charcoal/[0.07] bg-[#FBFAF7] p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            upload(e.dataTransfer.files[0]);
          }}
          className={cn(
            "relative shrink-0 overflow-hidden rounded-xl ring-1 ring-charcoal/10",
            tall ? "h-36 w-24" : "h-24 w-40",
            dragging && "ring-2 ring-honey-500",
            // checkerboard → transparent PNGs are easy to recognise
            "bg-[conic-gradient(#eee_25%,#fff_0_50%,#eee_0_75%,#fff_0)] bg-[length:16px_16px]",
          )}
        >
          {value ? (
            <ProductImage src={value} alt="" fill sizes="160px" className="object-contain" />
          ) : (
            <span className="grid h-full place-items-center px-2 text-center text-xs font-medium text-charcoal-400">Sitede gösterilmiyor</span>
          )}
          {busy && <span className="absolute inset-0 grid place-items-center bg-white/70 text-xs font-semibold">Yükleniyor…</span>}
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-charcoal">{label}</p>
          {hint && <p className="mt-0.5 text-xs text-charcoal-400">{hint}</p>}
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={busy}
              className="inline-flex items-center gap-1.5 rounded-lg bg-charcoal px-3 py-2 text-xs font-semibold text-cream hover:bg-honey-600 disabled:opacity-50"
            >
              <UploadIcon width={14} /> {value ? "Değiştir" : "Görsel yükle"}
            </button>
            {value && (
              <button
                type="button"
                onClick={() => onChange("")}
                className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50"
              >
                <TrashIcon width={14} /> Kaldır
              </button>
            )}
            {value !== fallback && (
              <button type="button" onClick={() => onChange(fallback)} className="rounded-lg border border-charcoal/10 px-3 py-2 text-xs font-semibold text-charcoal-500 hover:bg-white">
                Varsayılana dön
              </button>
            )}
          </div>
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
        hidden
        onChange={(e) => {
          upload(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
    </div>
  );
}
