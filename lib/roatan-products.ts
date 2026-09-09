type Product = { productCode: string; title: string };

export function roatanProductGroup(product: Product): "beach" | "private-island" | null {
  const title = product.title.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  if (/\b(west bay|tabyana|bananarama)\b/.test(title)) return "beach";
  if (/\bprivate\b/.test(title) && /\b(chocolate|rum|history|cultural|culture)\b/.test(title)) return "private-island";
  return null;
}

// Input is relevance-ranked; preserve rank within each choice and never invent a match.
export function selectRoatanProducts<T extends Product>(products: T[]): T[] {
  const unique = [...new Map(products.map(product => [product.productCode, product])).values()];
  const beach = unique.filter(product => roatanProductGroup(product) === "beach");
  const island = unique.filter(product => roatanProductGroup(product) === "private-island");
  const selected = [...beach.slice(0, 2), ...island.slice(0, 2)];
  const codes = new Set(selected.map(product => product.productCode));
  return [...selected, ...unique.filter(product => !codes.has(product.productCode) && roatanProductGroup(product))].slice(0, 4);
}
