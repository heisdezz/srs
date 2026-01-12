import { pb } from "@/api/apiClient";
import Card from "@/components/Card";
import PageHeader from "@/components/Headers/PageHeader";
import CardContainer from "@/components/layouts/CardContainer";
import PageLoader from "@/components/layouts/PageLoader";
import Paginator, { usePagination } from "@/components/pagination/Pagination";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/products/")({
  component: RouteComponent,
});

function RouteComponent() {
  const props = usePagination();
  const query = useQuery({
    queryKey: ["product_list", "admin"],
    queryFn: () => pb.collection("products").getList(props.currentPage, 20),
  });
  return (
    <>
      <PageHeader title="Product List">
        <Link to="/admin/product/new" className="btn btn-primary">
          New Product
        </Link>
      </PageHeader>
      <div>
        <PageLoader query={query}>
          {(data) => {
            const items = data.items;
            return (
              <>
                <CardContainer>
                  {items.map((item) => (
                    <Card admin key={item.id} item={item}></Card>
                  ))}
                </CardContainer>
                <Paginator totalPages={data.totalPages} />
              </>
            );
          }}
        </PageLoader>
      </div>
    </>
  );
}
