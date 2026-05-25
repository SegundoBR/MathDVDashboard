import { ShimmerSurface } from "@/components/shimmer-surface";

export default function LoadingStudentDetail() {
  return (
    <div className="space-y-6">
      <section className="card space-y-4">
        <ShimmerSurface className="h-6 w-48" />
        <ShimmerSurface className="h-4 w-64" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <ShimmerSurface className="h-20" />
          <ShimmerSurface className="h-20" />
          <ShimmerSurface className="h-20" />
        </div>
      </section>
      <section className="space-y-4">
        <ShimmerSurface className="h-6 w-56" />
        <div className="space-y-3">
          <ShimmerSurface className="h-28" />
          <ShimmerSurface className="h-28" />
          <ShimmerSurface className="h-28" />
        </div>
      </section>
    </div>
  );
}
