import mongoose from "mongoose";
import Bus from "../models/Bus.js";
import BusRoute from "../models/BusRoute.js";
import Route from "../models/Route.js";
import RouteStop from "../models/RouteStop.js";

function liveBusLookupQuery(param) {
  if (mongoose.isValidObjectId(param)) {
    return { $or: [{ id: param }, { _id: param }] };
  }
  return { id: param };
}

async function listLiveBuses(req, res, next) {
  try {
    const rows = await Bus.find({})
      .populate("route", "end_lat end_long drop_off_town")
      .lean();
    res.json({ success: true, data: rows });
  } catch (err) {
    next(err);
  }
}

async function getLiveBus(req, res, next) {
  try {
    const row = await Bus.findOne(liveBusLookupQuery(req.params.id))
      .populate("route", "end_lat end_long drop_off_town route route_status start_lat assigned_driver")
      .lean();

    if (!row) {
      return res.status(404).json({ success: false, message: "Bus not found" });
    }

    res.json({ success: true, data: row });
  } catch (err) {
    next(err);
  }
}

async function resolvePassengerRouteIdForBusStops(routeRef) {
  if (!routeRef) {
    return null;
  }

  const directRoute = await Route.findById(routeRef).select("_id").lean();
  if (directRoute) {
    return directRoute._id;
  }

  const busRouteDoc = await BusRoute.findById(routeRef).lean();
  if (!busRouteDoc?.route) {
    return null;
  }

  const linked = await Route.findOne({
    $or: [{ route_code: busRouteDoc.route }, { name: busRouteDoc.route }],
  })
    .select("_id")
    .lean();

  return linked?._id ?? null;
}

async function getLiveBusStops(req, res, next) {
  try {
    const bus = await Bus.findOne(liveBusLookupQuery(req.params.id)).lean();
    if (!bus) {
      return res.status(404).json({ success: false, message: "Bus not found" });
    }

    const passengerRouteId = await resolvePassengerRouteIdForBusStops(bus.route);
    if (!passengerRouteId) {
      return res.json({ success: true, data: [] });
    }

    const rows = await RouteStop.find({ route_id: passengerRouteId })
      .populate("location_id", "name lat long")
      .sort({ stop_order: 1 })
      .lean();

    const data = rows.map((row) => ({
      route: row.route_id,
      stop_order: row.stop_order,
      dwell_minutes: row.dwell_minutes,
      is_pickup: row.is_pickup,
      is_dropoff: row.is_dropoff,
      locations: row.location_id,
    }));

    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

async function updateLiveBus(req, res, next) {
  try {
    const { current_lat, current_long, bearing } = req.body;
    const row = await Bus.findOneAndUpdate(
      liveBusLookupQuery(req.params.id),
      { current_lat, current_long, bearing },
      { new: true }
    )
      .populate("route", "end_lat end_long drop_off_town")
      .lean();

    if (!row) {
      return res.status(404).json({ success: false, message: "Bus not found" });
    }

    res.json({ success: true, data: row });
  } catch (err) {
    next(err);
  }
}

async function listBusRouteMarkers(req, res, next) {
  try {
    const rows = await BusRoute.find({}, "end_lat end_long").lean();
    const data = rows.map((row) => ({
      id: row._id.toString(),
      end_lat: row.end_lat,
      end_long: row.end_long,
    }));
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export { listLiveBuses, getLiveBus, getLiveBusStops, updateLiveBus, listBusRouteMarkers };
