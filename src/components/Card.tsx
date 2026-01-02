import { Link } from "@tanstack/react-router";
import { Star } from "lucide-react";
import type { ProductsResponse } from "pocketbase-types"; // Updated import path to ProductsResponse
import { get_image } from "@/helpers/client"; // Import get_image helper

export default function Card(props: { item: ProductsResponse }) {
  // Use ProductsResponse for item prop
  const { item } = props;
  const price = item.price || 0; // Use item.price from the ProductsRecord
  const discountPrice = item.discountPrice || price; // Use item.discountPrice, or price if not set

  // Get the first image URL, or a placeholder if no images are available
  const imageUrl =
    item.images && item.images.length > 0
      ? get_image(item, item.images[0])
      : "https://fastly.picsum.photos/id/866/536/354.jpg?hmac=tGofDTV7tl2rprappPzKFiZ9vDh5MKj39oa2D--gqhA";

  return (
    <Link to={`/app/product/${item.id}`} className="relative">
      <div className="absolute rounded-t-box top-0 left-0 right-0 p-2 bg-linear-180 from-neutral/40 via-neutral/20">
        <span className="badge badge-primary">
          <Star className="fill-current size-3" /> 4.5 / 5{" "}
          <span className="text-current/60">(425)</span>
        </span>
      </div>
      <div className="h-52 flex rounded-box ring overflow-hidden fade">
        <figure className="flex-1 flex  bg-base-300 rounded-t-box overflow-hidden">
          <img
            className="flex-1 object-contain"
            src={imageUrl} // Use the dynamically generated image URL
            alt={item.name || "Product image"} // Use item.name for alt text
          />
        </figure>
      </div>
      {/*//product info*/}
      <div className="flex flex-col space-y-2 p-4 flex-1   -mt-8 z-20 ring fade rounded-b-box">
        <div aria-label="product status">
          <span className="badge badge-soft badge-success ring fade">
            New In
          </span>
        </div>
        <h2 className="text-xl font-bold ">{item.name || "Product Name"} </h2>{" "}
        {/* Use item.name */}
        <p className="text-base-content/80 line-clamp-3 h-20">
          {item.description || "No description available."}{" "}
          {/* Use item.description */}
        </p>
        {/*price*/}
        <div className="stats ring fade mt-auto">
          <div className="stat ">
            <p className="stat-title">Original Price</p>
            <p className="text-base line-through text-error  font-semibold">
              N {price.toLocaleString()}
            </p>{" "}
            {/* Use original price */}
          </div>
          <div className="stat ">
            <p className="stat-title">Discount Price</p>
            <p className="text-base font-bold">
              N {discountPrice.toLocaleString()}
            </p>{" "}
            {/* Use discountPrice */}
          </div>
        </div>
      </div>
    </Link>
  );
}
