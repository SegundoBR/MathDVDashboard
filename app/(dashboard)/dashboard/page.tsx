"use client";

import { useQuery } from "@tanstack/react-query";
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { ShimmerSurface } from "@/components/shimmer-surface";
import { api, buildAuthHeaders } from "@/lib/api";
import type { ChartDailyLoginsItem, ChartMonthItem, DashboardSummary } from "@/lib/types";
import { useAuthStore } from "@/stores/auth-store";

export default function DashboardPage() {
  const token = useAuthStore((state) => state.accessToken);

  const summary = useQuery({
    queryKey: ["dashboard-summary"],
    enabled: Boolean(token),
    queryFn: async () => {
      const { data } = await api.get<DashboardSummary>("/backoffice/dashboard/summary/", {
        headers: buildAuthHeaders(token),
      });
      return data;
    },
  });

  const monthly = useQuery({
    queryKey: ["dashboard-monthly"],
    enabled: Boolean(token),
    queryFn: async () => {
      const { data } = await api.get<{ items: ChartMonthItem[] }>(
        "/backoffice/dashboard/students-by-month/",
        { headers: buildAuthHeaders(token) }
      );
      return data.items;
    },
  });

  const dailyLogins = useQuery({
    queryKey: ["dashboard-daily-logins"],
    enabled: Boolean(token),
    queryFn: async () => {
      const { data } = await api.get<{ items: ChartDailyLoginsItem[] }>(
        "/backoffice/dashboard/daily-logins/",
        { headers: buildAuthHeaders(token) }
      );
      return data.items;
    },
  });

  const cards = [
    { label: "Estudiantes", value: summary.data?.total_students ?? 0 },
    { label: "Examenes", value: summary.data?.total_exams ?? 0 },
    { label: "Examenes activos", value: summary.data?.active_exams ?? 0 },
    { label: "Intentos totales", value: summary.data?.total_attempts ?? 0 },
  ];

  const isLoadingDashboard = summary.isLoading || monthly.isLoading || dailyLogins.isLoading;

  return (
    <div className="space-y-6">
      <section className="page-heading">
        <div>
          <p className="page-eyebrow">Panel docente</p>
          <h2 className="page-title">Dashboard</h2>
          <p className="page-subtitle">
            Vista general de actividad, crecimiento de estudiantes e intensidad de uso del sistema.
          </p>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {isLoadingDashboard
          ? Array.from({ length: 4 }).map((_, index) => (
              <article key={`dashboard-shimmer-card-${index}`} className="card bg-gradient-to-br from-white to-slate-50">
                <ShimmerSurface className="h-4 w-28" />
                <ShimmerSurface className="mt-3 h-10 w-24" />
              </article>
            ))
          : cards.map((card) => (
              <article key={card.label} className="card bg-gradient-to-br from-white to-slate-50">
                <p className="text-sm text-slate-500">{card.label}</p>
                <p className="mt-2 text-3xl font-extrabold text-ink">{card.value}</p>
              </article>
            ))}
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <article className="card h-[360px]">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600">
                Estudiantes por mes
              </h2>
              <p className="mt-1 text-xs text-slate-500">Crecimiento acumulado mensual.</p>
            </div>
          </div>
          {monthly.isLoading ? (
            <ShimmerSurface className="h-[78%] w-full" />
          ) : monthly.data?.length ? (
            <ResponsiveContainer width="100%" height="88%">
              <BarChart data={monthly.data || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="month" tick={{ fill: "#64748B", fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fill: "#64748B", fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="total_students" fill="#0E9384" radius={[12, 12, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-[78%] items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 text-sm text-slate-500">
              Sin datos para mostrar
            </div>
          )}
        </article>

        <article className="card h-[360px]">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600">
                Logins diarios
              </h2>
              <p className="mt-1 text-xs text-slate-500">Actividad de acceso de estudiantes.</p>
            </div>
          </div>
          {dailyLogins.isLoading ? (
            <ShimmerSurface className="h-[78%] w-full" />
          ) : dailyLogins.data?.length ? (
            <ResponsiveContainer width="100%" height="88%">
              <LineChart data={dailyLogins.data || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="date" tick={{ fill: "#64748B", fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fill: "#64748B", fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="total_logins" stroke="#1F2937" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-[78%] items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 text-sm text-slate-500">
              Sin datos para mostrar
            </div>
          )}
        </article>
      </section>
    </div>
  );
}
