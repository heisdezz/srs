import { Search, Bell, ChevronDown } from "lucide-react";

export default function AdminNavBar() {
  return (
    <div className="navbar bg-base-100 border-b px-4 h-20 fade ">
      <div className="flex-1">
        <h1 className="text-2xl font-bold text-slate-900">Overview</h1>
      </div>

      <div className="flex-none gap-2 flex items-center">
        <button className="btn btn-ghost btn-circle">
          <Search size={20} />
        </button>
        <div className="dropdown dropdown-end">
          <button className="btn btn-ghost btn-circle">
            <div className="indicator">
              <Bell size={20} />
              <span className="badge badge-xs badge-error indicator-item"></span>
            </div>
          </button>
        </div>
        <div className="dropdown dropdown-end ">
          <button
            tabIndex={0}
            role="button"
            className="btn btn-ghost rounded-full flex items-center gap-2 h-auto py-2  btn-secondary border-none normal-case"
          >
            <div className="avatar">
              <div className="w-8 rounded-full">
                <img
                  src="https://picsum.photos/seed/picsum/450/300"
                  alt="Zoia M."
                />
              </div>
            </div>
            <span className="text-sm font-medium">Zoia M.</span>
            <ChevronDown size={16} className="" />
          </button>
          <ul
            tabIndex={0}
            className="mt-3  p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
          >
            <li>
              <a>Profile</a>
            </li>
            <li>
              <a>Settings</a>
            </li>
            <li>
              <a>Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
