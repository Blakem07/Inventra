import { describe, it, expect, afterEach, vi } from "vitest";
import request from "supertest";

import express from "express";

import "dotenv/config";

import { verifyFrontendOrigin } from "../middlewares/verifyFrontendOrigin.js";

function setupApp() {
  const app = express();
  app.use(express.json());

  app.use(verifyFrontendOrigin);

  app.get("/test/read", (req, res) => {
    res.status(200).json({ ok: true });
  });

  app.post("/test/write", (req, res) => {
    res.status(200).json({ ok: true });
  });

  return app;
}

describe("Verify Frontend Origin Tests", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("allows write requests in development mode", async () => {
    vi.stubEnv("FRONTEND_URL", "http://localhost:5173");
    vi.stubEnv("NODE_ENV", "development");

    const app = setupApp();

    const differentOrigin = await request(app).post("/test/write").set("Origin", "http://evil");

    expect(differentOrigin.status).toBe(200);
    expect(differentOrigin.body).toEqual({ ok: true });
  });
});
