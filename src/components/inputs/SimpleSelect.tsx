import { pb } from "@/api/apiClient";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState, type PropsWithChildren } from "react";
import type { RecordModel } from "pocketbase";

interface SimpleSelect<T extends RecordModel> extends PropsWithChildren {
  route: string;
  value: string | null; // Changed to allow null for "All" option
  onChange: (value: string | null) => void; // Changed to allow null
  label?: string;
  render: (item: T, index: number) => React.ReactNode; // Changed return type to React.ReactNode
}

export default function SimpleSelect<T extends RecordModel>(
  props: SimpleSelect<T>,
) {
  const [internalValue, setInternalValue] = useState<string | null>(
    props.value,
  ); // Initialize with props.value
  const query = useQuery<T[]>({
    // Specify the type for query data
    queryKey: ["select", props.route],
    queryFn: () => pb.collection(props.route).getFullList<T>(), // Specify the type for getFullList
  });

  useEffect(() => {
    // Sync internalValue with props.value if props.value changes externally
    if (props.value !== internalValue) {
      setInternalValue(props.value);
    }
  }, [props.value]);

  useEffect(() => {
    // Call onChange only when internalValue changes and is different from props.value
    if (internalValue !== props.value && props.onChange) {
      props.onChange(internalValue);
    }
  }, [internalValue, props.onChange, props.value]);

  const label = props.label;
  if (query.isLoading)
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={`select-${props.route}`}
            className="mb-2 fieldset-label"
          >
            {label}
          </label>
        )}
        <select
          disabled
          name={`select-${props.route}`}
          className="select w-full"
          id={`select-${props.route}`}
        >
          <option value="">Loading</option>
        </select>
      </div>
    );

  if (query.isError)
    return (
      <div className="w-full ">
        {label && (
          <label
            htmlFor={`select-${props.route}`}
            className="mb-2 fieldset-label"
          >
            {label}
          </label>
        )}
        <select
          disabled
          name={`select-${props.route}`}
          className="select w-full"
          id={`select-${props.route}`}
        >
          <option value="">Error loading options</option>
        </select>
      </div>
    );

  const items: T[] = query.data ?? [];

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={`select-${props.route}`}
          className="mb-2 fieldset-label"
        >
          {label}
        </label>
      )}
      <select
        value={internalValue === null ? "null" : internalValue} // Handle null for "All" option
        onChange={(e) => {
          const newValue = e.target.value === "null" ? null : e.target.value;
          setInternalValue(newValue);
        }}
        className="select w-full"
        id={`select-${props.route}`}
        name={`select-${props.route}`}
      >
        <option value="null">All</option> {/* Moved "All" option to the top */}
        {items.map((item, idx) => props.render(item, idx))}
      </select>
    </div>
  );
}
