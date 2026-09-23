import type { Express } from "express";
import { verifyCaptcha } from "../../services/mockCaptcha.js";
import { createAccount } from "../../services/business.js";

const failures = new Map<string, number>();

export function scenario22(app: Express) {
  app.post("/vuln/22/login", async (req, res) => {
    const rawEmail = String(req.body.email ?? "");
    const count = failures.get(rawEmail) ?? 0;
    if (count >= 3) {
      const result = await verifyCaptcha(String(req.body.captchaToken ?? ""));
      if (!result.success) return res.status(403).json({ error: "captcha invalid" });
    }
    failures.set(rawEmail, count + 1);
    // Business layer canonicalizes identity, CAPTCHA counter does not.
    res.json(createAccount(rawEmail.trim().toLowerCase()));
  });
}
