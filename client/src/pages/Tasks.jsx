import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { getProjects } from "../services/projectService";
import {
  getProjectTasks,
  updateTask,
  deleteTask
} from "../services/taskService";

import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import Loading from "../components/ui/Loading";
import ErrorMessage from "../components/ui/ErrorMessage";
import EmptyState from "../components/ui/EmptyState";

function Tasks() {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filters, setFilters] = useState({
    search: "",
    status: "",
    priority: "",
    project: ""
  });

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError("");

      const projectData = await getProjects();

      if (!projectData?.success) {
        throw new Error(
          "Failed to load projects."
        );
      }

      const projectList =
        projectData.projects || [];

      setProjects(projectList);

      const taskResponses =
        await Promise.all(
          projectList.map(
            async (project) => {
              try {
                const response =
                  await getProjectTasks(
                    project._id
                  );

                if (!response?.success) {
                  return [];
                }

                return (
                  response.tasks || []
                ).map((task) => ({
                  ...task,
                  projectInfo: {
                    _id: project._id,
                    name: project.name
                  }
                }));
              } catch {
                return [];
              }
            }
          )
        );

      setTasks(
        taskResponses.flat()
      );
    } catch (error) {
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to load tasks."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

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
      search: "",
      status: "",
      priority: "",
      project: ""
    });
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const search =
        filters.search
          .trim()
          .toLowerCase();

      const matchesSearch =
        !search ||
        task.title
          ?.toLowerCase()
          .includes(search) ||
        task.description
          ?.toLowerCase()
          .includes(search) ||
        task.assignedTo?.name
          ?.toLowerCase()
          .includes(search);

      const matchesStatus =
        !filters.status ||
        task.status ===
          filters.status;

      const matchesPriority =
        !filters.priority ||
        task.priority ===
          filters.priority;

      const matchesProject =
        !filters.project ||
        task.projectInfo?._id ===
          filters.project;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPriority &&
        matchesProject
      );
    });
  }, [tasks, filters]);

  /* --------------------------------------------------
     Status
  -------------------------------------------------- */

  const handleStatusChange = async (
    taskId,
    newStatus
  ) => {
    try {
      setError("");

      const data =
        await updateTask(
          taskId,
          {
            status: newStatus
          }
        );

      if (
        data?.success &&
        data?.task
      ) {
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
      setError(
        error.response?.data
          ?.message ||
          "Failed to update task."
      );
    }
  };

  /* --------------------------------------------------
     Delete
  -------------------------------------------------- */

  const handleDeleteTask = async (
    taskId
  ) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this task?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await deleteTask(taskId);

      setTasks((current) =>
        current.filter(
          (task) =>
            task._id !== taskId
        )
      );
    } catch (error) {
      setError(
        error.response?.data
          ?.message ||
          "Failed to delete task."
      );
    }
  };

  /* --------------------------------------------------
     Helpers
  -------------------------------------------------- */

  const getPriorityVariant = (
    priority
  ) => {
    switch (priority) {
      case "URGENT":
        return "danger";

      case "HIGH":
        return "warning";

      case "MEDIUM":
        return "primary";

      default:
        return "default";
    }
  };

  const getStatusVariant = (
    status
  ) => {
    switch (status) {
      case "DONE":
        return "success";

      case "IN_PROGRESS":
        return "primary";

      case "REVIEW":
        return "warning";

      default:
        return "default";
    }
  };

  const getStatusLabel = (
    status
  ) => {
    switch (status) {
      case "IN_PROGRESS":
        return "In Progress";

      case "TODO":
        return "Todo";

      case "REVIEW":
        return "Review";

      case "DONE":
        return "Done";

      default:
        return status;
    }
  };

  const getPriorityLabel = (
    priority
  ) => {
    switch (priority) {
      case "URGENT":
        return "Urgent";

      case "HIGH":
        return "High";

      case "MEDIUM":
        return "Medium";

      case "LOW":
        return "Low";

      default:
        return priority;
    }
  };

  const formatDate = (date) => {
    if (!date) {
      return "—";
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

  const isOverdue = (task) => {
    if (
      !task.dueDate ||
      task.status === "DONE"
    ) {
      return false;
    }

    const dueDate =
      new Date(task.dueDate);

    dueDate.setHours(
      23,
      59,
      59,
      999
    );

    return dueDate < new Date();
  };

  /* --------------------------------------------------
     Loading
  -------------------------------------------------- */

  if (loading) {
    return (
      <Loading text="Loading your tasks..." />
    );
  }

  /* --------------------------------------------------
     Render
  -------------------------------------------------- */

  return (
    <div className="space-y-6">
      {/* Header */}

      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-indigo-600">
            Workspace
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Tasks
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            View and manage work across all your projects.
          </p>
        </div>

        <Link to="/projects">
          <Button>
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

            Go to Projects
          </Button>
        </Link>
      </section>

      {/* Error */}

      {error && (
        <ErrorMessage
          message={error}
          onRetry={loadTasks}
        />
      )}

      {/* Summary cards */}

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Card>
          <p className="text-xs font-medium text-slate-500">
            Total
          </p>

          <p className="mt-1 text-2xl font-bold text-slate-900">
            {tasks.length}
          </p>
        </Card>

        <Card>
          <p className="text-xs font-medium text-slate-500">
            In Progress
          </p>

          <p className="mt-1 text-2xl font-bold text-blue-600">
            {
              tasks.filter(
                (task) =>
                  task.status ===
                  "IN_PROGRESS"
              ).length
            }
          </p>
        </Card>

        <Card>
          <p className="text-xs font-medium text-slate-500">
            Completed
          </p>

          <p className="mt-1 text-2xl font-bold text-emerald-600">
            {
              tasks.filter(
                (task) =>
                  task.status ===
                  "DONE"
              ).length
            }
          </p>
        </Card>

        <Card>
          <p className="text-xs font-medium text-slate-500">
            High Priority
          </p>

          <p className="mt-1 text-2xl font-bold text-red-600">
            {
              tasks.filter(
                (task) =>
                  task.priority ===
                    "HIGH" ||
                  task.priority ===
                    "URGENT"
              ).length
            }
          </p>
        </Card>
      </section>

      {/* Filters */}

      <Card>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-semibold text-slate-900">
                Filter tasks
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Search by task, description or assignee.
              </p>
            </div>

            <button
              type="button"
              onClick={clearFilters}
              className="w-fit text-sm font-semibold text-indigo-600 hover:text-indigo-700"
            >
              Clear filters
            </button>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <Input
              id="task-search"
              name="search"
              label="Search"
              placeholder="Search tasks..."
              value={filters.search}
              onChange={
                handleFilterChange
              }
            />

            <Select
              id="task-status-filter"
              name="status"
              label="Status"
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
              id="task-priority-filter"
              name="priority"
              label="Priority"
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
              id="task-project-filter"
              name="project"
              label="Project"
              value={
                filters.project
              }
              onChange={
                handleFilterChange
              }
            >
              <option value="">
                All projects
              </option>

              {projects.map(
                (project) => (
                  <option
                    key={project._id}
                    value={
                      project._id
                    }
                  >
                    {project.name}
                  </option>
                )
              )}
            </Select>
          </div>
        </div>
      </Card>

      {/* Results */}

      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">
            Showing{" "}
            <span className="font-semibold text-slate-900">
              {filteredTasks.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-slate-900">
              {tasks.length}
            </span>{" "}
            tasks
          </p>
        </div>
      </div>

      {/* Empty state */}

      {filteredTasks.length === 0 ? (
        <EmptyState
          title={
            tasks.length === 0
              ? "No tasks yet"
              : "No matching tasks"
          }
          description={
            tasks.length === 0
              ? "Create a task from one of your projects to start tracking work."
              : "Try changing your search or filters."
          }
          action={
            tasks.length === 0 ? (
              <Link to="/projects">
                <Button>
                  View Projects
                </Button>
              </Link>
            ) : (
              <Button
                variant="secondary"
                onClick={
                  clearFilters
                }
              >
                Clear Filters
              </Button>
            )
          }
        />
      ) : (
        <>
          {/* Desktop table */}

          <Card
            padding={false}
            className="hidden overflow-hidden lg:block"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-slate-100 bg-slate-50">
                  <tr>
                    <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Task
                    </th>

                    <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Project
                    </th>

                    <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Status
                    </th>

                    <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Priority
                    </th>

                    <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Assigned
                    </th>

                    <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Due
                    </th>

                    <th className="px-5 py-3 text-right text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredTasks.map(
                    (task) => (
                      <tr
                        key={
                          task._id
                        }
                        className="transition hover:bg-slate-50"
                      >
                        {/* Task */}

                        <td className="px-5 py-4">
                          <div className="max-w-xs">
                            <p className="truncate text-sm font-semibold text-slate-900">
                              {
                                task.title
                              }
                            </p>

                            {task.description && (
                              <p className="mt-1 truncate text-xs text-slate-400">
                                {
                                  task.description
                                }
                              </p>
                            )}
                          </div>
                        </td>

                        {/* Project */}

                        <td className="px-5 py-4">
                          <Link
                            to={`/projects/${task.projectInfo?._id}`}
                            className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                          >
                            {
                              task
                                .projectInfo
                                ?.name
                            }
                          </Link>
                        </td>

                        {/* Status */}

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={getStatusVariant(
                                task.status
                              )}
                            >
                              {getStatusLabel(
                                task.status
                              )}
                            </Badge>

                            <select
                              value={
                                task.status
                              }
                              onChange={(
                                event
                              ) =>
                                handleStatusChange(
                                  task._id,
                                  event
                                    .target
                                    .value
                                )
                              }
                              className="h-7 rounded-lg border border-slate-200 bg-white px-1 text-xs text-slate-500"
                              aria-label="Change task status"
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
                            </select>
                          </div>
                        </td>

                        {/* Priority */}

                        <td className="px-5 py-4">
                          <Badge
                            variant={getPriorityVariant(
                              task.priority
                            )}
                          >
                            {getPriorityLabel(
                              task.priority
                            )}
                          </Badge>
                        </td>

                        {/* Assignee */}

                        <td className="px-5 py-4">
                          {task.assignedTo ? (
                            <div className="flex items-center gap-2">
                              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-[10px] font-bold text-indigo-700">
                                {task
                                  .assignedTo
                                  .name
                                  ?.charAt(
                                    0
                                  )
                                  ?.toUpperCase() ||
                                  "U"}
                              </div>

                              <span className="max-w-[120px] truncate text-sm text-slate-600">
                                {
                                  task
                                    .assignedTo
                                    .name
                                }
                              </span>
                            </div>
                          ) : (
                            <span className="text-sm text-slate-400">
                              Unassigned
                            </span>
                          )}
                        </td>

                        {/* Due */}

                        <td className="px-5 py-4">
                          {task.dueDate ? (
                            <span
                              className={`text-sm font-medium ${
                                isOverdue(
                                  task
                                )
                                  ? "text-red-600"
                                  : "text-slate-600"
                              }`}
                            >
                              {isOverdue(
                                task
                              )
                                ? "Overdue · "
                                : ""}
                              {formatDate(
                                task.dueDate
                              )}
                            </span>
                          ) : (
                            <span className="text-sm text-slate-400">
                              —
                            </span>
                          )}
                        </td>

                        {/* Action */}

                        <td className="px-5 py-4 text-right">
                          <button
                            type="button"
                            onClick={() =>
                              handleDeleteTask(
                                task._id
                              )
                            }
                            className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-red-500 transition hover:bg-red-50 hover:text-red-700"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Mobile / tablet cards */}

          <div className="space-y-3 lg:hidden">
            {filteredTasks.map(
              (task) => (
                <Card
                  key={task._id}
                  className="overflow-hidden"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h2 className="break-words text-sm font-semibold text-slate-900">
                        {task.title}
                      </h2>

                      {task.description && (
                        <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
                          {
                            task.description
                          }
                        </p>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        handleDeleteTask(
                          task._id
                        )
                      }
                      className="shrink-0 rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                      aria-label={`Delete ${task.title}`}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        className="h-4 w-4"
                      >
                        <path
                          strokeLinecap="round"
                          d="M6 6l12 12M18 6L6 18"
                        />
                      </svg>
                    </button>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <Badge
                      variant={getStatusVariant(
                        task.status
                      )}
                    >
                      {getStatusLabel(
                        task.status
                      )}
                    </Badge>

                    <Badge
                      variant={getPriorityVariant(
                        task.priority
                      )}
                    >
                      {getPriorityLabel(
                        task.priority
                      )}
                    </Badge>
                  </div>

                  <div className="mt-4 grid gap-3 border-t border-slate-100 pt-4 sm:grid-cols-2">
                    <div>
                      <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
                        Project
                      </p>

                      <Link
                        to={`/projects/${task.projectInfo?._id}`}
                        className="mt-1 block truncate text-sm font-semibold text-indigo-600"
                      >
                        {
                          task
                            .projectInfo
                            ?.name
                        }
                      </Link>
                    </div>

                    <div>
                      <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
                        Assigned to
                      </p>

                      <p className="mt-1 truncate text-sm font-medium text-slate-700">
                        {task.assignedTo
                          ?.name ||
                          "Unassigned"}
                      </p>
                    </div>

                    <div>
                      <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
                        Due date
                      </p>

                      <p
                        className={`mt-1 text-sm font-medium ${
                          isOverdue(
                            task
                          )
                            ? "text-red-600"
                            : "text-slate-700"
                        }`}
                      >
                        {task.dueDate
                          ? `${
                              isOverdue(
                                task
                              )
                                ? "Overdue · "
                                : ""
                            }${formatDate(
                              task.dueDate
                            )}`
                          : "Not set"}
                      </p>
                    </div>

                    <div>
                      <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
                        Change status
                      </p>

                      <select
                        value={
                          task.status
                        }
                        onChange={(
                          event
                        ) =>
                          handleStatusChange(
                            task._id,
                            event
                              .target
                              .value
                          )
                        }
                        className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs font-medium text-slate-700"
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
                      </select>
                    </div>
                  </div>
                </Card>
              )
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Tasks;