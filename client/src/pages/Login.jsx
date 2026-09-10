import { useEffect, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

function Login() {
  const { user, loading, login, clearError } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const from =
    location.state?.from?.pathname || "/dashboard";

  useEffect(() => {
    clearError();
  }, [clearError]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value
    }));

    setFormError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setFormError("");

    if (!formData.email.trim()) {
      setFormError("Email address is required.");
      return;
    }

    if (!formData.password) {
      setFormError("Password is required.");
      return;
    }

    try {
      setSubmitting(true);

      await login({
        email: formData.email.trim(),
        password: formData.password
      });

      navigate(from, { replace: true });
    } catch (error) {
      setFormError(
        error.response?.data?.message ||
          "Unable to sign in. Please check your credentials."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* Left branding panel */}

        <div className="relative hidden overflow-hidden bg-slate-950 lg:flex">
          <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl" />

          <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl" />

          <div className="relative z-10 flex w-full flex-col justify-between p-10 xl:p-14">

            <Link
              to="/login"
              className="flex w-fit items-center gap-3"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-sm font-bold text-white">
                N
              </div>

              <span className="text-xl font-bold tracking-tight text-white">
                NOVA
              </span>
            </Link>

            {/* Main message */}

            <div className="max-w-lg">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-xl text-indigo-300">
                ✦
              </div>

              <h1 className="text-4xl font-bold leading-tight tracking-tight text-white xl:text-5xl">
                Plan together.
                <br />
                Deliver better.
              </h1>

              <p className="mt-6 max-w-md text-base leading-7 text-slate-400">
                Keep your projects, tasks and team collaboration organized in one focused workspace.
              </p>

              <div className="mt-10 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm font-semibold text-white">
                    Projects
                  </p>
                  <p className="mt-1 text-xs leading-5 text-slate-400">
                    Keep every project organized.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm font-semibold text-white">
                    Tasks
                  </p>
                  <p className="mt-1 text-xs leading-5 text-slate-400">
                    Track work from start to done.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm font-semibold text-white">
                    Teams
                  </p>
                  <p className="mt-1 text-xs leading-5 text-slate-400">
                    Collaborate with your members.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}

            <p className="text-xs text-slate-500">
              NOVA · Team Productivity Platform
            </p>
          </div>
        </div>

        {/* Login panel */}

        <div className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-8">
          <div className="w-full max-w-md">

            <div className="mb-10 lg:hidden">
              <Link
                to="/login"
                className="inline-flex items-center gap-3"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-sm font-bold text-white shadow-sm">
                  N
                </div>

                <span className="text-xl font-bold tracking-tight text-slate-900">
                  NOVA
                </span>
              </Link>
            </div>

            {/* Heading */}

            <div>
              <p className="text-sm font-semibold text-indigo-600">
                Welcome back
              </p>

              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                Sign in to NOVA
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Enter your details to access your workspace.
              </p>
            </div>

            {/* Error */}

            {formError && (
              <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                <p className="text-sm font-medium text-red-700">
                  {formError}
                </p>
              </div>
            )}

            {/* Form */}

            <form
              onSubmit={handleSubmit}
              className="mt-8 space-y-5"
            >
              <Input
                id="email"
                name="email"
                type="email"
                label="Email address"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
              />

              <Input
                id="password"
                name="password"
                type="password"
                label="Password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
              />

              <Button
                type="submit"
                size="lg"
                loading={submitting}
                className="w-full"
              >
                Sign in
              </Button>
            </form>

            {/* Register */}

            <p className="mt-8 text-center text-sm text-slate-500">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-semibold text-indigo-600 hover:text-indigo-700"
              >
                Create one
              </Link>
            </p>

            <div className="mt-10 flex items-center justify-center gap-2 text-xs text-slate-400">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-4 w-4"
              >
                <rect
                  x="5"
                  y="10"
                  width="14"
                  height="10"
                  rx="2"
                />
                <path
                  strokeLinecap="round"
                  d="M8 10V7a4 4 0 0 1 8 0v3"
                />
              </svg>

              <span>
                Your account is protected with secure authentication.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;