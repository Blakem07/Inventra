import { describe, it, expect } from "vitest";
import request from "supertest";

import express from "express";
import cookieParser from "cookie-parser";

import { requireDemoAccess } from "../middlewares/requireDemoAccess.js";

function setupApp() {
  const app = express();
  app.use(express.json());
  app.use(cookieParser());

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
});
