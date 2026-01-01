import { createFileRoute, redirect } from "@tanstack/react-router";
import logo from "../logo.svg";
import { validate_user } from "@/helpers/client";

export const Route = createFileRoute("/")({
  component: App,
  loader: () => {
    return redirect({
      to: "/app",
    });
  },
});

function App() {
  return <>ss</>;
}
