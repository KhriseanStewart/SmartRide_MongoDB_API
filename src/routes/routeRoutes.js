import express from "express";
import { listRoutes, listRouteStops, getRoutesV2 } from "../controllers/routeController.js";

const router = express.Router();

router.get("/", listRoutes);
router.get("/v2/live-eta", getRoutesV2);
router.get("/:routeId/stops", listRouteStops);

export default router;
