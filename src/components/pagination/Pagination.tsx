import { useNavigate, useSearch } from "@tanstack/react-router";

/**
 * Custom hook to manage pagination state via TanStack Router URL search params
 */
export function usePagination() {
  const search = useSearch({ strict: false }) as { page?: number };
  const navigate = useNavigate();

  const currentPage = search.page !== undefined ? Number(search.page) : 1;

  const setPage = (page: number) => {
    navigate({
      //@ts-ignore
      search: (prev: any) => ({ ...prev, page }),
    });
  };

  return { currentPage, setPage };
}

interface PaginationProps {
  totalPages: number;
}

export default function Paginator({ totalPages }: PaginationProps) {
  const { currentPage, setPage } = usePagination();

  if (totalPages <= 1) {
    return (
      <section className="flex items-center justify-center py-4">
        <div className="join">
          <button
            className="join-item btn btn-sm"
            disabled={currentPage <= 1}
            onClick={() => setPage(currentPage - 1)}
          >
            «
          </button>

          <button className="join-item btn btn-sm no-animation">
            Page {currentPage} of {totalPages}
          </button>

          <button
            className="join-item btn btn-sm"
            disabled={currentPage >= totalPages}
            onClick={() => setPage(currentPage + 1)}
          >
            »
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="flex items-center justify-center py-4">
      <div className="join">
        <button
          className="join-item btn btn-sm"
          disabled={currentPage <= 1}
          onClick={() => setPage(currentPage - 1)}
        >
          «
        </button>

        <button className="join-item btn btn-sm no-animation">
          Page {currentPage} of {totalPages}
        </button>

        <button
          className="join-item btn btn-sm"
          disabled={currentPage >= totalPages}
          onClick={() => setPage(currentPage + 1)}
        >
          »
        </button>
      </div>
    </section>
  );
}
