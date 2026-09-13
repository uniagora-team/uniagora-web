import { useEffect, useState } from "react";

import { getApiErrorMessage } from "../../services/api";
import marketplaceService from "../../services/marketplace.service";
import type { MarketplaceCategory } from "../../types/marketplace";

import CategoryGrid from "./CategoryGrid";

interface CategorySectionProps {
  onCategoryClick?: (
    category: MarketplaceCategory,
  ) => void;
}

export default function CategorySection({
  onCategoryClick,
}: CategorySectionProps) {
  const [categories, setCategories] = useState<
    MarketplaceCategory[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchCategories = async () => {
      try {
        const response =
          await marketplaceService.getCategories();

        if (isMounted) {
          setCategories(response.results);
          setError(null);
          setIsLoading(false);
        }
      } catch (requestError) {
        if (isMounted) {
          setError(
            getApiErrorMessage(
              requestError,
              "We couldn't load categories right now.",
            ),
          );
          setIsLoading(false);
        }
      }
    };

    void fetchCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) {
    return (
      <div className="row g-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="col-6 col-md-4 col-lg-3"
          >
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body p-3">
                <div
                  className="placeholder-glow mb-3"
                  style={{
                    width: "52px",
                    height: "52px",
                  }}
                >
                  <span className="placeholder w-100 h-100 rounded-3" />
                </div>

                <span className="placeholder-glow d-block">
                  <span className="placeholder col-8" />
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
      <div
        className="alert alert-danger mb-0"
        role="alert"
      >
        {error}
      </div>
    );
  }

  return (
    <CategoryGrid
      categories={categories}
      onCategoryClick={onCategoryClick}
    />
  );
}