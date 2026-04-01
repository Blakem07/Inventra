import { Router } from "express";

import { createDemoToken } from "../services/demoAuthService";

const router = Router();

router.post("/access", async (req, res, next) => {
  try {
    const { password } = req.body;

    if (password !== process.env.DEMO_PASSWORD) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = createDemoToken();

    res.cookie("demoToken", token, { httpOnly: true });

    return res.status(200).json({ success: true });
  } catch (err) {
    next(err);
  }
});

export default router;
