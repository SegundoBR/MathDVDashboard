"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { toast } from "sonner";

import { ShimmerSurface } from "@/components/shimmer-surface";
import { api, buildAuthHeaders } from "@/lib/api";
import type { Exam, Paginated } from "@/lib/types";
import { useAuthStore } from "@/stores/auth-store";

export default function ExamsPage() {
  const token = useAuthStore((state) => state.accessToken);
  const queryClient = useQueryClient();

  const examsQuery = useQuery({
    queryKey: ["exams-list"],
    enabled: Boolean(token),
    queryFn: async () => {
      const { data } = await api.get<Paginated<Exam>>("/backoffice/exams/", {
        headers: buildAuthHeaders(token),
      });
      return data;
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: async (payload: { id: string; is_active: boolean }) => {
      const { data } = await api.patch(
        `/backoffice/exams/${payload.id}/status/`,
        { is_active: !payload.is_active },
        { headers: buildAuthHeaders(token) }
      );
      return data;
    },
    onSuccess: () => {
      toast.success("Estado actualizado");
      queryClient.invalidateQueries({ queryKey: ["exams-list"] });
    },
    onError: () => toast.error("No se pudo actualizar el estado"),
  });

  return (
    <div className="space-y-6">
      <section className="page-heading">
        <div>
          <p className="page-eyebrow">Gestion academica</p>
          <h2 className="page-title">Examenes</h2>
          <p className="page-subtitle">Administra contenido, visibilidad y acceso de cada examen.</p>
        </div>
      </section>

      <div className="table-shell">
        <table className="min-w-full text-sm">
          <thead className="table-head">
            <tr>
              <th className="px-4 py-3">Titulo</th>
              <th className="px-4 py-3">Tema</th>
              <th className="px-4 py-3">Dificultad</th>
              <th className="px-4 py-3">Preguntas</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {examsQuery.isLoading
              ? Array.from({ length: 7 }).map((_, index) => (
                  <tr key={`exam-shimmer-${index}`} className="border-t border-slate-100/80">
                    <td className="px-4 py-3" colSpan={6}>
                      <ShimmerSurface className="h-10 w-full" />
                    </td>
                  </tr>
                ))
              : null}
            {examsQuery.data?.results.map((exam) => (
              <tr key={exam.id} className="border-t border-slate-100/80 odd:bg-white even:bg-slate-50/40">
                <td className="px-4 py-3 font-medium text-slate-900">{exam.title}</td>
                <td className="px-4 py-3">{exam.topic_name}</td>
                <td className="px-4 py-3">{exam.difficulty}</td>
                <td className="px-4 py-3">{exam.questions_count}</td>
                <td className="px-4 py-3">
                  <span
                    className={`pill ${
                      exam.is_active ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    {exam.is_active ? "Activo" : "Inactivo"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    <Link
                      href={`/exams/${exam.id}`}
                      prefetch={false}
                      className="rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                      Editar
                    </Link>
                    <Link
                      href={`/exams/${exam.id}/questions`}
                      prefetch={false}
                      className="rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                      Preguntas
                    </Link>
                    <button
                      type="button"
                      className="rounded-xl bg-ink px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-slate-900"
                      onClick={() => toggleStatusMutation.mutate({ id: exam.id, is_active: exam.is_active })}
                    >
                      {exam.is_active ? "Desactivar" : "Activar"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
