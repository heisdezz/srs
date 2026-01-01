import { compute_total_price, get_image } from "@/helpers/client";
import { useCartStore } from "@/store/client";
import type { CartItem } from "@/types";

export default function CartListItem({ item }: { item: CartItem }) {
  const { remove_from_cart } = useCartStore();
  return (
    <>
      <div
        key={item.id}
        className="bg-base-200 ring fade p-4 flex gap-4 rounded-box "
      >
        <figure className="h-22 w-22 lg:aspect-9/12  lg:h-auto lg:min-w-32 ring fade  shrink-0 rounded-box bg-primary/30 overflow-hidden">
          <img
            src={item.img}
            alt=""
            className="w-full h-full fade object-cover"
          />
        </figure>
        {/*item details*/}
        <div className="flex-grow flex flex-col justify-between">
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold">{item.name}</h2>
            {Object.entries(item.options).map(([key, option]) => (
              <p key={key} className="text-sm">
                <span className="font-semibold capitalize">{key}</span>:{" "}
                {option.values[0].label}
              </p>
            ))}
          </div>
          <div className="flex flex-col lg:flex-row gap-2  lg:items-center justify-between mt-4">
            <QuantityInput id={item.id} quantity={item.quantity} />
            <div className="text-lg font-bold">
              <span>NGN</span>{" "}
              {compute_total_price(
                item.price,
                item.options,
                item.quantity,
              ).toFixed(2)}
            </div>
          </div>

          <div className="flex gap-4 mt-2">
            <button
              onClick={() => {
                console.log(item);
              }}
              className="btn btn-link btn-sm p-0 h-auto min-h-0"
            >
              Move to Favorites
            </button>
            <button
              className="btn btn-link btn-sm p-0 h-auto min-h-0"
              onClick={() => remove_from_cart(item.id)}
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

const QuantityInput = (props: { id: string; quantity: number }) => {
  const cartProps = useCartStore();

  const handleQuantityChange = (action: "increase" | "decrease") => {
    action === "increase"
      ? cartProps.increase_quantity(props.id)
      : cartProps.decrease_quantity(props.id);
  };
  const { quantity } = props;
  return (
    <>
      <div className="form-control">
        <div className="join">
          <button
            type="button"
            className="btn join-item btn-primary"
            onClick={() => handleQuantityChange("decrease")}
            disabled={quantity === 1}
          >
            -
          </button>
          <div className="btn btn-primary btn-soft ring fade">{quantity}</div>
          <button
            type="button"
            className="btn join-item btn-primary"
            onClick={() => handleQuantityChange("increase")}
          >
            +
          </button>
        </div>
      </div>
    </>
  );
};
