function ErrorMessage({
  message,
  onRetry
}) {
  if (!message) return null;

  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-red-800">
            Something went wrong
          </p>

          <p className="mt-1 text-sm text-red-600">
            {message}
          </p>
        </div>

        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="shrink-0 text-sm font-semibold text-red-700 hover:text-red-900"
          >
            Retry
          </button>
        )}
      </div>
    </div>
  );
}

export default ErrorMessage;