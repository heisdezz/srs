import SimpleInput from "@/components/inputs/SimpleInput";
import { validateItems } from "@/helpers/client";
import { useDeliverySettings } from "@/store/client";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";

export default function DeliverySettings() {
  const {
    isValid,
    state,
    street,
    city,
    country,
    zip,
    full_address,
    updateDeliverySettings,
  } = useDeliverySettings();
  const form = useForm({
    defaultValues: {
      street: street,
      city: city,
      state: state,
      country: country,
      zip: zip,
    },
  });
  const onSubmit = (data: Record<string, any>) => {
    const isValid = validateItems(data);
    if (isValid) {
      toast.success("Delivery Settings Updated");
      return updateDeliverySettings(data as any);
    }
    return toast.error("Not Complete/Valid");
  };
  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="ring  fade rounded-box"
    >
      <div className="p-4 border-b font-bold text-current/80 fade">
        Delivery Settings
      </div>
      <div className="p-4 space-y-4">
        <FormProvider {...form}>
          <SimpleInput {...form.register("street")} label="Street" />
          <SimpleInput {...form.register("city")} label="City" />
          <SimpleInput {...form.register("state")} label="State" />
          <SimpleInput {...form.register("country")} label="Country" />
          <SimpleInput {...form.register("zip")} label="Zip" />
        </FormProvider>
        {isValid && (
          <div className="p-4 ring fade rounded-md shadow">{full_address}</div>
        )}
        <button className="btn btn-sm btn-primary btn-block ">Submit</button>
      </div>
    </form>
  );
}
