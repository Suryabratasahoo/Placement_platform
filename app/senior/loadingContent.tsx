import Skeleton from "@/components/ui/skeleton"

export function QuestionsLoading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="h-56 bg-[#c9c3c3] rounded-[40px] p-6 space-y-4">
          <Skeleton className="w-20 h-4 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="w-full h-6 rounded-md" />
            <Skeleton className="w-3/4 h-6 rounded-md" />
          </div>
          <div className="flex justify-between items-end pt-6">
            <Skeleton className="w-24 h-5 rounded-full" />
            <Skeleton variant="circle" className="w-10 h-10" />
          </div>
        </div>
      ))}
    </div>
  )
}