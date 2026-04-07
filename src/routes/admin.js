import express from "express";
import { requireAdmin } from "../middleware/requireAdmin.js";
import {
  listUsers,
  getUserById,
  updateUser,
  deleteUser,
  listLocations,
  createLocation,
  updateLocation,
  deleteLocation,
  listRoutes,
  createRoute,
  updateRoute,
  deleteRoute,
  addRouteStop,
  updateRouteStop,
  deleteRouteStop,
  listBuses,
  createBus,
  updateBus,
  deleteBus,
  assignDriverToBus,
  listDrivers,
  listTransactions,
  getTransactionById,
  updateTransaction,
  getOverviewStats,
  getTransactionStats,
  getRouteStats,
} from "../controllers/adminController.js";
import { inviteDriver } from "../controllers/authController.js";
import { validateBody } from "../middleware/validate.js";
import { inviteDriverSchema } from "../schemas/authSchema.js";

const router = express.Router();

router.use(requireAdmin);

router.get("/users", listUsers);
router.get("/users/:userId", getUserById);
router.patch("/users/:userId", updateUser);
router.delete("/users/:userId", deleteUser);

router.get("/locations", listLocations);
router.post("/locations", createLocation);
router.patch("/locations/:locationId", updateLocation);
router.delete("/locations/:locationId", deleteLocation);

router.get("/routes", listRoutes);
router.post("/routes", createRoute);
router.patch("/routes/:routeId", updateRoute);
router.delete("/routes/:routeId", deleteRoute);
router.post("/routes/:routeId/stops", addRouteStop);
router.patch("/routes/:routeId/stops/:stopId", updateRouteStop);
router.delete("/routes/:routeId/stops/:stopId", deleteRouteStop);

router.get("/buses", listBuses);
router.post("/buses", createBus);
router.patch("/buses/:busId", updateBus);
router.delete("/buses/:busId", deleteBus);
router.post("/buses/:busId/assign-driver", assignDriverToBus);

router.get("/drivers", listDrivers);
router.post("/drivers/invite", validateBody(inviteDriverSchema), inviteDriver);

router.get("/transactions", listTransactions);
router.get("/transactions/:transactionId", getTransactionById);
router.patch("/transactions/:transactionId", updateTransaction);

router.get("/stats/overview", getOverviewStats);
router.get("/stats/transactions", getTransactionStats);
router.get("/stats/routes", getRouteStats);

export default router;
