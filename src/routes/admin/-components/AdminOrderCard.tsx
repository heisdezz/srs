import { pb } from "@/api/apiClient";
import CompLoader from "@/components/layouts/ComponentLoader";
import { render_status } from "@/helpers/ui";
import { validate_addr } from "@/store/client";
import type { OptionsConfig } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import type {
  OrdersRecord,
  OrdersResponse,
  ProductsRecord,
} from "pocketbase-types";

export default function AdminOrderCard({
  order,
}: {
  order: OrdersResponse<OptionsConfig, ProductsRecord>;
}) {
  const [showAddress, setShowAddress] = useState(false);
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
  const productOptions = order["productOptions"] as OptionsConfig;
  const keys = Object.keys(productOptions);

  return (
    <div
      key={order.id}
      className="card ring fade bg-base-100 shadow border border-base-200"
    >
      <div className="card-body p-5">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="card-title text-sm opacity-70 uppercase">
              Order #{order.refId || order.id.slice(0, 5)}
            </h2>
            <p className="font-bold text-lg">{product?.name || "Product"}</p>
          </div>
          <div>{render_status(order.status as any)}</div>
        </div>
        <div className="divider my-1"></div>
        <div className="flex justify-between text-sm">
          <span className="opacity-60">{date}</span>
          <span className="font-medium">Qty: {order.quantity}</span>
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className="text-sm opacity-60">Total Amount</span>
          <span className="text-xl font-bold text-primary">
            N {(order.price + order.deliveryFee).toLocaleString()}
          </span>
        </div>
        {keys.length > 0 && (
          <>
            <div className="ring p-2 ring-primary/30 rounded-box fade">
              {keys.map((item) => {
                return (
                  <div key={item}>
                    <span>{item}: </span>
                    {productOptions[item].values[0].label}
                  </div>
                );
              })}
            </div>
          </>
        )}

        {showAddress ? (
          <ShippingAddress user_id={order.userId} />
        ) : (
          <button
            onClick={() => setShowAddress(true)}
            className="btn btn-soft ring fade btn-sm w-full mt-2"
          >
            Show Shipping Address
          </button>
        )}

        <div className="card-actions justify-end mt-auto pt-4">
          <button className="btn btn-ghost btn-sm">Details</button>
          <Link to={`/admin/order/${order.id}`} className="btn btn-info btn-sm">
            Manage
          </Link>
        </div>
      </div>
    </div>
  );
}

export const ShippingAddress = ({ user_id }) => {
  const query = useQuery({
    queryKey: ["shipping-address", user_id],
    queryFn: async () => pb.collection("deliverySettings").getOne(user_id),
    enabled: !!user_id,
  });

  return (
    <div className="min-h-20 ring rounded-box fade mt-2">
      <h2 className="p-2 text-sm font-bold text-current/80 bg-base-200 border-b fade">
        Shipping Address
      </h2>
      <div className="p-2 flex">
        <CompLoader
          query={query}
          customError={(error) => {
            return (
              <div className="flex gap-2 items-center p-2">
                <span>{error}</span>
                <button
                  onClick={() => {
                    query.refetch();
                  }}
                  className="btn btn-error btn-sm"
                >
                  Retry
                </button>
              </div>
            );
          }}
          customLoading={
            <div className="p-2 space-x-4">
              {" "}
              <span className="loading"></span>
              <span>Loading...</span>
            </div>
          }
        >
          {(data) => {
            const { full_address, isValid } = validate_addr(data);
            return <>{full_address}</>;
          }}
        </CompLoader>
      </div>
    </div>
  );
};
