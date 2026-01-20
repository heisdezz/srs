import { createFileRoute, useSearch } from "@tanstack/react-router";
import OrderTracking from "./-components/OrderTracking";
import PageContainer from "@/components/layouts/PageContainer";
import { useQuery } from "@tanstack/react-query";
import { pb } from "@/api/apiClient";
import PageLoader from "@/components/layouts/PageLoader";
import { convert_to_array, get_image } from "@/helpers/client";
import type { OptionsConfig } from "@/types";
import OrderCard from "./-components/OrderCard";
import EmptyList from "@/components/EmptyList";
import { Filter } from "lucide-react";

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
  const search = useSearch({
    strict: false,
  });
  const status = search["status"];
  const query = useQuery({
    queryKey: ["orders", status],
    queryFn: async () => {
      let resp = await pb.collection("orders").getList(1, 10, {
        expand: "productId",
        filter: status === "all" ? undefined : `status = '${status}'`,
      });
      return resp;
    },
  });
  return (
    <PageContainer>
      <div>
        <div className="flex items-center  border-b h-18 fade">
          <h2 className="text-xl font-bold ">Order Items</h2>
          <label
            htmlFor="order-drawer"
            className="btn btn-primary btn-sm btn-soft ring fade btn-square ml-auto"
          >
            <Filter className="size-4" />
          </label>
        </div>
        <PageLoader query={query}>
          {(data) => {
            return (
              <>
                <EmptyList list={data.items} />
                <ul className="space-y-4">
                  {data.items.map((item) => {
                    return (
                      <>
                        <li key={item.id}>
                          <OrderCard item={item as any} />
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
