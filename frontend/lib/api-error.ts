export async function parseResponseError(response: Response): Promise<string> {
  let backendMessage: string | null = null

  try {
    const data = (await response.json()) as {
      error?: { message?: string }
      message?: string
    }
    if (data?.error?.message) {
      backendMessage = data.error.message
    } else if (data?.message) {
      backendMessage = data.message
    }
  } catch {
    // Response body was not JSON or failed to parse
  }

  if (backendMessage) {
    return `${backendMessage} (HTTP ${response.status})`
  }

  switch (response.status) {
    case 400:
      return 'Bad Request (HTTP 400): Invalid request parameters or files.'
    case 401:
      return 'Unauthorized (HTTP 401): Authentication is required.'
    case 403:
      return 'Forbidden (HTTP 403): Access denied or CORS origin rejected.'
    case 404:
      return 'Not Found (HTTP 404): The requested API endpoint does not exist.'
    case 413:
      return 'Payload Too Large (HTTP 413): Uploaded files exceed maximum server limit.'
    case 415:
      return 'Unsupported Media Type (HTTP 415): Invalid or unsupported file format.'
    case 422:
      return 'Unprocessable Entity (HTTP 422): Unable to process document contents.'
    case 429:
      return 'Too Many Requests (HTTP 429): Rate limit exceeded. Please wait a moment.'
    case 500:
      return 'Internal Server Error (HTTP 500): The server encountered an unexpected error.'
    case 502:
    case 503:
    case 504:
      return `Backend Service Unavailable (HTTP ${response.status}): Server is warming up or unreachable.`
    default:
      return `Server Error (HTTP ${response.status}): ${response.statusText || 'Operation failed'}`
  }
}

export function parseNetworkError(error: unknown, targetUrl: string): string {
  if (typeof window !== 'undefined' && !window.navigator.onLine) {
    return 'Network failure: Internet connection appears to be offline.'
  }

  if (error instanceof TypeError && error.message.toLowerCase().includes('fetch')) {
    return `Network failure: Unable to reach backend API at ${targetUrl}. Please verify CORS headers and server status.`
  }

  if (error instanceof Error && error.message) {
    return error.message
  }

  return 'An unexpected network error occurred while connecting to the server.'
}
