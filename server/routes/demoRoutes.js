import { Router } from "express";

import { createDemoToken, validateDemoToken } from "../services/demoAuthService.js";

const router = Router();

const COOKIE_NAME = "demoToken";

function getCookieOptions() {
  const isProduction = process.env.NODE_ENV === "production";

  return {
    httpOnly: true,
    sameSite: isProduction ? "none" : "lax",
    secure: isProduction,
    maxAge: 1000 * 60 * 60 * 8, // 8 hours
    path: "/demo",
  };
}

function getClearCookieOptions() {
  const isProduction = process.env.NODE_ENV === "production";

  return {
    httpOnly: true,
    sameSite: isProduction ? "none" : "lax",
    secure: isProduction,
    path: "/demo",
  };
}

router.post("/access", async (req, res, next) => {
  try {
    const { password } = req.body;

    if (password !== process.env.DEMO_PASSWORD) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = createDemoToken();

    res.cookie(COOKIE_NAME, token, getCookieOptions());

    return res.status(200).json({ success: true });
  } catch (err) {
    next(err);
  }
});

router.get("/session", async (req, res, next) => {
  try {
    const { demoToken } = req.cookies;

    const isValid = validateDemoToken(demoToken);

    if (!isValid) {
      return res.status(401).json({ allowed: false });
    }

    return res.status(200).json({ allowed: true });
  } catch (err) {
    next(err);
  }
});

router.post("/logout", async (req, res, next) => {
  try {
    res.clearCookie(COOKIE_NAME, getClearCookieOptions());

    return res.status(200).json({ success: true });
  } catch (err) {
    next(err);
  }
});

export default router;
