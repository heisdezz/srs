import { useDeliverySettings } from "@/store/client";
import { MapPin } from "lucide-react";

export function DeliveryInfo() {
  const { full_address, isValid } = useDeliverySettings();
  return (
    <div className="card bg-base-100 shadow  ring fade space-y-2 rounded-box">
      <div className="flex items-center justify-between  border-b fade p-3">
        <h2 className="card-title  font-bold">Delivery Information</h2>
      </div>

      {!isValid && (
        <div className="p-4">
          <p className="text-error text-sm mb-2">
            Delivery information not set
          </p>
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
              {full_address}
            </span>
            <br />
            <span className="text-sm text-gray-500">
              Estimated delivery: 30-45 minutes
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
