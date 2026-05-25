"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

import { ShimmerSurface } from "@/components/shimmer-surface";
import { api, buildAuthHeaders } from "@/lib/api";
import type { Paginated, StudentListItem } from "@/lib/types";
import { useAuthStore } from "@/stores/auth-store";

export default function StudentsPage() {
  const token = useAuthStore((state) => state.accessToken);

  const students = useQuery({
    queryKey: ["students-list"],
    enabled: Boolean(token),
    queryFn: async () => {
      const { data } = await api.get<Paginated<StudentListItem>>("/backoffice/students/", {
        headers: buildAuthHeaders(token),
      });
      return data;
    },
  });

  return (
    <div className="space-y-6">
      <section className="page-heading">
        <div>
          <p className="page-eyebrow">Seguimiento</p>
          <h2 className="page-title">Estudiantes</h2>
          <p className="page-subtitle">
            Consulta el avance y entra al detalle de cada alumno con su historial de intentos.
          </p>
        </div>
      </section>
      <div className="table-shell">
        <table className="min-w-full text-sm">
          <thead className="table-head">
            <tr>
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Correo</th>
              <th className="px-4 py-3">Intentos</th>
              <th className="px-4 py-3">Completados</th>
              <th className="px-4 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {students.isLoading
              ? Array.from({ length: 7 }).map((_, index) => (
                  <tr key={`student-shimmer-${index}`} className="border-t border-slate-100/80">
                    <td className="px-4 py-3" colSpan={5}>
                      <ShimmerSurface className="h-10 w-full" />
                    </td>
                  </tr>
                ))
              : null}
            {students.data?.results.map((student) => (
              <tr key={student.id} className="border-t border-slate-100/80 odd:bg-white even:bg-slate-50/40">
                <td className="px-4 py-3 font-medium">{student.full_name || "Sin nombre"}</td>
                <td className="px-4 py-3">{student.email}</td>
                <td className="px-4 py-3">{student.attempts_count}</td>
                <td className="px-4 py-3">{student.completed_attempts}</td>
                <td className="px-4 py-3">
                  <Link
                    href={`/students/${student.id}`}
                    prefetch={false}
                    className="rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    Ver detalle
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
