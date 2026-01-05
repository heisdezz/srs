import { pb } from "@/api/apiClient";
import CompContainer from "@/components/layouts/CompContainer";
import { render_status } from "@/helpers/ui";
import { useQuery } from "@tanstack/react-query";
import type { ProductsRecord } from "pocketbase-types";

export default function RecentOrders() {
  const query = useQuery({
    queryKey: ["orders-admin"],
    queryFn: () =>
      pb.collection("orders").getList(1, 20, {
        expand: "productId",
        filter: "status = 'pending'",
      }),
  });
  return (
    <CompContainer title="Recent Orders">
      <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,auto))] gap-4">
        {query.data?.items.map((order) => {
          const product = order.expand?.["productId"] as ProductsRecord;
          const date = new Date(order.created).toLocaleDateString("en-US", {
            weekday: "short",
            month: "long",
            day: "numeric",
            year: "numeric",
          });
          const time = new Date(order.created).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          });

          return (
            <div
              key={order.id}
              className="card ring fade bg-base-100 shadow-xl border border-base-200"
            >
              <div className="card-body p-5">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="card-title text-sm opacity-70 uppercase">
                      Order #{order.refId || order.id.slice(0, 5)}
                    </h2>
                    <p className="font-bold text-lg">
                      {product?.name || "Product"}
                    </p>
                  </div>
                  <div>{render_status(order.status)}</div>
                </div>

                <div className="divider my-1"></div>

                <div className="flex justify-between text-sm">
                  <span className="opacity-60">{date}</span>
                  <span className="font-medium">Qty: {order.quantity}</span>
                </div>

                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm opacity-60">Total Amount</span>
                  <span className="text-xl font-bold text-primary">
                    ${((order.price || 0) * (order.quantity || 1)).toFixed(2)}
                  </span>
                </div>

                <div className="card-actions justify-end mt-4">
                  <button className="btn btn-ghost btn-sm">Details</button>
                  <button className="btn btn-primary btn-sm">Manage</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </CompContainer>
  );
}
