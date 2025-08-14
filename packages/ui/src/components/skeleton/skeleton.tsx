import { Skeleton } from "../ui/skeleton";

export function LoadingSkeleton() {
  return (
    <div className="flex flex-col">
      <Skeleton className="h-[125px] rounded-xl" />
    </div>
  );
}
