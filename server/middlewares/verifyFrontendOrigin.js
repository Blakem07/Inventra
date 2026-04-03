import "dotenv/config";

export function verifyFrontendOrigin(req, res, next) {
  const origin = req.headers.origin;

  const isProduction = process.env.NODE_ENV == "production" ? true : false;
  const isWrongOrigin = origin !== process.env.FRONTEND_URL ? true : false;
  const isGetRequest = req.method == "GET" ? true : false;

  if (isProduction && isWrongOrigin && !isGetRequest) {
    return res.status(403).json({ error: "Invalid origin" });
  }

  next();
}
