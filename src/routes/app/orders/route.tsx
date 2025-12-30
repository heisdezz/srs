import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/app/orders")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <div className="drawer lg:drawer-open">
        <input id="order-drawer" type="checkbox" className="drawer-toggle" />
        <div className=" drawer-content">
          <Outlet />
          {/* Page content here */}
          {/*<label htmlFor="my-drawer-3" className="btn drawer-button lg:hidden">
            Open drawer
          </label>*/}
        </div>
        <div className="drawer-side">
          <label
            htmlFor="my-drawer-3"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="menu bg-base-200 min-h-full w-80 p-4">
            {/* Sidebar content here */}
            <li>
              <a>Sidebar Item 1</a>
            </li>
            <li>
              <a>Sidebar Item 2</a>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
