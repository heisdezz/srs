import { pb } from "@/api/apiClient";
import CompLoader from "@/components/layouts/ComponentLoader";
import { useUser, validateItems } from "@/helpers/client";
import { validate_addr } from "@/store/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { DeliverySettingsResponse } from "pocketbase-types";
import { toast } from "sonner";
import { AutoComp } from "./AutoComp";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

export default function DeliverySettings() {
  const { user } = useUser();
  const defaultDeliverySettings = {
    street: "",
    city: "",
    state: "",
    country: "",
    lat: null,
    lng: null,
  };

  const query = useQuery({
    queryKey: ["delvierySettings"],
    queryFn: () =>
      pb
        .collection("deliverySettings")
        .getOne(user.id)
        .catch((stat) => {
          if (stat.status === 404) {
            return defaultDeliverySettings;
          }
          throw stat;
        }),
    enabled: !!user,
    placeholderData: defaultDeliverySettings,
    initialData: defaultDeliverySettings,
  });

  return (
    <div className="ring  fade rounded-sleek">
      <div className="p-4 border-b font-bold text-current/80 fade flex">
        Delivery Settings
        {query.isFetching && (
          <span className="loading loading-spinner ml-auto text-primary"></span>
        )}
        {query.isError && <span className="text-error ml-auto">Error</span>}
      </div>
      <div className="p-4">
        <CompLoader query={query}>
          {(data) => {
            if (!data) return null;
            return (
              <>
                {/*{JSON.stringify(data)}*/}
                <DeliveryForm initial={data}></DeliveryForm>
              </>
            );
          }}
        </CompLoader>
      </div>
    </div>
  );
}

const DeliveryForm = ({
  initial,
}: {
  initial: Partial<DeliverySettingsResponse>;
}) => {
  const { user } = useUser();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      street: initial.street || "",
      city: initial.city || "",
      state: initial.state || "",
      country: initial.country || "",
      lat: initial.lat ?? null,
      lng: initial.lng ?? null,
    },
  });

  // Keep form in sync with initial prop
  useEffect(() => {
    reset({
      street: initial.street || "",
      city: initial.city || "",
      state: initial.state || "",
      country: initial.country || "",
      lat: initial.lat ?? null,
      lng: initial.lng ?? null,
    });
  }, [initial, reset]);

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      return await pb
        .collection("deliverySettings")
        .update(user.id, { ...data, user_id: user.id, id: user.id })
        .catch(async (err) => {
          if (err.status === 404) {
            return await pb
              .collection("deliverySettings")
              .create({ ...data, user_id: user.id, id: user.id });
          }
          throw err;
        });
    },
    onSuccess: (newData) => {
      queryClient.invalidateQueries({ queryKey: ["delvierySettings"] });
      reset({
        street: newData.street || "",
        city: newData.city || "",
        state: newData.state || "",
        country: newData.country || "",
        lat: newData.lat ?? null,
        lng: newData.lng ?? null,
      });
    },
  });

  const formValues = watch();

  const onSubmit = async (data: any) => {
    const isValid = validateItems(data);
    if (isValid) {
      return toast.promise(
        mutation.mutateAsync({ ...data, user_id: user.id }),
        {
          loading: "Updating...",
          success: "Delivery Settings Updated",
          error: "Error Updating Delivery Settings",
        },
      );
    }
    return toast.error("Not Complete/Valid");
  };

  const props = validate_addr(initial as any);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <AutoComp
        value={{
          street: formValues.street,
          city: formValues.city,
          state: formValues.state,
          country: formValues.country,
          lat: formValues.lat,
          lng: formValues.lng,
        }}
        onChange={(newAddressDetails: {
          street?: string;
          city?: string;
          state?: string;
          country?: string;
          lat?: number | null;
          lng?: number | null;
        }) => {
          if (newAddressDetails.street !== undefined)
            setValue("street", newAddressDetails.street);
          if (newAddressDetails.city !== undefined)
            setValue("city", newAddressDetails.city);
          if (newAddressDetails.state !== undefined)
            setValue("state", newAddressDetails.state);
          if (newAddressDetails.country !== undefined)
            setValue("country", newAddressDetails.country);
          if (newAddressDetails.lat !== undefined)
            setValue("lat", newAddressDetails.lat);
          if (newAddressDetails.lng !== undefined)
            setValue("lng", newAddressDetails.lng);
        }}
      />

      <div className="text-sm p-2 ring fade rounded-sleek ">
        {props.full_address}
      </div>
      <div className="space-y-4">
        <button className="btn btn-sm btn-primary btn-block ">Submit</button>
      </div>
    </form>
  );
};
