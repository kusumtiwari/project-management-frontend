function parseJSON<T>(response: Response): Promise<T> {
  console.log("*****", response);
  return response.json() as Promise<T>;
}

async function checkStatus(response: Response): Promise<Response> {
  if (!response.ok) {
    throw new Error(`Request failed with status: ${response.status}`);
  }
  return response;
}

export async function request<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  try {
    const response = await fetch(url, options);
    await checkStatus(response);
    return await parseJSON<T>(response);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log(error,'here is error ')
      console.error("Request failed:", (error as any).details ?? error.message);
    } else {
      console.error("Request failed with an unknown error");
    }
    throw error;
  }
}



