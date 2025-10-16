// actions/hospital/getHospitalsByClinic.ts
"use server";

import { auth } from "@/auth";
import {
  HospitalRecord,
  GetHospitalsByClinicResponse,
} from "@/types/hospital.type"; // Assumed path for the types

/**
 * Fetches a list of hospital records matching a preferred clinic name.
 * @param clinicName - The name of the clinic/hospital to search for.
 * @returns A promise resolving to the GetHospitalsByClinicResponse.
 */
export const getHospitalsByClinic = async (
  clinicName: string
): Promise<GetHospitalsByClinicResponse> => {
  try {
    // 1. Authentication and Token Check
    const session = await auth();

    if (!session?.user?.backendToken) {
      throw new Error("Authentication required: No backend token available.");
    }

    // URL encode the clinic name to handle spaces (like "Yekatit 12 Hospital")
    const encodedClinicName = encodeURIComponent(clinicName);

    // 2. API Call (Endpoint uses the encoded clinicName)
    const response = await fetch(
      `${process.env.BACKEND_API_URL}/hospital/hospitals-by-clinic/${encodedClinicName}`,
      {
        method: "GET", // Matches your cURL -X 'GET'
        headers: {
          Authorization: `Bearer ${session.user.backendToken}`, // Matches your cURL -H 'Authorization...'
          "Content-Type": "application/json",
        },
        // No body required for a GET request
      }
    );

    // 3. Process Response
    const result = await response.json();

    // Check for API-level failure (e.g., HTTP 4xx, 5xx) or a 'success: false' payload
    if (!response.ok || result.success === false) {
      // Use the message from the backend if available, otherwise a generic one
      throw new Error(result.message || `API call failed with status: ${response.status}`);
    }

    // 4. Successful Response
    // The response structure matches the 200 res provided (data is nested under 'data.data')
    return {
      success: true,
      message: result.message || result.data?.message || "Hospitals retrieved successfully",
      data: result.data, // This contains { message: string, data: HospitalRecord[] }
    };

  } catch (error) {
    // 5. Error Handling
    console.error(`Get Hospitals by Clinic (${clinicName}) error:`, error);

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred while fetching hospitals by clinic.",
    };
  }
};