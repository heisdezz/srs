import { pb } from "@/api/apiClient";
import PageLoader from "@/components/layouts/PageLoader";
import SimpleCarousel from "@/components/SimpleCarousel";
import { get_image } from "@/helpers/client";
import type { OptionsConfig } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useParams } from "@tanstack/react-router";
import type { ProductsRecord } from "pocketbase-types";

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
          const product = data.expand[
            "productId"
          ] as ProductsRecord<OptionsConfig>;
          return (
            <>
              <div className="ring mx-auto max-w-2xl p-4 rounded-box fade">
                <SimpleCarousel>
                  {data.expand["productId"].images.map((item) => {
                    return (
                      <div className="h-120 flex">
                        {/*{JSON.stringify(item.)}*/}
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
                    {/*{product.discountPrice && (
                      <p className="text-lg text-gray-500 line-through">
                        ${product.price.toFixed(2)}
                      </p>
                    )}*/}
                  </div>
                  <p className="text-sm text-gray-600">
                    Quantity: {product.quantity}
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
                </div>
              </div>
            </>
          );
        }}
      </PageLoader>
    </div>
  );
}
