/**
 * Turns an auth request failure into a message worth showing.
 *
 * The GraphQL error array is the only source that carries a real reason. When
 * it is absent the request never reached the resolver — most often a 419 from
 * Sanctum, which Laravel answers with an HTML "Page Expired" page that
 * graphql-request cannot parse. Falling back to a credentials message there
 * blames the user for an expired CSRF token, so each transport failure gets
 * its own text instead.
 */
export function authErrorMessage(error: unknown, fallback: string): string {
  const err = error as {
    response?: { errors?: { message?: string }[]; status?: number };
    message?: string;
  };

  const graphqlMessage = err?.response?.errors?.[0]?.message;
  if (graphqlMessage) return graphqlMessage;

  const status = err?.response?.status;

  if (status === 419) {
    return "Your session expired. Reload the page and try again.";
  }

  if (status === 401 || status === 403) return fallback;

  if (typeof status === "number" && status >= 500) {
    return "The server is unavailable right now. Please try again in a moment.";
  }

  if (status === undefined) {
    return "Could not reach the server. Check your connection and try again.";
  }

  return fallback;
}
