import Image, { type ImageProps } from "next/image";

/**
 * next/image wrapper: local SVG illustrations are served as-is (no optimisation needed),
 * uploaded photos (Vercel Blob / local uploads) go through Next's image optimiser.
 */
export function ProductImage({ src, alt, ...rest }: Omit<ImageProps, "src"> & { src: string }) {
  const safe = src || "/products/cicek-bali.svg";
  const unoptimized = safe.endsWith(".svg") || safe.startsWith("/uploads/");
  return <Image src={safe} alt={alt} unoptimized={unoptimized} {...rest} />;
}
