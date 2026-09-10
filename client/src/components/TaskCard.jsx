import { useMemo } from "react";

import Badge from "./ui/Badge";

function TaskCard({
  task,
  onStatusChange,
  onDelete,
  onEdit
}) {
  const isOverdue = useMemo(() => {
    if (!task.dueDate || task.status === "DONE") {
      return false;
    }

    const dueDate = new Date(task.dueDate);
    const today = new Date();

    dueDate.setHours(23, 59, 59, 999);

    return dueDate < today;
  }, [task.dueDate, task.status]);

  const getPriorityVariant = (priority) => {
    switch (priority) {
      case "URGENT":
        return "danger";

      case "HIGH":
        return "warning";

      case "MEDIUM":
        return "primary";

      case "LOW":
      default:
        return "default";
    }
  };

  const getPriorityLabel = (priority) => {
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
        return priority || "Medium";
    }
  };

  const formatDueDate = (date) => {
    if (!date) {
      return "";
    }

    return new Date(date).toLocaleDateString(
      undefined,
      {
        day: "numeric",
        month: "short"
      }
    );
  };

  return (
    <article className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md">
      {/* Top row */}

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="break-words text-sm font-semibold leading-5 text-slate-900">
            {task.title}
          </h3>

          {task.description && (
            <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-slate-500">
              {task.description}
            </p>
          )}
        </div>

        {/* Actions */}

        <div className="flex shrink-0 items-center gap-1 opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100">
          <button
            type="button"
            onClick={() => onEdit(task)}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 transition hover:bg-indigo-50 hover:text-indigo-600"
            aria-label={`Edit ${task.title}`}
            title="Edit task"
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
                strokeLinejoin="round"
                d="M12 20h9"
              />

              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 3.5a2.121 2.121 0 0 1 3 3L8 18l-4 1 1-4L16.5 3.5Z"
              />
            </svg>
          </button>

          <button
            type="button"
            onClick={() => onDelete(task._id)}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-600"
            aria-label={`Delete ${task.title}`}
            title="Delete task"
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
                strokeLinejoin="round"
                d="M4 7h16"
              />

              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10 11v6M14 11v6"
              />

              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 7l1 13h10l1-13"
              />

              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 7V4h6v3"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Badge
          variant={getPriorityVariant(
            task.priority
          )}
        >
          {getPriorityLabel(task.priority)}
        </Badge>

        {task.assignedTo && (
          <div className="inline-flex max-w-full items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1">
            <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-slate-300 text-[8px] font-bold text-slate-700">
              {task.assignedTo.name
                ?.charAt(0)
                ?.toUpperCase() || "U"}
            </div>

            <span className="max-w-[110px] truncate text-xs font-medium text-slate-600">
              {task.assignedTo.name}
            </span>
          </div>
        )}
      </div>

      {/* Status */}

      <div className="mt-4">
        <label
          htmlFor={`task-status-${task._id}`}
          className="sr-only"
        >
          Task status
        </label>

        <select
          id={`task-status-${task._id}`}
          value={task.status}
          onChange={(event) =>
            onStatusChange(
              task._id,
              event.target.value
            )
          }
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-white focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/10"
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

      {task.dueDate && (
        <div
          className={`mt-3 flex items-center gap-1.5 text-xs font-medium ${
            isOverdue
              ? "text-red-600"
              : "text-slate-400"
          }`}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-3.5 w-3.5"
          >
            <rect
              x="3"
              y="4"
              width="18"
              height="17"
              rx="2"
            />

            <path
              strokeLinecap="round"
              d="M16 2v4M8 2v4M3 10h18"
            />
          </svg>

          <span>
            {isOverdue
              ? `Overdue · ${formatDueDate(
                  task.dueDate
                )}`
              : `Due ${formatDueDate(
                  task.dueDate
                )}`}
          </span>
        </div>
      )}
    </article>
  );
}

export default TaskCard;