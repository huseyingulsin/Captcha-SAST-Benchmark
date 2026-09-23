import type { Express } from "express";
import { verifyCaptcha } from "../../services/mockCaptcha.js";
import { createAccount } from "../../services/business.js";

export function scenario03(app: Express) {
  app.post("/vuln/03/signup", async (req, res) => {
    try {
      const result = await verifyCaptcha(String(req.body.captchaToken ?? ""));
      if (!result.success) return res.status(403).json({ error: "captcha invalid" });
    } catch (e) {
      console.warn("captcha provider failed", e);
      // Fail-open: business operation continues when provider verification fails.
    }
    res.json(createAccount(String(req.body.email ?? "unknown@example.test")));
  });
}
