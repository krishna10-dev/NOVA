import TaskCard from "./TaskCard";

const columns = [
  {
    key: "TODO",
    title: "Todo",
    description: "Not started",
    dotClass: "bg-slate-400",
    headerClass: "bg-slate-50 border-slate-200"
  },
  {
    key: "IN_PROGRESS",
    title: "In Progress",
    description: "Currently working",
    dotClass: "bg-blue-500",
    headerClass: "bg-blue-50/60 border-blue-100"
  },
  {
    key: "REVIEW",
    title: "Review",
    description: "Awaiting review",
    dotClass: "bg-amber-500",
    headerClass: "bg-amber-50/60 border-amber-100"
  },
  {
    key: "DONE",
    title: "Done",
    description: "Completed",
    dotClass: "bg-emerald-500",
    headerClass: "bg-emerald-50/60 border-emerald-100"
  }
];

function KanbanBoard({
  tasks,
  onStatusChange,
  onDelete,
  onEdit
}) {
  return (
    <div className="min-w-0">
      <div className="mb-3 flex items-center gap-2 text-xs text-slate-400 lg:hidden">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="h-4 w-4"
        >
          <path
            strokeLinecap="round"
            d="M7 12h10M13 8l4 4-4 4"
          />
        </svg>

        <span>
          Swipe horizontally to view all columns
        </span>
      </div>

      {/* Board */}

      <div className="overflow-x-auto pb-3">
        <div className="grid min-w-[1100px] grid-cols-4 gap-4">
          {columns.map((column) => {
            const columnTasks = tasks.filter(
              (task) =>
                task.status === column.key
            );

            return (
              <section
                key={column.key}
                className="flex min-h-[500px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/70"
              >

                <div
                  className={`border-b p-4 ${column.headerClass}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <span
                        className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${column.dotClass}`}
                      />

                      <div>
                        <h3 className="text-sm font-bold text-slate-800">
                          {column.title}
                        </h3>

                        <p className="mt-0.5 text-[11px] text-slate-400">
                          {column.description}
                        </p>
                      </div>
                    </div>

                    <span className="flex h-7 min-w-7 items-center justify-center rounded-lg bg-white px-2 text-xs font-bold text-slate-600 shadow-sm">
                      {columnTasks.length}
                    </span>
                  </div>
                </div>

                {/* Tasks */}

                <div className="flex-1 space-y-3 p-3">
                  {columnTasks.length === 0 ? (
                    <div className="flex min-h-[180px] items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white/50 px-4">
                      <div className="text-center">
                        <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-xl bg-white text-slate-300 shadow-sm">
                          +
                        </div>

                        <p className="mt-3 text-xs font-medium text-slate-400">
                          No tasks here
                        </p>
                      </div>
                    </div>
                  ) : (
                    columnTasks.map((task) => (
                      <TaskCard
                        key={task._id}
                        task={task}
                        onStatusChange={
                          onStatusChange
                        }
                        onDelete={onDelete}
                        onEdit={onEdit}
                      />
                    ))
                  )}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default KanbanBoard;