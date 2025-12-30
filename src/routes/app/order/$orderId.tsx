import { pb } from "@/api/apiClient";
import PageLoader from "@/components/layouts/PageLoader";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useParams } from "@tanstack/react-router";

export const Route = createFileRoute("/app/order/$orderId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { orderId } = useParams({
    strict: false,
  });
  const query = useQuery({
    queryKey: ["order", orderId],
    queryFn: async () => {
      let resp = pb.collection("orders").getOne(orderId, {
        expand: "productId",
      });
      return resp;
    },
  });
  return (
    <div className="mx-auto container px-4 min-h-screen py-12 space-y-4">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold">Order Details</h1>
        <p className="text-xl">Order ID: {orderId}</p>
      </div>

      <PageLoader query={query}>
        {(data) => {
          return (
            <>
              <div className="ring p-4 rounded-box fade">
                {JSON.stringify(data)}
              </div>
            </>
          );
        }}
      </PageLoader>
    </div>
  );
}
