import { z } from "zod";

export const createMonitoredSiteSchema = z.object({
  nombre: z.string().min(2).max(120),
  dominio: z.string().min(4).max(160),
  plataforma: z.enum(["web", "ios", "android"])
});
