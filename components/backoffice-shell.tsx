"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

import { useAuthStore } from "@/stores/auth-store";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/exams", label: "Examenes" },
  { href: "/students", label: "Estudiantes" },
  { href: "/profile", label: "Profesor" },
];

export function BackofficeShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const user = useAuthStore((state) => state.user);
  const clearSession = useAuthStore((state) => state.clearSession);

  return (
    <div className="min-h-screen bg-shell">
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-700 lg:hidden"
                onClick={() => setMobileOpen(true)}
                aria-label="Abrir menu"
              >
                ☰
              </button>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Backoffice</p>
                <h1 className="text-lg font-semibold text-ink">Bardales Rueda</h1>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/profile"
              prefetch={false}
              className="rounded-full bg-accentSoft px-3 py-1 text-xs font-semibold text-accent transition hover:bg-emerald-100"
            >
              {user?.email}
            </Link>
            <button
              onClick={() => {
                clearSession();
                router.replace("/login");
              }}
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              type="button"
            >
              Cerrar sesion
            </button>
          </div>
        </div>
      </header>
      <div className="mx-auto grid min-h-[calc(100vh-73px)] max-w-7xl grid-cols-1 gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[240px_1fr]">
        <aside className="hidden h-full rounded-2xl border border-slate-200 bg-white p-3 lg:block">
          <nav className="space-y-1">
            {links.map((item) => {
              const active = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  prefetch={false}
                  className={`block rounded-xl px-3 py-2 text-sm font-medium transition ${
                    active ? "bg-ink text-white" : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>
        <main className="h-full">{children}</main>
      </div>
      {mobileOpen ? (
        <div className="fixed inset-0 z-50 bg-slate-900/40 lg:hidden" onClick={() => setMobileOpen(false)}>
          <div
            className="h-full w-[82%] max-w-xs bg-white p-4 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-semibold text-ink">Menu</p>
              <button
                type="button"
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
                onClick={() => setMobileOpen(false)}
              >
                Cerrar
              </button>
            </div>
            <nav className="space-y-2">
              {links.map((item) => {
                const active = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    prefetch={false}
                    onClick={() => setMobileOpen(false)}
                    className={`block rounded-xl px-3 py-3 text-sm font-medium transition ${
                      active ? "bg-ink text-white" : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      ) : null}
    </div>
  );
}
