import { Skeleton } from "@/components/ui/skeleton";

export function FeaturedSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex flex-col space-y-3">
          <Skeleton className="h-[220px] w-full rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      ))}
    </div>
  );
}