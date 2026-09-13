import { useEffect, useState } from "react";

import CategorySection from "../components/marketplace/CategorySection";
import ProductGrid from "../components/marketplace/ProductGrid";
import UniversitySelector from "../components/marketplace/UniversitySelector";
import { useAuth } from "../hooks/useAuth";
import marketplaceService from "../services/marketplace.service";
import type {
  MarketplaceCategory,
  MarketplaceProduct,
  ProductCondition,
  ProductOrdering,
} from "../types/marketplace";

interface ProductSectionProps {
  universitySlug: string;
  categorySlug: string | null;
  searchQuery: string;
  condition: ProductCondition | "";
  minPrice: string;
  maxPrice: string;
  ordering: ProductOrdering;
}

function ProductSection({
  universitySlug,
  categorySlug,
  searchQuery,
  condition,
  minPrice,
  maxPrice,
  ordering,
}: ProductSectionProps) {
  const [products, setProducts] = useState<MarketplaceProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      try {
        const response = await marketplaceService.getProducts({
          ordering,
          page_size: 8,
          category: categorySlug ?? undefined,
          q: searchQuery || undefined,
          condition: condition || undefined,
          min_price: minPrice || undefined,
          max_price: maxPrice || undefined,
        });

        if (isMounted) {
          setProducts(response.results);
          setError(null);
          setIsLoading(false);
        }
      } catch {
        if (isMounted) {
          setError(
            "We couldn't load products right now. Please try again.",
          );
          setIsLoading(false);
        }
      }
    };

    void fetchProducts();

    return () => {
      isMounted = false;
    };
  }, [
    universitySlug,
    categorySlug,
    searchQuery,
    condition,
    minPrice,
    maxPrice,
    ordering,
  ]);

  if (isLoading) {
    return (
      <div className="row g-3 g-md-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="col-6 col-md-4 col-lg-3"
          >
            <div className="card border-0 shadow-sm overflow-hidden h-100">
              <div
                className="placeholder-glow bg-white"
                style={{ aspectRatio: "1 / 1" }}
              >
                <span className="placeholder w-100 h-100" />
              </div>

              <div className="card-body">
                <span className="placeholder-glow">
                  <span className="placeholder col-9" />
                </span>

                <span className="placeholder-glow d-block mt-2">
                  <span className="placeholder col-6" />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="card border-0 shadow-sm">
        <div className="card-body text-center py-5">
          <h2 className="h5 fw-semibold mb-2">
            Something went wrong
          </h2>

          <p className="text-muted mb-4">
            {error}
          </p>

          <button
            type="button"
            className="btn btn-primary"
            onClick={() => window.location.reload()}
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="card border-0 shadow-sm">
        <div className="card-body text-center py-5">
          <h2 className="h5 fw-semibold mb-2">
            No products found
          </h2>

          <p className="text-muted mb-0">
            Try changing your search or filters to find more
            products.
          </p>
        </div>
      </div>
    );
  }

  return <ProductGrid products={products} />;
}

export default function DashboardPage() {
  const { user, logout } = useAuth();

  const [selectedCategory, setSelectedCategory] =
    useState<MarketplaceCategory | null>(null);

  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [condition, setCondition] =
    useState<ProductCondition | "">("");

  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const [ordering, setOrdering] =
    useState<ProductOrdering>("newest");

  const [showFilters, setShowFilters] = useState(false);

  const handleLogout = async () => {
    await logout();
  };

  const handleCategoryClick = (
    category: MarketplaceCategory,
  ) => {
    setSelectedCategory(category);
  };

  const handleClearCategory = () => {
    setSelectedCategory(null);
  };

  const handleSearchSubmit = (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setSearchQuery(searchInput.trim());
  };

  const handleClearSearch = () => {
    setSearchInput("");
    setSearchQuery("");
  };

  const handleClearFilters = () => {
    setCondition("");
    setMinPrice("");
    setMaxPrice("");
    setOrdering("newest");
  };

  const hasActiveFilters =
    condition !== "" ||
    minPrice !== "" ||
    maxPrice !== "" ||
    ordering !== "newest";

  if (!user?.active_university) {
    return (
      <main className="min-vh-100 bg-light">
        <nav className="navbar navbar-expand-lg bg-white border-bottom">
          <div className="container py-2">
            <span className="navbar-brand fw-bold mb-0">
              UniAGORA
            </span>

            <div className="d-flex align-items-center gap-3">
              <span className="text-muted small d-none d-sm-inline">
                {user?.full_name}
              </span>

              <button
                type="button"
                className="btn btn-outline-dark btn-sm"
                onClick={() => void handleLogout()}
              >
                Logout
              </button>
            </div>
          </div>
        </nav>

        <section className="container py-4 py-md-5">
          <div className="row justify-content-center">
            <div className="col-12 col-lg-7">
              <UniversitySelector />
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-vh-100 bg-light">
      <nav className="navbar navbar-expand-lg bg-white border-bottom">
        <div className="container py-2">
          <span className="navbar-brand fw-bold mb-0">
            UniAGORA
          </span>

          <div className="d-flex align-items-center gap-3">
            <span className="text-muted small d-none d-sm-inline">
              {user.full_name}
            </span>

            <button
              type="button"
              className="btn btn-outline-dark btn-sm"
              onClick={() => void handleLogout()}
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <section className="container py-4 py-md-5">
        <div className="mb-4">
          <p className="small text-muted mb-1">
            {user.active_university.name}
          </p>

          <h1 className="h3 fw-bold mb-1">
            Welcome back, {user.full_name}
          </h1>

          <p className="text-muted mb-0">
            Discover the latest products available on your campus.
          </p>
        </div>

        <form
          onSubmit={handleSearchSubmit}
          className="mb-3"
        >
          <label
            htmlFor="marketplace-search"
            className="visually-hidden"
          >
            Search products
          </label>

          <div className="input-group input-group-lg">
            <input
              id="marketplace-search"
              type="search"
              className="form-control"
              value={searchInput}
              onChange={(event) =>
                setSearchInput(event.target.value)
              }
              placeholder="Search products..."
              aria-label="Search products"
            />

            {searchInput && (
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={handleClearSearch}
              >
                Clear
              </button>
            )}

            <button
              type="submit"
              className="btn btn-primary"
            >
              Search
            </button>
          </div>
        </form>

        <div className="d-flex flex-wrap align-items-center gap-2 mb-5">
          <button
            type="button"
            className={`btn ${
              showFilters
                ? "btn-dark"
                : "btn-outline-dark"
            }`}
            onClick={() => setShowFilters((current) => !current)}
          >
            {showFilters ? "Hide filters" : "Filters"}
          </button>

          {hasActiveFilters && (
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={handleClearFilters}
            >
              Clear filters
            </button>
          )}

          {searchQuery && (
            <span className="badge bg-light text-dark border">
              Search: {searchQuery}
            </span>
          )}

          {selectedCategory && (
            <span className="badge bg-light text-dark border">
              Category: {selectedCategory.name}
            </span>
          )}
        </div>

        {showFilters && (
          <section className="card border-0 shadow-sm mb-5">
            <div className="card-body p-4">
              <div className="d-flex align-items-center justify-content-between gap-3 mb-4">
                <div>
                  <h2 className="h5 fw-bold mb-1">
                    Filter products
                  </h2>

                  <p className="small text-muted mb-0">
                    Narrow down products by price, condition,
                    or sorting.
                  </p>
                </div>

                {hasActiveFilters && (
                  <button
                    type="button"
                    className="btn btn-sm btn-link text-dark text-decoration-none"
                    onClick={handleClearFilters}
                  >
                    Reset
                  </button>
                )}
              </div>

              <div className="row g-3">
                <div className="col-12 col-md-6 col-lg-3">
                  <label
                    htmlFor="product-condition"
                    className="form-label small fw-semibold"
                  >
                    Condition
                  </label>

                  <select
                    id="product-condition"
                    className="form-select"
                    value={condition}
                    onChange={(event) =>
                      setCondition(
                        event.target
                          .value as ProductCondition | "",
                      )
                    }
                  >
                    <option value="">All conditions</option>
                    <option value="NEW">New</option>
                    <option value="USED">Used</option>
                  </select>
                </div>

                <div className="col-12 col-md-6 col-lg-3">
                  <label
                    htmlFor="min-price"
                    className="form-label small fw-semibold"
                  >
                    Minimum price
                  </label>

                  <input
                    id="min-price"
                    type="number"
                    min="0"
                    className="form-control"
                    value={minPrice}
                    onChange={(event) =>
                      setMinPrice(event.target.value)
                    }
                    placeholder="e.g. 5000"
                  />
                </div>

                <div className="col-12 col-md-6 col-lg-3">
                  <label
                    htmlFor="max-price"
                    className="form-label small fw-semibold"
                  >
                    Maximum price
                  </label>

                  <input
                    id="max-price"
                    type="number"
                    min="0"
                    className="form-control"
                    value={maxPrice}
                    onChange={(event) =>
                      setMaxPrice(event.target.value)
                    }
                    placeholder="e.g. 100000"
                  />
                </div>

                <div className="col-12 col-md-6 col-lg-3">
                  <label
                    htmlFor="product-ordering"
                    className="form-label small fw-semibold"
                  >
                    Sort by
                  </label>

                  <select
                    id="product-ordering"
                    className="form-select"
                    value={ordering}
                    onChange={(event) =>
                      setOrdering(
                        event.target.value as ProductOrdering,
                      )
                    }
                  >
                    <option value="newest">
                      Newest
                    </option>

                    <option value="price_asc">
                      Price: Low to High
                    </option>

                    <option value="price_desc">
                      Price: High to Low
                    </option>
                  </select>
                </div>
              </div>
            </div>
          </section>
        )}

        <section className="mb-5">
          <div className="d-flex align-items-start justify-content-between gap-3 mb-3">
            <div>
              <h2 className="h5 fw-bold mb-1">
                Browse categories
              </h2>

              <p className="small text-muted mb-0">
                Find what you need by category.
              </p>
            </div>

            {selectedCategory && (
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary"
                onClick={handleClearCategory}
              >
                View all
              </button>
            )}
          </div>

          {selectedCategory && (
            <div className="mb-3">
              <span className="badge text-bg-dark">
                {selectedCategory.name}
              </span>
            </div>
          )}

          <CategorySection
            onCategoryClick={handleCategoryClick}
          />
        </section>

        <section>
          <div className="mb-3">
            <h2 className="h5 fw-bold mb-1">
              {searchQuery
                ? `Search results for "${searchQuery}"`
                : selectedCategory
                  ? `${selectedCategory.name} products`
                  : "Latest products"}
            </h2>

            <p className="small text-muted mb-0">
              {searchQuery
                ? "Products matching your search and selected filters."
                : selectedCategory
                  ? `Products in ${selectedCategory.name} matching your selected filters.`
                  : "Recently listed items from your campus marketplace."}
            </p>
          </div>

          <ProductSection
            key={`${user.active_university.slug}-${selectedCategory?.slug ?? "all"}-${searchQuery}-${condition}-${minPrice}-${maxPrice}-${ordering}`}
            universitySlug={user.active_university.slug}
            categorySlug={selectedCategory?.slug ?? null}
            searchQuery={searchQuery}
            condition={condition}
            minPrice={minPrice}
            maxPrice={maxPrice}
            ordering={ordering}
          />
        </section>
      </section>
    </main>
  );
}