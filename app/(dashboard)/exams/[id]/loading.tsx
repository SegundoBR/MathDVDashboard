import { ShimmerSurface } from "@/components/shimmer-surface";

export default function LoadingExamDetail() {
  return (
    <div className="card max-w-2xl space-y-4">
      <ShimmerSurface className="h-6 w-40" />
      <ShimmerSurface className="h-12 w-full" />
      <ShimmerSurface className="h-12 w-full" />
      <ShimmerSurface className="h-12 w-full" />
      <ShimmerSurface className="h-12 w-full" />
      <ShimmerSurface className="h-12 w-32" />
    </div>
  );
}
