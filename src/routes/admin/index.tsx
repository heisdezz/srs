import { createFileRoute } from "@tanstack/react-router";
import AdminDashStats from "./-components/AdminDashStats";
import PageHeader from "@/components/Headers/PageHeader";
import RecentOrders from "./-components/RecentOrders";

export const Route = createFileRoute("/admin/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <PageHeader title="DashBoard" />
      <AdminDashStats />
      <RecentOrders />
    </>
  );
}
