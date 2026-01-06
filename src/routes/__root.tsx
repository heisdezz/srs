import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { TanStackDevtools } from "@tanstack/react-devtools";
import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useUser, validate_user } from "@/helpers/client";

const client = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        // PocketBase returns 404 when record not found
        if (error?.status === 404) return false;

        // Optional: stop after 2 retries
        return failureCount < 2;
      },
    },
  },
});
export const Route = createRootRoute({
  loader: async () => {
    try {
      await validate_user();
    } catch (err) {
      return null;
    }
  },
  component: () => {
    return (
      <>
        <>
          <QueryClientProvider client={client}>
            <Outlet />
          </QueryClientProvider>
          <Toaster richColors position="top-right" />
          <TanStackDevtools
            config={{
              position: "bottom-right",
            }}
            plugins={[
              {
                name: "Tanstack Router",
                render: <TanStackRouterDevtoolsPanel />,
              },
            ]}
          />
        </>
      </>
    );
  },
});
