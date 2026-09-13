export interface MarketplaceCategory {
  id: string;
  name: string;
  slug: string;
  parent: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface MarketplaceCategoryBrief {
  id: string;
  name: string;
  slug: string;
}

export interface MarketplaceUniversity {
  id: string;
  name: string;
  short_name: string;
  slug: string;
  logo: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface MarketplaceStore {
  id: string;
  vendor_id: string;
  display_name: string;
  slug: string;
  description: string | null;
  contact_phone: string | null;
  is_active: boolean;
  vendor_type: string;
  is_verified: boolean;
  created_at?: string;
  updated_at?: string;
}

export type ProductCondition = "NEW" | "USED";

export type ProductAvailability = "IN_STOCK" | "OUT_OF_STOCK";

export type ProductStatus =
  | "ACTIVE"
  | "EXPIRED"
  | "HIDDEN_BY_SUSPENSION"
  | "REMOVED_BY_ADMIN";

export interface MarketplaceProductImage {
  id: string;
  image: string;
  is_primary: boolean;
  display_order: number;
}

export interface MarketplaceProduct {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: string;
  condition: ProductCondition;
  condition_display: string;
  quantity: number;
  availability: ProductAvailability;
  campus_location: string | null;
  status: ProductStatus;
  status_display: string;
  views_count: number;
  listed_at: string;
  expires_at: string;
  store: {
    id: string;
    vendor_id: string;
    slug: string;
    display_name: string;
  };
  university: {
    id: string;
    name: string;
    short_name: string;
  };
  categories: MarketplaceCategoryBrief[];
  images: MarketplaceProductImage[];
  primary_image: MarketplaceProductImage | null;
}

export type ProductOrdering =
  | "newest"
  | "price_asc"
  | "price_desc";

export interface ProductListParams {
  q?: string;
  category?: string;
  min_price?: string | number;
  max_price?: string | number;
  condition?: ProductCondition;
  ordering?: ProductOrdering;
  page?: number;
  page_size?: number;
}