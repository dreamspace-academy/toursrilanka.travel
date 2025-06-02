import express from "express";
import {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getFavorites,
  addFavorite,
  removeFavorite,
} from "../controllers/userController.js";

import { protect, authorize } from "../middleware/auth.js";
import advancedResults from "../middleware/advancedResults.js";
import User from "../models/User.js";

const router = express.Router();

router.use(protect);

// Favorites routes
router.get("/favorites", getFavorites);
router.post("/favorites/:experienceId", addFavorite);
router.delete("/favorites/:experienceId", removeFavorite);

// Admin only routes
router.use(authorize("admin"));

router.route("/").get(advancedResults(User), getUsers).post(createUser);

router.route("/:id").get(getUser).put(updateUser).delete(deleteUser);

export default router;
