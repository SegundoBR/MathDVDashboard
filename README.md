# Backoffice Docente (Next.js)

Panel web para profesores conectado al backend Django.

## Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- React Query
- Zustand
- React Hook Form + Zod
- Recharts
- Sonner

## Configuracion

1. Copiar variables de entorno:

```bash
cp .env.example .env.local
```

2. Instalar dependencias:

```bash
npm install
```

3. Ejecutar en desarrollo:

```bash
npm run dev
```

Abrir `http://localhost:3000`.

## Endpoints esperados

- `POST /api/account/auth/teacher/login/`
- `GET /api/account/teacher/me/`
- `GET /api/backoffice/dashboard/summary/`
- `GET /api/backoffice/dashboard/students-by-month/`
- `GET /api/backoffice/dashboard/daily-logins/`
- `GET/POST /api/backoffice/exams/`
- `GET/PUT/PATCH /api/backoffice/exams/:id/`
- `PATCH /api/backoffice/exams/:id/status/`
- `GET/POST /api/backoffice/topics/`
- `PUT/PATCH /api/backoffice/topics/:id/`
- `GET /api/backoffice/students/`
- `GET /api/backoffice/students/:id/`
# bardalesrueda_backoffice
