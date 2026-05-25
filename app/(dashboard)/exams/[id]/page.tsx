"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, type MouseEvent } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { ShimmerSurface } from "@/components/shimmer-surface";
import { api, buildAuthHeaders } from "@/lib/api";
import type { Exam, Topic } from "@/lib/types";
import { useAuthStore } from "@/stores/auth-store";
import Link from "next/link";

const schema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  topic: z.string().uuid(),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
  recommended_age_min: z.coerce.number().int().nullable().optional(),
  recommended_age_max: z.coerce.number().int().nullable().optional(),
  is_active: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

export default function ExamDetailPage({ params }: { params: { id: string } }) {
  const token = useAuthStore((state) => state.accessToken);
  const router = useRouter();

  const { register, handleSubmit, reset, setValue, formState } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      description: "",
      topic: "",
      difficulty: "EASY",
      is_active: true,
    },
  });

  const examQuery = useQuery({
    queryKey: ["exam-detail", params.id],
    enabled: Boolean(token),
    queryFn: async () => {
      const { data } = await api.get<Exam>(`/backoffice/exams/${params.id}/`, {
        headers: buildAuthHeaders(token),
      });
      return data;
    },
  });

  const topicsQuery = useQuery({
    queryKey: ["topics-list"],
    enabled: Boolean(token),
    queryFn: async () => {
      const { data } = await api.get<{ topics: Topic[] }>("/backoffice/topics/", {
        headers: buildAuthHeaders(token),
      });
      return data.topics;
    },
  });

  useEffect(() => {
    if (examQuery.data) {
      reset({
        title: examQuery.data.title,
        description: examQuery.data.description,
        topic: examQuery.data.topic,
        difficulty: examQuery.data.difficulty,
        recommended_age_min: examQuery.data.recommended_age_min,
        recommended_age_max: examQuery.data.recommended_age_max,
        is_active: examQuery.data.is_active,
      });
    }
  }, [examQuery.data, reset]);

  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const payload = {
        ...values,
        // Keep the current diagnostic flag unchanged even if it is hidden in UI.
        is_diagnostic: examQuery.data?.is_diagnostic ?? false,
      };

      const { data } = await api.put(`/backoffice/exams/${params.id}/`, payload, {
        headers: buildAuthHeaders(token),
      });
      return data;
    },
    onSuccess: () => {
      toast.success("Examen actualizado");
      router.push("/exams");
    },
    onError: () => toast.error("No se pudo actualizar"),
  });

  const handleProtectedNavigation = (event: MouseEvent<HTMLElement>) => {
    if (formState.isDirty) {
      event.preventDefault();
      toast.warning("Primero guarda los cambios para poder navegar atras.");
    }
  };

  if (examQuery.isLoading || topicsQuery.isLoading) {
    return (
      <div className="card max-w-2xl space-y-4">
        <ShimmerSurface className="h-7 w-40" />
        <ShimmerSurface className="h-11 w-full" />
        <ShimmerSurface className="h-20 w-full" />
        <ShimmerSurface className="h-11 w-full" />
        <ShimmerSurface className="h-11 w-full" />
        <ShimmerSurface className="h-10 w-40" />
      </div>
    );
  }

  return (
    <div className="card max-w-2xl space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-bold">Editar examen</h2>
        <div className="flex items-center gap-2">
          <Link
            href="/exams"
            prefetch={false}
            onClick={handleProtectedNavigation}
            className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700"
          >
            Volver
          </Link>
          <Link
            href={`/exams/${params.id}/questions`}
            prefetch={false}
            onClick={handleProtectedNavigation}
            className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700"
          >
            Gestionar preguntas
          </Link>
        </div>
      </div>
      <form className="space-y-3" onSubmit={handleSubmit((values) => mutation.mutate(values))}>
        <input className="w-full rounded-xl border border-slate-300 px-3 py-2" placeholder="Titulo" {...register("title")} />
        <textarea className="w-full rounded-xl border border-slate-300 px-3 py-2" placeholder="Descripcion" {...register("description")} />
        <select className="w-full rounded-xl border border-slate-300 px-3 py-2" {...register("topic")}>
          <option value="">Seleccionar tema</option>
          {topicsQuery.data?.map((topic) => (
            <option value={topic.id} key={topic.id}>
              {topic.name}
            </option>
          ))}
        </select>
        <select className="w-full rounded-xl border border-slate-300 px-3 py-2" {...register("difficulty")}>
          <option value="EASY">Facil</option>
          <option value="MEDIUM">Media</option>
          <option value="HARD">Dificil</option>
        </select>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            onChange={(event) => setValue("is_active", event.target.checked)}
            defaultChecked={examQuery.data?.is_active}
          />
          Activo
        </label>
        <button type="submit" className="rounded-xl bg-ink px-4 py-2 text-sm font-semibold text-white">
          Guardar
        </button>
      </form>
    </div>
  );
}
