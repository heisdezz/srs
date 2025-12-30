import { createFileRoute } from "@tanstack/react-router";
import OrderTracking from "./-components/OrderTracking";
import PageContainer from "@/components/layouts/PageContainer";
import { useQuery } from "@tanstack/react-query";
import { pb } from "@/api/apiClient";
import PageLoader from "@/components/layouts/PageLoader";
import { convert_to_array, get_image } from "@/helpers/client";
import type { OptionsConfig } from "@/types";
import OrderCard from "./-components/OrderCard";

interface OrderSearch {
  status: "pending" | "completed" | "cancelled" | "in transit" | "all";
}
export const Route = createFileRoute("/app/orders/")({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>): OrderSearch => {
    return {
      status:
        (search.status as
          | "pending"
          | "completed"
          | "cancelled"
          | "in transit") || "all",
    };
  },
});

function RouteComponent() {
  const query = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      let resp = await pb.collection("orders").getList(1, 10, {
        expand: "productId",
      });
      return resp;
    },
  });
  return (
    <PageContainer>
      <div>
        <h2 className="text-xl font-bold border-b py-4 fade">Order Items</h2>
        <PageLoader query={query}>
          {(data) => {
            return (
              <>
                <ul className="space-y-4 menu w-full">
                  {data.items.map((item) => {
                    return (
                      <>
                        <li key={item.id}>
                          <a className="flex p-0 rounded-box">
                            <OrderCard item={item as any} />
                          </a>
                        </li>
                      </>
                    );
                  })}
                </ul>
              </>
            );
          }}
        </PageLoader>
      </div>
    </PageContainer>
  );
}
