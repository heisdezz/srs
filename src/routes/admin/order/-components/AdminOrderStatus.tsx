import { pb } from "@/api/apiClient";
import { extract_message } from "@/helpers/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { toast } from "sonner";

const status_list = ["pending", "processing", "in transit", "delivered"];

export default function OrderStatus({
  status,
  refetch,
}: {
  status: string;
  refetch: () => void;
}) {
  const queryClient = useQueryClient();
  const { orderId } = useParams({
    strict: false,
  });

  const return_next_status = (currentStatus: string) => {
    const index = status_list.indexOf(currentStatus);
    if (index === -1 || index === status_list.length - 1) return null;
    return status_list[index + 1];
  };

  const nextStatus = return_next_status(status);

  const mutation = useMutation({
    mutationFn: (newStatus: string) =>
      pb.collection("orders").update(orderId!, { status: newStatus }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders", orderId] });
      refetch();
    },
  });

  return (
    <div className="min-h-28 ring rounded-box fade bg-base-200 ">
      <div className="p-4 border-b fade flex justify-between items-center">
        <span>Order Status:</span>
        {nextStatus && (
          <button
            onClick={() =>
              toast.promise(mutation.mutateAsync(nextStatus), {
                loading: "Updating...",
                success: `Order updated to ${nextStatus}`,
                error: extract_message,
              })
            }
            disabled={mutation.isPending}
            className="btn btn-primary btn-sm"
          >
            {mutation.isPending ? "Updating..." : `Mark as ${nextStatus}`}
          </button>
        )}
      </div>
      <div className="p-4">
        <ul className="steps w-full">
          {status_list.map((stat, index) => {
            const currentStatusIndex = status_list.indexOf(status);
            const isActive = index <= currentStatusIndex;
            return (
              <li key={stat} className={` step ${isActive && "step-primary"} `}>
                <span className="capitalize">{stat}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
