const Project = require("../models/Project");
const Task = require("../models/Task");

const getDashboardStats = async (req, res) => {
  // Find projects where the current user is a member
  const projects = await Project.find({
    "members.user": req.user._id
  }).sort({
    createdAt: -1
  });

  const projectIds = projects.map(
    (project) => project._id
  );

  // Find tasks belonging to the user's projects
  const tasks = await Task.find({
    project: { $in: projectIds }
  });

  // ==========================================
  // PROJECT STATISTICS
  // ==========================================

  const totalProjects = projects.length;

  const activeProjects = projects.filter(
    (project) => project.status === "ACTIVE"
  ).length;

  const completedProjects = projects.filter(
    (project) => project.status === "COMPLETED"
  ).length;

  const archivedProjects = projects.filter(
    (project) => project.status === "ARCHIVED"
  ).length;

  // ==========================================
  // TASK STATISTICS
  // ==========================================

  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(
    (task) => task.status === "DONE"
  ).length;

  const pendingTasks = tasks.filter(
    (task) => task.status !== "DONE"
  ).length;

  const highPriorityTasks = tasks.filter(
    (task) =>
      task.priority === "HIGH" ||
      task.priority === "URGENT"
  ).length;

  const todoTasks = tasks.filter(
    (task) => task.status === "TODO"
  ).length;

  const inProgressTasks = tasks.filter(
    (task) => task.status === "IN_PROGRESS"
  ).length;

  const reviewTasks = tasks.filter(
    (task) => task.status === "REVIEW"
  ).length;

  // ==========================================
  // TASK COMPLETION PERCENTAGE
  // ==========================================

  const completionPercentage =
    totalTasks === 0
      ? 0
      : Math.round(
          (completedTasks / totalTasks) * 100
        );

  // ==========================================
  // RECENT PROJECTS
  // ==========================================

  const recentProjects = projects
    .slice(0, 5)
    .map((project) => ({
      _id: project._id,
      name: project.name,
      status: project.status,
      createdAt: project.createdAt
    }));

  // ==========================================
  // RESPONSE
  // ==========================================

  return res.status(200).json({
    success: true,

    stats: {
      projects: {
        total: totalProjects,
        active: activeProjects,
        completed: completedProjects,
        archived: archivedProjects
      },

      tasks: {
        total: totalTasks,
        completed: completedTasks,
        pending: pendingTasks,
        highPriority: highPriorityTasks,
        todo: todoTasks,
        inProgress: inProgressTasks,
        review: reviewTasks,
        completionPercentage
      },

      recentProjects
    }
  });
};

module.exports = {
  getDashboardStats
};