# הצהרת בריאות — Next.js + Prisma + Resend

## מבנה הפרויקט

```
health-declaration/
├── prisma/
│   └── schema.prisma
├── public/
├── src/
│   ├── app/
│   │   ├── admin/
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx          ← לוח בקרה
│   │   ├── api/
│   │   │   ├── admin/
│   │   │   │   ├── [id]/
│   │   │   │   │   └── route.ts
│   │   │   │   └── route.ts
│   │   │   └── send-health-form/
│   │   │       └── route.ts
│   │   ├── components/
│   │   │   └── HealthForm.tsx
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   └── lib/
│       ├── emailTemplate.ts
│       └── prisma.ts
├── .env.example
├── .gitignore
├── next.config.js
├── package.json
├── postcss.config.js
├── tailwind.config.ts
└── tsconfig.json
```

---

## הפעלה מקומית

```bash
npm install
cp .env.example .env.local
# מלא את .env.local
npx prisma db push
npm run dev
```

- טופס: http://localhost:3000
- Admin: http://localhost:3000/admin

---

## העלאה ל-Vercel

1. דחוף ל-GitHub
2. ייבא ב-Vercel → Deploy
3. **Settings → Environment Variables** — הוסף:
   - `RESEND_API_KEY`
   - `TO_EMAIL` = ohad@levsaar.co.il
   - `DATABASE_URL`
4. לאחר deploy ראשון: `npx prisma db push`

---

## DB חינמי — Neon

1. [neon.tech](https://neon.tech) → New Project
2. העתק את Connection String
3. הדבק ב-`DATABASE_URL`
