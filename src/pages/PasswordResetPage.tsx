import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";

import { getApiErrorMessage } from "../services/api";
import authService from "../services/auth.service";
import logo from "../assets/images/uniagora-logo.png";

export default function PasswordResetPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError(null);

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setError("Please enter your email address.");
      return;
    }

    setIsSubmitting(true);

    try {
      await authService.requestPasswordReset({
        email: trimmedEmail,
      });

      setIsSuccess(true);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
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
                Reset your password
              </h1>

              <p className="text-muted mb-0">
                Enter your email address and we'll send you a password
                reset link.
              </p>
            </div>

            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body p-4 p-md-5">
                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}

                {isSuccess ? (
                  <div>
                    <div
                      className="alert alert-success"
                      role="alert"
                    >
                      If an account with that email exists, a password
                      reset link has been sent.
                    </div>

                    <p className="text-muted mb-4">
                      Check your email inbox. If you don't see the
                      message, check your spam or junk folder.
                    </p>

                    <Link
                      to="/login"
                      className="btn btn-primary btn-lg w-100 rounded-3 fw-semibold"
                    >
                      Back to login
                    </Link>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} noValidate>
                    <div className="mb-4">
                      <label
                        htmlFor="email"
                        className="form-label fw-semibold"
                      >
                        Email address
                      </label>

                      <input
                        id="email"
                        type="email"
                        className="form-control form-control-lg rounded-3"
                        value={email}
                        onChange={(event) => {
                          setEmail(event.target.value);
                          setError(null);
                        }}
                        placeholder="you@example.com"
                        autoComplete="email"
                        disabled={isSubmitting}
                        required
                      />
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
                          Sending link...
                        </>
                      ) : (
                        "Send reset link"
                      )}
                    </button>
                  </form>
                )}

                {!isSuccess && (
                  <div className="text-center mt-4">
                    <Link
                      to="/login"
                      className="text-decoration-none fw-semibold"
                    >
                      Back to login
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}