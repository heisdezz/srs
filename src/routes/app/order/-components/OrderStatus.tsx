const status_list = ["pending", "processing", "in transit", "delivered"];

export default function OrderStatus({ status }: { status: string }) {
  const currentStatusIndex = status_list.indexOf(status.toLowerCase());

  return (
    <div className="w-full py-8 px-4 bg-base-200/50 rounded-2xl border border-base-300">
      <ul className="steps steps-vertical md:steps-horizontal w-full gap-y-4">
        {status_list.map((stat, index) => {
          const isCompleted = index < currentStatusIndex;
          const isCurrent = index === currentStatusIndex;
          const isPending = index > currentStatusIndex;

          return (
            <li
              key={stat}
              data-content={isCompleted ? "✓" : isCurrent ? "●" : index + 1}
              className={`step transition-all duration-700 ease-in-out ${
                isCompleted || isCurrent
                  ? "step-primary"
                  : "before:!bg-base-300"
              } ${isCurrent ? "font-bold" : ""}`}
            >
              <div className="flex flex-col items-center md:items-start ml-2 md:ml-0">
                <span
                  className={`text-sm tracking-wide capitalize transition-colors duration-300 ${
                    isCurrent
                      ? "text-primary scale-110 origin-left"
                      : isCompleted
                        ? "text-base-content/80"
                        : "text-base-content/40"
                  }`}
                >
                  {stat}
                </span>
                {isCurrent && (
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary/70 mt-1 animate-pulse hidden md:block">
                    In Progress
                  </span>
                )}
                {isCompleted && (
                  <span className="text-[10px] font-medium uppercase tracking-tighter text-success opacity-70 hidden md:block">
                    Completed
                  </span>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
