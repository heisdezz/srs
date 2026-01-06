const status_list = ["pending", "processing", "in transit", "delivered"];

export default function OrderStatus({ status }: { status: string }) {
  status = "processing";
  return (
    <div className="min-h-28 ring rounded-box fade bg-base-200 ">
      <div className="p-4 border-b fade "> Order Status:</div>
      <div className="p-4">
        <ul className="steps w-full">
          {status_list.map((stat, index) => {
            const currentStatusIndex = status_list.indexOf(status);
            const isActive = index <= currentStatusIndex;
            return (
              <>
                <li
                  key={index}
                  className={` step ${isActive && "step-primary"} `}
                >
                  <span className="capitalize">{stat}</span>
                </li>
              </>
            );
          })}
        </ul>
      </div>
      {/*{JSON.stringify(item.)}*/}
      {/*<img className="flex-1 object-contain" src={item.url} alt={item.name} />*/}
    </div>
  );
}
