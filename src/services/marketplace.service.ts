import api from "./api";

import type {
  MarketplaceCategory,
  MarketplaceProduct,
  MarketplaceStore,
  MarketplaceUniversity,
  ProductListParams,
} from "../types/marketplace";
import type {
  ApiSuccessResponse,
  PaginationResponse,
} from "../types/api";

const buildProductQueryParams = (
  params: ProductListParams = {},
): Record<string, string | number> => {
  const queryParams: Record<string, string | number> = {};

  if (params.q?.trim()) {
    queryParams.q = params.q.trim();
  }

  if (params.category) {
    queryParams.category = params.category;
  }

  if (params.min_price !== undefined) {
    queryParams.min_price = params.min_price;
  }

  if (params.max_price !== undefined) {
    queryParams.max_price = params.max_price;
  }

  if (params.condition) {
    queryParams.condition = params.condition;
  }

  if (params.ordering) {
    queryParams.ordering = params.ordering;
  }

  if (params.page !== undefined) {
    queryParams.page = params.page;
  }

  if (params.page_size !== undefined) {
    queryParams.page_size = params.page_size;
  }

  return queryParams;
};

const marketplaceService = {
  async getProducts(
    params: ProductListParams = {},
  ): Promise<PaginationResponse<MarketplaceProduct>> {
    const response = await api.get<
      ApiSuccessResponse<PaginationResponse<MarketplaceProduct>>
    >("/products/", {
      params: buildProductQueryParams(params),
    });

    return response.data.data;
  },

  async getProduct(slug: string): Promise<MarketplaceProduct> {
    const response = await api.get<
      ApiSuccessResponse<MarketplaceProduct>
    >(`/products/${slug}/`);

    return response.data.data;
  },

  async getCategories(): Promise<
    PaginationResponse<MarketplaceCategory>
  > {
    const response = await api.get<
      ApiSuccessResponse<PaginationResponse<MarketplaceCategory>>
    >("/categories/");

    return response.data.data;
  },

  async getCategory(slug: string): Promise<MarketplaceCategory> {
    const response = await api.get<
      ApiSuccessResponse<MarketplaceCategory>
    >(`/categories/${slug}/`);

    return response.data.data;
  },

  async getUniversities(): Promise<
    PaginationResponse<MarketplaceUniversity>
  > {
    const response = await api.get<
      ApiSuccessResponse<PaginationResponse<MarketplaceUniversity>>
    >("/universities/");

    return response.data.data;
  },

  async getUniversity(
    slug: string,
  ): Promise<MarketplaceUniversity> {
    const response = await api.get<
      ApiSuccessResponse<MarketplaceUniversity>
    >(`/universities/${slug}/`);

    return response.data.data;
  },

  async getStore(slug: string): Promise<MarketplaceStore> {
    const response = await api.get<
      ApiSuccessResponse<MarketplaceStore>
    >(`/stores/${slug}/`);

    return response.data.data;
  },
};

export default marketplaceService;