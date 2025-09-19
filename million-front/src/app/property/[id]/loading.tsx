import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';

export default function PropertyDetailsLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header Skeleton can be added if it also fetches data */}
      <div className="grid md:grid-cols-3 gap-8 mt-8">
        {/* Main Content Skeleton */}
        <div className="md:col-span-2 space-y-8">
          <Card className="rounded-3xl overflow-hidden">
            <Skeleton className="h-[500px] w-full" />
          </Card>
          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
          </div>
          <div className="grid grid-cols-2 gap-4 text-center border-t border-b py-6 rounded-lg">
            <div className="space-y-2">
              <Skeleton className="h-8 w-8 mx-auto rounded-full" />
              <Skeleton className="h-6 w-20 mx-auto" />
              <Skeleton className="h-4 w-24 mx-auto" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-8 w-8 mx-auto rounded-full" />
              <Skeleton className="h-6 w-16 mx-auto" />
              <Skeleton className="h-4 w-20 mx-auto" />
            </div>
          </div>
        </div>

        {/* Sidebar Skeleton */}
        <div className="space-y-6">
          <Card className="p-6 rounded-2xl">
            <Skeleton className="h-10 w-3/5 mx-auto" />
          </Card>
          <Card className="p-6 rounded-2xl">
            <Skeleton className="h-6 w-1/2 mb-4" />
            <div className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[150px]" />
                <Skeleton className="h-4 w-[100px]" />
              </div>
            </div>
          </Card>
          <Card className="p-6 rounded-2xl space-y-3">
            <Skeleton className="h-6 w-1/3 mb-4" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </Card>
        </div>
      </div>
    </div>
  );
}
