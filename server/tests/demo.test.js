import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../app.js";

describe("basic test", () => {
  it("should respond to /health", async () => {
    const res = await request(app).get("/health");

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("status", "ok");
  });
});

describe("Demo Access Tests", () => {
  it("POST /demo/access should reject wrong password", async () => {
    const res = await request(app).post("/demo/access").send({ password: "wrong-password" });

    expect(res.status).toBe(401);
    expect(res.headers["set-cookie"]).toBeUndefined();
  });

  it("POST /demo/access should accept correct password", async () => {
    const res = await request(app)
      .post("/demo/access")
      .send({ password: process.env.DEMO_PASSWORD });

    expect(res.status).toBe(200);
    expect(res.headers["set-cookie"]).toBeDefined();
  });

  it("GET /demo/session handles no demo token returning 401", async () => {
    const res = await request(app).get("/demo/session");

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("allowed", false);
  });
});
