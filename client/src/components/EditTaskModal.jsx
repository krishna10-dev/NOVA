import { useEffect, useState } from "react";

import Button from "./ui/Button";
import Input from "./ui/Input";
import Select from "./ui/Select";

function EditTaskModal({
  task,
  members,
  onClose,
  onUpdate
}) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "TODO",
    priority: "MEDIUM",
    dueDate: "",
    assignedTo: ""
  });

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!task) {
      return;
    }

    setFormData({
      title: task.title || "",
      description: task.description || "",
      status: task.status || "TODO",
      priority: task.priority || "MEDIUM",
      dueDate: task.dueDate
        ? new Date(task.dueDate)
            .toISOString()
            .split("T")[0]
        : "",
      assignedTo:
        task.assignedTo?._id ||
        task.assignedTo ||
        ""
    });

    setError("");
  }, [task]);

  if (!task) {
    return null;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value
    }));

    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!formData.title.trim()) {
      setError("Task title is required.");
      return;
    }

    if (formData.title.trim().length < 2) {
      setError(
        "Task title must contain at least 2 characters."
      );
      return;
    }

    try {
      setSaving(true);

      await onUpdate(task._id, {
        title: formData.title.trim(),
        description: formData.description.trim(),
        status: formData.status,
        priority: formData.priority,
        dueDate: formData.dueDate || null,
        assignedTo: formData.assignedTo || null
      });
    } catch (error) {
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to update task."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
        {/* Header */}

        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4 sm:px-6">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
              Edit task
            </p>

            <h2 className="mt-1 truncate text-lg font-bold text-slate-900">
              {task.title}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Update the task details and assignment.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close modal"
          >
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
                d="M6 6l12 12M18 6L6 18"
              />
            </svg>
          </button>
        </div>

        {/* Body */}

        <div className="overflow-y-auto px-5 py-5 sm:px-6">
          {error && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
              <p className="text-sm font-medium text-red-700">
                {error}
              </p>
            </div>
          )}

          <form
            id="edit-task-form"
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <Input
              id="edit-task-title"
              name="title"
              label="Task title"
              placeholder="Enter task title"
              value={formData.title}
              onChange={handleChange}
              maxLength={200}
            />

            <div className="space-y-1.5">
              <label
                htmlFor="edit-task-description"
                className="block text-sm font-semibold text-slate-700"
              >
                Description
              </label>

              <textarea
                id="edit-task-description"
                name="description"
                rows={5}
                maxLength={2000}
                value={
                  formData.description
                }
                onChange={handleChange}
                placeholder="Add details about this task..."
                className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/10"
              />

              <div className="text-right text-xs text-slate-400">
                {formData.description.length}/2000
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <Select
                id="edit-task-status"
                name="status"
                label="Status"
                value={formData.status}
                onChange={handleChange}
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
                id="edit-task-priority"
                name="priority"
                label="Priority"
                value={
                  formData.priority
                }
                onChange={handleChange}
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
                id="edit-task-due-date"
                name="dueDate"
                type="date"
                label="Due date"
                value={
                  formData.dueDate
                }
                onChange={handleChange}
              />

              <Select
                id="edit-task-assigned-to"
                name="assignedTo"
                label="Assigned to"
                value={
                  formData.assignedTo
                }
                onChange={handleChange}
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
          </form>
        </div>

        {/* Footer */}

        <div className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50/50 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={saving}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            form="edit-task-form"
            loading={saving}
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}

export default EditTaskModal;