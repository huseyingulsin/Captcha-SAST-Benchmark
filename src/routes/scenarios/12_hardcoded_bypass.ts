import type { Express } from "express";
import { verifyCaptcha } from "../../services/mockCaptcha.js";
import { createAccount } from "../../services/business.js";

const TEST_BYPASS = "TEST-CAPTCHA-BYPASS";

export function scenario12(app: Express) {
  app.post("/vuln/12/signup", async (req, res) => {
    const token = String(req.body.captchaToken ?? "");
    if (token !== TEST_BYPASS) {
      const result = await verifyCaptcha(token);
      if (!result.success) return res.status(403).json({ error: "captcha invalid" });
    }
    res.json(createAccount(String(req.body.email ?? "unknown@example.test")));
  });
}
