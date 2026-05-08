import { Router } from "express";
import { requireTenantAccess } from "../auth/tenant.middleware.js";
import { createMonitoredSiteSchema } from "./dashboard.schema.js";
import { createSite, getOverview, listSites } from "./dashboard.service.js";

export const dashboardRouter = Router();
dashboardRouter.use(requireTenantAccess);

dashboardRouter.get("/overview", async (req, res, next) => {
  try {
    const summary = await getOverview(req.tenantContext.tenantId);
    res.json({ summary });
  } catch (error) {
    next(error);
  }
});

dashboardRouter.get("/sites", async (req, res, next) => {
  try {
    const sites = await listSites(req.tenantContext.tenantId);
    res.json({ sites });
  } catch (error) {
    next(error);
  }
});

dashboardRouter.post("/sites", async (req, res, next) => {
  try {
    const payload = createMonitoredSiteSchema.parse(req.body);
    const site = await createSite(req.tenantContext.tenantId, payload);
    res.status(201).json({ site });
  } catch (error) {
    next(error);
  }
});
