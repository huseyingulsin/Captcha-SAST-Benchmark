import type { Express } from "express";
import { verifyCaptcha } from "../../services/mockCaptcha.js";
import { sendOtp } from "../../services/business.js";

export function scenario26(app: Express) {
  app.post("/vuln/26/send-otp", async (req, res) => {
    const result = await verifyCaptcha(String(req.body.captchaToken ?? ""));
    if (!result.success) return res.status(403).json({ error: "captcha invalid" });
    res.json(sendOtp(String(req.body.phone ?? "+000")));
  });

  app.post("/vuln/26/resend-otp", (req, res) => {
    res.json(sendOtp(String(req.body.phone ?? "+000")));
  });
}
