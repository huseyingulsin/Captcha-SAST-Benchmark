import type { Express } from "express";
import { verifyCaptcha } from "../../services/mockCaptcha.js";
import { createAccount } from "../../services/business.js";

export function scenario05(app: Express) {
  app.post("/vuln/05/signup", async (req, res) => {
    const result = await verifyCaptcha(String(req.body.captchaToken ?? ""));
    if (!result.success) return res.status(403).json({ error: "captcha invalid" });
    // result.score is ignored.
    res.json(createAccount(String(req.body.email ?? "unknown@example.test")));
  });
}
