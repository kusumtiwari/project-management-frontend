// No change needed here, as it simply returns the json promise
function parseJSON<T>(response: Response): Promise<T> {
  // console.log("*****", response); // You can keep this, it won't consume the body
  return response.json() as Promise<T>;
}

async function checkStatus(response: Response): Promise<Response> {
  if (!response.ok) {
    // Crucially, clone the response to read its error body without consuming the original
    // in case it's still needed for other purposes (though for !ok, it usually isn't)
    const errorResponseClone = response.clone();
    const errorBody = await errorResponseClone.text(); // Read the error body as text

    console.error(`Request failed with status: ${response.status}`, errorBody);

    let errorMessage = `Request failed with status: ${response.status}`;
    try {
      // Attempt to parse the error body if it's JSON
      const parsedError = JSON.parse(errorBody);
      errorMessage = parsedError.message || errorMessage; // Use backend's message if available
    } catch (e) {
      // If it's not valid JSON, use the raw text or a default
      errorMessage = errorBody || errorMessage;
    }

    // Throw an error that contains the actual message from the backend
    const error = new Error(errorMessage) as any;
    error.status = response.status;
    error.details = errorBody;
    throw error; // This error will be caught by the outer `request` try/catch
  }
  return response; // Return the original response if it was OK
}

export async function request<T>(
  url: string,
  options?: RequestInit
): Promise<{ status: number; data: T }> {
  try {
    const response = await fetch(url, options);

    await checkStatus(response); // Will throw if !response.ok

    const data = await parseJSON<T>(response);

    return { status: response.status, data };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Request failed:", (error as any).details || error.message);
      throw error;
    } else {
      console.error("Request failed with an unknown error:", error);
      throw new Error("An unknown error occurred during the request.");
    }
  }
}

