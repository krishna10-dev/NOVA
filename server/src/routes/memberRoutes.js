const express = require("express");
const {
  addMember,
  getMembers,
  removeMember
} = require("../controllers/memberController");
const protect = require("../middleware/authMiddleware");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

router.post(
  "/:projectId/members",
  protect,
  asyncHandler(addMember)
);

router.get(
  "/:projectId/members",
  protect,
  asyncHandler(getMembers)
);

router.delete(
  "/:projectId/members/:userId",
  protect,
  asyncHandler(removeMember)
);

module.exports = router;