import { describe, it, expect, afterEach, vi } from "vitest";
import request from "supertest";

import express from "express";

import "dotenv/config";

import { verifyFrontendOrigin } from "../middlewares/verifyFrontendOrigin";

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

describe("Verify Frontend Origin Test", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("...", () => {});
});
