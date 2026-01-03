import { pb } from "@/api/apiClient";
import SimpleInput from "@/components/inputs/SimpleInput";
import { useUser, validateItems } from "@/helpers/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
const defaultDeliverySettings = {
  user: user.id,
  street: "",
  city: "",
  state: "",
  country: "",
  zip: "",
};
export default function DeliverySettings() {
  const { user } = useUser();

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
  const mutation = useMutation({
    mutationFn: async (data: any) => {
      await pb.collection("deliverySettings").update(user.id, data);
    },
  });

  useEffect(() => {
    if (query.data) {
      const data = query.data;
      form.reset({
        street: data.street,
        city: data.city,
        state: data.state,
        country: data.country,
        zip: data.zip,
      });
    }
  }, [query.data]);
  const form = useForm({
    defaultValues: {
      street: "",
      city: "",
      state: "",
      country: "",
      zip: "",
    },
  });
  const onSubmit = (data: Record<string, any>) => {
    const isValid = validateItems(data);
    // return console.log(data);
    if (isValid) {
      return toast.promise(mutation.mutateAsync(data), {
        loading: "Updating...",
        success: "Delivery Settings Updated",
        error: "Error Updating Delivery Settings",
      });
    }
    return toast.error("Not Complete/Valid");
  };
  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="ring  fade rounded-box"
    >
      <div className="p-4 border-b font-bold text-current/80 fade flex">
        Delivery Settings
        {query.isFetching && (
          <span className="loading loading-spinner ml-auto text-primary"></span>
        )}
        {query.isError && <span className="text-error ml-auto">Error</span>}
      </div>
      <div className="p-4 space-y-4">
        <FormProvider {...form}>
          <SimpleInput {...form.register("street")} label="Street" />
          <SimpleInput {...form.register("city")} label="City" />
          <SimpleInput {...form.register("state")} label="State" />
          <SimpleInput {...form.register("country")} label="Country" />
          <SimpleInput {...form.register("zip")} label="Zip" />
        </FormProvider>

        <button className="btn btn-sm btn-primary btn-block ">Submit</button>
      </div>
    </form>
  );
}
