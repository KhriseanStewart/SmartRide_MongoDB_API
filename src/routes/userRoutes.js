import express from "express";
import multer from "multer";
import { requireUser } from "../middleware/requireUser.js";
import { validateBody } from "../middleware/validate.js";
import {
  upsertUser,
  getMe,
  addFavorite,
  removeFavorite,
  getFavoriteRouteCards,
  uploadMyProfileImage,
} from "../controllers/userController.js";
import { upsertUserSchema, favoriteSchema } from "../schemas/userSchema.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 4 * 1024 * 1024 } });

router.post("/", validateBody(upsertUserSchema), upsertUser);
router.get("/me", requireUser, getMe);
router.get("/me/favorites/live", requireUser, getFavoriteRouteCards);
router.post("/me/favorites", requireUser, validateBody(favoriteSchema), addFavorite);
router.delete("/me/favorites/:routeId", requireUser, removeFavorite);
router.post("/me/profile-image", requireUser, upload.single("image"), uploadMyProfileImage);

export default router;
