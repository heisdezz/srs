import { pb } from "@/api/apiClient";
import PageLoader from "@/components/layouts/PageLoader";
import SimpleCarousel from "@/components/SimpleCarousel";
import { get_image } from "@/helpers/client";
import type { OptionsConfig } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useParams } from "@tanstack/react-router";
import type { ProductsRecord, UsersRecord } from "pocketbase-types";
import OrderStatus from "./-components/AdminOrderStatus";
import { ShippingAddress } from "../-components/AdminOrderCard";

export const Route = createFileRoute("/admin/order/$orderId")({
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
        expand: "productId, userId, deliverySettings_via_user_id",
      });
      return resp;
    },
  });
  return (
    <div className="mx-auto container px-4 min-h-screen py-6 space-y-4">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold">Order Details</h1>
        <p className="text-xl">Order ID: {orderId}</p>
      </div>

      <PageLoader query={query}>
        {(data) => {
          const product = data.expand[
            "productId"
          ] as ProductsRecord<OptionsConfig>;

          const user = data.expand["userId"] as UsersRecord;

          return (
            <>
              <div className="mx-auto max-w-4xl mb-6">
                <OrderStatus refetch={query.refetch} status={data.status} />
              </div>

              <div className="mx-auto max-w-4xl ring p-4 rounded-box fade mb-6">
                <h3 className="text-lg font-bold mb-2 border-b pb-2">
                  Customer Information
                </h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <p className="font-semibold">Name:</p>
                  <p>{user.fullName || "N/A"}</p>
                  <p className="font-semibold">Email:</p>
                  <p>{user.email}</p>
                  <p className="font-semibold">User ID:</p>
                  <p className="font-mono text-xs">{user.id}</p>
                  {/*<p className="font-semibold">Verified:</p>
                  <p>{user.verified ? "✅ Yes" : "❌ No"}</p>*/}
                </div>
              </div>

              <div className="ring mx-auto max-w-4xl p-4 rounded-box fade">
                <SimpleCarousel>
                  {data.expand["productId"].images.map((item: string) => {
                    return (
                      <div key={item} className="h-120 bg-base-300 flex">
                        <img
                          className="flex-1 object-contain"
                          src={get_image(data.expand["productId"], item)}
                        />
                      </div>
                    );
                  })}
                </SimpleCarousel>

                <div>
                  <h2 className="text-2xl font-bold mt-4">{product.name}</h2>
                  <p className="text-lg text-gray-700">{product.description}</p>
                  <div className="flex flex-col gap-2 my-4 ring p-4 fade rounded-box">
                    <p className="text-md font-semibold">
                      Price: N {data.price.toLocaleString()}
                    </p>
                    <p className="text-xl font-semibold text-primary">
                      Total: N{" "}
                      {(data.price + data.deliveryFee).toLocaleString()}
                    </p>
                  </div>
                  <p className="text-current/80 text-lg font-bold">
                    Quantity:
                    <span className="text-info"> {data.quantity} Items</span>
                  </p>
                  {product.options && (
                    <div className="mt-4">
                      <h3 className="text-lg font-semibold mb-2">Options:</h3>
                      <ul className="list-disc list-inside bg-gray-100 p-4 rounded-box ring fade text-sm space-y-4">
                        {Object.entries(product.options).map(
                          ([key, option]) => (
                            <li key={key}>
                              {option.label}: {option.values[0]?.label}
                            </li>
                          ),
                        )}
                      </ul>
                    </div>
                  )}
                  <ShippingAddress user_id={data.userId} />
                </div>
              </div>
            </>
          );
        }}
      </PageLoader>
    </div>
  );
}
