import type { Express } from "express";
import { verifyCaptcha } from "../../services/mockCaptcha.js";
import { createAccount } from "../../services/business.js";

function verifyWithCallback(token: string, cb: (ok: boolean) => void) {
  verifyCaptcha(token).then(r => cb(r.success)).catch(() => cb(false));
}

export function scenario17(app: Express) {
  app.post("/vuln/17/signup", (req, res) => {
    verifyWithCallback(String(req.body.captchaToken ?? ""), ok => {
      console.log("captcha callback", ok);
    });
    res.json(createAccount(String(req.body.email ?? "unknown@example.test")));
  });
}
