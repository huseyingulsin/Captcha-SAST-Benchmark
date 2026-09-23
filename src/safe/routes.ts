import { Router } from "express";
import { requireCaptcha } from "../middleware/safeCaptcha.js";
import { createAccount, sendOtp, sendReset } from "../services/business.js";

export const safeRouter = Router();

safeRouter.post("/signup", requireCaptcha("signup"), (req, res) => {
  res.json(createAccount(String(req.body.email ?? "unknown@example.test")));
});

safeRouter.post("/send-otp", requireCaptcha("otp"), (req, res) => {
  res.json(sendOtp(String(req.body.phone ?? "+000")));
});

safeRouter.post("/password-reset", requireCaptcha("reset"), (req, res) => {
  res.json(sendReset(String(req.body.email ?? "unknown@example.test")));
});
