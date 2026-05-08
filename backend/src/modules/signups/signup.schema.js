import { z } from "zod";

export const createSignupSchema = z.object({
  nombre_completo: z.string().min(2).max(120),
  correo_laboral: z.string().email().max(254),
  empresa_proyecto: z.string().min(2).max(160),
  tipo_negocio: z.enum(["saas", "ecommerce", "agency", "corp"])
});
