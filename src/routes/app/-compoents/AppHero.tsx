import React, { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { pb } from "@/api/apiClient";
import CompLoader from "@/components/layouts/ComponentLoader";
import type { BannersResponse } from "pocketbase-types";
import HeroGrid from "./HeroGrid";

export default function AppHero() {
  const query = useQuery<BannersResponse[]>({
    queryKey: ["heroBanners"],
    queryFn: async () => {
      let resp = await pb.collection("banners").getFullList({
        expand: "product_id",
      });
      return resp;
    },
  });

  return (
    <div className="min-h-155 flex w-full ">
      <CompLoader query={query}>
        {(data) => {
          return (
            <>
              <div className="flex-1 container mx-auto grid lg:grid-cols-2 gap-4">
                <div className="flex-col flex justify-center prose *:m-0 gap-6 ">
                  <h1 className="text-5xl">
                    Elevate Your Style with Exquisite Items.
                  </h1>
                  <p>
                    Explore our cultured collection of meticously crafted
                    necklaces, designed to adorn your necklace with
                    sophistication and grace
                  </p>
                  <div className="flex gap-2">
                    <button className="btn flex-1 btn-primary">
                      Exlpore Now
                    </button>
                    <button className="btn btn-primary flex-1 btn-outline">
                      Exlpore Now
                    </button>
                  </div>
                  {/*// collections*/}
                  <div className="p-6 **:m-0 ring rounded-box fade flex gap-4">
                    <div className="">
                      <h2>500+</h2>
                      <p>Collections</p>
                    </div>
                    <div className="divider divider-horizontal"></div>
                    <div>
                      <p>
                        From Timeless classics to modern statement pieces. Find
                        the perfect necklace for every occassion
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex">
                  <HeroGrid items={data} />
                </div>
              </div>
            </>
          );
        }}
      </CompLoader>
    </div>
  );
}
