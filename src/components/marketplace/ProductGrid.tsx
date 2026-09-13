import type { MarketplaceProduct } from "../../types/marketplace";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  products: MarketplaceProduct[];
}

export default function ProductGrid({
  products,
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-5">
        <h2 className="h5 fw-semibold mb-2">
          No products found
        </h2>

        <p className="text-muted mb-0">
          There are no products available right now.
        </p>
      </div>
    );
  }

  return (
    <div className="row g-3 g-md-4">
      {products.map((product) => (
        <div
          key={product.id}
          className="col-6 col-md-4 col-lg-3"
        >
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
}