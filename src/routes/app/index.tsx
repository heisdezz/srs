import PageContainer from "@/components/layouts/PageContainer";
import { createFileRoute } from "@tanstack/react-router";
import AppHero from "./-compoents/AppHero";
import NewIn from "./-compoents/NewIn";
import Trending from "./-compoents/Trending";

export const Route = createFileRoute("/app/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <div className="mb-22 mt-12">
        <AppHero />
      </div>

      <PageContainer>
        {/*new in*/}
        <NewIn />
        {/*//trending*/}
        <Trending />
      </PageContainer>
    </>
  );
}
