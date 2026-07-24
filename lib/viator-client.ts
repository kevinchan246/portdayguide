import type { ViatorApiErrorPayload, ViatorProductsPayload } from "@/lib/viator";

const requests = new Map<string, Promise<ViatorProductsPayload>>();

function productsUrl(portSlug: string) {
  return `/api/viator/products?port=${encodeURIComponent(portSlug)}&strategy=attraction-v3`;
}

export function loadViatorProducts(portSlug: string, signal?: AbortSignal) {
  if (signal) {
    return fetch(productsUrl(portSlug), { signal }).then(async (response) => {
      if (!response.ok) throw await response.json() as ViatorApiErrorPayload;
      return response.json() as Promise<ViatorProductsPayload>;
    });
  }

  const existing = requests.get(portSlug);
  if (existing) return existing;
  const request = fetch(productsUrl(portSlug))
    .then(async (response) => {
      if (!response.ok) throw await response.json() as ViatorApiErrorPayload;
      return response.json() as Promise<ViatorProductsPayload>;
    })
    .catch((error) => {
      requests.delete(portSlug);
      throw error;
    });
  requests.set(portSlug, request);
  return request;
}
