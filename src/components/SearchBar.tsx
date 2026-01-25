import { useNavigate, useSearch } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function SearchBar() {
  const { search } = useSearch({
    strict: false,
  });
  const { register, handleSubmit } = useForm({
    defaultValues: {
      search: search,
    },
  });
  const nav = useNavigate();
  const onSubmit = (data) => {
    if (data.search === "") {
      return nav({
        to: "/app/products",
        //@ts-ignore
      });
    }
    if (data["search"].length < 3) {
      return toast.error("Search query must be at least 3 characters long");
    }
    // toast.info(data["search"]);
    const searchTerm = data["search"] as string;
    nav({
      to: "/app/products",
      //@ts-ignore
      search: { search: searchTerm },
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
