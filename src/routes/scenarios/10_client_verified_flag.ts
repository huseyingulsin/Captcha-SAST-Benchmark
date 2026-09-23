import type { Express } from "express";
import { createAccount } from "../../services/business.js";

export function scenario10(app: Express) {
  app.post("/vuln/10/signup", (req, res) => {
    if (req.body.captchaVerified !== true) return res.status(403).json({ error: "captcha required" });
    res.json(createAccount(String(req.body.email ?? "unknown@example.test")));
  });
}
