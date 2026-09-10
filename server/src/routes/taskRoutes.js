const express = require("express");
const {
  createTask,
  getProjectTasks,
  getTask,
  updateTask,
  deleteTask
} = require("../controllers/taskController");
const protect = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");
const {
  createTaskSchema,
  updateTaskSchema
} = require("../validators/taskValidator");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

// Project-scoped task endpoints: /api/projects/:projectId/tasks
router.post(
  "/:projectId/tasks",
  protect,
  validate(createTaskSchema),
  asyncHandler(createTask)
);

router.get(
  "/:projectId/tasks",
  protect,
  asyncHandler(getProjectTasks)
);

// Individual task endpoints (supports both /api/projects/tasks/:id and /api/tasks/:id)
router.get(
  ["/tasks/:id", "/:id"],
  protect,
  asyncHandler(getTask)
);

router.patch(
  ["/tasks/:id", "/:id"],
  protect,
  validate(updateTaskSchema),
  asyncHandler(updateTask)
);

router.delete(
  ["/tasks/:id", "/:id"],
  protect,
  asyncHandler(deleteTask)
);

module.exports = router;