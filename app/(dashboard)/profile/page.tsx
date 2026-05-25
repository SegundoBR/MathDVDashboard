"use client";

import { useQuery } from "@tanstack/react-query";

import { ShimmerSurface } from "@/components/shimmer-surface";
import { api, buildAuthHeaders } from "@/lib/api";
import type { TeacherUser } from "@/lib/types";
import { useAuthStore } from "@/stores/auth-store";

export default function ProfilePage() {
  const token = useAuthStore((state) => state.accessToken);

  const teacher = useQuery({
    queryKey: ["teacher-me"],
    enabled: Boolean(token),
    queryFn: async () => {
      const { data } = await api.get<TeacherUser>("/account/teacher/me/", {
        headers: buildAuthHeaders(token),
      });
      return data;
    },
  });

  if (teacher.isLoading || !teacher.data) {
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

  return (
    <div className="card space-y-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Profesor</p>
        <h2 className="text-2xl font-bold text-ink">
          {teacher.data.first_name || teacher.data.email}
        </h2>
        <p className="text-sm text-slate-600">{teacher.data.email}</p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-xs text-slate-500">Nombre</p>
          <p className="mt-1 font-semibold text-ink">{teacher.data.first_name || "-"}</p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-xs text-slate-500">Apellido</p>
          <p className="mt-1 font-semibold text-ink">{teacher.data.last_name || "-"}</p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-xs text-slate-500">Rol</p>
          <p className="mt-1 font-semibold text-ink">{teacher.data.role}</p>
        </div>
      </div>
    </div>
  );
}
