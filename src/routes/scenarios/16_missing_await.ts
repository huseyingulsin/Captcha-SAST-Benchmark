import type { Express } from "express";
import { verifyCaptcha } from "../../services/mockCaptcha.js";
import { createAccount } from "../../services/business.js";

export function scenario16(app: Express) {
  app.post("/vuln/16/signup", (req, res) => {
    const verification: any = verifyCaptcha(String(req.body.captchaToken ?? ""));
    // Promise existence is treated as success; verification result is never awaited.
    if (!verification) return res.status(403).json({ error: "captcha invalid" });
    res.json(createAccount(String(req.body.email ?? "unknown@example.test")));
  });
}
