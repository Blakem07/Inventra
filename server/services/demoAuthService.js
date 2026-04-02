import crypto from "crypto";

/**
 * Generates a stateless demo auth token by signing a fixed message
 * with an HMAC using a server-side secret.
 *
 * The token format is "<message>.<signature>", where the signature
 * proves the token was created by the server and has not been altered.
 *
 * Intended for use in a cookie-based auth flow without server-side storage.
 */
export function createDemoToken() {
  const message = "demo access";
  const hmac = crypto.createHmac("sha256", process.env.DEMO_COOKIE_SECRET);
  const signature = hmac.update(message).digest("hex");
  const token = `${message}.${signature}`;

  return token;
}

export function validateDemoToken(demoToken) {
  if (!demoToken) return false;

  const parts = demoToken.split(".");
  if (parts.length !== 2) return false;

  const [message, signature] = parts;
  if (message != "demo access") return false;

  const hmac = crypto.createHmac("sha256", process.env.DEMO_COOKIE_SECRET);
  const validSignature = hmac.update(message).digest("hex");
  if (signature != validSignature) return false;

  return true;
}
