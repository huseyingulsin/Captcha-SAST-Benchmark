import type { Express } from "express";
import { verifyCaptcha } from "../../services/mockCaptcha.js";
import { createAccount } from "../../services/business.js";

const consumed = new Set<string>();

export function scenario09(app: Express) {
  app.post("/vuln/09/signup", async (req, res) => {
    const token = String(req.body.captchaToken ?? "");
    const result = await verifyCaptcha(token);
    if (!result.success || consumed.has(token)) return res.status(403).json({ error: "captcha rejected" });

    // Artificial async gap between check and consume creates a race window.
    await new Promise(resolve => setTimeout(resolve, 25));
    consumed.add(token);
    res.json(createAccount(String(req.body.email ?? "unknown@example.test")));
  });
}
