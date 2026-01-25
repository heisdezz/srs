import { useNavigate, useSearch } from "@tanstack/react-router";

const statuses = [
  "pending",
  "processing",
  "in transit",
  "delivered",
  // "cancelled",
];

export default function OrderDrawerContent() {
  const search = useSearch({
    strict: false,
  });
  const nav = useNavigate();

  return (
    <div className=" space-y-4">
      <h2 className="h-20 border-b flex items-center fade font-bold text-xl ">
        Order Status
      </h2>
      {/*{search["status"]}*/}
      <div className="p-4 fade shadow rounded-sleek ring">
        <ul className="menu p-0 size-full space-y-2">
          <li>
            <a
              className={`${search["status"] === "all" ? "menu-active" : ""}`}
              onClick={() => nav({ to: "/app/orders" })}
            >
              All
            </a>
          </li>
          {statuses.map((status) => (
            <li key={status} className="menu-item capitalize">
              <a
                className={`${status == search["status"] ? "menu-active" : ""}`}
                onClick={() => {
                  nav({
                    to: "/app/orders",
                    search: {
                      //@ts-ignore
                      status: status,
                    },
                  });
                }}
              >
                {" "}
                {status}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
