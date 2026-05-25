"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { ShimmerSurface } from "@/components/shimmer-surface";
import { api, buildAuthHeaders } from "@/lib/api";
import type { Question } from "@/lib/types";
import { useAuthStore } from "@/stores/auth-store";

const optionSchema = z.object({
  label: z.string().min(1),
  position: z.enum(["LEFT", "RIGHT"]),
  is_correct: z.boolean(),
  order: z.coerce.number().int().min(0),
});

const schema = z.object({
  title: z.string().min(3),
  question_text: z.string().min(3),
  spoken_instruction: z.string().min(3),
  spoken_question: z.string().min(3),
  spoken_feedback_correct: z.string().min(3),
  spoken_feedback_incorrect: z.string().min(3),
  order: z.coerce.number().int().min(0),
  is_active: z.boolean(),
  options: z.array(optionSchema).length(2),
});

type FormValues = z.infer<typeof schema>;

const emptyValues: FormValues = {
  title: "",
  question_text: "",
  spoken_instruction: "",
  spoken_question: "",
  spoken_feedback_correct: "",
  spoken_feedback_incorrect: "",
  order: 0,
  is_active: true,
  options: [
    { label: "", position: "LEFT", is_correct: true, order: 0 },
    { label: "", position: "RIGHT", is_correct: false, order: 1 },
  ],
};

export default function ExamQuestionsPage({ params }: { params: { id: string } }) {
  const token = useAuthStore((state) => state.accessToken);
  const queryClient = useQueryClient();
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);

  const questionsQuery = useQuery({
    queryKey: ["exam-questions", params.id],
    enabled: Boolean(token),
    queryFn: async () => {
      const { data } = await api.get<{ questions: Question[] }>(`/backoffice/exams/${params.id}/questions/`, {
        headers: buildAuthHeaders(token),
      });
      return data.questions;
    },
  });

  const selectedQuestion = useMemo(
    () => questionsQuery.data?.find((question) => question.id === selectedQuestionId) || null,
    [questionsQuery.data, selectedQuestionId]
  );

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: emptyValues,
  });

  useEffect(() => {
    if (selectedQuestion) {
      reset({
        title: selectedQuestion.title,
        question_text: selectedQuestion.question_text,
        spoken_instruction: selectedQuestion.spoken_instruction,
        spoken_question: selectedQuestion.spoken_question,
        spoken_feedback_correct: selectedQuestion.spoken_feedback_correct,
        spoken_feedback_incorrect: selectedQuestion.spoken_feedback_incorrect,
        order: selectedQuestion.order,
        is_active: selectedQuestion.is_active,
        options: [
          selectedQuestion.options.find((option) => option.position === "LEFT") || {
            label: "",
            position: "LEFT",
            is_correct: true,
            order: 0,
          },
          selectedQuestion.options.find((option) => option.position === "RIGHT") || {
            label: "",
            position: "RIGHT",
            is_correct: false,
            order: 1,
          },
        ],
      });
    } else {
      reset(emptyValues);
    }
  }, [selectedQuestion, reset]);

  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const payload = {
        ...values,
        exam: params.id,
      };

      if (selectedQuestionId) {
        const { data } = await api.put(`/backoffice/questions/${selectedQuestionId}/`, payload, {
          headers: buildAuthHeaders(token),
        });
        return data;
      }

      const { data } = await api.post(`/backoffice/exams/${params.id}/questions/`, payload, {
        headers: buildAuthHeaders(token),
      });
      return data;
    },
    onSuccess: () => {
      toast.success(selectedQuestionId ? "Pregunta actualizada" : "Pregunta creada");
      queryClient.invalidateQueries({ queryKey: ["exam-questions", params.id] });
      setSelectedQuestionId(null);
      reset(emptyValues);
    },
    onError: () => toast.error("No se pudo guardar la pregunta"),
  });

  if (questionsQuery.isLoading) {
    return (
      <div className="grid gap-6 xl:grid-cols-[1fr_1.1fr]">
        <section className="card space-y-4">
          <ShimmerSurface className="h-6 w-40" />
          <ShimmerSurface className="h-4 w-56" />
          <ShimmerSurface className="h-16 w-full" />
          <ShimmerSurface className="h-16 w-full" />
          <ShimmerSurface className="h-16 w-full" />
        </section>
        <section className="card space-y-4">
          <ShimmerSurface className="h-6 w-44" />
          <ShimmerSurface className="h-11 w-full" />
          <ShimmerSurface className="h-20 w-full" />
          <ShimmerSurface className="h-11 w-full" />
          <ShimmerSurface className="h-11 w-full" />
        </section>
      </div>
    );
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_1.1fr]">
      <section className="card space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-ink">Preguntas</h2>
            <p className="text-sm text-slate-600">Crea y edita las preguntas de este examen.</p>
          </div>
          <button
            type="button"
            className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700"
            onClick={() => setSelectedQuestionId(null)}
          >
            Nueva pregunta
          </button>
        </div>

        <div className="space-y-2">
          {questionsQuery.data?.map((question) => (
            <button
              key={question.id}
              type="button"
              onClick={() => setSelectedQuestionId(question.id)}
              className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                selectedQuestionId === question.id
                  ? "border-ink bg-ink/5"
                  : "border-slate-200 bg-white hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-ink">{question.title}</p>
                  <p className="text-xs text-slate-500">Orden {question.order}</p>
                </div>
                <span className={`rounded-full px-2 py-1 text-xs font-semibold ${question.is_active ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-700"}`}>
                  {question.is_active ? "Activa" : "Inactiva"}
                </span>
              </div>
              <p className="mt-2 line-clamp-2 text-sm text-slate-600">{question.question_text}</p>
            </button>
          ))}
        </div>
      </section>

      <section className="card space-y-4">
        <div>
          <h2 className="text-lg font-bold text-ink">{selectedQuestionId ? "Editar pregunta" : "Crear pregunta"}</h2>
          <p className="text-sm text-slate-600">Cada pregunta debe tener dos opciones: LEFT y RIGHT.</p>
        </div>

        <form className="space-y-3" onSubmit={handleSubmit((values) => mutation.mutate(values))}>
          <input className="w-full rounded-xl border border-slate-300 px-3 py-2" placeholder="Titulo" {...register("title")} />
          <textarea className="w-full rounded-xl border border-slate-300 px-3 py-2" placeholder="Texto de la pregunta" {...register("question_text")} />
          <textarea className="w-full rounded-xl border border-slate-300 px-3 py-2" placeholder="Instruccion hablada" {...register("spoken_instruction")} />
          <textarea className="w-full rounded-xl border border-slate-300 px-3 py-2" placeholder="Pregunta hablada" {...register("spoken_question")} />
          <textarea className="w-full rounded-xl border border-slate-300 px-3 py-2" placeholder="Feedback correcto" {...register("spoken_feedback_correct")} />
          <textarea className="w-full rounded-xl border border-slate-300 px-3 py-2" placeholder="Feedback incorrecto" {...register("spoken_feedback_incorrect")} />
          <div className="grid grid-cols-2 gap-3">
            <input className="w-full rounded-xl border border-slate-300 px-3 py-2" type="number" placeholder="Orden" {...register("order")} />
            <label className="flex items-center gap-2 rounded-xl border border-slate-300 px-3 py-2 text-sm">
              <input type="checkbox" {...register("is_active")} /> Activa
            </label>
          </div>

          <div className="space-y-3 rounded-2xl border border-slate-200 p-4">
            <p className="text-sm font-semibold text-ink">Opciones</p>
            {[0, 1].map((index) => (
              <div key={index} className="space-y-2 rounded-xl bg-slate-50 p-3">
                <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                  <input className="w-full rounded-xl border border-slate-300 px-3 py-2" placeholder={`Opcion ${index + 1}`} {...register(`options.${index}.label` as const)} />
                  <select className="w-full rounded-xl border border-slate-300 px-3 py-2" {...register(`options.${index}.position` as const)}>
                    <option value="LEFT">LEFT</option>
                    <option value="RIGHT">RIGHT</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" {...register(`options.${index}.is_correct` as const)} /> Correcta
                  </label>
                  <input className="w-full rounded-xl border border-slate-300 px-3 py-2" type="number" placeholder="Orden" {...register(`options.${index}.order` as const)} />
                </div>
              </div>
            ))}
          </div>

          {errors.title ? <p className="text-sm text-rose-600">{errors.title.message}</p> : null}
          <button type="submit" className="rounded-xl bg-ink px-4 py-2 text-sm font-semibold text-white">
            Guardar pregunta
          </button>
        </form>
      </section>
    </div>
  );
}
