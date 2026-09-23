import type { Express } from "express";
import { createAccount } from "../../services/business.js";

async function fakeProviderHttpCall(_token: string) {
  return { status: 200, body: { success: false, score: 0 } };
}

export function scenario04(app: Express) {
  app.post("/vuln/04/signup", async (req, res) => {
    const providerResponse = await fakeProviderHttpCall(String(req.body.captchaToken ?? ""));
    if (providerResponse.status !== 200) return res.status(503).json({ error: "provider error" });
    res.json(createAccount(String(req.body.email ?? "unknown@example.test")));
  });
}
