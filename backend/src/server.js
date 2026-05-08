import express from "express";
import cors from "cors";
import { ZodError } from "zod";
import { env } from "./config/env.js";
import { contentRouter } from "./modules/content/content.routes.js";
import { signupRouter } from "./modules/signups/signup.routes.js";
import { dashboardRouter } from "./modules/dashboard/dashboard.routes.js";

const app = express();

app.use(cors({ origin: env.CORS_ORIGIN }));
app.use(express.json({ limit: "1mb" }));

app.get("/health", (_req, res) => {
  res.json({ ok: true, region: "mx", now: new Date().toISOString() });
});

app.use("/api/signups", signupRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/content", contentRouter);

app.use((error, _req, res, _next) => {
  if (error instanceof ZodError) {
    return res.status(400).json({ message: "Payload invalido", details: error.flatten() });
  }

  if (error?.status) {
    return res.status(error.status).json({ message: error.message });
  }

  return res.status(500).json({
    message: error?.message ?? "Error interno"
  });
});

app.listen(env.PORT, () => {
  console.log(`CMS backend listo en http://localhost:${env.PORT}`);
});
