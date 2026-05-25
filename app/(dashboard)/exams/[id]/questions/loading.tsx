import { ShimmerSurface } from "@/components/shimmer-surface";

export default function LoadingExamQuestions() {
  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_1.1fr]">
      <section className="card space-y-4">
        <ShimmerSurface className="h-6 w-36" />
        <ShimmerSurface className="h-4 w-56" />
        <ShimmerSurface className="h-12 w-full" />
        <ShimmerSurface className="h-12 w-full" />
        <ShimmerSurface className="h-12 w-full" />
      </section>
      <section className="card space-y-4">
        <ShimmerSurface className="h-6 w-44" />
        <ShimmerSurface className="h-12 w-full" />
        <ShimmerSurface className="h-12 w-full" />
        <ShimmerSurface className="h-12 w-full" />
        <ShimmerSurface className="h-12 w-full" />
      </section>
    </div>
  );
}
