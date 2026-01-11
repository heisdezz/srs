import { pb } from "@/api/apiClient";
import PageLoader from "@/components/layouts/PageLoader";
import SimpleCarousel from "@/components/SimpleCarousel";
import { get_image } from "@/helpers/client";
import Carousel from "@/routes/app/product/-components/Carousel";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import AdminProductInfo from "./-components/AdminProductInfo";
import AdminProductDetails from "./-components/AdminProductDetails";

export const Route = createFileRoute("/admin/product/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();
  const query = useQuery({
    queryKey: ["product_info_admin", id],
    queryFn: () => pb.collection("products").getOne(id),
  });
  return (
    <>
      <h2>Product: #{id}</h2>
      <PageLoader query={query}>
        {(data) => {
          return (
            <div className="flex-1  flex flex-col gap-6">
              <div className="flex-1  ">
                <AdminProductInfo item={data} />
              </div>
              <div className="flex-1">
                <AdminProductDetails item={data} />
              </div>
            </div>
          );
        }}
      </PageLoader>
    </>
  );
}
