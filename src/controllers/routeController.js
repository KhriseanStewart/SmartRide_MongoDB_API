import Route from "../models/Route.js";
import RouteStop from "../models/RouteStop.js";
import BusRoute from "../models/BusRoute.js";

async function listRoutes(req, res, next) {
  try {
    const rows = await Route.find({})
      .populate("start_location_id", "name lat long parish")
      .populate("end_location_id", "name lat long parish")
      .lean();

    res.json({ success: true, data: rows });
  } catch (err) {
    next(err);
  }
}

async function listRouteStops(req, res, next) {
  try {
    const rows = await RouteStop.find({ route_id: req.params.routeId })
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

    console.log(data);

    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

async function getRoutesV2(req, res, next) {
  try {
    const rows = await BusRoute.find({})
      .populate("assigned_driver", "driver_first_name telephone telephone_number")
      .lean();

    const data = rows.map((row) => ({
      route: row.route,
      created_at: row.created_at,
      drop_off_town: row.drop_off_town,
      assigned_driver: {
        driver_first_name: row.assigned_driver?.driver_first_name || "",
        telephone: row.assigned_driver?.telephone || "",
        telephone_number: row.assigned_driver?.telephone_number || "",
      },
      route_status: row.route_status,
      end_lat: row.end_lat,
      end_long: row.end_long,
      start_lat: row.start_lat,
      id: row.buses || [],
    }));

    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export { listRoutes, listRouteStops, getRoutesV2 };
