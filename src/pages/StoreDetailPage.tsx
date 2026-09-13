import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import marketplaceService from "../services/marketplace.service";
import type { MarketplaceStore } from "../types/marketplace";

export default function StoreDetailPage() {
  const { slug } = useParams<{ slug: string }>();

  const [store, setStore] =
    useState<MarketplaceStore | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchStore = async () => {
      if (!slug) {
        if (isMounted) {
          setError("This store could not be found.");
          setIsLoading(false);
        }

        return;
      }

      try {
        const response =
          await marketplaceService.getStore(slug);

        if (isMounted) {
          setStore(response);
          setError(null);
          setIsLoading(false);
        }
      } catch {
        if (isMounted) {
          setError(
            "We couldn't load this store. It may no longer be available.",
          );
          setIsLoading(false);
        }
      }
    };

    void fetchStore();

    return () => {
      isMounted = false;
    };
  }, [slug]);

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

        <section className="container py-5">
          <div className="row justify-content-center">
            <div className="col-12 col-lg-7">
              <div className="card border-0 shadow-sm">
                <div className="card-body p-4 p-md-5">
                  <div className="placeholder-glow mb-4">
                    <span className="placeholder col-4" />
                  </div>

                  <div className="placeholder-glow mb-3">
                    <span className="placeholder col-7 placeholder-lg" />
                  </div>

                  <div className="placeholder-glow mb-4">
                    <span className="placeholder col-3" />
                  </div>

                  <div className="placeholder-glow mb-2">
                    <span className="placeholder col-12" />
                  </div>

                  <div className="placeholder-glow mb-2">
                    <span className="placeholder col-10" />
                  </div>

                  <div className="placeholder-glow">
                    <span className="placeholder col-8" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (error || !store) {
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
                    Store unavailable
                  </h1>

                  <p className="text-muted mb-4">
                    {error ??
                      "This store could not be found."}
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

        <div className="row justify-content-center">
          <div className="col-12 col-lg-8">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4 p-md-5">
                <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
                  <span className="badge bg-light text-dark border">
                    {store.vendor_type}
                  </span>

                  {store.is_verified && (
                    <span className="badge text-bg-success">
                      ✓ Verified
                    </span>
                  )}

                  <span
                    className={`badge ${
                      store.is_active
                        ? "text-bg-success"
                        : "text-bg-secondary"
                    }`}
                  >
                    {store.is_active
                      ? "Active"
                      : "Inactive"}
                  </span>
                </div>

                <h1 className="h2 fw-bold mb-3">
                  {store.display_name}
                </h1>

                {store.description && (
                  <p className="text-muted mb-4">
                    {store.description}
                  </p>
                )}

                <div className="border-top border-bottom py-3">
                  <div className="d-flex justify-content-between gap-3 py-2">
                    <span className="text-muted">
                      Vendor type
                    </span>

                    <span className="fw-semibold text-end">
                      {store.vendor_type}
                    </span>
                  </div>

                  <div className="d-flex justify-content-between gap-3 py-2">
                    <span className="text-muted">
                      Verification
                    </span>

                    <span className="fw-semibold text-end">
                      {store.is_verified
                        ? "Verified seller"
                        : "Not verified"}
                    </span>
                  </div>

                  {store.contact_phone && (
                    <div className="d-flex justify-content-between gap-3 py-2">
                      <span className="text-muted">
                        Contact
                      </span>

                      <a
                        href={`tel:${store.contact_phone}`}
                        className="fw-semibold text-dark text-decoration-none"
                      >
                        {store.contact_phone}
                      </a>
                    </div>
                  )}
                </div>

                <div className="bg-light rounded-3 p-3 mt-4">
                  <p className="small text-muted mb-1">
                    Shopping safely
                  </p>

                  <p className="small mb-0">
                    Always confirm the product details,
                    condition, price, and meeting location
                    with the seller before completing a
                    transaction.
                  </p>
                </div>

                <div className="mt-4">
                  <Link
                    to="/dashboard"
                    className="btn btn-primary"
                  >
                    Browse marketplace
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}