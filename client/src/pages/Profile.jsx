import { useState } from "react";

import { useAuth } from "../context/AuthContext";

import {
  updateProfile,
  changePassword
} from "../services/authService";

import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Card from "../components/ui/Card";
import ErrorMessage from "../components/ui/ErrorMessage";

function Profile() {
  const {
    user,
    refreshUser
  } = useAuth();

  const [name, setName] = useState(
    user?.name || ""
  );

  const [profileLoading, setProfileLoading] =
    useState(false);

  const [profileError, setProfileError] =
    useState("");

  const [profileSuccess, setProfileSuccess] =
    useState("");

  const [passwordData, setPasswordData] =
    useState({
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    });

  const [passwordLoading, setPasswordLoading] =
    useState(false);

  const [passwordError, setPasswordError] =
    useState("");

  const [passwordSuccess, setPasswordSuccess] =
    useState("");

  const getInitials = (value = "") => {
    return (
      value
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map(
          (word) =>
            word[0]?.toUpperCase()
        )
        .join("") || "U"
    );
  };

  const handleProfileSubmit = async (
    event
  ) => {
    event.preventDefault();

    setProfileError("");
    setProfileSuccess("");

    const trimmedName = name.trim();

    if (!trimmedName) {
      setProfileError(
        "Name is required."
      );
      return;
    }

    if (trimmedName.length < 2) {
      setProfileError(
        "Name must contain at least 2 characters."
      );
      return;
    }

    try {
      setProfileLoading(true);

      const data =
        await updateProfile({
          name: trimmedName
        });

      if (!data?.success) {
        throw new Error(
          "Failed to update profile."
        );
      }

      await refreshUser();

      setProfileSuccess(
        "Profile updated successfully."
      );
    } catch (error) {
      setProfileError(
        error.response?.data
          ?.message ||
          error.message ||
          "Failed to update profile."
      );
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordChange = (
    event
  ) => {
    const { name, value } =
      event.target;

    setPasswordData((current) => ({
      ...current,
      [name]: value
    }));

    setPasswordError("");
    setPasswordSuccess("");
  };

  const handlePasswordSubmit = async (
    event
  ) => {
    event.preventDefault();

    setPasswordError("");
    setPasswordSuccess("");

    if (
      !passwordData.currentPassword
    ) {
      setPasswordError(
        "Current password is required."
      );
      return;
    }

    if (!passwordData.newPassword) {
      setPasswordError(
        "New password is required."
      );
      return;
    }

    if (
      passwordData.newPassword.length < 8
    ) {
      setPasswordError(
        "New password must contain at least 8 characters."
      );
      return;
    }

    if (
      passwordData.newPassword !==
      passwordData.confirmPassword
    ) {
      setPasswordError(
        "New passwords do not match."
      );
      return;
    }

    try {
      setPasswordLoading(true);

      const data =
        await changePassword({
          currentPassword:
            passwordData.currentPassword,
          newPassword:
            passwordData.newPassword
        });

      if (!data?.success) {
        throw new Error(
          "Failed to change password."
        );
      }

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });

      setPasswordSuccess(
        "Password changed successfully."
      );
    } catch (error) {
      setPasswordError(
        error.response?.data
          ?.message ||
          error.message ||
          "Failed to change password."
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}

      <section>
        <p className="text-sm font-semibold text-indigo-600">
          Account
        </p>

        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Profile
        </h1>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Manage your personal information and account security.
        </p>
      </section>

      {/* Profile overview */}

      <Card className="overflow-hidden p-0">
        <div className="bg-gradient-to-br from-indigo-50 via-white to-white p-6 sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-2xl font-bold text-white shadow-sm">
              {getInitials(user.name)}
            </div>

            <div className="min-w-0">
              <h2 className="truncate text-xl font-bold text-slate-900">
                {user.name}
              </h2>

              <p className="mt-1 truncate text-sm text-slate-500">
                {user.email}
              </p>

              <div className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-indigo-100 bg-white px-2.5 py-1 text-xs font-medium text-indigo-600">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                NOVA account
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Content */}

      <div className="grid gap-6 xl:grid-cols-2">

        <Card>
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-slate-900">
              Personal information
            </h2>

            <p className="mt-1 text-sm leading-6 text-slate-500">
              Update the name associated with your account.
            </p>
          </div>

          {profileError && (
            <div className="mb-5">
              <ErrorMessage
                message={profileError}
              />
            </div>
          )}

          {profileSuccess && (
            <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
              <p className="text-sm font-medium text-emerald-700">
                {profileSuccess}
              </p>
            </div>
          )}

          <form
            onSubmit={
              handleProfileSubmit
            }
            className="space-y-5"
          >
            <Input
              id="profile-name"
              name="name"
              label="Full name"
              type="text"
              value={name}
              onChange={(event) =>
                setName(
                  event.target.value
                )
              }
              placeholder="Your name"
              maxLength={50}
            />

            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-slate-700">
                Email address
              </label>

              <div className="flex min-h-[44px] items-center rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-500">
                {user.email}
              </div>

              <p className="text-xs text-slate-400">
                Email address cannot currently be changed.
              </p>
            </div>

            <div className="flex justify-end border-t border-slate-100 pt-5">
              <Button
                type="submit"
                loading={profileLoading}
              >
                Save Changes
              </Button>
            </div>
          </form>
        </Card>

        {/* Password */}

        <Card>
          <div className="mb-6">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-5 w-5"
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
              </div>

              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Change password
                </h2>

                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Keep your account secure with a strong password.
                </p>
              </div>
            </div>
          </div>

          {passwordError && (
            <div className="mb-5">
              <ErrorMessage
                message={passwordError}
              />
            </div>
          )}

          {passwordSuccess && (
            <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
              <p className="text-sm font-medium text-emerald-700">
                {passwordSuccess}
              </p>
            </div>
          )}

          <form
            onSubmit={
              handlePasswordSubmit
            }
            className="space-y-5"
          >
            <Input
              id="current-password"
              name="currentPassword"
              type="password"
              label="Current password"
              placeholder="Enter current password"
              value={
                passwordData.currentPassword
              }
              onChange={
                handlePasswordChange
              }
              autoComplete="current-password"
            />

            <Input
              id="new-password"
              name="newPassword"
              type="password"
              label="New password"
              placeholder="At least 8 characters"
              value={
                passwordData.newPassword
              }
              onChange={
                handlePasswordChange
              }
              autoComplete="new-password"
            />

            <Input
              id="confirm-password"
              name="confirmPassword"
              type="password"
              label="Confirm new password"
              placeholder="Enter the new password again"
              value={
                passwordData.confirmPassword
              }
              onChange={
                handlePasswordChange
              }
              autoComplete="new-password"
            />

            <div className="rounded-xl bg-slate-50 p-3">
              <p className="text-xs font-semibold text-slate-600">
                Password requirements
              </p>

              <ul className="mt-2 space-y-1 text-xs text-slate-500">
                <li className="flex items-center gap-2">
                  <span className="text-slate-400">
                    •
                  </span>
                  At least 8 characters
                </li>

                <li className="flex items-center gap-2">
                  <span className="text-slate-400">
                    •
                  </span>
                  Should be difficult to guess
                </li>
              </ul>
            </div>

            <div className="flex justify-end border-t border-slate-100 pt-5">
              <Button
                type="submit"
                loading={
                  passwordLoading
                }
              >
                Update Password
              </Button>
            </div>
          </form>
        </Card>
      </div>

      {/* Account information */}

      <Card>
        <div className="mb-5">
          <h2 className="font-semibold text-slate-900">
            Account information
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Basic information associated with your NOVA account.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs font-medium text-slate-400">
              Name
            </p>

            <p className="mt-1 truncate text-sm font-semibold text-slate-800">
              {user.name}
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs font-medium text-slate-400">
              Email
            </p>

            <p className="mt-1 truncate text-sm font-semibold text-slate-800">
              {user.email}
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs font-medium text-slate-400">
              Account ID
            </p>

            <p className="mt-1 truncate text-sm font-semibold text-slate-800">
              {user._id}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default Profile;