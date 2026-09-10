import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  getProjects,
  createProject,
  deleteProject
} from "../services/projectService";

import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Loading from "../components/ui/Loading";
import ErrorMessage from "../components/ui/ErrorMessage";
import EmptyState from "../components/ui/EmptyState";

function Projects() {
  const [projects, setProjects] = useState([]);

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");

  const [showCreateForm, setShowCreateForm] =
    useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    startDate: "",
    dueDate: ""
  });

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getProjects();

      if (!data?.success) {
        throw new Error(
          "Unable to load projects."
        );
      }

      setProjects(data.projects || []);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to load projects."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value
    }));

    setFormError("");
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      startDate: "",
      dueDate: ""
    });

    setFormError("");
  };

  const handleCreateProject = async (event) => {
    event.preventDefault();

    setFormError("");

    if (!formData.name.trim()) {
      setFormError("Project name is required.");
      return;
    }

    if (formData.name.trim().length < 2) {
      setFormError(
        "Project name must contain at least 2 characters."
      );
      return;
    }

    if (
      formData.startDate &&
      formData.dueDate &&
      new Date(formData.dueDate) <
        new Date(formData.startDate)
    ) {
      setFormError(
        "Due date cannot be earlier than the start date."
      );
      return;
    }

    try {
      setCreating(true);

      const data = await createProject({
        name: formData.name.trim(),
        description: formData.description.trim(),
        startDate: formData.startDate || undefined,
        dueDate: formData.dueDate || undefined
      });

      if (!data?.success || !data?.project) {
        throw new Error(
          "Failed to create project."
        );
      }

      setProjects((current) => [
        data.project,
        ...current
      ]);

      resetForm();
      setShowCreateForm(false);
    } catch (error) {
      setFormError(
        error.response?.data?.message ||
          error.message ||
          "Failed to create project."
      );
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (projectId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this project? All tasks belonging to this project will also be deleted."
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await deleteProject(projectId);

      setProjects((current) =>
        current.filter(
          (project) => project._id !== projectId
        )
      );
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to delete project."
      );
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case "COMPLETED":
        return "success";

      case "ARCHIVED":
        return "default";

      case "ACTIVE":
      default:
        return "primary";
    }
  };

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

  if (loading) {
    return (
      <Loading text="Loading your projects..." />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}

      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-indigo-600">
            Workspace
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Projects
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Organize your work and collaborate with your team.
          </p>
        </div>

        <Button
          onClick={() => {
            setShowCreateForm(
              (current) => !current
            );
            setFormError("");
          }}
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

          {showCreateForm
            ? "Close"
            : "New Project"}
        </Button>
      </section>

      {/* Error */}

      {error && (
        <ErrorMessage
          message={error}
          onRetry={loadProjects}
        />
      )}

      {/* Create project */}

      {showCreateForm && (
        <Card>
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Create a new project
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Set up the basics before adding tasks and team members.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setShowCreateForm(false);
                resetForm();
              }}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              aria-label="Close create project form"
            >
              ×
            </button>
          </div>

          {formError && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
              <p className="text-sm font-medium text-red-700">
                {formError}
              </p>
            </div>
          )}

          <form
            onSubmit={handleCreateProject}
            className="space-y-5"
          >
            <Input
              id="project-name"
              name="name"
              label="Project name"
              placeholder="e.g. Website Redesign"
              value={formData.name}
              onChange={handleChange}
              maxLength={100}
            />

            <div className="space-y-1.5">
              <label
                htmlFor="project-description"
                className="block text-sm font-semibold text-slate-700"
              >
                Description
              </label>

              <textarea
                id="project-description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe what this project is about..."
                rows={4}
                maxLength={1000}
                className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/10"
              />

              <div className="flex justify-end">
                <span className="text-xs text-slate-400">
                  {formData.description.length}/1000
                </span>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <Input
                id="project-start-date"
                name="startDate"
                type="date"
                label="Start date"
                value={formData.startDate}
                onChange={handleChange}
              />

              <Input
                id="project-due-date"
                name="dueDate"
                type="date"
                label="Due date"
                value={formData.dueDate}
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setShowCreateForm(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                loading={creating}
              >
                Create Project
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Summary */}

      <div className="flex flex-wrap items-center gap-3">
        <div className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm">
          <span className="font-semibold text-slate-900">
            {projects.length}
          </span>{" "}
          <span className="text-slate-500">
            {projects.length === 1
              ? "project"
              : "projects"}
          </span>
        </div>

        <div className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm">
          <span className="font-semibold text-indigo-600">
            {
              projects.filter(
                (project) =>
                  project.status === "ACTIVE"
              ).length
            }
          </span>{" "}
          <span className="text-slate-500">
            active
          </span>
        </div>

        <div className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm">
          <span className="font-semibold text-emerald-600">
            {
              projects.filter(
                (project) =>
                  project.status === "COMPLETED"
              ).length
            }
          </span>{" "}
          <span className="text-slate-500">
            completed
          </span>
        </div>
      </div>

      {/* Projects */}

      {projects.length === 0 ? (
        <EmptyState
          title="No projects yet"
          description="Create your first project to start organizing tasks and collaborating with your team."
          action={
            <Button
              onClick={() => {
                setShowCreateForm(true);
                setFormError("");
              }}
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

              Create Project
            </Button>
          }
        />
      ) : (
        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <Card
              key={project._id}
              className="group flex h-full flex-col transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
            >
              {/* Card header */}

              <div className="flex items-start justify-between gap-3">
                <Link
                  to={`/projects/${project._id}`}
                  className="flex min-w-0 items-center gap-3"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-base font-bold text-indigo-600">
                    {project.name
                      ?.charAt(0)
                      ?.toUpperCase() || "P"}
                  </div>

                  <div className="min-w-0">
                    <h2 className="truncate font-semibold text-slate-900 transition group-hover:text-indigo-700">
                      {project.name}
                    </h2>

                    <p className="mt-0.5 text-xs text-slate-400">
                      Created{" "}
                      {formatDate(
                        project.createdAt
                      )}
                    </p>
                  </div>
                </Link>

                <Badge
                  variant={getStatusVariant(
                    project.status
                  )}
                >
                  {project.status}
                </Badge>
              </div>

              {/* Description */}

              <Link
                to={`/projects/${project._id}`}
                className="mt-5 flex-1"
              >
                <p className="line-clamp-3 text-sm leading-6 text-slate-500">
                  {project.description ||
                    "No project description has been added yet."}
                </p>
              </Link>

              {/* Project metadata */}

              <div className="mt-5 grid grid-cols-2 gap-3 border-t border-slate-100 pt-5">
                <div>
                  <p className="text-xs text-slate-400">
                    Start date
                  </p>

                  <p className="mt-1 text-sm font-medium text-slate-700">
                    {formatDate(
                      project.startDate
                    )}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-400">
                    Due date
                  </p>

                  <p className="mt-1 text-sm font-medium text-slate-700">
                    {formatDate(
                      project.dueDate
                    )}
                  </p>
                </div>
              </div>

              {/* Footer */}

              <div className="mt-5 flex items-center justify-between">
                <Link
                  to={`/projects/${project._id}`}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 transition hover:text-indigo-700"
                >
                  Open project

                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 18l6-6-6-6"
                    />
                  </svg>
                </Link>

                <button
                  type="button"
                  onClick={() =>
                    handleDelete(project._id)
                  }
                  className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-red-500 transition hover:bg-red-50 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            </Card>
          ))}
        </section>
      )}
    </div>
  );
}

export default Projects;