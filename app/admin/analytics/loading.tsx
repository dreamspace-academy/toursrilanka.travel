import { Skeleton } from "@/components/ui/skeleton"

export default function AnalyticsLoading() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-32" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>

      <div className="space-y-4">
        <Skeleton className="h-10 w-full max-w-md" />
        <Skeleton className="h-80 w-full" />
      </div>
    </div>
  )
}
