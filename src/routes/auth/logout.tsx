import { pb } from "@/api/apiClient";
import { useUser } from "@/helpers/client";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/auth/logout")({
  component: RouteComponent,
  loader: async () => {
    return redirect({ to: "/app" });
  },
  beforeLoad: () => {
    return pb.authStore.clear();
  },
});

function RouteComponent() {
  const { user } = useUser();
  return (
    <div>
      Hello "/auth/logout"!
      {JSON.stringify(user)}
    </div>
  );
}
