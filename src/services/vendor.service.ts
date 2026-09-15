import api, {
  type ApiErrorResponse,
} from "./api";

import type {
  ApiSuccessResponse,
} from "../types/api";

export type VendorType = "STUDENT" | "BUSINESS";

export type VendorDocumentType =
  | "ADMISSION_LETTER"
  | "STUDENT_ID_CARD"
  | "COURSE_REGISTRATION_SLIP"
  | "SCHOOL_FEE_RECEIPT";

export interface VendorDocument {
  id: string;
  document_type: VendorDocumentType | "BUSINESS_DOCUMENT";
  file: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  uploaded_at: string;
  reviewed_at: string | null;
}

export interface VendorProfile {
  id: string;
  user: string;
  university: {
    id: string;
    name: string;
    slug: string;
  };
  vendor_type: VendorType;
  store_name: string;
  phone_number: string;
  matric_number: string | null;
  department: string | null;
  level: string | null;
  business_name: string | null;
  business_address: string | null;
  business_logo: string | null;
  status: "PENDING" | "VERIFIED" | "REJECTED" | "SUSPENDED";
  is_verified: boolean;
  submitted_at: string;
  reviewed_at: string | null;
  reviewed_by: string | null;
  documents: VendorDocument[];
  created_at: string;
  updated_at: string;
}

export interface StudentVendorApplication {
  university: string;
  vendor_type: "STUDENT";
  store_name: string;
  phone_number: string;
  matric_number: string;
  department: string;
  level: string;
  document_type: VendorDocumentType;
  document_file: File;
}

export interface BusinessVendorApplication {
  university: string;
  vendor_type: "BUSINESS";
  store_name: string;
  phone_number: string;
  business_name: string;
  business_address: string;
  business_logo?: File;
}

export type VendorApplication =
  | StudentVendorApplication
  | BusinessVendorApplication;

const buildFormData = (
  payload: VendorApplication,
): FormData => {
  const formData = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    if (value instanceof File) {
      formData.append(key, value);
      return;
    }

    if (value !== undefined && value !== null) {
      formData.append(key, String(value));
    }
  });

  return formData;
};

const getResponseData = <T>(
  response: ApiSuccessResponse<T> | ApiErrorResponse,
): T => {
  if (!response.success) {
    throw new Error(response.message || "Request failed.");
  }

  if (!("data" in response)) {
    throw new Error("The server returned an invalid response.");
  }

  return response.data;
};

export const vendorService = {
  async apply(
    payload: VendorApplication,
  ): Promise<VendorProfile> {
    const formData = buildFormData(payload);

    const response = await api.post<
      ApiSuccessResponse<VendorProfile> | ApiErrorResponse
    >(
      "/vendors/",
      formData,
    );

    return getResponseData(response.data);
  },

  async getMyVendorProfile(): Promise<VendorProfile> {
    const response = await api.get<
      ApiSuccessResponse<VendorProfile> | ApiErrorResponse
    >("/vendors/me/");

    return getResponseData(response.data);
  },
};

export default vendorService;