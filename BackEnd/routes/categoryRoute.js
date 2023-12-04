import express from "express";
import categoryUpload from "../config/categoryUpload.js";
import {
  createCategoryCtrl,
  getCategoryCtrl,
  getSingleCategoryCtrl,
  updateCategoryCtrl,
  deleteProductCtrl,
} from "../controllers/categoriesCtrl.js";
import { isLoggedIn } from "../middleware/isLoggedIn.js";

const categoryRoutes = express.Router();

categoryRoutes.post(
  "/",
  isLoggedIn,
  categoryUpload.single("file"),
  createCategoryCtrl
);
categoryRoutes.get("/", getCategoryCtrl);
categoryRoutes.get("/:id", getSingleCategoryCtrl);
categoryRoutes.put("/:id", isLoggedIn, updateCategoryCtrl);
categoryRoutes.delete("/:id/delete", isLoggedIn, deleteProductCtrl);

export default categoryRoutes;
