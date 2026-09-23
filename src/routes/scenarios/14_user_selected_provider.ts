import type { Express } from "express";
import { verifyCaptcha } from "../../services/mockCaptcha.js";
import { createAccount } from "../../services/business.js";

export function scenario14(app: Express) {
  app.post("/vuln/14/signup", async (req, res) => {
    const provider = String(req.body.captchaProvider ?? "none");
    if (provider === "mock") {
      const result = await verifyCaptcha(String(req.body.captchaToken ?? ""));
      if (!result.success) return res.status(403).json({ error: "captcha invalid" });
    }
    // Unknown/none provider falls through instead of being rejected.
    res.json(createAccount(String(req.body.email ?? "unknown@example.test")));
  });
}
