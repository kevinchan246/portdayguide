export type ViatorPricingPackageType = "PER_PERSON" | "UNIT";

export type ViatorProductCard = {
  productCode: string;
  title: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  duration: string;
  freeCancellation: boolean;
  likelyToSellOut: boolean;
  rating: number | null;
  reviewCount: number;
  price: number;
  priceBeforeDiscount: number | null;
  currency: string;
  pricingPackageType: ViatorPricingPackageType | null;
  productUrl: string;
};

export type ViatorHighlightRecommendation = {
  highlight: string;
  kind: "direct";
  product: ViatorProductCard;
};

export function viatorPriceUnitLabel(pricingPackageType: ViatorPricingPackageType | null) {
  if (pricingPackageType === "UNIT") return "per group";
  if (pricingPackageType === "PER_PERSON") return "per person";
  return null;
}

export type ViatorProductsPayload = {
  products: ViatorProductCard[];
  recommendations: ViatorHighlightRecommendation[];
  destinationName: string;
  destinationUrl: string;
  campaign: string;
  updatedAt: string;
};

export type FeaturedViatorProductCard = ViatorProductCard & {
  portName: string;
  portSlug: string;
};

export type FeaturedViatorProductsPayload = {
  products: FeaturedViatorProductCard[];
  updatedAt: string;
};

export type ViatorApiErrorPayload = {
  error: "not_configured" | "destination_not_found" | "temporarily_unavailable";
  message: string;
};
