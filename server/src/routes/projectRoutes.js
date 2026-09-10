const express = require("express");
const {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
} = require("../controllers/projectController");
const protect = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");
const {
  createProjectSchema,
  updateProjectSchema
} = require("../validators/projectValidator");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

router.post(
  "/",
  protect,
  validate(createProjectSchema),
  asyncHandler(createProject)
);

router.get(
  "/",
  protect,
  asyncHandler(getProjects)
);

router.get(
  "/:id",
  protect,
  asyncHandler(getProject)
);

router.patch(
  "/:id",
  protect,
  validate(updateProjectSchema),
  asyncHandler(updateProject)
);

router.delete(
  "/:id",
  protect,
  asyncHandler(deleteProject)
);

module.exports = router;
