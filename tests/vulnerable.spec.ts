import { describe, expect, it } from "vitest";
import request from "supertest";
import { createApp } from "../src/server.js";

const app = createApp();

const email = (n: number) => `case${n}@example.test`;

describe("intentionally vulnerable CAPTCHA scenarios", () => {
  it("01 permits signup without any CAPTCHA", async () => {
    const r = await request(app).post("/vuln/01/signup").send({ email: email(1) });
    expect(r.status).toBe(200);
  });

  it("02 treats a missing token as optional", async () => {
    const r = await request(app).post("/vuln/02/signup").send({ email: email(2) });
    expect(r.status).toBe(200);
  });

  it("03 fails open when verification throws", async () => {
    const r = await request(app).post("/vuln/03/signup").send({ email: email(3), captchaToken: "timeout" });
    expect(r.status).toBe(200);
  });

  it("04 trusts provider HTTP 200 even when semantic success is false", async () => {
    const r = await request(app).post("/vuln/04/signup").send({ email: email(4), captchaToken: "invalid" });
    expect(r.status).toBe(200);
  });

  it("05 accepts a low-score token", async () => {
    const r = await request(app).post("/vuln/05/signup").send({ email: email(5), captchaToken: "ok:0.1:signup:app.local" });
    expect(r.status).toBe(200);
  });

  it("06 accepts a token issued for another action", async () => {
    const r = await request(app).post("/vuln/06/signup").send({ email: email(6), captchaToken: "ok:0.9:homepage:app.local" });
    expect(r.status).toBe(200);
  });

  it("07 accepts a token issued for another hostname", async () => {
    const r = await request(app).post("/vuln/07/signup").send({ email: email(7), captchaToken: "ok:0.9:signup:other.local" });
    expect(r.status).toBe(200);
  });

  it("08 permits token replay", async () => {
    const token = "replay:0.9:signup:app.local";
    const a = await request(app).post("/vuln/08/signup").send({ email: "a@example.test", captchaToken: token });
    const b = await request(app).post("/vuln/08/signup").send({ email: "b@example.test", captchaToken: token });
    expect([a.status, b.status]).toEqual([200, 200]);
  });

  it("09 has a check-then-use race window", async () => {
    const token = "race:0.9:signup:app.local";
    const [a, b] = await Promise.all([
      request(app).post("/vuln/09/signup").send({ email: "race-a@example.test", captchaToken: token }),
      request(app).post("/vuln/09/signup").send({ email: "race-b@example.test", captchaToken: token })
    ]);
    expect([a.status, b.status].sort()).toEqual([200, 200]);
  });

  it("10 trusts a client supplied verified flag", async () => {
    const r = await request(app).post("/vuln/10/signup").send({ email: email(10), captchaVerified: true });
    expect(r.status).toBe(200);
  });

  it("11 exposes a query-controlled debug bypass", async () => {
    const r = await request(app).post("/vuln/11/signup?debug=1").send({ email: email(11), captchaToken: "invalid" });
    expect(r.status).toBe(200);
  });

  it("12 accepts a hardcoded bypass token", async () => {
    const r = await request(app).post("/vuln/12/signup").send({ email: email(12), captchaToken: "TEST-CAPTCHA-BYPASS" });
    expect(r.status).toBe(200);
  });

  it("13 disables CAPTCHA when config is absent", async () => {
    delete process.env.CAPTCHA_ENABLED;
    const r = await request(app).post("/vuln/13/signup").send({ email: email(13), captchaToken: "invalid" });
    expect(r.status).toBe(200);
  });

  it("14 lets the client select an unsupported provider that falls through", async () => {
    const r = await request(app).post("/vuln/14/signup").send({ email: email(14), captchaProvider: "none", captchaToken: "invalid" });
    expect(r.status).toBe(200);
  });

  it("15 treats the string false as truthy", async () => {
    const r = await request(app).post("/vuln/15/signup").send({ email: email(15), providerResponse: { success: "false" } });
    expect(r.status).toBe(200);
  });

  it("16 does not await verification", async () => {
    const r = await request(app).post("/vuln/16/signup").send({ email: email(16), captchaToken: "invalid" });
    expect(r.status).toBe(200);
  });

  it("17 ignores callback verification result", async () => {
    const r = await request(app).post("/vuln/17/signup").send({ email: email(17), captchaToken: "invalid" });
    expect(r.status).toBe(200);
  });

  it("18 exposes an alternate unprotected route", async () => {
    const r = await request(app).post("/vuln/18/api/users").send({ email: email(18) });
    expect(r.status).toBe(200);
  });

  it("19 leaves reset resend unprotected", async () => {
    const r = await request(app).post("/vuln/19/password-reset/resend").send({ email: email(19) });
    expect(r.status).toBe(200);
  });

  it("20 trusts a spoofable forwarded IP header", async () => {
    const r = await request(app).post("/vuln/20/signup").set("x-forwarded-for", "10.0.0.7").send({ email: email(20), captchaToken: "invalid" });
    expect(r.status).toBe(200);
  });

  it("21 lets a client reset the attempt counter cookie", async () => {
    const r = await request(app).post("/vuln/21/login").set("Cookie", "failedAttempts=0").send({ email: email(21), captchaToken: "invalid" });
    expect(r.status).toBe(200);
  });

  it("22 tracks attempts by non-canonical identity", async () => {
    for (const value of ["Victim@example.test", "victim@example.test ", " VICTIM@example.test"]) {
      const r = await request(app).post("/vuln/22/login").send({ email: value, captchaToken: "invalid" });
      expect(r.status).toBe(200);
    }
  });

  it("23 leaves PUT method unprotected", async () => {
    const r = await request(app).put("/vuln/23/account").send({ email: email(23), captchaToken: "invalid" });
    expect(r.status).toBe(200);
  });

  it("24 leaves the mobile channel unprotected", async () => {
    const r = await request(app).post("/vuln/24/mobile/send-otp").send({ phone: "+001" });
    expect(r.status).toBe(200);
  });

  it("25 accepts an expired token", async () => {
    const r = await request(app).post("/vuln/25/signup").send({ email: email(25), captchaToken: "old:0.9:signup:app.local:9999" });
    expect(r.status).toBe(200);
  });

  it("26 leaves OTP resend unprotected", async () => {
    const r = await request(app).post("/vuln/26/resend-otp").send({ phone: "+002" });
    expect(r.status).toBe(200);
  });
});
