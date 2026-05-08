import { Router } from "express";
import { createContentSchema } from "./content.schema.js";
import { createContent, listContent, publishContent } from "./content.service.js";
import { requireTenantAccess } from "../auth/tenant.middleware.js";

export const contentRouter = Router();
contentRouter.use(requireTenantAccess);

contentRouter.get("/", async (req, res, next) => {
  try {
    const items = await listContent(req.tenantContext.tenantId);
    res.json({ items });
  } catch (error) {
    next(error);
  }
});

contentRouter.post("/", async (req, res, next) => {
  try {
    const payload = createContentSchema.parse(req.body);
    const item = await createContent(req.tenantContext.tenantId, payload);
    res.status(201).json({ item });
  } catch (error) {
    next(error);
  }
});

contentRouter.patch("/:id/publish", async (req, res, next) => {
  try {
    const item = await publishContent(req.tenantContext.tenantId, req.params.id);
    res.json({ item });
  } catch (error) {
    next(error);
  }
});
