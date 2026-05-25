import { ShimmerSurface } from "@/components/shimmer-surface";

export default function LoadingProfile() {
  return (
    <div className="card space-y-4">
      <ShimmerSurface className="h-6 w-48" />
      <ShimmerSurface className="h-4 w-64" />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <ShimmerSurface className="h-20" />
        <ShimmerSurface className="h-20" />
        <ShimmerSurface className="h-20" />
      </div>
    </div>
  );
}
