const Project = require("../models/Project");
const Task = require("../models/Task");
const { isAdmin, isOwner } = require("../utils/projectPermissions");

const createProject = async (req, res) => {
  try {
    const { name, description, startDate, dueDate } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Project name is required"
      });
    }

    const project = await Project.create({
      name,
      description: description || "",
      startDate: startDate || null,
      dueDate: dueDate || null,
      owner: req.user._id,
      members: [
        {
          user: req.user._id,
          role: "ADMIN"
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      project
    });
  } catch (error) {
    console.error("Create project error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create project"
    });
  }
};

const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [
        { owner: req.user._id },
        { "members.user": req.user._id }
      ]
    })
      .populate("owner", "name email")
      .populate("members.user", "name email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: projects.length,
      projects
    });
  } catch (error) {
    console.error("Get projects error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch projects"
    });
  }
};

const getProject = async (req, res) => {
  const project = await Project.findOne({
    _id: req.params.id,
    "members.user": req.user._id
  })
    .populate("owner", "name email")
    .populate("members.user", "name email");

  if (!project) {
    return res.status(404).json({
      success: false,
      message: "Project not found"
    });
  }

  res.status(200).json({
    success: true,
    project
  });
};

const updateProject = async (req, res) => {
  const {
    name,
    description,
    status,
    startDate,
    dueDate
  } = req.body;

  const project = await Project.findById(req.params.id);

  if (!project) {
    return res.status(404).json({
      success: false,
      message: "Project not found"
    });
  }

  const isProjectOwner =
    project.owner.toString() === req.user._id.toString();

  const membership = project.members.find(
    (member) =>
      member.user.toString() === req.user._id.toString()
  );

  const isProjectAdmin =
    isProjectOwner || membership?.role === "ADMIN";

  if (!isProjectAdmin) {
    return res.status(403).json({
      success: false,
      message: "Only project admins can update this project"
    });
  }

  const allowedUpdates = {};

  if (name !== undefined) {
    allowedUpdates.name = name;
  }

  if (description !== undefined) {
    allowedUpdates.description = description;
  }

  if (status !== undefined) {
    allowedUpdates.status = status;
  }

  if (startDate !== undefined) {
    allowedUpdates.startDate = startDate;
  }

  if (dueDate !== undefined) {
    allowedUpdates.dueDate = dueDate;
  }

  const updatedProject = await Project.findByIdAndUpdate(
    req.params.id,
    allowedUpdates,
    {
      new: true,
      runValidators: true
    }
  )
    .populate("owner", "name email")
    .populate("members.user", "name email");

  return res.status(200).json({
    success: true,
    project: updatedProject
  });
};

const deleteProject = async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    return res.status(404).json({
      success: false,
      message: "Project not found"
    });
  }

  if (
    project.owner.toString() !==
    req.user._id.toString()
  ) {
    return res.status(403).json({
      success: false,
      message: "Only the project owner can delete this project"
    });
  }

  await Project.findByIdAndDelete(req.params.id);

  await Task.deleteMany({
    project: project._id
  });

  return res.status(200).json({
    success: true,
    message: "Project deleted successfully"
  });
};

module.exports = {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject
};