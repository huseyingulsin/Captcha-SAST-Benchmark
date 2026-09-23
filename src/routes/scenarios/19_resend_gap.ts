import type { Express } from "express";
import { verifyCaptcha } from "../../services/mockCaptcha.js";
import { sendReset } from "../../services/business.js";

export function scenario19(app: Express) {
  app.post("/vuln/19/password-reset", async (req, res) => {
    const result = await verifyCaptcha(String(req.body.captchaToken ?? ""));
    if (!result.success) return res.status(403).json({ error: "captcha invalid" });
    res.json(sendReset(String(req.body.email ?? "unknown@example.test")));
  });

  app.post("/vuln/19/password-reset/resend", (req, res) => {
    res.json(sendReset(String(req.body.email ?? "unknown@example.test")));
  });
}
