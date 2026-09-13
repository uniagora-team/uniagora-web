import type { MarketplaceCategory } from "../../types/marketplace";

import CategoryCard from "./CategoryCard";

interface CategoryGridProps {
  categories: MarketplaceCategory[];
  onCategoryClick?: (
    category: MarketplaceCategory,
  ) => void;
}

export default function CategoryGrid({
  categories,
  onCategoryClick,
}: CategoryGridProps) {
  if (categories.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-muted mb-0">
          No categories are available right now.
        </p>
      </div>
    );
  }

  return (
    <div className="row g-3">
      {categories.map((category) => (
        <div
          key={category.id}
          className="col-6 col-md-4 col-lg-3"
        >
          <CategoryCard
            category={category}
            onClick={onCategoryClick}
          />
        </div>
      ))}
    </div>
  );
}