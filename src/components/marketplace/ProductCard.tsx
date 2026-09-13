import { Link } from "react-router-dom";

import type { MarketplaceProduct } from "../../types/marketplace";

interface ProductCardProps {
  product: MarketplaceProduct;
}

const formatPrice = (price: string): string => {
  const numericPrice = Number(price);

  if (Number.isNaN(numericPrice)) {
    return `₦${price}`;
  }

  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(numericPrice);
};

export default function ProductCard({
  product,
}: ProductCardProps) {
  const imageUrl = product.primary_image?.image ?? null;

  const conditionLabel =
    product.condition_display || product.condition;

  const isAvailable = product.availability === "IN_STOCK";

  return (
    <Link
      to={`/products/${product.slug}`}
      className="text-decoration-none text-reset d-block h-100"
      aria-label={`View ${product.name}`}
    >
      <article className="card h-100 border-0 shadow-sm overflow-hidden">
        <div
          className="position-relative bg-light"
          style={{ aspectRatio: "1 / 1" }}
        >
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={product.name}
              className="w-100 h-100"
              style={{ objectFit: "cover" }}
            />
          ) : (
            <div className="w-100 h-100 d-flex align-items-center justify-content-center">
              <span className="text-muted small">
                No image available
              </span>
            </div>
          )}

          <span
            className={`position-absolute top-0 end-0 m-2 badge ${
              isAvailable ? "text-bg-success" : "text-bg-secondary"
            }`}
          >
            {isAvailable ? "In stock" : "Out of stock"}
          </span>
        </div>

        <div className="card-body d-flex flex-column p-3">
          <div className="d-flex align-items-start justify-content-between gap-2 mb-2">
            <span className="badge bg-light text-dark border">
              {conditionLabel}
            </span>
          </div>

          <h2 className="h6 fw-bold mb-2 text-truncate">
            {product.name}
          </h2>

          <p className="fs-5 fw-bold mb-3">
            {formatPrice(product.price)}
          </p>

          <div className="mt-auto">
            <p className="small text-muted mb-1 text-truncate">
              {product.store.display_name}
            </p>

            {product.campus_location && (
              <p className="small text-muted mb-0 text-truncate">
                {product.campus_location}
              </p>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}