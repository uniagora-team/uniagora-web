import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import logo from "../assets/images/uniagora-logo.png";
import { useAuth } from "../hooks/useAuth";

interface LocationState {
  from?: {
    pathname?: string;
  };
}

export default function LoginPage() {
  const { login, isLoading, error, clearError } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState("");

  const locationState = location.state as LocationState | null;

  const redirectPath =
    locationState?.from?.pathname || "/dashboard";

  useEffect(() => {
    clearError();
  }, [clearError]);

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setValidationError("");
    clearError();

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setValidationError(
        "Please enter your email address.",
      );
      return;
    }

    if (!password) {
      setValidationError("Please enter your password.");
      return;
    }

    try {
      await login({
        email: trimmedEmail,
        password,
      });

      navigate(redirectPath, {
        replace: true,
      });
    } catch {
      // Authentication errors are handled by AuthContext.
    }
  };

  const displayedError =
    validationError || error;

  return (
    <main className="min-vh-100 d-flex align-items-center bg-light py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-10 col-md-7 col-lg-5 col-xl-4">
            <div className="text-center mb-4">
              <Link
                to="/"
                className="d-inline-block text-decoration-none"
              >
                <img
                  src={logo}
                  alt="UniAGORA"
                  style={{ maxWidth: "180px" }}
                />
              </Link>

              <h1 className="h3 fw-bold mt-4 mb-2">
                Welcome back
              </h1>

              <p className="text-muted mb-0">
                Sign in to continue to UniAGORA.
              </p>
            </div>

            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body p-4 p-md-5">
                {displayedError && (
                  <div
                    className="alert alert-danger"
                    role="alert"
                  >
                    {displayedError}
                  </div>
                )}

                <form
                  onSubmit={handleSubmit}
                  noValidate
                >
                  <div className="mb-3">
                    <label
                      htmlFor="login-email"
                      className="form-label fw-semibold"
                    >
                      Email address
                    </label>

                    <input
                      id="login-email"
                      type="email"
                      className="form-control form-control-lg"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(event) =>
                        setEmail(event.target.value)
                      }
                      autoComplete="email"
                      disabled={isLoading}
                    />
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="login-password"
                      className="form-label fw-semibold"
                    >
                      Password
                    </label>

                    <div className="input-group input-group-lg">
                      <input
                        id="login-password"
                        type={
                          showPassword
                            ? "text"
                            : "password"
                        }
                        className="form-control"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(event) =>
                          setPassword(event.target.value)
                        }
                        autoComplete="current-password"
                        disabled={isLoading}
                      />

                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() =>
                          setShowPassword(
                            (current) => !current,
                          )
                        }
                        disabled={isLoading}
                        aria-label={
                          showPassword
                            ? "Hide password"
                            : "Show password"
                        }
                      >
                        {showPassword
                          ? "Hide"
                          : "Show"}
                      </button>
                    </div>
                  </div>

                  <div className="d-flex justify-content-end mb-4">
                    <Link
                      to="/password-reset"
                      className="text-decoration-none fw-semibold"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-dark btn-lg w-100"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        />
                        Signing in...
                      </>
                    ) : (
                      "Sign in"
                    )}
                  </button>
                </form>

                <div className="text-center mt-4">
                  <span className="text-muted">
                    Don't have an account?{" "}
                  </span>

                  <Link
                    to="/register"
                    className="fw-semibold text-decoration-none"
                  >
                    Create one
                  </Link>
                </div>
              </div>
            </div>

            <p className="text-center text-muted small mt-4 mb-0">
              © {new Date().getFullYear()} UniAGORA
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}