const Project = require("../models/Project");
const User = require("../models/User");
const Task = require("../models/Task");
const { isAdmin, isOwner } = require("../utils/projectPermissions");

const addMember = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { email, role = "MEMBER" } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "User email is required"
      });
    }

    if (!["ADMIN", "MEMBER"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid member role. Must be ADMIN or MEMBER"
      });
    }

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }

    if (!isAdmin(project, req.user._id)) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to add members"
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase()
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found with this email"
      });
    }

    if (isOwner(project, user._id)) {
      return res.status(400).json({
        success: false,
        message: "User is the project owner"
      });
    }

    const alreadyMember = project.members.some(
      (member) => (member.user?._id || member.user).toString() === user._id.toString()
    );

    if (alreadyMember) {
      return res.status(409).json({
        success: false,
        message: "User is already a project member"
      });
    }

    project.members.push({
      user: user._id,
      role,
      joinedAt: new Date()
    });

    await project.save();

    res.status(201).json({
      success: true,
      message: "Member added successfully",
      member: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        },
        role
      }
    });
  } catch (error) {
    console.error("Add member error:", error);
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid project ID format"
      });
    }
    res.status(500).json({
      success: false,
      message: error.message || "Failed to add member"
    });
  }
};

const getMembers = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.projectId,
      $or: [
        { owner: req.user._id },
        { "members.user": req.user._id }
      ]
    }).populate(
      "members.user",
      "name email"
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found or access denied"
      });
    }

    res.json({
      success: true,
      members: project.members
    });
  } catch (error) {
    console.error("Get members error:", error);
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid project ID format"
      });
    }
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch members"
    });
  }
};

const removeMember = async (req, res) => {
  try {
    const { projectId, userId } = req.params;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }

    if (!isAdmin(project, req.user._id)) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to remove members"
      });
    }

    if (isOwner(project, userId)) {
      return res.status(400).json({
        success: false,
        message: "Project owner cannot be removed"
      });
    }

    const memberIndex = project.members.findIndex(
      (member) => (member.user?._id || member.user).toString() === userId.toString()
    );

    if (memberIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Member not found in project"
      });
    }

    project.members.splice(memberIndex, 1);
    await project.save();

    // Unassign tasks that were assigned to this removed member in this project
    await Task.updateMany(
      { project: projectId, assignedTo: userId },
      { $set: { assignedTo: null } }
    );

    res.json({
      success: true,
      message: "Member removed successfully"
    });
  } catch (error) {
    console.error("Remove member error:", error);
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid ID format"
      });
    }
    res.status(500).json({
      success: false,
      message: error.message || "Failed to remove member"
    });
  }
};

module.exports = {
  addMember,
  getMembers,
  removeMember
};