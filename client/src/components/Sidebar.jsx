import { useState } from "react";
import { NavLink } from "react-router-dom";

function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const mainLinks = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="h-5 w-5"
        >
          <rect x="3" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" />
        </svg>
      )
    },
    {
      name: "Projects",
      path: "/projects",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="h-5 w-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 7.5A2.5 2.5 0 0 1 5.5 5h4l2 2h7A2.5 2.5 0 0 1 21 9.5v8A2.5 2.5 0 0 1 18.5 20h-13A2.5 2.5 0 0 1 3 17.5v-10Z"
          />
        </svg>
      )
    },
    {
      name: "Tasks",
      path: "/tasks",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="h-5 w-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 11l3 3L21 5"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 12v5.5A2.5 2.5 0 0 1 18.5 20h-13A2.5 2.5 0 0 1 3 17.5v-13A2.5 2.5 0 0 1 5.5 2H14"
          />
        </svg>
      )
    }
  ];

  const secondaryLinks = [
    {
      name: "Profile",
      path: "/profile",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="h-5 w-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M20 21a8 8 0 0 0-16 0"
          />
          <circle cx="12" cy="7" r="4" />
        </svg>
      )
    }
  ];

  const linkClass = ({ isActive }) =>
    `group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200 ${
      isActive
        ? "bg-indigo-50 text-indigo-700 shadow-sm"
        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
    }`;

  const renderLinks = (links) =>
    links.map((link) => (
      <NavLink
        key={link.path}
        to={link.path}
        onClick={() => setMobileOpen(false)}
        className={linkClass}
      >
        {({ isActive }) => (
          <>
            <span
              className={`flex h-8 w-8 items-center justify-center rounded-lg transition ${
                isActive
                  ? "bg-indigo-100 text-indigo-600"
                  : "text-slate-400 group-hover:text-slate-600"
              }`}
            >
              {link.icon}
            </span>

            <span>{link.name}</span>
          </>
        )}
      </NavLink>
    ));

  return (
    <>

      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="fixed bottom-5 left-5 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700 md:hidden"
        aria-label="Open navigation"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="h-5 w-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {mobileOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/30 backdrop-blur-sm md:hidden"
        />
      )}

      {/* Desktop sidebar */}

      <aside className="hidden min-h-[calc(100vh-64px)] w-64 shrink-0 border-r border-slate-200 bg-white md:block">
        <div className="sticky top-16 flex h-[calc(100vh-64px)] flex-col p-4">
          <nav className="flex-1">
            <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
              Workspace
            </p>

            <div className="space-y-1">
              {renderLinks(mainLinks)}
            </div>

            <p className="mb-3 mt-8 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
              Account
            </p>

            <div className="space-y-1">
              {renderLinks(secondaryLinks)}
            </div>
          </nav>

          <div className="mt-6 rounded-2xl bg-slate-900 p-4 text-white">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
              <span className="text-sm">✦</span>
            </div>

            <p className="text-sm font-semibold">
              Stay organized
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-400">
              Manage projects, tasks and your team from one place.
            </p>
          </div>
        </div>
      </aside>

      {/* Mobile sidebar */}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 transform border-r border-slate-200 bg-white shadow-2xl transition-transform duration-300 md:hidden ${
          mobileOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col p-4">

          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-sm font-bold text-white">
                N
              </div>

              <div>
                <p className="text-base font-bold text-slate-900">
                  NOVA
                </p>

                <p className="text-[9px] font-medium uppercase tracking-[0.16em] text-slate-400">
                  Productivity
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              aria-label="Close navigation"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 6l12 12M18 6L6 18"
                />
              </svg>
            </button>
          </div>

          <nav className="flex-1">
            <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
              Workspace
            </p>

            <div className="space-y-1">
              {renderLinks(mainLinks)}
            </div>

            <p className="mb-3 mt-8 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
              Account
            </p>

            <div className="space-y-1">
              {renderLinks(secondaryLinks)}
            </div>
          </nav>

          <div className="rounded-2xl bg-slate-900 p-4 text-white">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
              ✦
            </div>

            <p className="text-sm font-semibold">
              Stay organized
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-400">
              Keep your projects and tasks moving forward.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;