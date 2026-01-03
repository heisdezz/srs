import SimpleInput from "@/components/inputs/SimpleInput";
import { useDeliverySettings } from "@/store/client";
import { FormProvider, useForm } from "react-hook-form";

export default function DeliverySettings() {
  const props = useDeliverySettings();
  const form = useForm({
    defaultValues: props,
  });
  return (
    <div className="ring  fade rounded-box">
      <div className="p-4 border-b font-bolda fade">Delivery Settings</div>
      <div className="p-4 space-y-4">
        <FormProvider {...form}>
          <SimpleInput {...form.register("street")} label="Street" />
          <SimpleInput {...form.register("city")} label="City" />
          <SimpleInput {...form.register("state")} label="State" />
          <SimpleInput {...form.register("country")} label="Country" />
        </FormProvider>
        <div className="p-4 ring fade rounded-md shadow">
          {props.full_address}
        </div>
      </div>
    </div>
  );
}
