import User from "../models/User.js";
import BusRoute from "../models/BusRoute.js";
import { uploadProfileImage } from "../services/r2Service.js";

async function upsertUser(req, res, next) {
  try {
    const payload = req.body;
    const user = await User.findByIdAndUpdate(
      payload.id,
      {
        _id: payload.id,
        email: payload.email,
        full_name: payload.full_name,
        smart_card_num: payload.smart_card_num || null,
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
}

async function getMe(req, res, next) {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
}

async function addFavorite(req, res, next) {
  try {
    const { routeId } = req.body;
    const user = await User.findByIdAndUpdate(
      req.userId,
      { $addToSet: { fav_routes: routeId } },
      { new: true }
    );
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
}

async function removeFavorite(req, res, next) {
  try {
    const { routeId } = req.params;
    const user = await User.findByIdAndUpdate(
      req.userId,
      { $pull: { fav_routes: routeId } },
      { new: true }
    );
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
}

async function getFavoriteRouteCards(req, res, next) {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const rows = await BusRoute.find({ route: { $in: user.fav_routes } })
      .populate("assigned_driver")
      .lean();

    const data = rows.map((row) => ({
      route: row.route,
      created_at: row.created_at,
      drop_off_town: row.drop_off_town,
      route_status: row.route_status,
      start_lat: row.start_lat,
      end_lat: row.end_lat,
      end_long: row.end_long,
      assigned_driver: {
        driver_first_name: row.assigned_driver?.driver_first_name || "",
        telephone: row.assigned_driver?.telephone || "",
        telephone_number: row.assigned_driver?.telephone_number || "",
      },
      id: row.buses || [],
    }));

    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

async function uploadMyProfileImage(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Image file is required" });
    }

    const profileUrl = await uploadProfileImage({
      userId: req.userId,
      buffer: req.file.buffer,
      contentType: req.file.mimetype,
    });

    const user = await User.findByIdAndUpdate(
      req.userId,
      { profile_url: profileUrl },
      { new: true }
    );

    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
}

export {
  upsertUser,
  getMe,
  addFavorite,
  removeFavorite,
  getFavoriteRouteCards,
  uploadMyProfileImage,
};
