function Input({
  label,
  error,
  hint,
  id,
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

      <input
        id={id}
        className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm transition placeholder:text-slate-400 ${
          error
            ? "border-red-300 focus:border-red-500"
            : "border-slate-200 focus:border-indigo-500"
        } ${className}`}
        {...props}
      />

      {error ? (
        <p className="text-xs font-medium text-red-600">
          {error}
        </p>
      ) : hint ? (
        <p className="text-xs text-slate-500">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export default Input;