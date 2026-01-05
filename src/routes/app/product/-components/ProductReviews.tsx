import { pb } from "@/api/apiClient";
import SimpleTextArea from "@/components/inputs/SimpleTextArea";
import Modal from "@/components/modals/DialogModal";
import { extract_message } from "@/helpers/api";
import { useUser } from "@/helpers/client";
import { useModal } from "@/helpers/modals";
import type { ReviewsResponse, UsersResponse } from "pocketbase-types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";

export default function ProductReviews({ productId }: { productId: string }) {
  const { user } = useUser();
  const form = useForm({
    defaultValues: {
      rating: 5,
      review: "",
    },
  });
  const reviews = useQuery({
    queryKey: [productId, "reviews"],
    queryFn: async () => {
      let resp = await pb
        .collection("reviews")
        .getList<ReviewsResponse<{ user_id: UsersResponse }>>(1, 3, {
          filter: `product_id = "${productId}"`,
          sort: "-created",
          expand: "user_id",
          skipTotal: true,
        });
      return resp;
    },
    enabled: !!productId,
  });
  const { mutateAsync } = useMutation({
    mutationFn: async (data: { review: string; rating: number }) => {
      let resp = await pb
        .collection("reviews")
        .create({ product_id: productId, ...data, user_id: user.id });
      return resp;
    },
    onSuccess: () => {
      reviews.refetch();
      modal.closeModal();
      form.reset();
    },
  });
  const modal = useModal();

  const averageRating = reviews.data?.length
    ? (
        reviews.data.reduce((acc, rev) => acc + (rev.rating || 0), 0) /
        reviews.data.length
      ).toFixed(1)
    : "0.0";

  return (
    <>
      <Modal ref={modal.ref} title="Add Review">
        <FormProvider {...form}>
          <form
            className="space-y-4"
            onSubmit={form.handleSubmit((data) => {
              toast.promise(() => mutateAsync(data), {
                loading: "Submitting...",
                success: "Review submitted!",
                error: extract_message,
              });
            })}
          >
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Rating</span>
              </label>
              <div className="rating rating-lg">
                {[1, 2, 3, 4, 5].map((star) => (
                  <input
                    key={star}
                    type="radio"
                    value={star}
                    className="mask mask-star-2 bg-orange-400"
                    {...form.register("rating", { valueAsNumber: true })}
                  />
                ))}
              </div>
            </div>
            <SimpleTextArea
              label="Review"
              placeholder="What did you think about this product?"
              {...form.register("review", { required: "Review is required" })}
            />
            <button className="btn btn-primary btn-block">Submit Review</button>
          </form>
        </FormProvider>
      </Modal>

      <div className="bg-base-100 rounded-box border border-base-300 overflow-hidden">
        <div className="p-6 border-b border-base-300 flex items-center justify-between bg-base-200/30">
          <div>
            <h2 className="text-xl font-bold">Ratings & Reviews</h2>
            <p className="text-sm opacity-60">Real feedback from customers</p>
          </div>
          {user && (
            <button
              onClick={() => modal.showModal()}
              className="btn btn-primary btn-sm"
            >
              Write Review
            </button>
          )}
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-10">
            <div className="md:col-span-4 flex flex-col items-center justify-center bg-base-200/50 rounded-2xl p-6 border border-base-300">
              <span className="text-6xl font-black text-primary">
                {averageRating}
              </span>
              <div className="rating rating-sm my-2 pointer-events-none">
                {[1, 2, 3, 4, 5].map((star) => (
                  <input
                    key={star}
                    type="radio"
                    className="mask mask-star-2 bg-orange-400"
                    checked={Math.round(Number(averageRating)) === star}
                    readOnly
                  />
                ))}
              </div>
              <span className="text-base-content/60 text-sm font-medium">
                Based on {reviews.data?.length || 0} reviews
              </span>
            </div>

            <div className="md:col-span-8 flex flex-col justify-center">
              <RatingDistribution reviews={reviews.data || []} />
            </div>
          </div>

          <div className="space-y-4">
            {reviews.data?.map((review) => (
              <div
                key={review.id}
                className="p-5 rounded-2xl bg-base-100 border border-base-200 shadow-sm flex gap-4 transition-all hover:border-primary/30 ring fade"
              >
                <div className="avatar placeholder h-fit">
                  <div className="bg-neutral text-neutral-content rounded-full w-10 h-10 ring-1 ring-base-300">
                    <span className="text-sm uppercase font-bold">
                      {review.expand?.user_id?.fullName?.charAt(0) || "U"}
                    </span>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-3">
                    <div>
                      <h3 className="font-bold text-md">
                        {review.expand?.user_id?.fullName || "Anonymous User"}
                      </h3>
                      <div className="rating rating-xs pointer-events-none">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <input
                            key={star}
                            type="radio"
                            className="mask mask-star-2 bg-orange-400"
                            checked={Math.round(review.rating) === star}
                            readOnly
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-xs opacity-40 font-medium italic">
                      {new Date(review.created).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <p className="text-base-content/90 leading-relaxed">
                    {review.review}
                  </p>
                </div>
              </div>
            ))}

            {reviews.data?.length === 0 && (
              <div className="text-center py-12 bg-base-200/20 rounded-xl border-2 border-dashed border-base-300">
                <p className="text-base-content/40 font-medium">
                  No reviews yet. Be the first to share your thoughts!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

const RatingDistribution = ({ reviews }: { reviews: any[] }) => {
  const counts = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: reviews.filter((r) => Math.round(r.rating) === rating).length,
    percentage: reviews.length
      ? (reviews.filter((r) => Math.round(r.rating) === rating).length /
          reviews.length) *
        100
      : 0,
  }));

  return (
    <div className="space-y-2 w-full max-w-md">
      {counts.map(({ rating, count, percentage }) => (
        <div key={rating} className="flex items-center gap-4">
          <span className="text-xs font-bold w-3">{rating}</span>
          <progress
            className="progress progress-primary flex-1 h-2"
            value={percentage}
            max="100"
          ></progress>
          <span className="text-xs opacity-50 w-8 text-right">{count}</span>
        </div>
      ))}
    </div>
  );
};
