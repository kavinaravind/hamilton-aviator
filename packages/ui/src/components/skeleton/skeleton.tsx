import { Skeleton } from "../ui/skeleton";

export function LoadingSkeleton() {
  return (
    <div className="flex justify-center px-4 py-8">
      <div className="w-full max-w-5xl">
        <div className="flex flex-col space-y-3">
          <Skeleton className="h-[125px] rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-8" />
            <Skeleton className="h-8" />
          </div>
        </div>
      </div>
    </div>
  );
}
