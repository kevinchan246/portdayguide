import manifest from "@/lib/local-photo-variants.json";

type LocalPhoto = { width: number; height: number; bytes: number; variants: { src: string; width: number; height: number; bytes: number }[] };

export function localPhoto(src: string): LocalPhoto | undefined {
  return (manifest as Record<string, LocalPhoto>)[src];
}

export function localPhotoSrcSet(src: string) {
  return localPhoto(src)?.variants.map((photo) => `${photo.src} ${photo.width}w`).join(", ");
}

// Full-width mobile cards become two columns on tablets and three on desktop.
// Callers with a different layout can supply a narrower, more precise hint.
export const scenicCardSizes = "(max-width: 640px) calc(100vw - 48px), (max-width: 1000px) calc((100vw - 72px) / 2), 380px";
