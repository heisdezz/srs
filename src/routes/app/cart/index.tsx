import { compute_total_price } from "@/helpers/client";
import { useCartStore } from "@/store/client";
import { createFileRoute } from "@tanstack/react-router";
import CartListItem from "./-components/CartItem";
import Checkout from "./-components/Checkout";
import EmptyList from "@/components/EmptyList";
import { useQuery } from "@tanstack/react-query";
import { pb } from "@/api/apiClient";
import PageLoader from "@/components/layouts/PageLoader";
import type { CartRequestType, UserCart } from "@/types";

export const Route = createFileRoute("/app/cart/")({
  component: RouteComponent,
});
export interface CartResponse {
  delivery_fee: number;
  // fees: {
  //   deliveryFee: number;
  //   totalFees: number;
  // };
  location: {
    city: string;
    collectionId: string;
    collectionName: string;
    country: string;
    created: string;
    id: string;
    lat: number;
    lng: number;
    state: string;
    street: string;
    updated: string;
    user_id: string;
    zip: string;
  };
  message: string;
  opt: any[]; // You might want to define a more specific type for 'opt' if possible
  out_of_stock: Record<string, any>; // Assuming out_of_stock is an object with string keys and any values
  sub_total_fees: number;
  total_fees: number;
}

const generate_cart_request = (cart: UserCart): CartRequestType[] => {
  const keys = Object.keys(cart);
  return keys.map((key) => {
    const item = cart[key];
    // Check if the options object is not empty
    const hasOptions = Object.keys(item.options).length > 0;
    return {
      productId: key,
      quantity: item.quantity,
      options: hasOptions ? item.options : null, // If no options, send an empty object
    };
  });
};
function RouteComponent() {
  const { add_to_cart, cart, cart_array } = useCartStore();
  const cart_length = cart_array.length;
  const keys = Object.keys(cart);
  const requests = generate_cart_request(cart);

  const query = useQuery<CartResponse>({
    queryKey: ["db_cart", cart],
    queryFn: async () => {
      if (!pb.send) return;
      let resp = await pb.send("/api/cart", {
        method: "POST",
        body: {
          cart: requests,
        },
      });
      return resp;
    },
    enabled: keys.length > 0,
  });
  const dummy_arr = [1, 2, 3];

  return (
    <>
      <PageLoader
        query={query}
        customLoading={
          <>
            <section className="container mx-auto px-4 py-12 space-y-4">
              <h2 className="text-3xl font-bold">Cart Items ({cart_length})</h2>
              <div className=" flex gap-4  ">
                <div className="flex-1 flex flex-col gap-2 ">
                  {dummy_arr.map((item) => {
                    return (
                      <div className=" card min-h-24 card-compact rounded-sleek bg-base-100 ring fade shadow-md p-4 flex flex-row skeleton"></div>
                    );
                  })}
                  {/*{cart_array.map((item) => (
                    <CartListItem
                      item={item}
                      out_of_stock={!!resp.out_of_stock[item.id]}
                    />
                  ))}*/}
                  <EmptyList list={cart_array} />
                  <div className=" lg:hidden ">
                    <div className="w-full h-[420px] skeleton"></div>
                    {/*<Checkout cartResponse={resp} />*/}
                  </div>
                </div>

                <div className="flex-1 hidden lg:block max-w-md bg-base-300/20 ">
                  <div className="w-full h-[420px] skeleton"></div>
                </div>
              </div>
            </section>
          </>
        }
      >
        {(data) => {
          const resp = data;
          return (
            <>
              <section className="container mx-auto px-4 py-12 space-y-4">
                <h2 className="text-3xl font-bold">
                  Cart Items ({cart_length})
                </h2>
                <div className=" flex gap-4  ">
                  <div className="flex-1 flex flex-col gap-2 ">
                    {cart_array.map((item) => (
                      <CartListItem
                        item={item}
                        out_of_stock={!!resp.out_of_stock[item.id]}
                      />
                    ))}
                    <EmptyList list={cart_array} />
                    <div className=" lg:hidden">
                      <Checkout cartResponse={resp} />
                    </div>
                  </div>

                  <div className="flex-1 hidden lg:block max-w-md bg-base-300/20">
                    <Checkout cartResponse={resp} />
                  </div>
                </div>
              </section>
            </>
          );
        }}
      </PageLoader>
    </>
  );
  // return (
  //   <section className="container mx-auto px-4 py-12 space-y-4">
  //     <h2 className="text-3xl font-bold">Cart Items ({cart_length})</h2>
  //     <div className=" flex gap-4  ">
  //       <div className="flex-1 flex flex-col gap-2 ">
  //         {cart_array.map((item) => (
  //           <CartListItem item={item} />
  //         ))}
  //         <EmptyList list={cart_array} />
  //         <div className=" lg:hidden">
  //           <Checkout />
  //         </div>
  //       </div>

  //       <div className="flex-1 hidden lg:block max-w-md bg-base-300/20">
  //         <Checkout />
  //       </div>
  //     </div>
  //   </section>
  // );
}
