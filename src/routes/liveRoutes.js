import express from "express";
import { validateBody } from "../middleware/validate.js";
import {
  listLiveBuses,
  getLiveBus,
  getLiveBusStops,
  updateLiveBus,
  listBusRouteMarkers,
} from "../controllers/liveController.js";
import { updateBusSchema } from "../schemas/liveSchema.js";

const router = express.Router();

router.get("/buses", listLiveBuses);
router.get("/buses/:id/stops", getLiveBusStops);
router.get("/buses/:id", getLiveBus);
router.patch("/buses/:id", validateBody(updateBusSchema), updateLiveBus);
router.get("/bus-routes/markers", listBusRouteMarkers);

export default router;
