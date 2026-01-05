import PageContainer from "@/components/layouts/PageContainer";
import { useUser } from "@/helpers/client";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import AdminNavBar from "./-components/AdminNavBar";

export const Route = createFileRoute("/admin")({
  component: RouteComponent,
  loader: () => {
    const { user } = useUser();
    if (user.collectionName != "admins")
      return redirect({
        to: "/",
        replace: true,
      });

    return null;
  },
});

function RouteComponent() {
  return (
    <>
      <div className="drawer lg:drawer-open">
        <input id="app-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content ">
          {/* Page content here */}
          {/*<label htmlFor="products-drawer" className="btn drawer-button lg:hidden">
          Open drawer
        </label>*/}
          <AdminNavBar />
          <main className="p-4 pt-8 container mx-auto space-y-8">
            <Outlet />
          </main>
          {/*<DrawerContent />*/}
        </div>
        <div className="drawer-side">
          <label
            htmlFor="app-drawer"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <div className=" bg-base-200 min-h-full w-3xs md:border-r fade flex">
            {/* Sidebar content here */}
            {/*<AppDrawer />*/}
          </div>
        </div>
      </div>
    </>
  );
}
