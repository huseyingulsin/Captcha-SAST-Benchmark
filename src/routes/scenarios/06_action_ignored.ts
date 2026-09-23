import type { Express } from "express";
import { verifyCaptcha } from "../../services/mockCaptcha.js";
import { createAccount } from "../../services/business.js";

export function scenario06(app: Express) {
  app.post("/vuln/06/signup", async (req, res) => {
    const result = await verifyCaptcha(String(req.body.captchaToken ?? ""));
    if (!result.success || result.score < 0.7) return res.status(403).json({ error: "captcha rejected" });
    // result.action is not bound to the signup operation.
    res.json(createAccount(String(req.body.email ?? "unknown@example.test")));
  });
}
