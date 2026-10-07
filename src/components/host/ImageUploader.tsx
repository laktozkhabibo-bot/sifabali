"use client";

import { motion, Reorder } from "framer-motion";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { ProductImage } from "@/components/ui/ProductImage";
import { CloseIcon, UploadIcon } from "@/components/ui/Icons";
import { cn } from "@/lib/utils";

/**
 * Drag & drop image uploader. Files are uploaded immediately (Vercel Blob) and their URLs
 * are added to the product draft; the first image is the main (cover) image.
 * Images can be re-ordered by dragging.
 */
export function ImageUploader({ images, onChange }: { images: string[]; onChange: (images: string[]) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(0);

  const upload = async (files: FileList | File[]) => {
    const list = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (!list.length) {
      toast.error("Lütfen bir görsel dosyası seçin.");
      return;
    }
    setUploading((n) => n + list.length);
    const urls: string[] = [];
    for (const file of list) {
      try {
        const body = new FormData();
        body.append("file", file);
        const res = await fetch("/api/admin/upload", { method: "POST", body });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Yükleme başarısız.");
        urls.push(data.url);
      } catch (err) {
        toast.error(`${file.name}: ${(err as Error).message}`);
      } finally {
        setUploading((n) => n - 1);
      }
    }
    if (urls.length) {
      onChange([...images, ...urls]);
      toast.success(`${urls.length} görsel yüklendi`);
    }
  };

  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between">
        <span className="text-sm font-medium text-charcoal-600">Görseller</span>
        <span className="text-xs text-charcoal-300">İlk görsel kapak görselidir · sürükleyerek sıralayın</span>
      </div>

      {images.length > 0 && (
        <Reorder.Group axis="x" values={images} onReorder={onChange} className="mb-3 flex flex-wrap gap-3">
          {images.map((src, i) => (
            <Reorder.Item key={src} value={src} className="group relative h-28 w-24 cursor-grab overflow-hidden rounded-2xl bg-honey-50 ring-1 ring-charcoal/10 active:cursor-grabbing">
              <ProductImage src={src} alt="" fill sizes="96px" className="pointer-events-none object-cover" />
              {i === 0 && <span className="absolute start-1.5 top-1.5 rounded-md bg-charcoal/80 px-1.5 py-0.5 text-[10px] font-semibold text-cream">Kapak</span>}
              <button
                type="button"
                onClick={() => onChange(images.filter((x) => x !== src))}
                aria-label="Görseli kaldır"
                className="absolute end-1.5 top-1.5 grid h-7 w-7 place-items-center rounded-full bg-white/90 text-charcoal opacity-0 shadow transition group-hover:opacity-100 focus:opacity-100"
              >
                <CloseIcon width={14} />
              </button>
            </Reorder.Item>
          ))}
        </Reorder.Group>
      )}

      <motion.button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          if (e.dataTransfer.files.length) upload(e.dataTransfer.files);
        }}
        animate={{ scale: dragging ? 1.02 : 1 }}
        className={cn(
          "flex w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-6 py-8 text-center transition-colors",
          dragging ? "border-honey-500 bg-honey-50" : "border-charcoal/15 bg-[#FBFAF7] hover:border-honey-400 hover:bg-honey-50/50",
        )}
      >
        <span className="grid h-12 w-12 place-items-center rounded-full bg-honey-100 text-honey-700">
          <UploadIcon width={22} />
        </span>
        <span className="text-sm font-medium">
          {uploading > 0 ? `${uploading} görsel yükleniyor…` : "Görselleri buraya sürükleyip bırakın"}
        </span>
        <span className="text-xs text-charcoal-400">veya tıklayıp seçin · JPG, PNG, WEBP · en fazla 8 MB</span>
      </motion.button>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
        multiple
        hidden
        onChange={(e) => {
          if (e.target.files?.length) upload(e.target.files);
          e.target.value = "";
        }}
      />
    </div>
  );
}
