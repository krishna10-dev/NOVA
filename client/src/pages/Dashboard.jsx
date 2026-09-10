import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { getDashboardStats } from "../services/dashboardService";

import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Loading from "../components/ui/Loading";
import ErrorMessage from "../components/ui/ErrorMessage";

function Dashboard() {
  const { user } = useAuth();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getDashboardStats();

      if (!data?.success) {
        throw new Error(
          "Unable to load dashboard statistics."
        );
      }

      setStats(data.stats);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to load dashboard."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  if (loading) {
    return <Loading text="Loading your workspace..." />;
  }

  if (error && !stats) {
    return (
      <div className="space-y-6">
        <div>
          <p className="text-sm font-semibold text-indigo-600">
            Dashboard
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
            Your workspace
          </h1>
        </div>

        <ErrorMessage
          message={error}
          onRetry={loadDashboard}
        />
      </div>
    );
  }

  const projectStats = stats?.projects || {};
  const taskStats = stats?.tasks || {};

  const recentProjects =
    stats?.recentProjects || [];

  const completionPercentage =
    taskStats.completionPercentage || 0;

  const totalTasks = taskStats.total || 0;

  const getProjectBadge = (status) => {
    if (status === "COMPLETED") {
      return "success";
    }

    if (status === "ARCHIVED") {
      return "default";
    }

    return "primary";
  };

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString(
      undefined,
      {
        day: "numeric",
        month: "short",
        year: "numeric"
      }
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}

      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold text-indigo-600">
            Dashboard
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Welcome back,{" "}
            {user?.name?.split(" ")[0] || "there"}
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Here's an overview of your projects and tasks.
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

            New Project
          </Button>
        </Link>
      </section>

      {/* Error */}

      {error && (
        <ErrorMessage
          message={error}
          onRetry={loadDashboard}
        />
      )}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {/* Projects */}

        <Card className="relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Total Projects
              </p>

              <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                {projectStats.total || 0}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 7.5A2.5 2.5 0 0 1 5.5 5h4l2 2h7A2.5 2.5 0 0 1 21 9.5v8A2.5 2.5 0 0 1 18.5 20h-13A2.5 2.5 0 0 1 3 17.5v-10Z"
                />
              </svg>
            </div>
          </div>

          <div className="mt-5 flex items-center gap-2 text-xs">
            <span className="font-semibold text-indigo-600">
              {projectStats.active || 0}
            </span>

            <span className="text-slate-500">
              active
            </span>
          </div>
        </Card>

        {/* Total tasks */}

        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Total Tasks
              </p>

              <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                {taskStats.total || 0}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 11l3 3L21 5"
                />

                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 12v5.5A2.5 2.5 0 0 1 18.5 20h-13A2.5 2.5 0 0 1 3 17.5v-13A2.5 2.5 0 0 1 5.5 2H14"
                />
              </svg>
            </div>
          </div>

          <div className="mt-5 flex items-center gap-2 text-xs">
            <span className="font-semibold text-blue-600">
              {taskStats.pending || 0}
            </span>

            <span className="text-slate-500">
              pending
            </span>
          </div>
        </Card>

        {/* Completed */}

        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Completed Tasks
              </p>

              <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                {taskStats.completed || 0}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 12l4 4L19 6"
                />
              </svg>
            </div>
          </div>

          <div className="mt-5 flex items-center gap-2 text-xs">
            <span className="font-semibold text-emerald-600">
              {completionPercentage}%
            </span>

            <span className="text-slate-500">
              completion rate
            </span>
          </div>
        </Card>

        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                High Priority
              </p>

              <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                {taskStats.highPriority || 0}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 3l9 16H3L12 3Z"
                />

                <path
                  strokeLinecap="round"
                  d="M12 9v4"
                />

                <path
                  strokeLinecap="round"
                  d="M12 16h.01"
                />
              </svg>
            </div>
          </div>

          <div className="mt-5 flex items-center gap-2 text-xs">
            <span className="font-semibold text-red-600">
              {taskStats.highPriority || 0}
            </span>

            <span className="text-slate-500">
              urgent or high
            </span>
          </div>
        </Card>
      </section>

      {/* Main content */}

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">

        <Card>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-semibold text-slate-900">
                Task progress
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Overall progress across your projects.
              </p>
            </div>

            <span className="text-2xl font-bold text-indigo-600">
              {completionPercentage}%
            </span>
          </div>

          <div className="mt-6">
            <div className="h-3 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-indigo-600 transition-all duration-500"
                style={{
                  width: `${completionPercentage}%`
                }}
              />
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-xl bg-slate-50 p-3">
              <p className="text-xs text-slate-500">
                Todo
              </p>

              <p className="mt-1 text-lg font-bold text-slate-900">
                {taskStats.todo || 0}
              </p>
            </div>

            <div className="rounded-xl bg-blue-50 p-3">
              <p className="text-xs text-blue-600">
                In Progress
              </p>

              <p className="mt-1 text-lg font-bold text-blue-900">
                {taskStats.inProgress || 0}
              </p>
            </div>

            <div className="rounded-xl bg-amber-50 p-3">
              <p className="text-xs text-amber-600">
                Review
              </p>

              <p className="mt-1 text-lg font-bold text-amber-900">
                {taskStats.review || 0}
              </p>
            </div>

            <div className="rounded-xl bg-emerald-50 p-3">
              <p className="text-xs text-emerald-600">
                Done
              </p>

              <p className="mt-1 text-lg font-bold text-emerald-900">
                {taskStats.completed || 0}
              </p>
            </div>
          </div>
        </Card>

        {/* Project summary */}

        <Card>
          <div className="flex items-start justify-between">
            <div>
              <h2 className="font-semibold text-slate-900">
                Project overview
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Current project distribution.
              </p>
            </div>

            <Link
              to="/projects"
              className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
            >
              View all
            </Link>
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-slate-600">
                  Active
                </span>

                <span className="font-semibold text-slate-900">
                  {projectStats.active || 0}
                </span>
              </div>

              <div className="h-2 rounded-full bg-slate-100">
                <div
                  className="h-2 rounded-full bg-indigo-600"
                  style={{
                    width: `${
                      projectStats.total
                        ? (projectStats.active /
                            projectStats.total) *
                          100
                        : 0
                    }%`
                  }}
                />
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-slate-600">
                  Completed
                </span>

                <span className="font-semibold text-slate-900">
                  {projectStats.completed || 0}
                </span>
              </div>

              <div className="h-2 rounded-full bg-slate-100">
                <div
                  className="h-2 rounded-full bg-emerald-500"
                  style={{
                    width: `${
                      projectStats.total
                        ? (projectStats.completed /
                            projectStats.total) *
                          100
                        : 0
                    }%`
                  }}
                />
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-slate-600">
                  Archived
                </span>

                <span className="font-semibold text-slate-900">
                  {projectStats.archived || 0}
                </span>
              </div>

              <div className="h-2 rounded-full bg-slate-100">
                <div
                  className="h-2 rounded-full bg-slate-400"
                  style={{
                    width: `${
                      projectStats.total
                        ? (projectStats.archived /
                            projectStats.total) *
                          100
                        : 0
                    }%`
                  }}
                />
              </div>
            </div>
          </div>
        </Card>
      </section>

      <Card padding={false}>
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <h2 className="font-semibold text-slate-900">
              Recent projects
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Your latest project activity.
            </p>
          </div>

          <Link
            to="/projects"
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
          >
            View all
          </Link>
        </div>

        {recentProjects.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
              ✦
            </div>

            <p className="mt-4 font-semibold text-slate-900">
              No projects yet
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Create your first project to get started.
            </p>

            <div className="mt-5">
              <Link to="/projects">
                <Button size="sm">
                  Create Project
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {recentProjects.map((project) => (
              <Link
                key={project._id}
                to={`/projects/${project._id}`}
                className="flex items-center justify-between gap-4 px-5 py-4 transition hover:bg-slate-50"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-sm font-bold text-indigo-600">
                    {project.name
                      ?.charAt(0)
                      ?.toUpperCase() || "P"}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900">
                      {project.name}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Created{" "}
                      {formatDate(project.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-3">
                  <Badge
                    variant={getProjectBadge(
                      project.status
                    )}
                  >
                    {project.status}
                  </Badge>

                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="hidden h-4 w-4 text-slate-400 sm:block"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 18l6-6-6-6"
                    />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        )}
      </Card>

      <section className="grid gap-4 sm:grid-cols-2">
        <Link
          to="/projects"
          className="group rounded-2xl border border-indigo-100 bg-indigo-50 p-5 transition hover:border-indigo-200 hover:bg-indigo-100"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-semibold text-indigo-900">
                Manage projects
              </p>

              <p className="mt-1 text-sm leading-6 text-indigo-700/70">
                Create projects, manage members and organize your work.
              </p>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm transition group-hover:translate-x-0.5">
              →
            </div>
          </div>
        </Link>

        <Link
          to="/tasks"
          className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-slate-300 hover:bg-slate-50"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-900">
                Review tasks
              </p>

              <p className="mt-1 text-sm leading-6 text-slate-500">
                Find pending work and keep your projects moving.
              </p>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600 shadow-sm transition group-hover:translate-x-0.5">
              →
            </div>
          </div>
        </Link>
      </section>


      {totalTasks === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-5 text-center">
          <p className="text-sm font-semibold text-slate-800">
            Your workspace is ready
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Create a project and add tasks to start tracking progress.
          </p>
        </div>
      )}
    </div>
  );
}

export default Dashboard;