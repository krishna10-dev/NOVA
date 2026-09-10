function Select({
  label,
  error,
  id,
  children,
  className = "",
  ...props
}) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-semibold text-slate-700"
        >
          {label}
        </label>
      )}

      <select
        id={id}
        className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm transition ${
          error
            ? "border-red-300"
            : "border-slate-200"
        } ${className}`}
        {...props}
      >
        {children}
      </select>

      {error && (
        <p className="text-xs font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

export default Select;