export default function EmptyList({ list }: { list: any[] }) {
  if (list.length > 0) {
    return null;
  }
  return (
    <div className="flex-1 p-4 grid place-items-center bg-error/20 ring rounded-box fade ring-error ">
      <div className="p-4 space-y-4 text-center">
        <h2 className="font-bold text-xl">List is empty</h2>
      </div>
    </div>
  );
}
