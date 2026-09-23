import type { Express } from "express";
import { verifyCaptcha } from "../../services/mockCaptcha.js";
import { createAccount } from "../../services/business.js";

export function scenario23(app: Express) {
  app.post("/vuln/23/account", async (req, res) => {
    const result = await verifyCaptcha(String(req.body.captchaToken ?? ""));
    if (!result.success) return res.status(403).json({ error: "captcha invalid" });
    res.json(createAccount(String(req.body.email ?? "unknown@example.test")));
  });

  app.put("/vuln/23/account", (req, res) => {
    res.json(createAccount(String(req.body.email ?? "unknown@example.test")));
  });
}
