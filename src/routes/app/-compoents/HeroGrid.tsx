import { get_image } from "@/helpers/client";
import type { BannersResponse } from "pocketbase-types";

export default function HeroGrid({ items }: { items: BannersResponse[] }) {
  return (
    <div className="flex-1  grid grid-cols-2 gap-4 p-4">
      <div className="bg-primary flex rounded-box">
        <img
          className="flex-1 object-cover rounded-box"
          src={get_image(items[0], items[0].banner_img)}
          alt=""
        />
      </div>
      <div className="flex flex-col gap-4 rounded-box">
        <img
          src={get_image(items[1], items[1].banner_img)}
          className="flex-1 rounded-box object-cover"
          alt=""
        />
        <img
          src={get_image(items[1], items[1].banner_img)}
          className="flex-1 rounded-box object-cover"
          alt=""
        />
      </div>
    </div>
  );
}
