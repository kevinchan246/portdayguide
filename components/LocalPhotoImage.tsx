import { localPhoto, localPhotoSrcSet } from "@/lib/local-photos";
import type { CSSProperties } from "react";

type LocalPhotoImageProps = {
  src: string;
  alt: string;
  sizes: string;
  width?: number;
  height?: number;
  priority?: boolean;
  style?: CSSProperties;
};

/** Responsive same-origin photography, retaining the original URL as a fallback. */
export function LocalPhotoImage({ src, alt, sizes, width, height, priority = false, style }: LocalPhotoImageProps) {
  const asset = localPhoto(src);
  return <picture style={{ display: "block", width: "100%", height: "100%" }}>
    {asset && <source type="image/webp" srcSet={localPhotoSrcSet(src)} sizes={sizes} />}
    <img src={src} alt={alt} width={asset?.width ?? width} height={asset?.height ?? height} loading={priority ? "eager" : "lazy"} fetchPriority={priority ? "high" : "auto"} decoding="async" style={style} />
  </picture>;
}
