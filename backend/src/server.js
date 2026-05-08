import express from "express";
import cors from "cors";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { existsSync } from "node:fs";
import { ZodError } from "zod";
import { env } from "./config/env.js";
import { contentRouter } from "./modules/content/content.routes.js";
import { signupRouter } from "./modules/signups/signup.routes.js";
import { dashboardRouter } from "./modules/dashboard/dashboard.routes.js";

const app = express();

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || env.corsOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Origen no permitido por CORS"));
    }
  })
);
app.use(express.json({ limit: "1mb" }));

app.get("/health", (_req, res) => {
  res.json({ ok: true, region: "mx", now: new Date().toISOString() });
});

app.use("/api/signups", signupRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/content", contentRouter);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const frontendDistPath = path.resolve(__dirname, "../../frontend/dist");

if (existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath));

  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api/")) {
      return next();
    }
    return res.sendFile(path.join(frontendDistPath, "index.html"));
  });
}

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
