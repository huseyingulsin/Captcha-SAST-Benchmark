import type { Express } from "express";
import { createAccount } from "../../services/business.js";

export function scenario15(app: Express) {
  app.post("/vuln/15/signup", (req, res) => {
    const providerBody = req.body.providerResponse ?? {};
    if (!providerBody.success) return res.status(403).json({ error: "captcha invalid" });
    // A string such as "false" is truthy in JavaScript.
    res.json(createAccount(String(req.body.email ?? "unknown@example.test")));
  });
}
