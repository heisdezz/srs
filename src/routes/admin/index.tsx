import { createFileRoute } from "@tanstack/react-router";
import AdminDashStats from "./-components/AdminDashStats";
import PageHeader from "@/components/Headers/PageHeader";

export const Route = createFileRoute("/admin/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <PageHeader title="DashBoard" />
      <AdminDashStats />
    </div>
  );
}
