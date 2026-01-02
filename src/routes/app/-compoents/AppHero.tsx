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
              <div className="flex-1 container mx-auto grid lg:grid-cols-2 gap-12 px-4">
                <div className="flex-col flex justify-center prose *:m-0 gap-6 ">
                  <h1 className="text-5xl">
                    Define Your Style with Our Fashion Accessories.
                  </h1>
                  <p>
                    Discover our diverse collection of meticulously curated
                    fashion accessories for both men and women, designed to
                    complement every look with sophistication and flair.
                  </p>
                  <div className="flex gap-2">
                    <button className="btn flex-1 btn-primary">
                      Shop Men's
                    </button>
                    <button className="btn btn-primary flex-1 btn-outline">
                      Shop Women's
                    </button>
                  </div>
                  {/*// collections*/}
                  <div className="p-6 **:m-0 ring rounded-box fade flex gap-4 !mt-8">
                    <div className="">
                      <h2>500+</h2>
                      <p>Styles</p>
                    </div>
                    <div className="divider divider-horizontal"></div>
                    <div>
                      <p>
                        From timeless classics to modern statement pieces. Find
                        the perfect accessory for every occasion and
                        personality.
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
