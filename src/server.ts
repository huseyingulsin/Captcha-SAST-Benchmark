import express from "express";
import cookieParser from "cookie-parser";
import { safeRouter } from "./safe/routes.js";
import { registerVulnerableRoutes } from "./routes/vulnerable.js";

export function createApp() {
  const app = express();
  app.disable("x-powered-by");
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  app.get("/health", (_req, res) => res.json({ ok: true, benchmark: "captcha-sast" }));
  app.use("/safe", safeRouter);
  registerVulnerableRoutes(app);
  return app;
}

if (process.env.NODE_ENV !== "test") {
  const port = Number(process.env.PORT ?? 3000);
  createApp().listen(port, "127.0.0.1", () => {
    console.log(`CAPTCHA SAST benchmark listening on http://127.0.0.1:${port}`);
  });
}
