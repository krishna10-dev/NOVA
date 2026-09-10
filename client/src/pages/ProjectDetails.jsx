import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import {
  getProject,
} from "../services/projectService";

import {
  getProjectTasks,
  createTask,
  updateTask,
  deleteTask
} from "../services/taskService";

import ProjectMembers from "../components/ProjectMembers";
import KanbanBoard from "../components/KanbanBoard";
import EditTaskModal from "../components/EditTaskModal";

import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Loading from "../components/ui/Loading";
import ErrorMessage from "../components/ui/ErrorMessage";
import EmptyState from "../components/ui/EmptyState";

function ProjectDetails() {
  const { id } = useParams();
  const { user } = useAuth();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);

  const [loadingProject, setLoadingProject] =
    useState(true);

  const [loadingTasks, setLoadingTasks] =
    useState(true);

  const [creatingTask, setCreatingTask] =
    useState(false);

  const [error, setError] = useState("");
  const [taskError, setTaskError] = useState("");

  const [showCreateTask, setShowCreateTask] =
    useState(false);

  const [editingTask, setEditingTask] =
    useState(null);

  const [filters, setFilters] = useState({
    status: "",
    priority: "",
    assignedTo: ""
  });

  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    status: "TODO",
    priority: "MEDIUM",
    dueDate: "",
    assignedTo: ""
  });

  /* --------------------------------------------------
     Load project
  -------------------------------------------------- */

  const loadProject = async () => {
    try {
      setLoadingProject(true);
      setError("");

      const data = await getProject(id);

      if (!data?.success || !data?.project) {
        throw new Error("Project not found.");
      }

      setProject(data.project);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to load project."
      );
    } finally {
      setLoadingProject(false);
    }
  };

  /* --------------------------------------------------
     Load tasks
  -------------------------------------------------- */

  const loadTasks = async () => {
    try {
      setLoadingTasks(true);
      setTaskError("");

      const data = await getProjectTasks(
        id,
        {
          status: filters.status || undefined,
          priority: filters.priority || undefined,
          assignedTo:
            filters.assignedTo || undefined
        }
      );

      if (!data?.success) {
        throw new Error(
          "Failed to load project tasks."
        );
      }

      setTasks(data.tasks || []);
    } catch (error) {
      setTaskError(
        error.response?.data?.message ||
          error.message ||
          "Failed to load tasks."
      );
    } finally {
      setLoadingTasks(false);
    }
  };

  useEffect(() => {
    loadProject();
  }, [id]);

  useEffect(() => {
    loadTasks();
  }, [
    id,
    filters.status,
    filters.priority,
    filters.assignedTo
  ]);

  /* --------------------------------------------------
     Form handling
  -------------------------------------------------- */

  const handleTaskFormChange = (event) => {
    const { name, value } = event.target;

    setTaskForm((current) => ({
      ...current,
      [name]: value
    }));

    setTaskError("");
  };

  const resetTaskForm = () => {
    setTaskForm({
      title: "",
      description: "",
      status: "TODO",
      priority: "MEDIUM",
      dueDate: "",
      assignedTo: ""
    });

    setTaskError("");
  };

  /* --------------------------------------------------
     Create task
  -------------------------------------------------- */

  const handleCreateTask = async (event) => {
    event.preventDefault();

    setTaskError("");

    if (!taskForm.title.trim()) {
      setTaskError("Task title is required.");
      return;
    }

    if (taskForm.title.trim().length < 2) {
      setTaskError(
        "Task title must contain at least 2 characters."
      );
      return;
    }

    try {
      setCreatingTask(true);

      const data = await createTask(id, {
        title: taskForm.title.trim(),
        description: taskForm.description.trim(),
        status: taskForm.status,
        priority: taskForm.priority,
        dueDate:
          taskForm.dueDate || null,
        assignedTo:
          taskForm.assignedTo || null
      });

      if (!data?.success || !data?.task) {
        throw new Error(
          "Failed to create task."
        );
      }

      setTasks((current) => [
        data.task,
        ...current
      ]);

      resetTaskForm();
      setShowCreateTask(false);
    } catch (error) {
      setTaskError(
        error.response?.data?.message ||
          error.message ||
          "Failed to create task."
      );
    } finally {
      setCreatingTask(false);
    }
  };

  /* --------------------------------------------------
     Status update
  -------------------------------------------------- */

  const handleStatusChange = async (
    taskId,
    newStatus
  ) => {
    try {
      setTaskError("");

      const data = await updateTask(taskId, {
        status: newStatus
      });

      if (data?.success && data?.task) {
        setTasks((current) =>
          current.map((task) =>
            task._id === taskId
              ? {
                  ...task,
                  ...data.task
                }
              : task
          )
        );
      }
    } catch (error) {
      setTaskError(
        error.response?.data?.message ||
          "Failed to update task."
      );
    }
  };

  /* --------------------------------------------------
     Delete task
  -------------------------------------------------- */

  const handleDeleteTask = async (taskId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setTaskError("");

      await deleteTask(taskId);

      setTasks((current) =>
        current.filter(
          (task) => task._id !== taskId
        )
      );
    } catch (error) {
      setTaskError(
        error.response?.data?.message ||
          "Failed to delete task."
      );
    }
  };

  /* --------------------------------------------------
     Edit task
  -------------------------------------------------- */

  const handleEditTask = (task) => {
    setEditingTask(task);
  };

  const handleUpdateTask = async (
    taskId,
    taskData
  ) => {
    try {
      setTaskError("");

      const data = await updateTask(
        taskId,
        taskData
      );

      if (data?.success && data?.task) {
        setTasks((current) =>
          current.map((task) =>
            task._id === taskId
              ? {
                  ...task,
                  ...data.task
                }
              : task
          )
        );

        setEditingTask(null);
      }
    } catch (error) {
      setTaskError(
        error.response?.data?.message ||
          "Failed to update task."
      );

      throw error;
    }
  };

  /* --------------------------------------------------
     Filters
  -------------------------------------------------- */

  const handleFilterChange = (event) => {
    const { name, value } = event.target;

    setFilters((current) => ({
      ...current,
      [name]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      status: "",
      priority: "",
      assignedTo: ""
    });
  };

  /* --------------------------------------------------
     Task statistics
  -------------------------------------------------- */

  const taskStats = useMemo(() => {
    return {
      total: tasks.length,

      todo: tasks.filter(
        (task) => task.status === "TODO"
      ).length,

      inProgress: tasks.filter(
        (task) =>
          task.status === "IN_PROGRESS"
      ).length,

      review: tasks.filter(
        (task) => task.status === "REVIEW"
      ).length,

      done: tasks.filter(
        (task) => task.status === "DONE"
      ).length
    };
  }, [tasks]);

  const completionPercentage =
    taskStats.total === 0
      ? 0
      : Math.round(
          (taskStats.done /
            taskStats.total) *
            100
        );

  /* --------------------------------------------------
     Helpers
  -------------------------------------------------- */

  const formatDate = (date) => {
    if (!date) {
      return "Not set";
    }

    return new Date(date).toLocaleDateString(
      undefined,
      {
        day: "numeric",
        month: "short",
        year: "numeric"
      }
    );
  };

  const getProjectStatusVariant = (
    status
  ) => {
    if (status === "COMPLETED") {
      return "success";
    }

    if (status === "ARCHIVED") {
      return "default";
    }

    return "primary";
  };

  if (loadingProject) {
    return (
      <Loading text="Loading project..." />
    );
  }

  if (error || !project) {
    return (
      <div className="space-y-6">
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-slate-900"
        >
          ← Back to Projects
        </Link>

        <ErrorMessage
          message={
            error || "Project not found."
          }
          onRetry={loadProject}
        />
      </div>
    );
  }

  const members =
    project.members || [];

  return (
    <div className="space-y-6">
      {/* ------------------------------------------------
          Breadcrumb
      ------------------------------------------------ */}

      <Link
        to="/projects"
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-slate-900"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="h-4 w-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 18l-6-6 6-6"
          />
        </svg>

        Back to Projects
      </Link>

      {/* ------------------------------------------------
          Project hero
      ------------------------------------------------ */}

      <Card className="overflow-hidden p-0">
        <div className="border-b border-slate-100 bg-gradient-to-br from-indigo-50 via-white to-white p-6 sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex min-w-0 items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-xl font-bold text-white shadow-sm">
                {project.name
                  ?.charAt(0)
                  ?.toUpperCase() || "P"}
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="break-words text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                    {project.name}
                  </h1>

                  <Badge
                    variant={getProjectStatusVariant(
                      project.status
                    )}
                  >
                    {project.status}
                  </Badge>
                </div>

                <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500">
                  {project.description ||
                    "No description has been added for this project."}
                </p>
              </div>
            </div>

            <div className="shrink-0">
              <Button
                onClick={() =>
                  setShowCreateTask(
                    (current) => !current
                  )
                }
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-4 w-4"
                >
                  <path
                    strokeLinecap="round"
                    d="M12 5v14M5 12h14"
                  />
                </svg>

                {showCreateTask
                  ? "Close"
                  : "Add Task"}
              </Button>
            </div>
          </div>

          {/* Project metadata */}

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-200/80 bg-white/80 p-4">
              <p className="text-xs font-medium text-slate-400">
                Owner
              </p>

              <p className="mt-1 truncate text-sm font-semibold text-slate-800">
                {project.owner?.name ||
                  "Unknown"}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200/80 bg-white/80 p-4">
              <p className="text-xs font-medium text-slate-400">
                Start date
              </p>

              <p className="mt-1 text-sm font-semibold text-slate-800">
                {formatDate(
                  project.startDate
                )}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200/80 bg-white/80 p-4">
              <p className="text-xs font-medium text-slate-400">
                Due date
              </p>

              <p className="mt-1 text-sm font-semibold text-slate-800">
                {formatDate(
                  project.dueDate
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Task summary */}

        <div className="grid grid-cols-2 divide-x divide-slate-100 sm:grid-cols-5">
          <div className="p-4 sm:p-5">
            <p className="text-xs text-slate-400">
              Total
            </p>

            <p className="mt-1 text-xl font-bold text-slate-900">
              {taskStats.total}
            </p>
          </div>

          <div className="p-4 sm:p-5">
            <p className="text-xs text-slate-400">
              Todo
            </p>

            <p className="mt-1 text-xl font-bold text-slate-700">
              {taskStats.todo}
            </p>
          </div>

          <div className="p-4 sm:p-5">
            <p className="text-xs text-slate-400">
              In Progress
            </p>

            <p className="mt-1 text-xl font-bold text-blue-600">
              {taskStats.inProgress}
            </p>
          </div>

          <div className="p-4 sm:p-5">
            <p className="text-xs text-slate-400">
              Review
            </p>

            <p className="mt-1 text-xl font-bold text-amber-600">
              {taskStats.review}
            </p>
          </div>

          <div className="col-span-2 border-t border-slate-100 p-4 sm:col-span-1 sm:border-t-0 sm:p-5">
            <p className="text-xs text-slate-400">
              Completed
            </p>

            <p className="mt-1 text-xl font-bold text-emerald-600">
              {taskStats.done}
            </p>
          </div>
        </div>
      </Card>

      {/* ------------------------------------------------
          Create task
      ------------------------------------------------ */}

      {showCreateTask && (
        <Card>
          <div className="mb-6">
            <p className="text-sm font-semibold text-indigo-600">
              New task
            </p>

            <h2 className="mt-1 text-lg font-bold text-slate-900">
              Add a task to this project
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Define the task and assign it to a project member.
            </p>
          </div>

          {taskError && (
            <div className="mb-5">
              <ErrorMessage
                message={taskError}
              />
            </div>
          )}

          <form
            onSubmit={handleCreateTask}
            className="space-y-5"
          >
            <Input
              id="task-title"
              name="title"
              label="Task title"
              placeholder="e.g. Design the landing page"
              value={taskForm.title}
              onChange={handleTaskFormChange}
              maxLength={200}
            />

            <div className="space-y-1.5">
              <label
                htmlFor="task-description"
                className="block text-sm font-semibold text-slate-700"
              >
                Description
              </label>

              <textarea
                id="task-description"
                name="description"
                value={
                  taskForm.description
                }
                onChange={
                  handleTaskFormChange
                }
                rows={4}
                maxLength={2000}
                placeholder="Add useful details about this task..."
                className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/10"
              />

              <div className="text-right text-xs text-slate-400">
                {taskForm.description.length}/2000
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <Select
                id="task-status"
                name="status"
                label="Status"
                value={taskForm.status}
                onChange={handleTaskFormChange}
              >
                <option value="TODO">
                  Todo
                </option>

                <option value="IN_PROGRESS">
                  In Progress
                </option>

                <option value="REVIEW">
                  Review
                </option>

                <option value="DONE">
                  Done
                </option>
              </Select>

              <Select
                id="task-priority"
                name="priority"
                label="Priority"
                value={taskForm.priority}
                onChange={handleTaskFormChange}
              >
                <option value="LOW">
                  Low
                </option>

                <option value="MEDIUM">
                  Medium
                </option>

                <option value="HIGH">
                  High
                </option>

                <option value="URGENT">
                  Urgent
                </option>
              </Select>

              <Input
                id="task-due-date"
                name="dueDate"
                type="date"
                label="Due date"
                value={taskForm.dueDate}
                onChange={handleTaskFormChange}
              />

              <Select
                id="task-assigned-to"
                name="assignedTo"
                label="Assign to"
                value={
                  taskForm.assignedTo
                }
                onChange={handleTaskFormChange}
              >
                <option value="">
                  Unassigned
                </option>

                {members.map(
                  (member) => (
                    <option
                      key={
                        member.user?._id
                      }
                      value={
                        member.user?._id
                      }
                    >
                      {member.user?.name ||
                        "Unknown user"}
                    </option>
                  )
                )}
              </Select>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setShowCreateTask(false);
                  resetTaskForm();
                }}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                loading={creatingTask}
              >
                Create Task
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* ------------------------------------------------
          Project content
      ------------------------------------------------ */}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        {/* Tasks */}

        <div className="min-w-0 space-y-5">
          {/* Task toolbar */}

          <Card>
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="font-semibold text-slate-900">
                    Tasks
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Track work across this project.
                  </p>
                </div>

                <div className="text-sm text-slate-500">
                  <span className="font-semibold text-slate-900">
                    {completionPercentage}%
                  </span>{" "}
                  complete
                </div>
              </div>

              {/* Progress */}

              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-indigo-600 transition-all duration-500"
                  style={{
                    width: `${completionPercentage}%`
                  }}
                />
              </div>

              {/* Filters */}

              <div className="grid gap-3 border-t border-slate-100 pt-5 sm:grid-cols-3">
                <Select
                  id="filter-status"
                  name="status"
                  value={filters.status}
                  onChange={
                    handleFilterChange
                  }
                >
                  <option value="">
                    All statuses
                  </option>

                  <option value="TODO">
                    Todo
                  </option>

                  <option value="IN_PROGRESS">
                    In Progress
                  </option>

                  <option value="REVIEW">
                    Review
                  </option>

                  <option value="DONE">
                    Done
                  </option>
                </Select>

                <Select
                  id="filter-priority"
                  name="priority"
                  value={
                    filters.priority
                  }
                  onChange={
                    handleFilterChange
                  }
                >
                  <option value="">
                    All priorities
                  </option>

                  <option value="LOW">
                    Low
                  </option>

                  <option value="MEDIUM">
                    Medium
                  </option>

                  <option value="HIGH">
                    High
                  </option>

                  <option value="URGENT">
                    Urgent
                  </option>
                </Select>

                <Select
                  id="filter-assigned"
                  name="assignedTo"
                  value={
                    filters.assignedTo
                  }
                  onChange={
                    handleFilterChange
                  }
                >
                  <option value="">
                    All members
                  </option>

                  {members.map(
                    (member) => (
                      <option
                        key={
                          member.user?._id
                        }
                        value={
                          member.user?._id
                        }
                      >
                        {member.user?.name ||
                          "Unknown"}
                      </option>
                    )
                  )}
                </Select>
              </div>

              {(filters.status ||
                filters.priority ||
                filters.assignedTo) && (
                <div>
                  <button
                    type="button"
                    onClick={
                      clearFilters
                    }
                    className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </div>
          </Card>

          {/* Task error */}

          {taskError && (
            <ErrorMessage
              message={taskError}
              onRetry={loadTasks}
            />
          )}

          {/* Board */}

          {loadingTasks ? (
            <Card>
              <Loading text="Loading tasks..." />
            </Card>
          ) : tasks.length === 0 ? (
            <EmptyState
              title="No tasks found"
              description={
                filters.status ||
                filters.priority ||
                filters.assignedTo
                  ? "Try changing your filters to find other tasks."
                  : "Create your first task to start tracking work in this project."
              }
              action={
                <Button
                  onClick={() =>
                    setShowCreateTask(
                      true
                    )
                  }
                >
                  Add Task
                </Button>
              }
            />
          ) : (
            <KanbanBoard
              tasks={tasks}
              onStatusChange={
                handleStatusChange
              }
              onDelete={
                handleDeleteTask
              }
              onEdit={
                handleEditTask
              }
            />
          )}
        </div>

        {/* Sidebar */}

        <div className="space-y-6">
          {/* Members */}

          <ProjectMembers
            projectId={id}
            projectOwner={
              project.owner
            }
            currentUser={user}
          />

          {/* Project details */}

          <Card>
            <div className="mb-5">
              <h2 className="font-semibold text-slate-900">
                Project details
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Key information about this project.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-xs font-medium text-slate-400">
                  Created
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-700">
                  {formatDate(
                    project.createdAt
                  )}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium text-slate-400">
                  Last updated
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-700">
                  {formatDate(
                    project.updatedAt
                  )}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium text-slate-400">
                  Team members
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-700">
                  {members.length}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium text-slate-400">
                  Tasks
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-700">
                  {taskStats.total}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Edit task modal */}

      {editingTask && (
        <EditTaskModal
          task={editingTask}
          members={members}
          onClose={() =>
            setEditingTask(null)
          }
          onUpdate={
            handleUpdateTask
          }
        />
      )}
    </div>
  );
}

export default ProjectDetails;