import type { Request, Response, NextFunction } from "express";
import { verifyCaptcha } from "../services/mockCaptcha.js";

const usedTokens = new Set<string>();

export function requireCaptcha(expectedAction: string) {
  return async function captchaMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
      const token = String(req.body?.captchaToken ?? "");
      if (!token) return res.status(400).json({ error: "captcha required" });

      const result = await verifyCaptcha(token);
      if (!result.success) return res.status(403).json({ error: "captcha invalid" });
      if (result.score < 0.7) return res.status(403).json({ error: "captcha score too low" });
      if (result.action !== expectedAction) return res.status(403).json({ error: "captcha action mismatch" });
      if (result.hostname !== "app.local") return res.status(403).json({ error: "captcha hostname mismatch" });
      if (Date.now() - result.challengeTs > 120_000) return res.status(403).json({ error: "captcha expired" });
      if (usedTokens.has(result.tokenId)) return res.status(409).json({ error: "captcha replay" });

      usedTokens.add(result.tokenId);
      next();
    } catch {
      return res.status(503).json({ error: "captcha unavailable" });
    }
  };
}
