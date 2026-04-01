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
  it("should reject wrong password", async () => {
    const res = await request(app).post("/demo/access").send({ password: "wrong-password" });

    expect(res.status).toBe(401);
    expect(res.headers["set-cookie"]).toBeUndefined();
  });
});
