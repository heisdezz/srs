import { pb } from "@/api/apiClient";
import { useUser, validateItems } from "@/helpers/client";
import { useDeliverySettings, validate_addr } from "@/store/client";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { MapPin } from "lucide-react";
import CompLoader from "./layouts/ComponentLoader";

export function DeliveryInfo() {
  const { user } = useUser();
  const defaultDeliverySettings = {
    user: user.id,
    street: "",
    city: "",
    state: "",
    country: "",
    zip: "",
  };
  const query = useQuery({
    queryKey: ["delvierySettings"],
    queryFn: () =>
      pb
        .collection("deliverySettings")
        .getOne(user.id)
        .catch((stat) => {
          if (stat.status === 404) {
            pb.collection("deliverySettings").create({
              id: user.id,
              user: user.id,
              street: "",
              city: "",
              state: "",
              country: "",
              zip: "",
            });
            return defaultDeliverySettings;
          }
          throw stat;
        }),
    enabled: !!user,
    placeholderData: defaultDeliverySettings,
    initialData: defaultDeliverySettings,
  });
  return (
    <div className="card bg-base-100 shadow  ring fade space-y-2 rounded-box">
      <div className="flex items-center justify-between  border-b fade p-3">
        <h2 className="card-title  font-bold">Delivery Information</h2>
      </div>
      <CompLoader query={query}>
        {(data) => {
          const isValid = validateItems(data);
          const addr = validate_addr(data);
          return (
            <>
              {!user && <div>Not logged in</div>}
              {!user && !isValid && (
                <div className="p-4">
                  <div className="flex items-center mb-2 justify-between">
                    <p className="text-error text-sm ">
                      Delivery information not set
                    </p>
                    <Link
                      to="/app/profile"
                      className="btn btn-sm btn-soft ring fade btn-info"
                    >
                      Edit
                    </Link>
                  </div>
                  <p className="bg-error/20 ring mb-2 rounded-box p-4 fade ring-error/50">
                    Invalid address
                  </p>
                </div>
              )}
              {isValid && (
                <div className="flex  gap-2 p-4">
                  <MapPin className="size-6 stroke-primary" />
                  <p className="text-base leading-tight">
                    Delivering to:{" "}
                    <span className="font-semibold text-base-content">
                      {addr.full_address}
                    </span>
                    <br />
                    <span className="text-sm text-gray-500">
                      Estimated delivery: 30-45 minutes
                    </span>
                  </p>
                </div>
              )}
            </>
          );
        }}
      </CompLoader>
    </div>
  );
}
