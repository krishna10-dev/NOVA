function Button({
  children,
  type = "button",
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  onClick,
  className = ""
}) {
  const baseStyles =
    "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

  const variants = {
    primary:
      "bg-indigo-600 text-white shadow-sm hover:bg-indigo-700 active:bg-indigo-800",

    secondary:
      "border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50 active:bg-slate-100",

    danger:
      "bg-red-600 text-white shadow-sm hover:bg-red-700 active:bg-red-800",

    ghost:
      "text-slate-600 hover:bg-slate-100 hover:text-slate-900",

    outline:
      "border border-indigo-200 bg-white text-indigo-600 hover:bg-indigo-50"
  };

  const sizes = {
    sm: "px-3 py-2 text-xs",
    md: "px-4 py-2.5 text-sm",
    lg: "px-5 py-3 text-sm"
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {loading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}

      {loading ? "Please wait..." : children}
    </button>
  );
}

export default Button;