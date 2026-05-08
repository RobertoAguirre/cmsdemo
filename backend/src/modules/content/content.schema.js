import { z } from "zod";

export const createContentSchema = z.object({
  title: z.string().min(3).max(140),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  contentType: z.enum(["pagina", "blog", "landing", "producto"]),
  body: z.string().min(3),
  seo: z
    .object({
      title: z.string().max(70).optional(),
      description: z.string().max(160).optional()
    })
    .optional()
});
