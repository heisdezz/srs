import { useNavigate, useSearch } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function GeneralSearchBar() {
  const { search: currentSearch } = useSearch({
    strict: false,
  });
  const { register, handleSubmit } = useForm({
    defaultValues: {
      search: currentSearch,
    },
  });
  const nav = useNavigate();

  const onSubmit = (data: { search: string }) => {
    if (data.search === "") {
      return nav({
        search: (prev: any) => {
          const { search, ...rest } = prev;
          return rest;
        },
      });
    }
    if (data.search.length < 3) {
      return toast.error("Search query must be at least 3 characters long");
    }

    nav({
      search: (prev: any) => ({
        ...prev,
        search: data.search,
      }),
    });
  };

  return (
    <form className="flex-1 join" onSubmit={handleSubmit(onSubmit)}>
      <input
        type="text"
        {...register("search")}
        placeholder="Search..."
        title="Search"
        className="input w-full join-item"
      />
      <button className="btn btn-primary btn-square join-item">
        <Search className="size-4" />
      </button>
    </form>
  );
}
