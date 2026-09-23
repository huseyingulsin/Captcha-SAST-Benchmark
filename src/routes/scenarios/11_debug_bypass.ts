import type { Express } from "express";
import { verifyCaptcha } from "../../services/mockCaptcha.js";
import { createAccount } from "../../services/business.js";

export function scenario11(app: Express) {
  app.post("/vuln/11/signup", async (req, res) => {
    if (req.query.debug !== "1") {
      const result = await verifyCaptcha(String(req.body.captchaToken ?? ""));
      if (!result.success) return res.status(403).json({ error: "captcha invalid" });
    }
    res.json(createAccount(String(req.body.email ?? "unknown@example.test")));
  });
}
