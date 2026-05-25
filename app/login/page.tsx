"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { api } from "@/lib/api";
import type { TeacherUser } from "@/lib/types";
import { useAuthStore } from "@/stores/auth-store";

const schema = z.object({
  email: z.string().email("Correo invalido"),
  password: z.string().min(6, "Minimo 6 caracteres"),
});

type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const setSession = useAuthStore((state) => state.setSession);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const { data } = await api.post<{
        access_token: string;
        refresh_token: string;
        user: TeacherUser;
      }>("/account/auth/teacher/login/", values);
      return data;
    },
    onSuccess: (payload) => {
      setSession({
        accessToken: payload.access_token,
        refreshToken: payload.refresh_token,
        user: payload.user,
      });
      toast.success("Bienvenido al backoffice");
      router.replace("/dashboard");
    },
    onError: () => {
      toast.error("No se pudo iniciar sesion");
    },
  });

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#E6F9F6] px-6">
      <div className="pointer-events-none absolute -left-16 -top-16 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-10 h-80 w-80 rounded-full bg-emerald-300/30 blur-3xl" />

      <div className="w-full max-w-md rounded-3xl border border-white/80 bg-white/90 p-8 shadow-xl backdrop-blur">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Panel Docente</p>
        <h1 className="mt-2 text-2xl font-extrabold text-ink">Iniciar sesion</h1>
        <p className="mt-1 text-sm text-slate-600">
          Usa tus credenciales de profesor para gestionar examenes y estudiantes.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit((values) => mutation.mutate(values))}>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="email">
              Correo
            </label>
            <input
              id="email"
              type="email"
              {...register("email")}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-accent"
            />
            {errors.email && <p className="mt-1 text-xs text-rose-600">{errors.email.message}</p>}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="password">
              Contrasena
            </label>
            <input
              id="password"
              type="password"
              {...register("password")}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-accent"
            />
            {errors.password && (
              <p className="mt-1 text-xs text-rose-600">{errors.password.message}</p>
            )}
          </div>

          <button
            disabled={mutation.isPending}
            type="submit"
            className="w-full rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {mutation.isPending ? "Ingresando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
