import type { Express } from "express";
import { verifyCaptcha } from "../../services/mockCaptcha.js";
import { createAccount } from "../../services/business.js";

export function scenario02(app: Express) {
  app.post("/vuln/02/signup", async (req, res) => {
    const token = req.body.captchaToken;
    if (token) {
      const result = await verifyCaptcha(String(token));
      if (!result.success) return res.status(403).json({ error: "captcha invalid" });
    }
    res.json(createAccount(String(req.body.email ?? "unknown@example.test")));
  });
}
