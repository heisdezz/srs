import {
  useForm,
  useFieldArray,
  type UseFieldArrayReturn,
} from "react-hook-form";
import type { ProductsRecord, ProductsResponse } from "pocketbase-types";
import SimpleInput from "@/components/inputs/SimpleInput";
import SimpleTextArea from "@/components/inputs/SimpleTextArea";
import LocalSelect from "@/components/inputs/LocalSelect";
import { Package, DollarSign, Tag, Info, Plus, X } from "lucide-react";
import type { OptionsConfig, Option, OptionValue } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { pb } from "@/api/apiClient";
import { toast } from "sonner";
import SimpleSelect from "@/components/inputs/SimpleSelect";

// Define a type for an option with a key, to be used in an array for useFieldArray
type OptionWithKey = Option & { key: string };

export default function AdminProductDetails({
  item,
  add = false,
  addFn,
}: {
  item: ProductsResponse;
  add?: boolean;
  addFn?: (data: ProductsRecord<OptionsConfig>) => void;
}) {
  // Ensure item.options is treated as OptionsConfig or an empty object if null
  const defaultOptions = (item.options || {}) as OptionsConfig;

  // Transform the defaultOptions object into an array of OptionWithKey for useFieldArray
  const defaultOptionsArray: OptionWithKey[] = Object.entries(
    defaultOptions,
  ).map(([key, option]) => ({ ...option, key }));

  const { register, handleSubmit, control, watch, setValue } = useForm<
    ProductsResponse & { optionsDataArray: OptionWithKey[] }
  >({
    defaultValues: {
      ...item,
      // @ts-ignore - options can be null, but defaultOptionsArray will handle it
      optionsDataArray: defaultOptionsArray, // Use a separate field for options to manage its structure as an array
    },
  });

  const {
    fields: optionFields,
    append: appendOption,
    remove: removeOption,
  }: UseFieldArrayReturn<
    ProductsResponse & { optionsDataArray: OptionWithKey[] },
    "optionsDataArray",
    "id"
  > = useFieldArray({
    control,
    name: "optionsDataArray",
  });

  const mutation = useMutation({
    mutationFn: (data: ProductsRecord<OptionsConfig>) =>
      pb.collection("products").update(data.id, data),
    onMutate: () => {
      toast.loading("Updating product...", { id: "product-update" });
    },
    onSuccess: () => {
      toast.success("Product updated successfully!", { id: "product-update" });
    },
    onError: (error) => {
      toast.error(`Failed to update product: ${error.message}`, {
        id: "product-update",
      });
    },
  });

  const onSubmit = (
    data: ProductsResponse & { optionsDataArray: OptionWithKey[] },
  ) => {
    // Convert optionsDataArray back to the OptionsConfig object format expected by PocketBase
    const optionsConfigToSend: OptionsConfig = data.optionsDataArray.reduce(
      (acc, optionItem) => {
        const { key, ...rest } = optionItem;
        acc[key] = rest;
        return acc;
      },
      {} as OptionsConfig,
    );

    const productDataToSend: ProductsRecord<OptionsConfig> = {
      ...data,
      options: optionsConfigToSend, // PocketBase expects the JSON object directly
      id: item.id, // Ensure the ID is included for the update mutation
    };
    console.log("Updated Product Data:", productDataToSend);
    if (add) {
      return addFn(productDataToSend);
    }
    mutation.mutate(productDataToSend);
  };

  return (
    <div className="p-6 bg-base-100 rounded-box shadow-md ring fade">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SimpleInput
            {...register("name")}
            label="Product Name"
            placeholder="Enter product name"
            icon={<Tag size={18} className="opacity-70" />}
          />

          <SimpleSelect
            route="categories"
            value={watch("category")} // Use watch to get the current value
            onChange={(newValue) => setValue("category", newValue as string)} // Update the form value
            label="Category"
            render={(category, index) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            )}
          />

          <SimpleInput
            {...register("price", { valueAsNumber: true })}
            type="number"
            label="Original Price"
            placeholder="0.00"
            icon={<DollarSign size={18} className="opacity-70" />}
          />

          <SimpleInput
            {...register("discountPrice", { valueAsNumber: true })}
            type="number"
            label="Discount Price"
            placeholder="0.00"
            icon={<DollarSign size={18} className="opacity-70" />}
          />

          <SimpleInput
            {...register("quantity", { valueAsNumber: true })}
            type="number"
            label="Stock Quantity"
            placeholder="0"
            icon={<Package size={18} className="opacity-70" />}
          />
        </div>

        <SimpleTextArea
          {...register("description")}
          label="Description"
          placeholder="Describe the product..."
          rows={4}
          icon={<Info size={18} className="opacity-70 self-start mt-2" />}
        />

        {/* Dynamic Options Section */}
        <div className="card bg-base-200 shadow-sm p-4">
          <h3 className="card-title text-lg mb-4">Product Options</h3>
          {optionFields.map((optionField, optionIndex) => (
            <div
              key={optionField.id}
              className="mb-4 p-3 border rounded-md border-base-300"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-2">
                <SimpleInput
                  {...register(
                    `optionsDataArray.${optionIndex}.label` as const,
                  )}
                  label="Option Name"
                  placeholder="e.g., Color, Size"
                  className="grow w-full sm:w-auto"
                />
                <LocalSelect
                  {...register(`optionsDataArray.${optionIndex}.type` as const)}
                  label="Option Type"
                  className="w-full sm:w-40"
                >
                  <option value="select">Select</option>
                  {/* Add other types if needed, e.g., "radio", "checkbox" */}
                </LocalSelect>
                <button
                  type="button"
                  onClick={() => removeOption(optionIndex)}
                  className="btn btn-sm btn-error btn-outline w-full sm:w-auto"
                >
                  <X size={16} />
                </button>
              </div>

              <h4 className="text-md font-semibold mt-4 mb-2">Option Values</h4>
              {(watch(`optionsDataArray.${optionIndex}.values`) || []).map(
                (value, valueIndex) => (
                  <div
                    key={value.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mb-2 ml-0 sm:ml-4 p-2 border-t border-base-300 sm:border-none pt-2 sm:pt-0"
                  >
                    <SimpleInput
                      {...register(
                        `optionsDataArray.${optionIndex}.values.${valueIndex}.label` as const,
                      )}
                      label="Value Label"
                      placeholder="e.g., Red, Small"
                      className="grow w-full sm:w-auto"
                    />
                    <SimpleInput
                      {...register(
                        `optionsDataArray.${optionIndex}.values.${valueIndex}.price` as const,
                        { valueAsNumber: true },
                      )}
                      type="number"
                      label="Price Adjustment"
                      placeholder="0.00"
                      className="w-full sm:w-32"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const currentValues = watch(
                          `optionsDataArray.${optionIndex}.values`,
                        );
                        const updatedValues = (currentValues || []).filter(
                          (_, i) => i !== valueIndex,
                        );
                        setValue(
                          `optionsDataArray.${optionIndex}.values`,
                          updatedValues,
                          { shouldDirty: true },
                        );
                      }}
                      className="btn btn-sm btn-ghost btn-circle self-end sm:self-center"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ),
              )}
              <button
                type="button"
                onClick={() => {
                  const newOptionValue: OptionValue = {
                    id: crypto.randomUUID(), // Generate a unique ID for the new value
                    label: "",
                    price: 0,
                  };
                  const currentValues = watch(
                    `optionsDataArray.${optionIndex}.values`,
                  );
                  setValue(
                    `optionsDataArray.${optionIndex}.values`,
                    [...(currentValues || []), newOptionValue],
                    { shouldDirty: true },
                  );
                }}
                className="btn btn-sm btn-outline btn-info mt-2 ml-0 sm:ml-4 w-full sm:w-auto"
              >
                <Plus size={16} className="mr-1" /> Add Value
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => {
              const newOption: OptionWithKey = {
                key: `option_${crypto.randomUUID()}`, // Unique key for the new option
                label: "",
                type: "select",
                values: [{ id: crypto.randomUUID(), label: "", price: 0 }],
              };
              appendOption(newOption);
            }}
            className="btn btn-outline btn-primary mt-4 w-full"
          >
            <Plus size={18} className="mr-1" /> Add New Option
          </button>
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-2">
          <button type="button" className="btn btn-ghost w-full sm:w-auto">
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary w-full sm:w-auto"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
