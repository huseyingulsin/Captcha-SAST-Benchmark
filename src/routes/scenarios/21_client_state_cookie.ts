import type { Express } from "express";
import { verifyCaptcha } from "../../services/mockCaptcha.js";
import { createAccount } from "../../services/business.js";

export function scenario21(app: Express) {
  app.post("/vuln/21/login", async (req, res) => {
    const failed = Number(req.cookies.failedAttempts ?? "0");
    if (failed >= 5) {
      const result = await verifyCaptcha(String(req.body.captchaToken ?? ""));
      if (!result.success) return res.status(403).json({ error: "captcha invalid" });
    }
    res.cookie("failedAttempts", String(failed + 1), { httpOnly: true });
    res.json(createAccount(String(req.body.email ?? "unknown@example.test")));
  });
}
