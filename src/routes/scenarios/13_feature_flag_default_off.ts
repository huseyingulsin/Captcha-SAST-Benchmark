import type { Express } from "express";
import { verifyCaptcha } from "../../services/mockCaptcha.js";
import { createAccount } from "../../services/business.js";

function captchaEnabled() {
  return process.env.CAPTCHA_ENABLED === "true"; // missing/invalid config disables protection
}

export function scenario13(app: Express) {
  app.post("/vuln/13/signup", async (req, res) => {
    if (captchaEnabled()) {
      const result = await verifyCaptcha(String(req.body.captchaToken ?? ""));
      if (!result.success) return res.status(403).json({ error: "captcha invalid" });
    }
    res.json(createAccount(String(req.body.email ?? "unknown@example.test")));
  });
}
