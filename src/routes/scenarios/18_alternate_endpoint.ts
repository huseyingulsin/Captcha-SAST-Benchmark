import type { Express } from "express";
import { verifyCaptcha } from "../../services/mockCaptcha.js";
import { createAccount } from "../../services/business.js";

export function scenario18(app: Express) {
  app.post("/vuln/18/register", async (req, res) => {
    const result = await verifyCaptcha(String(req.body.captchaToken ?? ""));
    if (!result.success) return res.status(403).json({ error: "captcha invalid" });
    res.json(createAccount(String(req.body.email ?? "unknown@example.test")));
  });

  app.post("/vuln/18/api/users", (req, res) => {
    // Alternate route reaches the same operation with no CAPTCHA enforcement.
    res.json(createAccount(String(req.body.email ?? "unknown@example.test")));
  });
}
