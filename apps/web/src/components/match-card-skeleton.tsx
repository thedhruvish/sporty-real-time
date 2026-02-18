import { Skeleton } from "./ui/skeleton";

export function MatchCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg border border-orange-100 bg-white shadow-sm">
      <div className="border-orange-100 border-b bg-linear-to-r from-orange-50 to-white px-4 py-3">
        <Skeleton className="h-4 w-24 bg-orange-100" />
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-1 flex-col items-center gap-2">
            <Skeleton className="h-14 w-14 rounded-full bg-orange-100" />
            <Skeleton className="h-4 w-20 bg-orange-100" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8 bg-orange-100" />
            <Skeleton className="h-4 w-2 bg-orange-100" />
            <Skeleton className="h-8 w-8 bg-orange-100" />
          </div>
          <div className="flex flex-1 flex-col items-center gap-2">
            <Skeleton className="h-14 w-14 rounded-full bg-orange-100" />
            <Skeleton className="h-4 w-20 bg-orange-100" />
          </div>
        </div>
      </div>
    </div>
  );
}
