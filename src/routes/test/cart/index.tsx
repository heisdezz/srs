import { pb } from "@/api/apiClient";
import { useCartStore } from "@/store/client";
import type { CartRequestType, UserCart } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/test/cart/")({
  component: RouteComponent,
});

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
  const { cart, cart_array } = useCartStore();
  const keys = Object.keys(cart);
  const requests = generate_cart_request(cart);

  const query = useQuery({
    queryKey: ["db_cart"],
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
  return (
    <div className="space-y-4 p-4 container mx-auto">
      Hello "/test/"!
      <div>
        <span>data: </span>
        {JSON.stringify(query.data)}
      </div>
      <div className="wrap-anywhere">{JSON.stringify(requests, null, 2)}</div>
    </div>
  );
}
