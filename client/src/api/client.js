/**
 * Performs an HTTP request to the API and normalizes error handling.
 *
 * Behavior:
 * - Success (2xx): resolves with the parsed JSON response body.
 * - Failure (non-2xx): throws an Error with flattened fields derived from
 *   the server error payload.
 *
 * Thrown Error shape:
 * - message   → server error message if available
 * - status    → HTTP status code
 * - productId → optional domain field from the server error payload
 *
 * Notes:
 * - Error fields are flattened to simplify consumption by the UI.
 * - Successful responses are returned unchanged to preserve the server's
 *   domain data structure.
 *
 * @param {string} path - API route path (e.g. "/sales")
 * @param {RequestInit} options - Fetch configuration (method, headers, body, etc.)
 * @returns {Promise<any>} Parsed JSON response body on success
 * @throws {Error} When the response status is not 2xx
 */
export async function client(path, options) {
  const baseURL = import.meta.env.VITE_API_BASE_URL;

  if (!baseURL) {
    throw new Error("VITE_API_BASE_URL is not defined");
  }

  const response = await fetch(baseURL + path, {
    credentials: "include",
    ...options,
  });
  const body = await response.json();

  if (!response.ok) {
    const err = new Error(body?.error?.message || "Request failed");

    err.status = response.status;
    err.code = body?.error?.code;
    err.productId = body?.error?.productId;

    throw err;
  }

  return body;
}
