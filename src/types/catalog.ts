export type CategoryId = string;

export type BadgeType = "BESTSELLER" | "NEW" | "OFERTA" | "";

export interface BannerItem {
  id: string;
  url: string;
  alt: string;
}

export interface CategoryItem {
  id: string;
  label: {
    es: string;
    zh: string;
    en: string;
  };
}

export interface ProductSku {
  id: string;
  code: string; // e.g. "MNG-500G"
  name: string; // e.g. "500g" / "1kg" / "Caja 10uds"
  priceUSD: number;
  stock: number;
}

export interface ProductItem {
  id: string;
  name: {
    es: string;
    zh: string;
    en: string;
  };
  priceUSD: number;
  category: string;
  badge?: BadgeType;
  imageUrl?: string; // Uploaded image URL (/uploads/...) or external URL
  illustrationKey?: string; // Fallback built-in SVG key
  active?: boolean;
  skus: ProductSku[];
}
