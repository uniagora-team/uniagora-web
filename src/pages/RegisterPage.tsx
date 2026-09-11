import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";
import logo from "../assets/images/uniagora-logo.png";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register, error, clearError, isLoading } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setValidationError(null);
    clearError();

    const trimmedFullName = fullName.trim();
    const trimmedEmail = email.trim();
    const trimmedPhoneNumber = phoneNumber.trim();

    if (!trimmedFullName) {
      setValidationError("Please enter your full name.");
      return;
    }

    if (!trimmedEmail) {
      setValidationError("Please enter your email address.");
      return;
    }

    if (!password) {
      setValidationError("Please enter a password.");
      return;
    }

    if (password !== confirmPassword) {
      setValidationError("Passwords do not match.");
      return;
    }

    try {
      await register({
        full_name: trimmedFullName,
        email: trimmedEmail,
        ...(trimmedPhoneNumber
          ? { phone_number: trimmedPhoneNumber }
          : {}),
        password,
      });

      navigate("/dashboard", { replace: true });
    } catch {
      // The authentication context exposes the backend error.
    }
  };

  const displayError = validationError || error;

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
                Create your UniAGORA account
              </h1>

              <p className="text-muted mb-0">
                Join UniAGORA and start exploring your campus marketplace.
              </p>
            </div>

            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body p-4 p-md-5">
                {displayError && (
                  <div className="alert alert-danger" role="alert">
                    {displayError}
                  </div>
                )}

                <form onSubmit={handleSubmit} noValidate>
                  <div className="mb-3">
                    <label
                      htmlFor="fullName"
                      className="form-label fw-semibold"
                    >
                      Full name
                    </label>

                    <input
                      id="fullName"
                      type="text"
                      className="form-control form-control-lg rounded-3"
                      value={fullName}
                      onChange={(event) => {
                        setFullName(event.target.value);
                        setValidationError(null);
                        clearError();
                      }}
                      placeholder="Enter your full name"
                      autoComplete="name"
                      disabled={isLoading}
                      required
                    />
                  </div>

                  <div className="mb-3">
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
                        setValidationError(null);
                        clearError();
                      }}
                      placeholder="you@example.com"
                      autoComplete="email"
                      disabled={isLoading}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label
                      htmlFor="phoneNumber"
                      className="form-label fw-semibold"
                    >
                      Phone number{" "}
                      <span className="text-muted fw-normal">
                        (optional)
                      </span>
                    </label>

                    <input
                      id="phoneNumber"
                      type="tel"
                      className="form-control form-control-lg rounded-3"
                      value={phoneNumber}
                      onChange={(event) => {
                        setPhoneNumber(event.target.value);
                        setValidationError(null);
                        clearError();
                      }}
                      placeholder="08012345678"
                      autoComplete="tel"
                      disabled={isLoading}
                    />
                  </div>

                  <div className="mb-3">
                    <label
                      htmlFor="password"
                      className="form-label fw-semibold"
                    >
                      Password
                    </label>

                    <div className="input-group input-group-lg">
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        className="form-control rounded-start-3"
                        value={password}
                        onChange={(event) => {
                          setPassword(event.target.value);
                          setValidationError(null);
                          clearError();
                        }}
                        placeholder="Create a password"
                        autoComplete="new-password"
                        disabled={isLoading}
                        required
                      />

                      <button
                        type="button"
                        className="btn btn-outline-secondary rounded-end-3"
                        onClick={() =>
                          setShowPassword((current) => !current)
                        }
                        disabled={isLoading}
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
                      Confirm password
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
                          setValidationError(null);
                          clearError();
                        }}
                        placeholder="Confirm your password"
                        autoComplete="new-password"
                        disabled={isLoading}
                        required
                      />

                      <button
                        type="button"
                        className="btn btn-outline-secondary rounded-end-3"
                        onClick={() =>
                          setShowConfirmPassword((current) => !current)
                        }
                        disabled={isLoading}
                      >
                        {showConfirmPassword ? "Hide" : "Show"}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary btn-lg w-100 rounded-3 fw-semibold"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          aria-hidden="true"
                        />
                        Creating account...
                      </>
                    ) : (
                      "Create account"
                    )}
                  </button>
                </form>

                <div className="text-center mt-4">
                  <span className="text-muted">
                    Already have an account?{" "}
                  </span>

                  <Link
                    to="/login"
                    className="text-decoration-none fw-semibold"
                  >
                    Log in
                  </Link>
                </div>
              </div>
            </div>

            <p className="text-center text-muted small mt-4 mb-0">
              By creating an account, you agree to use UniAGORA responsibly.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}