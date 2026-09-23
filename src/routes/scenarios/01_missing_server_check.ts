import type { Express } from "express";
import { createAccount } from "../../services/business.js";

export function scenario01(app: Express) {
  app.post("/vuln/01/signup", (req, res) => {
    // The UI is assumed to have displayed CAPTCHA, but the server never verifies it.
    res.json(createAccount(String(req.body.email ?? "unknown@example.test")));
  });
}
