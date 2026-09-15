import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import logo from "../assets/images/uniagora-logo.png";
import { useAuth } from "../hooks/useAuth";
import { getApiErrorMessage } from "../services/api";
import marketplaceService from "../services/marketplace.service";
import vendorService, {
  type VendorDocumentType,
  type VendorType,
} from "../services/vendor.service";
import type { MarketplaceUniversity } from "../types/marketplace";

const studentDocumentOptions: {
  value: VendorDocumentType;
  label: string;
}[] = [
  {
    value: "ADMISSION_LETTER",
    label: "Admission letter",
  },
  {
    value: "STUDENT_ID_CARD",
    label: "Student ID card",
  },
  {
    value: "COURSE_REGISTRATION_SLIP",
    label: "Course registration slip",
  },
  {
    value: "SCHOOL_FEE_RECEIPT",
    label: "School fee receipt",
  },
];

export default function VendorApplicationPage() {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  const [vendorType, setVendorType] =
    useState<VendorType>("STUDENT");

  const [universities, setUniversities] = useState<
    MarketplaceUniversity[]
  >([]);
  const [isLoadingUniversities, setIsLoadingUniversities] =
    useState(true);

  const [university, setUniversity] = useState("");
  const [storeName, setStoreName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [matricNumber, setMatricNumber] = useState("");
  const [department, setDepartment] = useState("");
  const [level, setLevel] = useState("");
  const [documentType, setDocumentType] =
    useState<VendorDocumentType>("ADMISSION_LETTER");
  const [documentFile, setDocumentFile] =
    useState<File | null>(null);

  const [businessName, setBusinessName] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");
  const [businessLogo, setBusinessLogo] =
    useState<File | null>(null);

  const [validationError, setValidationError] =
    useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadUniversities = async () => {
      try {
        const response =
          await marketplaceService.getUniversities();

        if (isMounted) {
          setUniversities(response.results);
        }
      } catch (requestError) {
        if (isMounted) {
          setValidationError(
            getApiErrorMessage(
              requestError,
              "We couldn't load the available universities.",
            ),
          );
        }
      } finally {
        if (isMounted) {
          setIsLoadingUniversities(false);
        }
      }
    };

    void loadUniversities();

    return () => {
      isMounted = false;
    };
  }, []);

  const resetErrors = () => {
    setValidationError(null);
  };

  const handleVendorTypeChange = (
    type: VendorType,
  ) => {
    setVendorType(type);
    resetErrors();
  };

  const handleDocumentChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    setDocumentFile(event.target.files?.[0] ?? null);
    resetErrors();
  };

  const handleBusinessLogoChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    setBusinessLogo(event.target.files?.[0] ?? null);
    resetErrors();
  };

  const validateForm = (): string | null => {
    if (!university) {
      return "Please select your university.";
    }

    if (!storeName.trim()) {
      return "Please enter your store name.";
    }

    if (!phoneNumber.trim()) {
      return "Please enter your phone number.";
    }

    if (vendorType === "STUDENT") {
      if (!matricNumber.trim()) {
        return "Please enter your matric number.";
      }

      if (!department.trim()) {
        return "Please enter your department.";
      }

      if (!level.trim()) {
        return "Please enter your level.";
      }

      if (!documentFile) {
        return "Please upload your proof of studentship.";
      }
    }

    if (vendorType === "BUSINESS") {
      if (!businessName.trim()) {
        return "Please enter your business name.";
      }

      if (!businessAddress.trim()) {
        return "Please enter your business address.";
      }
    }

    return null;
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    resetErrors();

    const formError = validateForm();

    if (formError) {
      setValidationError(formError);
      return;
    }

    setIsSubmitting(true);

    try {
      if (vendorType === "STUDENT") {
        if (!documentFile) {
          setValidationError(
            "Please upload your proof of studentship.",
          );
          return;
        }

        await vendorService.apply({
          university,
          vendor_type: "STUDENT",
          store_name: storeName.trim(),
          phone_number: phoneNumber.trim(),
          matric_number: matricNumber.trim(),
          department: department.trim(),
          level: level.trim(),
          document_type: documentType,
          document_file: documentFile,
        });
      } else {
        await vendorService.apply({
          university,
          vendor_type: "BUSINESS",
          store_name: storeName.trim(),
          phone_number: phoneNumber.trim(),
          business_name: businessName.trim(),
          business_address: businessAddress.trim(),
          ...(businessLogo
            ? { business_logo: businessLogo }
            : {}),
        });
      }

      await refreshUser();

      navigate("/dashboard", { replace: true });
    } catch (requestError) {
      setValidationError(
        getApiErrorMessage(
          requestError,
          "We couldn't submit your vendor application. Please try again.",
        ),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-vh-100 bg-light py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-8 col-xl-7">
            <div className="text-center mb-4">
              <Link to="/" className="d-inline-block">
                <img
                  src={logo}
                  alt="UniAGORA"
                  style={{
                    maxWidth: "180px",
                    height: "auto",
                  }}
                />
              </Link>

              <h1 className="h3 fw-bold mt-4 mb-2">
                Become a UniAGORA vendor
              </h1>

              <p className="text-muted mb-0">
                Set up your store and start selling to students
                on your campus.
              </p>
            </div>

            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body p-4 p-md-5">
                {validationError && (
                  <div
                    className="alert alert-danger"
                    role="alert"
                  >
                    {validationError}
                  </div>
                )}

                <div className="mb-4">
                  <label className="form-label fw-semibold">
                    Vendor type
                  </label>

                  <div className="row g-3">
                    <div className="col-12 col-md-6">
                      <button
                        type="button"
                        className={`w-100 text-start border rounded-4 p-3 bg-white ${
                          vendorType === "STUDENT"
                            ? "border-success"
                            : ""
                        }`}
                        onClick={() =>
                          handleVendorTypeChange("STUDENT")
                        }
                        disabled={isSubmitting}
                      >
                        <div className="fw-bold">
                          Student vendor
                        </div>

                        <div className="text-muted small mt-1">
                          Sell products as a student on your
                          campus.
                        </div>
                      </button>
                    </div>

                    <div className="col-12 col-md-6">
                      <button
                        type="button"
                        className={`w-100 text-start border rounded-4 p-3 bg-white ${
                          vendorType === "BUSINESS"
                            ? "border-success"
                            : ""
                        }`}
                        onClick={() =>
                          handleVendorTypeChange("BUSINESS")
                        }
                        disabled={isSubmitting}
                      >
                        <div className="fw-bold">
                          Business vendor
                        </div>

                        <div className="text-muted small mt-1">
                          Represent a business serving your
                          campus community.
                        </div>
                      </button>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSubmit} noValidate>
                  <div className="mb-3">
                    <label
                      htmlFor="university"
                      className="form-label fw-semibold"
                    >
                      University
                    </label>

                    <select
                      id="university"
                      className="form-select form-select-lg rounded-3"
                      value={university}
                      onChange={(event) => {
                        setUniversity(event.target.value);
                        resetErrors();
                      }}
                      disabled={
                        isLoadingUniversities ||
                        isSubmitting
                      }
                      required
                    >
                      <option value="">
                        {isLoadingUniversities
                          ? "Loading universities..."
                          : "Select your university"}
                      </option>

                      {universities.map((item) => (
                        <option
                          key={item.id}
                          value={item.id}
                        >
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label
                      htmlFor="storeName"
                      className="form-label fw-semibold"
                    >
                      Store name
                    </label>

                    <input
                      id="storeName"
                      type="text"
                      className="form-control form-control-lg rounded-3"
                      value={storeName}
                      onChange={(event) => {
                        setStoreName(event.target.value);
                        resetErrors();
                      }}
                      placeholder="Enter your store name"
                      disabled={isSubmitting}
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="phoneNumber"
                      className="form-label fw-semibold"
                    >
                      Phone number
                    </label>

                    <input
                      id="phoneNumber"
                      type="tel"
                      className="form-control form-control-lg rounded-3"
                      value={phoneNumber}
                      onChange={(event) => {
                        setPhoneNumber(event.target.value);
                        resetErrors();
                      }}
                      placeholder="08012345678"
                      autoComplete="tel"
                      disabled={isSubmitting}
                      required
                    />
                  </div>

                  {vendorType === "STUDENT" ? (
                    <>
                      <div className="border-top pt-4 mb-4">
                        <h2 className="h5 fw-bold mb-1">
                          Student information
                        </h2>

                        <p className="text-muted small mb-0">
                          Provide your student details and proof
                          of studentship.
                        </p>
                      </div>

                      <div className="mb-3">
                        <label
                          htmlFor="matricNumber"
                          className="form-label fw-semibold"
                        >
                          Matric number
                        </label>

                        <input
                          id="matricNumber"
                          type="text"
                          className="form-control form-control-lg rounded-3"
                          value={matricNumber}
                          onChange={(event) => {
                            setMatricNumber(event.target.value);
                            resetErrors();
                          }}
                          placeholder="Enter your matric number"
                          disabled={isSubmitting}
                          required
                        />
                      </div>

                      <div className="mb-3">
                        <label
                          htmlFor="department"
                          className="form-label fw-semibold"
                        >
                          Department
                        </label>

                        <input
                          id="department"
                          type="text"
                          className="form-control form-control-lg rounded-3"
                          value={department}
                          onChange={(event) => {
                            setDepartment(event.target.value);
                            resetErrors();
                          }}
                          placeholder="Enter your department"
                          disabled={isSubmitting}
                          required
                        />
                      </div>

                      <div className="mb-3">
                        <label
                          htmlFor="level"
                          className="form-label fw-semibold"
                        >
                          Level
                        </label>

                        <input
                          id="level"
                          type="text"
                          className="form-control form-control-lg rounded-3"
                          value={level}
                          onChange={(event) => {
                            setLevel(event.target.value);
                            resetErrors();
                          }}
                          placeholder="e.g. 200 Level"
                          disabled={isSubmitting}
                          required
                        />
                      </div>

                      <div className="mb-3">
                        <label
                          htmlFor="documentType"
                          className="form-label fw-semibold"
                        >
                          Proof of studentship
                        </label>

                        <select
                          id="documentType"
                          className="form-select form-select-lg rounded-3"
                          value={documentType}
                          onChange={(event) => {
                            setDocumentType(
                              event.target
                                .value as VendorDocumentType,
                            );
                            resetErrors();
                          }}
                          disabled={isSubmitting}
                          required
                        >
                          {studentDocumentOptions.map(
                            (option) => (
                              <option
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </option>
                            ),
                          )}
                        </select>
                      </div>

                      <div className="mb-4">
                        <label
                          htmlFor="documentFile"
                          className="form-label fw-semibold"
                        >
                          Upload document
                        </label>

                        <input
                          id="documentFile"
                          type="file"
                          className="form-control form-control-lg rounded-3"
                          onChange={handleDocumentChange}
                          disabled={isSubmitting}
                          accept=".pdf,.jpg,.jpeg,.png"
                          required
                        />

                        {documentFile && (
                          <div className="form-text">
                            Selected: {documentFile.name}
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="border-top pt-4 mb-4">
                        <h2 className="h5 fw-bold mb-1">
                          Business information
                        </h2>

                        <p className="text-muted small mb-0">
                          Provide the details customers will use
                          to identify your business.
                        </p>
                      </div>

                      <div className="mb-3">
                        <label
                          htmlFor="businessName"
                          className="form-label fw-semibold"
                        >
                          Business name
                        </label>

                        <input
                          id="businessName"
                          type="text"
                          className="form-control form-control-lg rounded-3"
                          value={businessName}
                          onChange={(event) => {
                            setBusinessName(event.target.value);
                            resetErrors();
                          }}
                          placeholder="Enter your business name"
                          disabled={isSubmitting}
                          required
                        />
                      </div>

                      <div className="mb-3">
                        <label
                          htmlFor="businessAddress"
                          className="form-label fw-semibold"
                        >
                          Business address
                        </label>

                        <textarea
                          id="businessAddress"
                          className="form-control rounded-3"
                          rows={4}
                          value={businessAddress}
                          onChange={(event) => {
                            setBusinessAddress(
                              event.target.value,
                            );
                            resetErrors();
                          }}
                          placeholder="Enter your business address"
                          disabled={isSubmitting}
                          required
                        />
                      </div>

                      <div className="mb-4">
                        <label
                          htmlFor="businessLogo"
                          className="form-label fw-semibold"
                        >
                          Business logo{" "}
                          <span className="text-muted fw-normal">
                            (optional)
                          </span>
                        </label>

                        <input
                          id="businessLogo"
                          type="file"
                          className="form-control form-control-lg rounded-3"
                          onChange={
                            handleBusinessLogoChange
                          }
                          disabled={isSubmitting}
                          accept=".jpg,.jpeg,.png,.webp"
                        />

                        {businessLogo && (
                          <div className="form-text">
                            Selected: {businessLogo.name}
                          </div>
                        )}
                      </div>
                    </>
                  )}

                  <div className="alert alert-success rounded-3">
                    <strong>You're almost ready to sell.</strong>
                    <div className="small mt-1">
                      Vendor applications are automatically
                      approved in the current UniAGORA MVP. Once
                      your application is successfully submitted,
                      your account will become a verified vendor.
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary btn-lg w-100 rounded-3 fw-semibold"
                    disabled={
                      isSubmitting ||
                      isLoadingUniversities ||
                      universities.length === 0
                    }
                  >
                    {isSubmitting ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          aria-hidden="true"
                        />
                        Submitting application...
                      </>
                    ) : (
                      "Become a vendor"
                    )}
                  </button>
                </form>

                <div className="text-center mt-4">
                  <Link
                    to="/dashboard"
                    className="text-decoration-none fw-semibold"
                  >
                    Back to dashboard
                  </Link>
                </div>
              </div>
            </div>

            <p className="text-center text-muted small mt-4 mb-0">
              UniAGORA connects students and campus businesses
              through a trusted marketplace.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}