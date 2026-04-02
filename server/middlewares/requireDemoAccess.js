import { validateDemoToken } from "../auth/demoAuth";

export function requireDemoAccess(req, res, next) {
  const { demoToken } = req.cookies;

  const isValid = validateDemoToken(demoToken);

  if (!isValid) {
    return res.status(401).json({ error: "Demo access required" });
  }
}
