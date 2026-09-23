# CAPTCHA SAST Benchmark

A deliberately vulnerable, **localhost-only** TypeScript/Express application for comparing SAST tools on CAPTCHA / anti-automation implementation weaknesses.

## Safety guardrails

- Binds to `127.0.0.1` only.
- Uses a local mock CAPTCHA verifier; no real CAPTCHA provider, credentials, or third-party endpoint.
- Contains intentionally vulnerable code. Do **not** deploy it or expose it to a network.
- Vulnerable routes live under `/vuln/*`; reference implementations live under `/safe/*`.

## Run

```bash
npm install
npm run dev
```

Default port: `3000`.

## Benchmark design

Each weakness has:

1. a vulnerable route or service,
2. a stable benchmark ID (`CAPTCHA-###`),
3. a ground-truth entry in `ground-truth/findings.json`,
4. where useful, a corresponding safe implementation.

The benchmark is designed to evaluate whether a SAST tool can identify data-flow and control-flow mistakes around CAPTCHA enforcement, not whether it recognizes one specific vendor API.

## Included cases (v0.1)

26 positive cases currently cover missing enforcement, optional validation, fail-open exceptions, semantic response validation, score/action/hostname/freshness binding, replay, race conditions, client-trusted state, debug/test bypasses, unsafe feature flags, client-selected providers, type confusion, missing `await`, ignored callbacks, alternate endpoint/method/channel coverage, reset/OTP resend gaps, proxy-header trust, client-controlled attempt state, and identity canonicalization gaps.

The `/safe` routes provide negative controls for SAST false-positive measurement.

## Normalizing tool output

Convert each tool's result into:

```json
{
  "findings": [
    {"file":"src/routes/scenarios/03_fail_open.ts","ruleId":"...","message":"..."}
  ]
}
```

Then run:

```bash
node scripts/score-findings.mjs normalized-findings.json
```

The included scorer uses file-level matching for the first iteration. For a stricter benchmark, add line/range and semantic-category matching in the next phase.
