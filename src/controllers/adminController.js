import mongoose from "mongoose";
import User from "../models/User.js";
import Route from "../models/Route.js";
import RouteStop from "../models/RouteStop.js";
import Bus from "../models/Bus.js";
import BusRoute from "../models/BusRoute.js";
import Driver from "../models/Driver.js";
import Transaction from "../models/Transaction.js";
import Location from "../models/Location.js";

function parsePagination(query) {
  const page = Math.max(1, Number.parseInt(query.page || "1", 10) || 1);
  const limit = Math.max(1, Math.min(100, Number.parseInt(query.limit || "20", 10) || 20));
  return { page, limit, skip: (page - 1) * limit };
}

function sendPaginated(res, rows, total, page, limit) {
  res.json({ success: true, data: rows, total, page, limit });
}

function badRequest(message) {
  const err = new Error(message);
  err.statusCode = 400;
  return err;
}

function notFound(message) {
  const err = new Error(message);
  err.statusCode = 404;
  return err;
}

function ensureObjectId(value, fieldName) {
  if (!mongoose.isValidObjectId(value)) {
    throw badRequest(`${fieldName} must be a valid ObjectId`);
  }
}

function buildRouteDisplayName(route) {
  const startName = route.start_location_id?.name || "Unknown start";
  const endName = route.end_location_id?.name || "Unknown end";
  return `${startName} to ${endName}`;
}

function mapAdminRoute(route) {
  return {
    ...route,
    start_location: route.start_location_id || null,
    end_location: route.end_location_id || null,
    display_name: buildRouteDisplayName(route),
  };
}

async function findBusRouteByReference(routeRef) {
  if (!routeRef) {
    return null;
  }

  const normalizedRouteRef =
    typeof routeRef === "object" && routeRef !== null && routeRef._id ? routeRef._id : routeRef;

  const routeRefString = String(normalizedRouteRef);

  if (mongoose.isValidObjectId(routeRefString)) {
    const busRoute = await BusRoute.findById(routeRefString).lean();
    if (busRoute) {
      return busRoute;
    }

    const route = await Route.findById(routeRefString).lean();
    if (route) {
      return BusRoute.findOne({
        $or: [{ route: route.name }, { route: route.route_code }],
      }).lean();
    }
  }

  return BusRoute.findOne({ route: routeRefString }).lean();
}

async function resolveBusRouteId(routeRef) {
  const busRoute = await findBusRouteByReference(routeRef);
  if (!busRoute) {
    throw notFound("Bus route not found for the supplied route reference");
  }

  return busRoute._id;
}

function normalizeDateRange({ from, to }) {
  const range = {};

  if (from) {
    const start = new Date(from);
    if (Number.isNaN(start.getTime())) {
      throw badRequest("from must be a valid date");
    }
    range.$gte = start;
  }

  if (to) {
    const end = new Date(to);
    if (Number.isNaN(end.getTime())) {
      throw badRequest("to must be a valid date");
    }
    range.$lte = end;
  }

  return Object.keys(range).length ? range : null;
}

async function listUsers(req, res, next) {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const [rows, total] = await Promise.all([
      User.find({})
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments({}),
    ]);

    sendPaginated(res, rows, total, page, limit);
  } catch (err) {
    next(err);
  }
}

async function getUserById(req, res, next) {
  try {
    const user = await User.findById(req.params.userId).lean();
    if (!user) {
      throw notFound("User not found");
    }

    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
}

async function updateUser(req, res, next) {
  try {
    const updates = {};
    const allowedFields = ["email", "full_name", "profile_url", "smart_card_cash", "smart_card_num", "fav_routes"];

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    const user = await User.findByIdAndUpdate(req.params.userId, updates, {
      returnDocument: "after",
      runValidators: true,
    });

    if (!user) {
      throw notFound("User not found");
    }

    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
}

async function deleteUser(req, res, next) {
  try {
    const user = await User.findByIdAndDelete(req.params.userId);
    if (!user) {
      throw notFound("User not found");
    }

    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
}

async function listLocations(req, res, next) {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const search = (req.query.search || "").trim();
    const filter = search
      ? {
          name: {
            $regex: search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
            $options: "i",
          },
        }
      : {};

    const [rows, total] = await Promise.all([
      Location.find(filter)
        .sort({ name: 1, _id: 1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Location.countDocuments(filter),
    ]);

    sendPaginated(res, rows, total, page, limit);
  } catch (err) {
    next(err);
  }
}

async function createLocation(req, res, next) {
  try {
    const location = await Location.create({
      name: req.body.name,
      lat: req.body.lat,
      long: req.body.long,
      parish: req.body.parish,
    });

    res.status(201).json({ success: true, data: location });
  } catch (err) {
    next(err);
  }
}

async function updateLocation(req, res, next) {
  try {
    const updates = {};
    const allowedFields = ["name", "lat", "long", "parish"];

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    const location = await Location.findByIdAndUpdate(req.params.locationId, updates, {
      returnDocument: "after",
      runValidators: true,
    });

    if (!location) {
      throw notFound("Location not found");
    }

    res.json({ success: true, data: location });
  } catch (err) {
    next(err);
  }
}

async function deleteLocation(req, res, next) {
  try {
    const location = await Location.findByIdAndDelete(req.params.locationId);
    if (!location) {
      throw notFound("Location not found");
    }

    res.json({ success: true, data: location });
  } catch (err) {
    next(err);
  }
}

async function listRoutes(req, res, next) {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const [rows, total] = await Promise.all([
      Route.find({})
        .sort({ created_at: -1, _id: -1 })
        .skip(skip)
        .limit(limit)
        .populate("start_location_id", "name lat long parish")
        .populate("end_location_id", "name lat long parish")
        .lean(),
      Route.countDocuments({}),
    ]);

    sendPaginated(res, rows.map(mapAdminRoute), total, page, limit);
  } catch (err) {
    next(err);
  }
}

async function createRoute(req, res, next) {
  try {
    const { route_code, name, start_location_id, end_location_id, is_active } = req.body;
    ensureObjectId(start_location_id, "start_location_id");
    ensureObjectId(end_location_id, "end_location_id");

    const route = await Route.create({
      route_code,
      name,
      start_location_id,
      end_location_id,
      is_active,
    });

    const populatedRoute = await Route.findById(route._id)
      .populate("start_location_id", "name lat long parish")
      .populate("end_location_id", "name lat long parish")
      .lean();

    res.status(201).json({ success: true, data: mapAdminRoute(populatedRoute) });
  } catch (err) {
    next(err);
  }
}

async function updateRoute(req, res, next) {
  try {
    const updates = {};
    const allowedFields = ["route_code", "name", "is_active", "start_location_id", "end_location_id"];

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    if (updates.start_location_id) {
      ensureObjectId(updates.start_location_id, "start_location_id");
    }
    if (updates.end_location_id) {
      ensureObjectId(updates.end_location_id, "end_location_id");
    }

    const route = await Route.findByIdAndUpdate(req.params.routeId, updates, {
      returnDocument: "after",
      runValidators: true,
    });

    if (!route) {
      throw notFound("Route not found");
    }

    const populatedRoute = await Route.findById(route._id)
      .populate("start_location_id", "name lat long parish")
      .populate("end_location_id", "name lat long parish")
      .lean();

    res.json({ success: true, data: mapAdminRoute(populatedRoute) });
  } catch (err) {
    next(err);
  }
}

async function deleteRoute(req, res, next) {
  try {
    const route = await Route.findByIdAndDelete(req.params.routeId);
    if (!route) {
      throw notFound("Route not found");
    }

    await RouteStop.deleteMany({ route_id: req.params.routeId });

    res.json({ success: true, data: route });
  } catch (err) {
    next(err);
  }
}

async function addRouteStop(req, res, next) {
  try {
    ensureObjectId(req.params.routeId, "routeId");
    ensureObjectId(req.body.location_id, "location_id");

    const route = await Route.findById(req.params.routeId).lean();
    if (!route) {
      throw notFound("Route not found");
    }

    const stop = await RouteStop.create({
      route_id: req.params.routeId,
      location_id: req.body.location_id,
      stop_order: req.body.stop_order,
      dwell_minutes: req.body.dwell_minutes,
      is_pickup: req.body.is_pickup,
      is_dropoff: req.body.is_dropoff,
    });

    res.status(201).json({ success: true, data: stop });
  } catch (err) {
    next(err);
  }
}

async function updateRouteStop(req, res, next) {
  try {
    const updates = {};
    const allowedFields = ["location_id", "stop_order", "dwell_minutes", "is_pickup", "is_dropoff"];

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    if (updates.location_id) {
      ensureObjectId(updates.location_id, "location_id");
    }

    const stop = await RouteStop.findOneAndUpdate(
      { _id: req.params.stopId, route_id: req.params.routeId },
      updates,
      { returnDocument: "after", runValidators: true }
    );

    if (!stop) {
      throw notFound("Stop not found");
    }

    res.json({ success: true, data: stop });
  } catch (err) {
    next(err);
  }
}

async function deleteRouteStop(req, res, next) {
  try {
    const stop = await RouteStop.findOneAndDelete({
      _id: req.params.stopId,
      route_id: req.params.routeId,
    });

    if (!stop) {
      throw notFound("Stop not found");
    }

    res.json({ success: true, data: stop });
  } catch (err) {
    next(err);
  }
}

async function listBuses(req, res, next) {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const [rows, total] = await Promise.all([
      Bus.find({})
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate({
          path: "route",
          populate: { path: "assigned_driver" },
        })
        .lean(),
      Bus.countDocuments({}),
    ]);

    sendPaginated(res, rows, total, page, limit);
  } catch (err) {
    next(err);
  }
}

async function createBus(req, res, next) {
  try {
    const { id, current_lat, current_long, bearing, route } = req.body;
    const resolvedRouteId = await resolveBusRouteId(route);

    const bus = await Bus.create({ id, current_lat, current_long, bearing, route: resolvedRouteId });
    res.status(201).json({ success: true, data: bus });
  } catch (err) {
    next(err);
  }
}

async function updateBus(req, res, next) {
  try {
    const updates = {};
    const allowedFields = ["id", "current_lat", "current_long", "bearing", "route"];

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    if (updates.route) {
      updates.route = await resolveBusRouteId(updates.route);
    }

    const bus = await Bus.findByIdAndUpdate(req.params.busId, updates, {
      returnDocument: "after",
      runValidators: true,
    });

    if (!bus) {
      throw notFound("Bus not found");
    }

    res.json({ success: true, data: bus });
  } catch (err) {
    next(err);
  }
}

async function deleteBus(req, res, next) {
  try {
    const bus = await Bus.findByIdAndDelete(req.params.busId);
    if (!bus) {
      throw notFound("Bus not found");
    }

    res.json({ success: true, data: bus });
  } catch (err) {
    next(err);
  }
}

async function assignDriverToBus(req, res, next) {
  try {
    ensureObjectId(req.params.busId, "busId");
    ensureObjectId(req.body.driverId, "driverId");

    const bus = await Bus.findById(req.params.busId).lean();
    if (!bus) {
      throw notFound("Bus not found");
    }

    const busRoute = await findBusRouteByReference(bus.route);
    if (!busRoute) {
      throw notFound("Assigned route not found");
    }

    const route = await BusRoute.findByIdAndUpdate(
      busRoute._id,
      { assigned_driver: req.body.driverId },
      { returnDocument: "after" }
    ).populate("assigned_driver");

    if (!route) {
      throw notFound("Assigned route not found");
    }

    res.json({ success: true, data: route });
  } catch (err) {
    next(err);
  }
}

async function listDrivers(req, res, next) {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const [rows, total] = await Promise.all([
      Driver.find({}).skip(skip).limit(limit).lean(),
      Driver.countDocuments({}),
    ]);

    sendPaginated(res, rows, total, page, limit);
  } catch (err) {
    next(err);
  }
}

async function listTransactions(req, res, next) {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const filter = {};

    if (req.query.status) {
      filter.status = req.query.status;
    }
    if (req.query.route) {
      filter.route = req.query.route;
    }

    const dateRange = normalizeDateRange({
      from: req.query.from || req.query.startDate,
      to: req.query.to || req.query.endDate,
    });
    if (dateRange) {
      filter.created_at = dateRange;
    }

    const [rows, total] = await Promise.all([
      Transaction.find(filter)
        .sort({ created_at: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Transaction.countDocuments(filter),
    ]);

    sendPaginated(res, rows, total, page, limit);
  } catch (err) {
    next(err);
  }
}

async function getTransactionById(req, res, next) {
  try {
    const transaction = await Transaction.findById(req.params.transactionId).lean();
    if (!transaction) {
      throw notFound("Transaction not found");
    }

    res.json({ success: true, data: transaction });
  } catch (err) {
    next(err);
  }
}

async function updateTransaction(req, res, next) {
  try {
    const updates = {};
    if (req.body.status !== undefined) {
      updates.status = req.body.status;
    }
    if (req.body.receiver_id !== undefined) {
      updates.receiver_id = req.body.receiver_id;
    }
    if (req.body.driver_id !== undefined) {
      updates.driver_id = req.body.driver_id;
    }
    updates.last_updated = new Date();

    const transaction = await Transaction.findByIdAndUpdate(req.params.transactionId, updates, {
      returnDocument: "after",
      runValidators: true,
    });

    if (!transaction) {
      throw notFound("Transaction not found");
    }

    res.json({ success: true, data: transaction });
  } catch (err) {
    next(err);
  }
}

async function getOverviewStats(req, res, next) {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [totalUsers, activeBusRoutes, dailyTransactions] = await Promise.all([
      User.countDocuments({}),
      BusRoute.countDocuments({ route_status: "Active" }),
      Transaction.countDocuments({ created_at: { $gte: today } }),
    ]);

    res.json({
      success: true,
      data: {
        total_users: totalUsers,
        active_buses: activeBusRoutes,
        daily_transactions: dailyTransactions,
      },
    });
  } catch (err) {
    next(err);
  }
}

async function getTransactionStats(req, res, next) {
  try {
    const dateRange = normalizeDateRange({
      from: req.query.from || req.query.startDate,
      to: req.query.to || req.query.endDate,
    });

    const match = dateRange ? { created_at: dateRange } : {};
    const rows = await Transaction.aggregate([
      { $match: match },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$created_at" },
          },
          count: { $sum: 1 },
          amount: { $sum: "$amount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({ success: true, data: rows });
  } catch (err) {
    next(err);
  }
}

async function getRouteStats(req, res, next) {
  try {
    const rows = await Transaction.aggregate([
      {
        $group: {
          _id: "$route",
          rides: { $sum: 1 },
          amount: { $sum: "$amount" },
        },
      },
      { $sort: { rides: -1, _id: 1 } },
    ]);

    res.json({ success: true, data: rows });
  } catch (err) {
    next(err);
  }
}

export {
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
};
