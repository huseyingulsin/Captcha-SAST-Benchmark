import type { CaptchaResult } from "../types.js";

const now = () => Date.now();

/**
 * Local-only mock verifier. Token format is intentionally simple so tests can
 * exercise application logic without talking to a real CAPTCHA provider.
 */
export async function verifyCaptcha(token: string): Promise<CaptchaResult> {
  if (token === "timeout") {
    throw new Error("mock provider timeout");
  }

  if (token === "invalid" || token.length === 0) {
    return {
      success: false,
      score: 0,
      action: "unknown",
      hostname: "invalid.local",
      challengeTs: now(),
      tokenId: token || "empty"
    };
  }

  const parts = token.split(":");
  const score = Number(parts[1] ?? "0.9");
  const action = parts[2] ?? "signup";
  const hostname = parts[3] ?? "app.local";
  const ageSeconds = Number(parts[4] ?? "0");

  return {
    success: true,
    score: Number.isFinite(score) ? score : 0,
    action,
    hostname,
    challengeTs: now() - ageSeconds * 1000,
    tokenId: token
  };
}
