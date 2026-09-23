import { describe, expect, it } from "vitest";
import request from "supertest";
import { createApp } from "../src/server.js";

const app = createApp();

describe("reference CAPTCHA middleware", () => {
  it("rejects missing token", async () => {
    const r = await request(app).post("/safe/signup").send({ email: "safe@example.test" });
    expect(r.status).toBe(400);
  });

  it("rejects low score", async () => {
    const r = await request(app).post("/safe/signup").send({ email: "safe@example.test", captchaToken: "x:0.1:signup:app.local" });
    expect(r.status).toBe(403);
  });

  it("rejects wrong action", async () => {
    const r = await request(app).post("/safe/signup").send({ email: "safe@example.test", captchaToken: "x:0.9:otp:app.local" });
    expect(r.status).toBe(403);
  });

  it("rejects wrong hostname", async () => {
    const r = await request(app).post("/safe/signup").send({ email: "safe@example.test", captchaToken: "x:0.9:signup:elsewhere.local" });
    expect(r.status).toBe(403);
  });

  it("rejects expired token", async () => {
    const r = await request(app).post("/safe/signup").send({ email: "safe@example.test", captchaToken: "x:0.9:signup:app.local:9999" });
    expect(r.status).toBe(403);
  });

  it("rejects replay", async () => {
    const token = "unique-safe:0.9:signup:app.local";
    const a = await request(app).post("/safe/signup").send({ email: "safe-a@example.test", captchaToken: token });
    const b = await request(app).post("/safe/signup").send({ email: "safe-b@example.test", captchaToken: token });
    expect(a.status).toBe(200);
    expect(b.status).toBe(409);
  });
});
