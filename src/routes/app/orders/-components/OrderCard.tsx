import { convert_to_array, get_image } from "@/helpers/client";
import type { OptionsConfig, OrderType } from "@/types";
import { Link } from "@tanstack/react-router";
import type { OrdersRecord } from "pocketbase-types";

export default function OrderCard({
  item,
}: {
  item: OrdersRecord<OptionsConfig>;
}) {
  const options_array = convert_to_array(
    item["productOptions"] as OptionsConfig,
  );
  const { arr } = options_array;
  return (
    <Link
      to={"/app/order/$orderId"}
      params={{
        //@ts-ignore
        orderId: item.id,
      }}
      className="card flex-1  card-side  shadow-xl p-2 h-28 ring fade"
    >
      <figure className="aspect-square h-full rounded-box overflow-hidden">
        <img
          src={get_image(
            //@ts-ignore
            item.expand.productId,
            //@ts-ignore

            item.expand.productId.images[0],
          )}
          className="w-full h-full object-cover"
          alt={item["expand"]["productId"].name}
        />
      </figure>
      <div className="card-body p-2 ml-2 flex flex-col justify-between border-r fade">
        <h2 className="card-title text-base">
          {item["expand"]["productId"].name}
        </h2>
        <div className="flex gap-2 flex-wrap">
          {arr.map((opt, index) => {
            return (
              <span
                key={index}
                className="badge badge-info badge-outline badge-sm"
              >
                {opt["values"][0].label}
              </span>
            );
          })}
        </div>
        <div className="text-sm">Quantity: {item.quantity}</div>
      </div>
      <div className="ml-auto flex flex-col justify-center items-end gap-1 p-2 ">
        <h2 className="text-sm w-full">
          <span>Price: </span>N {item.price}
        </h2>
        <div className="text-lg font-bold">
          Total: N {item.price + item.deliveryFee}
        </div>
      </div>
    </Link>
  );
}
