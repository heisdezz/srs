import ProductDetails from "./ProductDetails";
import type { ProductsRecord } from "pocketbase-types";
import type { OptionsConfig } from "@/types";
import useEmblaCarousel from "embla-carousel-react";
import { useState, useEffect } from "react";
import { get_image } from "@/helpers/client"; // Updated import path
import ProductReviews from "./ProductReviews";
import Carousel from "./Carousel";

export default function ProductInfo({
  item,
}: {
  item: ProductsRecord<OptionsConfig>;
}) {
  return (
    <div className=" space-y-4">
      <Carousel item={item} />
      <div className="md:hidden">
        <ProductDetails item={item} />
      </div>
      <ProductReviews />
    </div>
  );
}
