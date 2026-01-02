import { get_image } from "@/helpers/client";
import { Link } from "@tanstack/react-router";
import type { BannersResponse, ProductsRecord } from "pocketbase-types";

export default function HeroGrid({ items }: { items: BannersResponse[] }) {
  return (
    <div className="flex-1  grid grid-cols-2 gap-4 p-4">
      <div className="bg-primary flex rounded-box">
        <ImageCard item={items[0]} />
      </div>
      <div className="flex flex-col gap-4 rounded-box">
        <ImageCard item={items[1]} />
        <ImageCard item={items[1]} />
      </div>
    </div>
  );
}
const ImageCard = ({
  item,
}: {
  item: BannersResponse<{ product_id?: ProductsRecord }>;
}) => {
  if (!item) return <></>;
  return (
    <Link
      to={`/app/product/${item.expand["product_id"].id}`}
      className="flex-1 rounded-box isolate object-cover overflow-hidden relative flex group"
    >
      <img
        src={get_image(item, item.banner_img)}
        className="flex-1 object-cover rounded-box transition-transform duration-300 group-hover:scale-110"
        alt=""
      />
      <div className="m-1 absolute bottom-0 ring fade p-4 z-10 bg-base-100/80 backdrop-blur-md left-0 right-0 rounded-box flex">
        <div>
          <h2 className="text-sm font-bold line-clamp-1">{item.title}</h2>
          <p className="line-clamp-1 text-xs">
            {item.expand["product_id"].description}
          </p>
        </div>
        <span className="divider  divider-horizontal"></span>
        <p className="text-xs self-center ml-auto ">
          <span className="">
            N {item.expand["product_id"]?.price?.toLocaleString()}
          </span>
        </p>
      </div>
    </Link>
  );
};
