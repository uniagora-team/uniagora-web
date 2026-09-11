import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import { getApiErrorMessage } from "../services/api";
import authService from "../services/auth.service";
import logo from "../assets/images/uniagora-logo.png";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const uid = searchParams.get("uid");
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError(null);

    if (!uid || !token) {
      setError("This password reset link is invalid or incomplete.");
      return;
    }

    if (!password) {
      setError("Please enter a new password.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      await authService.confirmPasswordReset({
        uid,
        token,
        new_password: password,
      });

      navigate("/login", {
        replace: true,
        state: {
          passwordResetSuccess: true,
        },
      });
    } catch (resetError) {
      setError(getApiErrorMessage(resetError));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-vh-100 d-flex align-items-center bg-light py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5">
            <div className="text-center mb-4">
              <Link to="/" className="d-inline-block">
                <img
                  src={logo}
                  alt="UniAGORA"
                  style={{ maxWidth: "180px", height: "auto" }}
                />
              </Link>

              <h1 className="h3 fw-bold mt-4 mb-2">
                Create a new password
              </h1>

              <p className="text-muted mb-0">
                Choose a strong password for your UniAGORA account.
              </p>
            </div>

            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body p-4 p-md-5">
                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} noValidate>
                  <div className="mb-3">
                    <label
                      htmlFor="password"
                      className="form-label fw-semibold"
                    >
                      New password
                    </label>

                    <div className="input-group input-group-lg">
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        className="form-control rounded-start-3"
                        value={password}
                        onChange={(event) => {
                          setPassword(event.target.value);
                          setError(null);
                        }}
                        placeholder="Enter your new password"
                        autoComplete="new-password"
                        disabled={isSubmitting}
                        required
                      />

                      <button
                        type="button"
                        className="btn btn-outline-secondary rounded-end-3"
                        onClick={() =>
                          setShowPassword((current) => !current)
                        }
                        disabled={isSubmitting}
                      >
                        {showPassword ? "Hide" : "Show"}
                      </button>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="confirmPassword"
                      className="form-label fw-semibold"
                    >
                      Confirm new password
                    </label>

                    <div className="input-group input-group-lg">
                      <input
                        id="confirmPassword"
                        type={
                          showConfirmPassword ? "text" : "password"
                        }
                        className="form-control rounded-start-3"
                        value={confirmPassword}
                        onChange={(event) => {
                          setConfirmPassword(event.target.value);
                          setError(null);
                        }}
                        placeholder="Confirm your new password"
                        autoComplete="new-password"
                        disabled={isSubmitting}
                        required
                      />

                      <button
                        type="button"
                        className="btn btn-outline-secondary rounded-end-3"
                        onClick={() =>
                          setShowConfirmPassword((current) => !current)
                        }
                        disabled={isSubmitting}
                      >
                        {showConfirmPassword ? "Hide" : "Show"}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary btn-lg w-100 rounded-3 fw-semibold"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          aria-hidden="true"
                        />
                        Resetting password...
                      </>
                    ) : (
                      "Reset password"
                    )}
                  </button>
                </form>

                <div className="text-center mt-4">
                  <Link
                    to="/login"
                    className="text-decoration-none fw-semibold"
                  >
                    Back to login
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}