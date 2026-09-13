import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import marketplaceService from "../services/marketplace.service";
import {chatService} from "../services/chat.service";
import { getApiErrorMessage } from "../services/api";
import type { MarketplaceProduct } from "../types/marketplace";

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

const formatDate = (date: string): string => {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Unknown date";
  }

  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
  }).format(parsedDate);
};

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [product, setProduct] =
    useState<MarketplaceProduct | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isStartingConversation, setIsStartingConversation] =
    useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conversationError, setConversationError] =
    useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchProduct = async () => {
      if (!slug) {
        if (isMounted) {
          setError("This product could not be found.");
          setIsLoading(false);
        }

        return;
      }

      try {
        const response =
          await marketplaceService.getProduct(slug);

        if (isMounted) {
          setProduct(response);
          setError(null);
          setIsLoading(false);
        }
      } catch {
        if (isMounted) {
          setError(
            "We couldn't load this product. It may have been removed or is no longer available.",
          );
          setIsLoading(false);
        }
      }
    };

    void fetchProduct();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  const handleContactSeller = async () => {
    if (!product) {
      return;
    }

    if (!product.store.vendor_id) {
      setConversationError(
        "We couldn't identify this seller. Please try again later.",
      );
      return;
    }

    setIsStartingConversation(true);
    setConversationError(null);

    try {
      const conversation =
        await chatService.createConversation({
          vendor: product.store.vendor_id,
          product: product.id,
        });

      navigate(`/chat/${conversation.id}`);
    } catch (error) {
      setConversationError(
        getApiErrorMessage(
          error,
          "We couldn't start a conversation with this seller. Please try again.",
        ),
      );
    } finally {
      setIsStartingConversation(false);
    }
  };

  if (isLoading) {
    return (
      <main className="min-vh-100 bg-light">
        <nav className="navbar bg-white border-bottom">
          <div className="container py-2">
            <Link
              to="/dashboard"
              className="navbar-brand fw-bold"
            >
              UniAGORA
            </Link>
          </div>
        </nav>

        <section className="container py-4 py-md-5">
          <div className="row g-4 g-lg-5">
            <div className="col-12 col-lg-7">
              <div
                className="placeholder-glow bg-white rounded-4 overflow-hidden"
                style={{ aspectRatio: "1 / 1" }}
              >
                <span className="placeholder w-100 h-100" />
              </div>
            </div>

            <div className="col-12 col-lg-5">
              <div className="card border-0 shadow-sm">
                <div className="card-body p-4">
                  <span className="placeholder-glow d-block mb-3">
                    <span className="placeholder col-4" />
                  </span>

                  <span className="placeholder-glow d-block mb-3">
                    <span className="placeholder col-10 placeholder-lg" />
                  </span>

                  <span className="placeholder-glow d-block mb-4">
                    <span className="placeholder col-6" />
                  </span>

                  <span className="placeholder-glow d-block mb-2">
                    <span className="placeholder col-12" />
                  </span>

                  <span className="placeholder-glow d-block mb-2">
                    <span className="placeholder col-9" />
                  </span>

                  <span className="placeholder-glow d-block">
                    <span className="placeholder col-7" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="min-vh-100 bg-light">
        <nav className="navbar bg-white border-bottom">
          <div className="container py-2">
            <Link
              to="/dashboard"
              className="navbar-brand fw-bold"
            >
              UniAGORA
            </Link>
          </div>
        </nav>

        <section className="container py-5">
          <div className="row justify-content-center">
            <div className="col-12 col-md-7 col-lg-6">
              <div className="card border-0 shadow-sm">
                <div className="card-body text-center p-5">
                  <h1 className="h4 fw-bold mb-3">
                    Product unavailable
                  </h1>

                  <p className="text-muted mb-4">
                    {error ??
                      "This product could not be found."}
                  </p>

                  <Link
                    to="/dashboard"
                    className="btn btn-primary"
                  >
                    Back to marketplace
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  const isAvailable =
    product.availability === "IN_STOCK";

  const conditionLabel =
    product.condition_display || product.condition;

  const images =
    product.images.length > 0
      ? product.images
      : product.primary_image
        ? [product.primary_image]
        : [];

  return (
    <main className="min-vh-100 bg-light">
      <nav className="navbar bg-white border-bottom">
        <div className="container py-2">
          <Link
            to="/dashboard"
            className="navbar-brand fw-bold"
          >
            UniAGORA
          </Link>

          <Link
            to="/dashboard"
            className="btn btn-outline-dark btn-sm"
          >
            Back to marketplace
          </Link>
        </div>
      </nav>

      <section className="container py-4 py-md-5">
        <div className="mb-4">
          <Link
            to="/dashboard"
            className="small text-muted text-decoration-none"
          >
            ← Back to marketplace
          </Link>
        </div>

        <div className="row g-4 g-lg-5">
          <div className="col-12 col-lg-7">
            <div className="card border-0 shadow-sm overflow-hidden">
              {images.length > 0 ? (
                <div
                  className="bg-white"
                  style={{ aspectRatio: "1 / 1" }}
                >
                  <img
                    src={images[0].image}
                    alt={product.name}
                    className="w-100 h-100"
                    style={{ objectFit: "contain" }}
                  />
                </div>
              ) : (
                <div
                  className="bg-light d-flex align-items-center justify-content-center"
                  style={{ aspectRatio: "1 / 1" }}
                >
                  <span className="text-muted">
                    No image available
                  </span>
                </div>
              )}
            </div>

            {images.length > 1 && (
              <div className="row g-2 mt-2">
                {images.map((image) => (
                  <div
                    key={image.id}
                    className="col-3 col-sm-2"
                  >
                    <div
                      className="bg-white rounded-3 overflow-hidden border"
                      style={{ aspectRatio: "1 / 1" }}
                    >
                      <img
                        src={image.image}
                        alt={`${product.name} ${
                          image.display_order + 1
                        }`}
                        className="w-100 h-100"
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="col-12 col-lg-5">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4 p-md-5">
                <div className="d-flex flex-wrap gap-2 mb-3">
                  <span className="badge bg-light text-dark border">
                    {conditionLabel}
                  </span>

                  <span
                    className={`badge ${
                      isAvailable
                        ? "text-bg-success"
                        : "text-bg-secondary"
                    }`}
                  >
                    {isAvailable
                      ? "In stock"
                      : "Out of stock"}
                  </span>
                </div>

                <h1 className="h3 fw-bold mb-3">
                  {product.name}
                </h1>

                <p className="display-6 fw-bold mb-4">
                  {formatPrice(product.price)}
                </p>

                <div className="border-top border-bottom py-3 mb-4">
                  <div className="d-flex justify-content-between gap-3 mb-2">
                    <span className="text-muted">
                      Availability
                    </span>

                    <span className="fw-semibold">
                      {product.quantity > 0
                        ? `${product.quantity} available`
                        : "Out of stock"}
                    </span>
                  </div>

                  {product.campus_location && (
                    <div className="d-flex justify-content-between gap-3">
                      <span className="text-muted">
                        Location
                      </span>

                      <span className="fw-semibold text-end">
                        {product.campus_location}
                      </span>
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <h2 className="h6 fw-bold mb-2">
                    Description
                  </h2>

                  <p className="text-muted mb-0">
                    {product.description}
                  </p>
                </div>

                {product.categories.length > 0 && (
                  <div className="mb-4">
                    <h2 className="h6 fw-bold mb-2">
                      Categories
                    </h2>

                    <div className="d-flex flex-wrap gap-2">
                      {product.categories.map((category) => (
                        <span
                          key={category.id}
                          className="badge bg-light text-dark border"
                        >
                          {category.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="bg-light rounded-3 p-3 mb-4">
                  <Link
                    to={`/stores/${product.store.slug}`}
                    className="fw-bold text-dark text-decoration-none"
                  >
                    {product.store.display_name}
                  </Link>

                  <p className="fw-bold mb-1">
                    {product.store.display_name}
                  </p>

                  <p className="small text-muted mb-0">
                    {product.university.short_name}
                  </p>
                </div>

                {conversationError && (
                  <div
                    className="alert alert-danger"
                    role="alert"
                  >
                    {conversationError}
                  </div>
                )}

                <button
                  type="button"
                  className="btn btn-primary w-100 mb-3"
                  onClick={handleContactSeller}
                  disabled={isStartingConversation}
                >
                  {isStartingConversation ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        aria-hidden="true"
                      />
                      Starting conversation...
                    </>
                  ) : (
                    "Contact Seller"
                  )}
                </button>

                <div className="small text-muted">
                  Listed {formatDate(product.listed_at)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}