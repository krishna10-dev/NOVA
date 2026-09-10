import { useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);

  const getInitials = (name = "") => {
    return (
      name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((word) => word[0]?.toUpperCase())
        .join("") || "U"
    );
  };

  return (
    <header className="sticky top-0 z-40 h-16 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="flex h-full items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}

        <Link
          to="/dashboard"
          className="flex items-center gap-2.5"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-lg font-bold text-white shadow-sm">
            N
          </div>

          <div className="hidden sm:block">
            <p className="text-lg font-bold tracking-tight text-slate-900">
              NOVA
            </p>
            <p className="hidden text-[10px] font-medium uppercase tracking-[0.18em] text-slate-400 lg:block">
              Team productivity
            </p>
          </div>
        </Link>

        {/* Right side */}

        <div className="relative flex items-center gap-2 sm:gap-4">
          {/* User information */}

          <div className="hidden items-center gap-3 sm:flex">
            <div className="text-right">
              <p className="text-sm font-semibold leading-5 text-slate-800">
                {user?.name || "User"}
              </p>

              <p className="max-w-[180px] truncate text-xs text-slate-500">
                {user?.email || ""}
              </p>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">
              {getInitials(user?.name)}
            </div>
          </div>

          {/* Mobile user avatar */}

          <button
            type="button"
            onClick={() => setMenuOpen((current) => !current)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700 transition hover:bg-indigo-200 sm:hidden"
            aria-label="Open user menu"
            aria-expanded={menuOpen}
          >
            {getInitials(user?.name)}
          </button>

          {/* Desktop logout */}

          <button
            type="button"
            onClick={logout}
            className="hidden rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 sm:block"
          >
            Logout
          </button>

          {/* Mobile dropdown */}

          {menuOpen && (
            <div className="absolute right-0 top-12 w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg sm:hidden">
              <div className="border-b border-slate-100 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">
                    {getInitials(user?.name)}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900">
                      {user?.name || "User"}
                    </p>

                    <p className="truncate text-xs text-slate-500">
                      {user?.email || ""}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-2">
                <Link
                  to="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
                >
                  Profile
                </Link>

                <button
                  type="button"
                  onClick={async () => {
                    setMenuOpen(false);
                    await logout();
                  }}
                  className="w-full rounded-xl px-3 py-2.5 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;