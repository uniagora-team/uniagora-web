import { useEffect, useState } from "react";

import { getApiErrorMessage } from "../../services/api";
import marketplaceService from "../../services/marketplace.service";
import { useAuth } from "../../hooks/useAuth";
import type { MarketplaceUniversity } from "../../types/marketplace";

export default function UniversitySelector() {
  const { setActiveUniversity } = useAuth();

  const [universities, setUniversities] = useState<
    MarketplaceUniversity[]
  >([]);
  const [selectedSlug, setSelectedSlug] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchUniversities = async () => {
      try {
        const response =
          await marketplaceService.getUniversities();

        if (isMounted) {
          setUniversities(response.results);
          setError(null);
          setIsLoading(false);
        }
      } catch (requestError) {
        if (isMounted) {
          setError(
            getApiErrorMessage(
              requestError,
              "We couldn't load the available universities.",
            ),
          );
          setIsLoading(false);
        }
      }
    };

    void fetchUniversities();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSubmit = async () => {
    if (!selectedSlug) {
      setError("Please select your university.");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      await setActiveUniversity({
        university_slug: selectedSlug,
      });
    } catch (requestError) {
      setError(
        getApiErrorMessage(
          requestError,
          "We couldn't update your university.",
        ),
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="card border-0 shadow-sm rounded-4">
        <div className="card-body p-4 p-md-5">
          <div className="placeholder-glow">
            <span className="placeholder col-7" />
          </div>

          <div className="placeholder-glow mt-2">
            <span className="placeholder col-10" />
          </div>

          <div className="placeholder-glow mt-4">
            <span
              className="placeholder col-12"
              style={{ height: "48px" }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card border-0 shadow-sm rounded-4">
      <div className="card-body p-4 p-md-5">
        <div className="mb-4">
          <h2 className="h4 fw-bold mb-2">
            Select your university
          </h2>

          <p className="text-muted mb-0">
            Choose your university to see products and stores
            available on your campus.
          </p>
        </div>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        {universities.length === 0 ? (
          <div className="alert alert-info mb-0" role="alert">
            There are currently no active universities available.
          </div>
        ) : (
          <>
            <div className="mb-4">
              <label
                htmlFor="university"
                className="form-label fw-semibold"
              >
                University
              </label>

              <select
                id="university"
                className="form-select form-select-lg rounded-3"
                value={selectedSlug}
                onChange={(event) => {
                  setSelectedSlug(event.target.value);
                  setError(null);
                }}
                disabled={isSaving}
              >
                <option value="">
                  Choose your university
                </option>

                {universities.map((university) => (
                  <option
                    key={university.id}
                    value={university.slug}
                  >
                    {university.name}
                    {university.short_name
                      ? ` (${university.short_name})`
                      : ""}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              className="btn btn-primary btn-lg rounded-3 fw-semibold"
              onClick={() => void handleSubmit()}
              disabled={isSaving || !selectedSlug}
            >
              {isSaving ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    aria-hidden="true"
                  />
                  Saving...
                </>
              ) : (
                "Continue to marketplace"
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
}