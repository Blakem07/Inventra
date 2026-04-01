import { Router } from "express";

import crypto from "crypto";

const router = Router();

router.post("/access", async (req, res, next) => {
  try {
    const { password } = req.body;

    if (password !== process.env.DEMO_PASSWORD) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const message = "demo access";
    const hmac = crypto.createHmac("sha256", process.env.DEMO_COOKIE_SECRET);
    const signature = hmac.update(message).digest("hex");
    const token = `${message}.${signature}`;
    res.cookie("demo_auth", token, {
      httpOnly: true,
      sameSite: "lax",
    });

    // success case will be implemented later
    return res.status(200).json({ success: true });
  } catch (err) {
    next(err);
  }
});

export default router;
