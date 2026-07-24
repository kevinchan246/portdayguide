"use client";

import { useEffect, useState } from "react";
import type { ViatorProductsPayload } from "@/lib/viator";
import { portPath } from "@/lib/seo";

export function ViatorDestinationLink({ portSlug, portName, className }: { portSlug: string; portName: string; className: string }) {
  const [url, setUrl] = useState("");
  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/viator/products?port=${encodeURIComponent(portSlug)}`, { signal: controller.signal })
      .then((response) => response.ok ? response.json() as Promise<ViatorProductsPayload> : null)
      .then((payload) => setUrl(payload?.destinationUrl || ""))
      .catch(() => undefined);
    return () => controller.abort();
  }, [portSlug]);
  if (!url) return <a className={className} href={`${portPath(portSlug)}#top-things`}>See matched {portName} tours in the port guide <span aria-hidden="true">→</span></a>;
  return <a className={className} href={url} target="_blank" rel="sponsored nofollow noopener">Check live {portName} options on Viator <span aria-hidden="true">↗</span></a>;
}
