import { describe, it, expect } from "vitest";
import request from "supertest";

import express from "express";
import cookieParser from "cookie-parser";

import "dotenv/config";
import demoRoutes from "../routes/demoRoutes.js";
import { requireDemoAccess } from "../middlewares/requireDemoAccess.js";

function setupApp() {
  const app = express();
  app.use(express.json());
  app.use(cookieParser());

  app.use("/demo", demoRoutes);
  return app;
}

describe("Require Demo Access Tests", () => {
  it("returns 401 when no demo cookie is present", async () => {
    const app = setupApp();

    app.get("/test/protected", requireDemoAccess, (req, res) => {
      res.status(200).json({ status: "ok" });
    });

    const res = await request(app).get("/test/protected");

    expect(res.status).toBe(401);
    expect(res.body).toEqual({ error: "Demo access required" });
  });

  it("allows access when a valid demo cookie is present returning 200", async () => {
    const app = setupApp();

    app.get("/test/protected", requireDemoAccess, (req, res) => {
      res.status(200).json({ ok: true });
    });

    const demoAccessTokenRes = await request(app)
      .post("/demo/access")
      .send({ password: process.env.DEMO_PASSWORD });

    expect(demoAccessTokenRes.status).toBe(200);

    const cookie = demoAccessTokenRes.headers["set-cookie"];

    const res = await request(app).get("/test/protected").set("Cookie", cookie);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true });
  });
});
