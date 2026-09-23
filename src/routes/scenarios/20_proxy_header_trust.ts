import type { Express } from "express";
import { verifyCaptcha } from "../../services/mockCaptcha.js";
import { createAccount } from "../../services/business.js";

export function scenario20(app: Express) {
  app.post("/vuln/20/signup", async (req, res) => {
    const claimedIp = String(req.header("x-forwarded-for") ?? req.ip);
    if (!claimedIp.startsWith("10.")) {
      const result = await verifyCaptcha(String(req.body.captchaToken ?? ""));
      if (!result.success) return res.status(403).json({ error: "captcha invalid" });
    }
    res.json(createAccount(String(req.body.email ?? "unknown@example.test")));
  });
}
