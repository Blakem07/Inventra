import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../app.js";

import { createDemoToken, validateDemoToken } from "../auth/demoAuth.js";

describe("Demo Integration Tests", () => {
  it("POST /demo/access should reject wrong password", async () => {
    const res = await request(app).post("/demo/access").send({ password: "wrong-password" });

    expect(res.status).toBe(401);
    expect(res.headers["set-cookie"]).toBeUndefined();
  });

  it("POST /demo/access without password should reject with 401", async () => {
    const res = await request(app).post("/demo/access").send({});

    expect(res.status).toBe(401);
  });

  it("POST /demo/access with empty password should reject with 401", async () => {
    const res = await request(app).post("/demo/access").send({ password: "" });

    expect(res.status).toBe(401);
  });

  it("POST /demo/access should accept correct password", async () => {
    const res = await request(app)
      .post("/demo/access")
      .send({ password: process.env.DEMO_PASSWORD });

    expect(res.status).toBe(200);
    expect(res.headers["set-cookie"]).toBeDefined();
  });

  it("POST /demo/access sets demoToken cookie with correct attributes", async () => {
    const res = await request(app)
      .post("/demo/access")
      .send({ password: process.env.DEMO_PASSWORD });

    expect(res.status).toBe(200);

    const setCookie = res.headers["set-cookie"][0];

    expect(setCookie).toContain("demoToken=");
    expect(setCookie).toContain("HttpOnly");
    expect(setCookie).toContain("Path=/");
  });

  it("GET /demo/session handles no demo token returning 401", async () => {
    const res = await request(app).get("/demo/session");

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("allowed", false);
  });

  it("GET /demo/session handles invalid demo token returning 401", async () => {
    const res = await request(app).get("/demo/session").set("Cookie", ["demoToken=bad-token"]);

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("allowed", false);
  });

  it("GET /demo/session handles invalid demo token message returning 401", async () => {
    const demoAccessTokenRes = await request(app)
      .post("/demo/access")
      .send({ password: process.env.DEMO_PASSWORD });

    expect(demoAccessTokenRes.status).toBe(200);

    const cookie = demoAccessTokenRes.headers["set-cookie"];
    const raw = cookie[0];
    const cookiePair = raw.split(";")[0];
    const value = cookiePair.split("=").slice(1).join("=");

    const [message, signature] = value.split(".");

    const invalidMessageCookie = "invalid-message" + "." + signature;

    const res = await request(app)
      .get("/demo/session")
      .set("Cookie", [`demoToken=${invalidMessageCookie}`]);

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("allowed", false);
  });

  it("GET /demo/session handles invalid demo token signature returning 401", async () => {
    const demoAccessTokenRes = await request(app)
      .post("/demo/access")
      .send({ password: process.env.DEMO_PASSWORD });

    expect(demoAccessTokenRes.status).toBe(200);

    const cookie = demoAccessTokenRes.headers["set-cookie"];
    const raw = cookie[0];
    const cookiePair = raw.split(";")[0];
    const value = cookiePair.split("=").slice(1).join("=");
    const [message, signature] = value.split(".");
    const invalidSignatureCookie = message + "." + "invalid-signature";

    const res = await request(app)
      .get("/demo/session")
      .set("Cookie", [`demoToken=${invalidSignatureCookie}`]);

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("allowed", false);
  });

  it("GET /demo/session handles valid demo token returning 200", async () => {
    const demoAccessTokenRes = await request(app)
      .post("/demo/access")
      .send({ password: process.env.DEMO_PASSWORD });

    expect(demoAccessTokenRes.status).toBe(200);

    const cookie = demoAccessTokenRes.headers["set-cookie"];

    const demoSessionRes = await request(app).get("/demo/session").set("Cookie", [cookie]);

    expect(demoSessionRes.status).toBe(200);
    expect(demoSessionRes.body).toHaveProperty("allowed", true);
  });

  it("POST /demo/logout clears the demo session cookie and invalidates the session", async () => {
    const agent = request.agent(app);

    const demoAccessTokenRes = await agent
      .post("/demo/access")
      .send({ password: process.env.DEMO_PASSWORD });

    expect(demoAccessTokenRes.status).toBe(200);

    const demoSessionRes = await agent.get("/demo/session");
    expect(demoSessionRes.status).toBe(200);
    expect(demoSessionRes.body).toHaveProperty("allowed", true);

    const demoLogoutRes = await agent.post("/demo/logout");
    expect(demoLogoutRes.status).toBe(200);
    expect(demoLogoutRes.body).toHaveProperty("success", true);

    const postLogoutSessionRes = await agent.get("/demo/session");
    expect(postLogoutSessionRes.status).toBe(401);
    expect(postLogoutSessionRes.body).toHaveProperty("allowed", false);
  });
});

describe("Demo Unit Tests", () => {
  it("createDemoToken returns a token with message and signature", () => {
    const token = createDemoToken();

    const parts = token.split(".");
    expect(parts.length).toBe(2);
    expect(parts[0]).toBe("demo access");
    expect(parts[1]).toBeTruthy();
  });

  it("validateDemoToken returns true for a valid token", () => {
    const token = createDemoToken();

    expect(validateDemoToken(token)).toBe(true);
  });

  it("validateDemoToken returns false for a missing token", () => {
    expect(validateDemoToken(undefined)).toBe(false);
  });

  it("validateDemoToken returns false for a malformed token", () => {
    expect(validateDemoToken("bad-token")).toBe(false);
  });

  it("validateDemoToken returns false for a tampered message", () => {
    const token = createDemoToken();
    const [, signature] = token.split(".");

    const tamperedToken = `invalid-message.${signature}`;

    expect(validateDemoToken(tamperedToken)).toBe(false);
  });

  it("validateDemoToken returns false for a tampered signature", () => {
    const token = createDemoToken();
    const [message] = token.split(".");

    const tamperedToken = `${message}.invalid-signature`;

    expect(validateDemoToken(tamperedToken)).toBe(false);
  });
});
