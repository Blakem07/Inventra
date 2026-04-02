import { Router } from "express";

import { createDemoToken, validateDemoToken } from "../auth/demoAuth.js";
import { COOKIE_NAME, getCookieOptions, getClearCookieOptions } from "../auth/demoCookie.js";

const router = Router();

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
