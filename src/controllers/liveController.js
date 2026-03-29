import Bus from "../models/Bus.js";
import BusRoute from "../models/BusRoute.js";

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

async function updateLiveBus(req, res, next) {
  try {
    const { current_lat, current_long, bearing } = req.body;
    const row = await Bus.findOneAndUpdate(
      { id: req.params.id },
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

export { listLiveBuses, updateLiveBus, listBusRouteMarkers };
