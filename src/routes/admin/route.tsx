import PageContainer from "@/components/layouts/PageContainer";
import { useUser } from "@/helpers/client";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import AdminNavBar from "./-components/AdminNavBar";

export const Route = createFileRoute("/admin")({
  component: RouteComponent,
  loader: () => {
    const user = useUser();
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

          <main className="space-y-12">
            <PageContainer>
              <Outlet />
            </PageContainer>
          </main>
          {/*<DrawerContent />*/}
        </div>
        <div className="drawer-side">
          <label
            htmlFor="app-drawer"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <div className=" bg-base-200 min-h-full w-2xs md:border-r fade flex">
            {/* Sidebar content here */}
            {/*<AppDrawer />*/}
          </div>
        </div>
      </div>
    </>
  );
}
