import { useEffect, useMemo, useState } from "react";

import {
  getProjectMembers,
  addProjectMember,
  removeProjectMember
} from "../services/memberService";

import Button from "./ui/Button";
import Input from "./ui/Input";
import Select from "./ui/Select";
import Card from "./ui/Card";
import Badge from "./ui/Badge";
import Loading from "./ui/Loading";
import ErrorMessage from "./ui/ErrorMessage";

function ProjectMembers({
  projectId,
  projectOwner,
  currentUser
}) {
  const [members, setMembers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [removingId, setRemovingId] =
    useState(null);

  const [error, setError] = useState("");
  const [formError, setFormError] =
    useState("");

  const [showAddForm, setShowAddForm] =
    useState(false);

  const [formData, setFormData] = useState({
    email: "",
    role: "MEMBER"
  });

  const loadMembers = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getProjectMembers(
        projectId
      );

      if (!data?.success) {
        throw new Error(
          "Failed to load project members."
        );
      }

      setMembers(data.members || []);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to load project members."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMembers();
  }, [projectId]);

  const currentMembership = useMemo(() => {
    if (!currentUser?._id) {
      return null;
    }

    return members.find(
      (member) =>
        member.user?._id ===
        currentUser._id
    );
  }, [members, currentUser]);

  const isOwner =
    projectOwner?._id ===
    currentUser?._id;

  const isAdmin =
    isOwner ||
    currentMembership?.role ===
      "ADMIN";

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value
    }));

    setFormError("");
  };

  const resetForm = () => {
    setFormData({
      email: "",
      role: "MEMBER"
    });

    setFormError("");
  };

  const handleAddMember = async (event) => {
    event.preventDefault();

    setFormError("");

    if (!formData.email.trim()) {
      setFormError(
        "Email address is required."
      );
      return;
    }

    try {
      setAdding(true);

      const data =
        await addProjectMember(
          projectId,
          {
            email:
              formData.email.trim(),
            role: formData.role
          }
        );

      if (
        !data?.success ||
        !data?.member
      ) {
        throw new Error(
          "Failed to add member."
        );
      }

      setMembers((current) => [
        ...current,
        data.member
      ]);

      resetForm();
      setShowAddForm(false);
    } catch (error) {
      setFormError(
        error.response?.data?.message ||
          error.message ||
          "Failed to add member."
      );
    } finally {
      setAdding(false);
    }
  };

  const handleRemoveMember = async (
    userId
  ) => {
    const member = members.find(
      (item) =>
        item.user?._id === userId
    );

    const memberName =
      member?.user?.name ||
      "this member";

    const confirmed = window.confirm(
      `Remove ${memberName} from this project?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setRemovingId(userId);

      await removeProjectMember(
        projectId,
        userId
      );

      setMembers((current) =>
        current.filter(
          (member) =>
            member.user?._id !==
            userId
        )
      );
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to remove member."
      );
    } finally {
      setRemovingId(null);
    }
  };

  const getInitials = (name = "") => {
    return (
      name
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

  if (loading) {
    return (
      <Card>
        <Loading text="Loading team..." />
      </Card>
    );
  }

  return (
    <Card padding={false}>
      {/* Header */}

      <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-5 py-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-semibold text-slate-900">
              Team members
            </h2>

            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-500">
              {members.length}
            </span>
          </div>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            People working on this project.
          </p>
        </div>

        {isAdmin && (
          <button
            type="button"
            onClick={() => {
              setShowAddForm(
                (current) => !current
              );
              setFormError("");
            }}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 transition hover:bg-indigo-100"
            aria-label={
              showAddForm
                ? "Close add member form"
                : "Add member"
            }
            title={
              showAddForm
                ? "Close"
                : "Add member"
            }
          >
            {showAddForm ? (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-4 w-4"
              >
                <path
                  strokeLinecap="round"
                  d="M6 6l12 12M18 6L6 18"
                />
              </svg>
            ) : (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                className="h-4 w-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 5v14M5 12h14"
                />
              </svg>
            )}
          </button>
        )}
      </div>

      {error && (
        <div className="p-4 pb-0">
          <ErrorMessage
            message={error}
            onRetry={loadMembers}
          />
        </div>
      )}

      {/* Add member */}

      {showAddForm && isAdmin && (
        <div className="border-b border-slate-100 bg-slate-50/70 p-4">
          <div className="mb-4">
            <p className="text-sm font-semibold text-slate-800">
              Add team member
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Enter the email address of an existing NOVA user.
            </p>
          </div>

          {formError && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5">
              <p className="text-xs font-medium text-red-700">
                {formError}
              </p>
            </div>
          )}

          <form
            onSubmit={handleAddMember}
            className="space-y-4"
          >
            <Input
              id={`member-email-${projectId}`}
              name="email"
              type="email"
              label="Email address"
              placeholder="member@example.com"
              value={formData.email}
              onChange={handleChange}
            />

            <Select
              id={`member-role-${projectId}`}
              name="role"
              label="Role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="MEMBER">
                Member
              </option>

              <option value="ADMIN">
                Admin
              </option>
            </Select>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => {
                  setShowAddForm(false);
                  resetForm();
                }}
                disabled={adding}
                className="flex-1"
              >
                Cancel
              </Button>

              <Button
                type="submit"
                size="sm"
                loading={adding}
                className="flex-1"
              >
                Add Member
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Member list */}

      <div className="divide-y divide-slate-100">
        {members.length === 0 ? (
          <div className="p-8 text-center">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"
                />

                <circle
                  cx="9"
                  cy="7"
                  r="4"
                />

                <path
                  strokeLinecap="round"
                  d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"
                />
              </svg>
            </div>

            <p className="mt-3 text-sm font-semibold text-slate-800">
              No team members
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Add members to collaborate on this project.
            </p>
          </div>
        ) : (
          members.map((member) => {
            const memberUser =
              member.user;

            if (!memberUser) {
              return null;
            }

            const memberIsOwner =
              memberUser._id ===
              projectOwner?._id;

            const canRemove =
              isAdmin &&
              !memberIsOwner &&
              memberUser._id !==
                currentUser?._id;

            return (
              <div
                key={memberUser._id}
                className="flex items-center gap-3 px-5 py-3.5"
              >

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">
                  {getInitials(
                    memberUser.name
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex min-w-0 items-center gap-2">
                    <p className="truncate text-sm font-semibold text-slate-800">
                      {memberUser.name}
                    </p>

                    {memberUser._id ===
                      currentUser?._id && (
                      <span className="shrink-0 text-[10px] font-medium text-slate-400">
                        You
                      </span>
                    )}
                  </div>

                  <p className="truncate text-xs text-slate-400">
                    {memberUser.email}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <Badge
                    variant={
                      memberIsOwner ||
                      member.role ===
                        "ADMIN"
                        ? "primary"
                        : "default"
                    }
                  >
                    {memberIsOwner
                      ? "Owner"
                      : member.role}
                  </Badge>

                  {canRemove && (
                    <button
                      type="button"
                      onClick={() =>
                        handleRemoveMember(
                          memberUser._id
                        )
                      }
                      disabled={
                        removingId ===
                        memberUser._id
                      }
                      className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                      aria-label={`Remove ${memberUser.name}`}
                      title="Remove member"
                    >
                      {removingId ===
                      memberUser._id ? (
                        <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-slate-200 border-t-red-500" />
                      ) : (
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          className="h-4 w-4"
                        >
                          <path
                            strokeLinecap="round"
                            d="M6 6l12 12M18 6L6 18"
                          />
                        </svg>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}

      {members.length > 0 && (
        <div className="border-t border-slate-100 bg-slate-50/50 px-5 py-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">
              {members.length === 1
                ? "1 person"
                : `${members.length} people`}
            </span>

            <span className="font-medium text-slate-400">
              {members.filter(
                (member) =>
                  member.role ===
                  "ADMIN"
              ).length}{" "}
              admin
              {members.filter(
                (member) =>
                  member.role ===
                  "ADMIN"
              ).length !== 1
                ? "s"
                : ""}
            </span>
          </div>
        </div>
      )}
    </Card>
  );
}

export default ProjectMembers;