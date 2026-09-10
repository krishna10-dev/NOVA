import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

function Register() {
  const { user, loading, register, clearError } = useAuth();

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

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

  const validateForm = () => {
    if (!formData.name.trim()) {
      return "Name is required.";
    }

    if (formData.name.trim().length < 2) {
      return "Name must contain at least 2 characters.";
    }

    if (!formData.email.trim()) {
      return "Email address is required.";
    }

    if (!formData.password) {
      return "Password is required.";
    }

    if (formData.password.length < 8) {
      return "Password must contain at least 8 characters.";
    }

    if (formData.password !== formData.confirmPassword) {
      return "Passwords do not match.";
    }

    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setFormError("");

    const validationError = validateForm();

    if (validationError) {
      setFormError(validationError);
      return;
    }

    try {
      setSubmitting(true);

      await register({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password
      });

      navigate("/login", {
        replace: true,
        state: {
          registered: true
        }
      });
    } catch (error) {
      setFormError(
        error.response?.data?.message ||
          "Unable to create your account. Please try again."
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
          <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl" />

          <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl" />

          <div className="relative z-10 flex w-full flex-col justify-between p-10 xl:p-14">
            {/* Logo */}

            <Link
              to="/register"
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
                Build momentum.
                <br />
                Ship together.
              </h1>

              <p className="mt-6 max-w-md text-base leading-7 text-slate-400">
                Create a workspace where your projects, tasks and team stay aligned from planning to delivery.
              </p>

              <div className="mt-10 space-y-3">
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-300">
                    ✓
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-white">
                      Organize projects
                    </p>

                    <p className="text-xs text-slate-400">
                      Keep important work in one place.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-300">
                    ✓
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-white">
                      Track every task
                    </p>

                    <p className="text-xs text-slate-400">
                      Move work from Todo to Done.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-300">
                    ✓
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-white">
                      Work as a team
                    </p>

                    <p className="text-xs text-slate-400">
                      Collaborate with project members.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}

            <p className="text-xs text-slate-500">
              NOVA · Team Productivity Platform
            </p>
          </div>
        </div>

        {/* Registration panel */}

        <div className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-8">
          <div className="w-full max-w-md">
            {/* Mobile logo */}

            <div className="mb-10 lg:hidden">
              <Link
                to="/register"
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
                Get started
              </p>

              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                Create your account
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Set up your NOVA workspace and start managing your work.
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
                id="name"
                name="name"
                type="text"
                label="Full name"
                placeholder="Your name"
                value={formData.name}
                onChange={handleChange}
                autoComplete="name"
              />

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
                placeholder="At least 8 characters"
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
              />

              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                label="Confirm password"
                placeholder="Enter your password again"
                value={formData.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
              />

              <Button
                type="submit"
                size="lg"
                loading={submitting}
                className="w-full"
              >
                Create account
              </Button>
            </form>

            {/* Login */}

            <p className="mt-8 text-center text-sm text-slate-500">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-indigo-600 hover:text-indigo-700"
              >
                Sign in
              </Link>
            </p>

            {/* Terms */}

            <p className="mt-6 text-center text-xs leading-5 text-slate-400">
              By creating an account, you agree to use NOVA responsibly and keep your account credentials secure.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;