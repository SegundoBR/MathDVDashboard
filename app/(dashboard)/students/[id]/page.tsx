"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { ShimmerSurface } from "@/components/shimmer-surface";
import { api, buildAuthHeaders } from "@/lib/api";
import type { Paginated, StudentAttemptDetail, StudentDetail } from "@/lib/types";
import { useAuthStore } from "@/stores/auth-store";

export default function StudentDetailPage({ params }: { params: { id: string } }) {
  const token = useAuthStore((state) => state.accessToken);
  const [page, setPage] = useState(1);

  const student = useQuery({
    queryKey: ["student-detail", params.id, page],
    enabled: Boolean(token),
    queryFn: async () => {
      const { data } = await api.get<Paginated<StudentAttemptDetail> & { student: StudentDetail }>(
        `/backoffice/students/${params.id}/`,
        {
          headers: buildAuthHeaders(token),
          params: { page },
        }
      );
      return data;
    },
  });

  return (
    <div className="space-y-6">
      {student.isLoading || !student.data ? (
        <>
          <section className="card space-y-4">
            <ShimmerSurface className="h-6 w-56" />
            <ShimmerSurface className="h-4 w-64" />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <ShimmerSurface className="h-20" />
              <ShimmerSurface className="h-20" />
              <ShimmerSurface className="h-20" />
            </div>
          </section>
          <section className="space-y-4">
            <ShimmerSurface className="h-6 w-56" />
            <ShimmerSurface className="h-28" />
            <ShimmerSurface className="h-28" />
            <ShimmerSurface className="h-28" />
          </section>
        </>
      ) : null}

      {student.data ? (
        <>
      <section className="card">
        <h2 className="text-lg font-bold text-ink">{student.data?.student.full_name || "Estudiante"}</h2>
        <p className="text-sm text-slate-600">{student.data?.student.email}</p>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-xl bg-slate-50 p-3">
            <p className="text-xs text-slate-500">Intentos</p>
            <p className="text-2xl font-bold">{student.data?.student.stats.total_attempts ?? 0}</p>
          </div>
          <div className="rounded-xl bg-slate-50 p-3">
            <p className="text-xs text-slate-500">Completados</p>
            <p className="text-2xl font-bold">{student.data?.student.stats.completed_attempts ?? 0}</p>
          </div>
          <div className="rounded-xl bg-slate-50 p-3">
            <p className="text-xs text-slate-500">Promedio</p>
            <p className="text-2xl font-bold">{student.data?.student.stats.average_score ?? 0}%</p>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-ink">Examenes resueltos</h3>
          <p className="text-sm text-slate-600">Ordenado del mas reciente al mas antiguo</p>
        </div>

        <div className="space-y-3">
          {student.data?.results.map((attempt) => (
            <details key={attempt.id} className="card group">
              <summary className="cursor-pointer list-none">
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="font-semibold text-ink">{attempt.exam_title}</p>
                    <p className="text-xs text-slate-500">
                      {attempt.topic_name} · {new Date(attempt.started_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="rounded-full bg-slate-100 px-2 py-1 font-semibold text-slate-700">
                      {attempt.percentage}%
                    </span>
                    <span className="rounded-full bg-accentSoft px-2 py-1 font-semibold text-accent">
                      {attempt.completed ? "Completado" : "En progreso"}
                    </span>
                  </div>
                </div>
              </summary>

              <div className="mt-4 space-y-3 border-t border-slate-200 pt-4">
                <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-xs text-slate-500">Puntaje</p>
                    <p className="font-bold text-ink">{attempt.score}/{attempt.total_questions}</p>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-xs text-slate-500">Tipo</p>
                    <p className="font-bold text-ink">{attempt.attempt_type}</p>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-xs text-slate-500">Inicio</p>
                    <p className="font-bold text-ink">{new Date(attempt.started_at).toLocaleString()}</p>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-xs text-slate-500">Fin</p>
                    <p className="font-bold text-ink">{attempt.completed_at ? new Date(attempt.completed_at).toLocaleString() : "-"}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-semibold text-ink">Respuestas</p>
                  {attempt.answers.map((answer) => (
                    <div key={answer.id} className="rounded-xl border border-slate-200 p-3">
                      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="font-medium text-ink">{answer.question_title}</p>
                          <p className="text-xs text-slate-500">{answer.question_text}</p>
                        </div>
                        <span className={`rounded-full px-2 py-1 text-xs font-semibold ${answer.is_correct ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
                          {answer.is_correct ? "Correcta" : "Incorrecta"}
                        </span>
                      </div>
                      <div className="mt-2 grid grid-cols-1 gap-2 text-sm md:grid-cols-2">
                        <p><span className="font-semibold">Elegida:</span> {answer.selected_option_label}</p>
                        <p><span className="font-semibold">Correcta:</span> {answer.correct_option_label || "-"}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </details>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            disabled={!student.data?.previous}
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Anterior
          </button>
          <span className="text-sm text-slate-600">
            Pagina {student.data?.current_page ?? 1} de {student.data?.total_pages ?? 1}
          </span>
          <button
            type="button"
            onClick={() => setPage((current) => current + 1)}
            disabled={!student.data?.next}
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>
      </section>
        </>
      ) : null}
    </div>
  );
}
