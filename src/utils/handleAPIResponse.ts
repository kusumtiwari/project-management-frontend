// utils/handleAPIResponse.ts

export const handleAPIResponse = (status: number, message?: string) => {
  if (status >= 200 && status < 300) {
    return { success: true, message: message || "Operation successful" };
  }

  if (status >= 400 && status < 500) {
    return { success: false, message: message || "Client error occurred" };
  }

  if (status >= 500) {
    return { success: false, message: message || "Server error occurred" };
  }

  return { success: false, message: "Unexpected response" };
};
