const Task = require("../models/Task");
const Project = require("../models/Project");
const { isMember, isAdmin } = require("../utils/projectPermissions");

const createTask = async (req, res) => {
  try {
    const { projectId } = req.params;

    const {
      title,
      description,
      assignedTo,
      status,
      priority,
      dueDate
    } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Task title is required"
      });
    }

    const project = await Project.findOne({
      _id: projectId,
      $or: [
        { owner: req.user._id },
        { "members.user": req.user._id }
      ]
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found or access denied"
      });
    }

    if (assignedTo) {
      const isAssignedMember = isMember(project, assignedTo);

      if (!isAssignedMember) {
        return res.status(400).json({
          success: false,
          message: "Task can only be assigned to a project member or owner"
        });
      }
    }

    const task = await Task.create({
      title,
      description: description || "",
      project: projectId,
      assignedTo: assignedTo || null,
      createdBy: req.user._id,
      status: status || "TODO",
      priority: priority || "MEDIUM",
      dueDate: dueDate || null
    });

    const populatedTask = await Task.findById(task._id)
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email");

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      task: populatedTask
    });
  } catch (error) {
    console.error("Create task error:", error);
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid ID format"
      });
    }
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create task"
    });
  }
};

const getProjectTasks = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { status, priority, assignedTo } = req.query;

    const project = await Project.findOne({
      _id: projectId,
      $or: [
        { owner: req.user._id },
        { "members.user": req.user._id }
      ]
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found or access denied"
      });
    }

    const filter = {
      project: projectId
    };

    if (status) {
      filter.status = status;
    }

    if (priority) {
      filter.priority = priority;
    }

    if (assignedTo) {
      filter.assignedTo = assignedTo;
    }

    const tasks = await Task.find(filter)
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email")
      .sort({
        createdAt: -1
      });

    res.json({
      success: true,
      count: tasks.length,
      tasks
    });
  } catch (error) {
    console.error("Get project tasks error:", error);
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid ID format"
      });
    }
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch tasks"
    });
  }
};

const getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email")
      .populate("project", "name owner");

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found"
      });
    }

    const project = await Project.findOne({
      _id: task.project._id || task.project,
      $or: [
        { owner: req.user._id },
        { "members.user": req.user._id }
      ]
    });

    if (!project) {
      return res.status(403).json({
        success: false,
        message: "Access denied"
      });
    }

    res.json({
      success: true,
      task
    });
  } catch (error) {
    console.error("Get task error:", error);
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID format"
      });
    }
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch task"
    });
  }
};

const updateTask = async (req, res) => {
  const { title, description, status, priority, dueDate, assignedTo } =
    req.body;

  const task = await Task.findById(req.params.id);

  if (!task) {
    return res.status(404).json({
      success: false,
      message: "Task not found"
    });
  }

  const project = await Project.findById(task.project);

  if (!project) {
    return res.status(404).json({
      success: false,
      message: "Project not found"
    });
  }

  // Check whether current user belongs to the project
  const membership = project.members.find(
    (member) =>
      member.user.toString() === req.user._id.toString()
  );

  if (!membership) {
    return res.status(403).json({
      success: false,
      message: "You are not a member of this project"
    });
  }

  // Only allow specific fields to be updated
  const allowedUpdates = {};

  if (title !== undefined) {
    allowedUpdates.title = title;
  }

  if (description !== undefined) {
    allowedUpdates.description = description;
  }

  if (status !== undefined) {
    allowedUpdates.status = status;
  }

  if (priority !== undefined) {
    allowedUpdates.priority = priority;
  }

  if (dueDate !== undefined) {
    allowedUpdates.dueDate = dueDate;
  }

  if (assignedTo !== undefined) {
    // Allow null to remove assignment
    if (assignedTo === null || assignedTo === "") {
      allowedUpdates.assignedTo = null;
    } else {
      const assignedMember = project.members.find(
        (member) =>
          member.user.toString() === assignedTo.toString()
      );

      if (!assignedMember) {
        return res.status(400).json({
          success: false,
          message:
            "Assigned user must be a member of this project"
        });
      }

      allowedUpdates.assignedTo = assignedTo;
    }
  }

  const updatedTask = await Task.findByIdAndUpdate(
    req.params.id,
    allowedUpdates,
    {
      new: true,
      runValidators: true
    }
  )
    .populate("assignedTo", "name email")
    .populate("createdBy", "name email");

  return res.status(200).json({
    success: true,
    task: updatedTask
  });
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found"
      });
    }

    const project = await Project.findOne({
      _id: task.project,
      $or: [
        { owner: req.user._id },
        { "members.user": req.user._id }
      ]
    });

    if (!project) {
      return res.status(403).json({
        success: false,
        message: "Access denied"
      });
    }

    const isCreator = task.createdBy.toString() === req.user._id.toString();
    const hasAdminAccess = isAdmin(project, req.user._id);

    if (!isCreator && !hasAdminAccess) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to delete this task"
      });
    }

    await task.deleteOne();

    res.json({
      success: true,
      message: "Task deleted successfully"
    });
  } catch (error) {
    console.error("Delete task error:", error);
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID format"
      });
    }
    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete task"
    });
  }
};

module.exports = {
  createTask,
  getProjectTasks,
  getTask,
  updateTask,
  deleteTask
};