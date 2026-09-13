import type { MarketplaceCategory } from "../../types/marketplace";

interface CategoryCardProps {
  category: MarketplaceCategory;
  onClick?: (category: MarketplaceCategory) => void;
}

export default function CategoryCard({
  category,
  onClick,
}: CategoryCardProps) {
  const content = (
    <>
      <div
        className="d-flex align-items-center justify-content-center rounded-3 bg-light mb-3"
        style={{
          width: "52px",
          height: "52px",
        }}
      >
        <span
          className="fw-bold"
          style={{ fontSize: "1.25rem" }}
          aria-hidden="true"
        >
          {category.name.charAt(0).toUpperCase()}
        </span>
      </div>

      <h2 className="h6 fw-semibold mb-1 text-dark">
        {category.name}
      </h2>

      <p className="small text-muted mb-0">
        Browse products
      </p>
    </>
  );

  if (onClick) {
    return (
      <button
        type="button"
        className="card border-0 shadow-sm h-100 w-100 text-start"
        onClick={() => onClick(category)}
      >
        <div className="card-body p-3">{content}</div>
      </button>
    );
  }

  return (
    <div className="card border-0 shadow-sm h-100">
      <div className="card-body p-3">{content}</div>
    </div>
  );
}