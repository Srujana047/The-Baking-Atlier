import express from "express";
import { requireAuth, requireAdmin } from "../middleware/authMiddleware.js";
import * as adminController from "../controllers/adminController.js";
import { checkSchema } from "express-validator";
import { validateRequest } from "../middleware/validateRequest.js";
import { reportValidators } from "../validators/feedValidators.js";

const router = express.Router();

router.use(requireAuth, requireAdmin);

router.get("/analytics", adminController.getAnalytics);

router.get("/reports", adminController.getReports);
router.patch(
  "/reports/:reportId/status",
  checkSchema(reportValidators.updateReportStatus),
  validateRequest,
  adminController.updateReportStatus
);

router.get("/posts", adminController.getPosts);
router.delete("/posts/:postId", adminController.deletePost);

router.get("/comments", adminController.getComments);
router.delete("/comments/:commentId", adminController.deleteComment);

router.get("/recipes", adminController.getRecipes);
router.delete("/recipes/:recipeId", adminController.deleteRecipe);

router.get("/users", adminController.getUsers);
router.get("/logs", adminController.getLogs);

export default router;
