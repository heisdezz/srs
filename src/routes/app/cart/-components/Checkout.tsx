import { pb } from "@/api/apiClient";
import { create_config } from "@/api/payment";
import { DeliveryInfo } from "@/components/DeliveryInfo";
import {
  calculate_cart_total,
  compute_total_price,
  useUser,
} from "@/helpers/client";
import { useCartStore } from "@/store/client";
import type { CartItemOption, OrderType } from "@/types";
import { PaystackButton } from "react-paystack";
import { toast } from "sonner";

import { usePaystackPayment } from "react-paystack";
import { extract_message } from "@/helpers/api";
import type { OrdersRecord } from "pocketbase-types";
export default function Checkout() {
  const initialize = usePaystackPayment(null);
  const user = useUser();
  const props = useCartStore();
  const deliveryFee = 3374;
  const total = calculate_cart_total(props.cart) + deliveryFee;
  const config = create_config(total, "desto4q@gmail.com");
  const handlePaystackSuccessAction = (reference) => {
    console.log(reference);
  };
  const create_orders = () => {
    pb.collection("users").authRefresh();
    if (!user["user"]) {
      return toast.error("Please login to continue");
    }
    const orders = props.cart_array.map((item) => {
      const order = {
        productId: item.id,
        productOptions: item.options,
        userId: user["user"].id as string,
        refId: config.reference,
        price:
          compute_total_price(item.price, item.options, item.quantity) +
          deliveryFee,
        quantity: item.quantity,
      } satisfies OrderType;
      return order;
    });

    const send_batch = async () => {
      const batch = pb.createBatch();
      for (const order of orders) {
        batch.collection("orders").create(order);
      }
      await batch.send();
    };
    initialize({
      config: config,
      onSuccess: () => {
        toast.promise(send_batch, {
          loading: "Sending orders...",
          success: () => {
            props.clear_cart();
            return "Orders sent successfully";
          },
          error: extract_message,
        });
      },
    });
  };
  // you can call this function anything
  const handlePaystackCloseAction = () => {
    console.log("closed");
  };
  const componentProps = {
    ...config,
    text: "Check Out",
    onSuccess: (reference) => handlePaystackSuccessAction(reference),
    onClose: handlePaystackCloseAction,
  };
  return (
    <div className="p-4 ring fade rounded-box space-y-4">
      <h2 className="text-xl font-bold">Total</h2>
      <div className="ring p-4 fade rounded-box">
        <ul className="space-y-2">
          <li>
            <div className="flex items-center justify-between">
              <span>SubTotal:</span>
              <span className="text-right font-bold">
                NGN {calculate_cart_total(props.cart).toLocaleString()}
              </span>
            </div>
          </li>
          <li>
            <div className="flex items-center justify-between">
              <span>Delivery Fee:</span>
              <span className="text-right font-bold">
                {" "}
                NGN {deliveryFee.toLocaleString()}
              </span>
            </div>
          </li>
          <li>
            <div className="flex items-center justify-between">
              <span className="font-bold text-lg">Total:</span>
              <span className="text-right font-bold text-primary">
                {" "}
                NGN {total.toLocaleString()}
              </span>
            </div>
          </li>
        </ul>
      </div>
      <PaystackButton
        text="Check Out"
        className="btn btn-primary btn-block"
        {...componentProps}
      />
      <button
        onClick={() => create_orders()}
        className="btn btn-accent btn-block"
      >
        Check Out
      </button>
      <DeliveryInfo />
    </div>
  );
}
