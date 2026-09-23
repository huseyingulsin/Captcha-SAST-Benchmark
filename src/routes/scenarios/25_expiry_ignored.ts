import type { Express } from "express";
import { verifyCaptcha } from "../../services/mockCaptcha.js";
import { createAccount } from "../../services/business.js";

export function scenario25(app: Express) {
  app.post("/vuln/25/signup", async (req, res) => {
    const result = await verifyCaptcha(String(req.body.captchaToken ?? ""));
    if (!result.success || result.score < 0.7 || result.action !== "signup" || result.hostname !== "app.local") {
      return res.status(403).json({ error: "captcha rejected" });
    }
    // challengeTs is ignored; arbitrarily old tokens remain acceptable.
    res.json(createAccount(String(req.body.email ?? "unknown@example.test")));
  });
}
