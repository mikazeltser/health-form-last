"use client";

import { useState } from "react";

/* ─── Types ──────────────────────────────────────────────── */
interface PersonalData {
  firstName: string;
  lastName: string;
  idNumber: string;
  birthDate: string;
  phone: string;
  email: string;
  address: string;
  occupation: string;
  employer: string;
  gender: "male" | "female" | "";
}

interface YesNoItem {
  id: string;
  question: string;
  answer: "yes" | "no" | "";
  detail: string;
}

const defaultPersonal: PersonalData = {
  firstName: "",
  lastName: "",
  idNumber: "",
  birthDate: "",
  phone: "",
  email: "",
  address: "",
  occupation: "",
  employer: "",
  gender: "",
};

const GENERAL_QUESTIONS: Omit<YesNoItem, "answer" | "detail">[] = [
  { id: "g1", question: "האם אתה מעשן או עישנת בעבר?" },
  { id: "g2", question: "האם אתה שותה אלכוהול באופן קבוע?" },
  { id: "g3", question: "האם אתה עוסק בפעילות גופנית סדירה?" },
  { id: "g4", question: "האם עברת ניתוח כלשהו בשנתיים האחרונות?" },
  { id: "g5", question: "האם אתה נוטל תרופות באופן קבוע?" },
  { id: "g6", question: "האם אתה בהריון או מניק?" },
];

const MEDICAL_QUESTIONS: Omit<YesNoItem, "answer" | "detail">[] = [
  { id: "m1", question: "האם אובחנת עם מחלת לב או כלי דם?" },
  { id: "m2", question: "האם אובחנת עם סוכרת?" },
  { id: "m3", question: "האם יש לך לחץ דם גבוה?" },
  { id: "m4", question: "האם אובחנת עם מחלת סרטן בעבר או בהווה?" },
  { id: "m5", question: "האם אובחנת עם מחלת ריאות (כגון אסתמה, COPD)?" },
  { id: "m6", question: "האם אובחנת עם מחלה נפשית או הפרעת נפש?" },
  { id: "m7", question: "האם סבלת או סובל מבעיות בעמוד השדרה או המפרקים?" },
  { id: "m8", question: "האם יש לך אלרגיות לתרופות?" },
];

const STEPS = [
  { num: 1, label: "פרטים אישיים" },
  { num: 2, label: "שאלות כלליות" },
  { num: 3, label: "מצב רפואי" },
  { num: 4, label: "סיכום ושליחה" },
];

/* ─── Step Bar ───────────────────────────────────────────── */
function StepBar({ current }: { current: number }) {
  return (
    <div className="flex items-start justify-between w-full">
      {STEPS.map((s, i) => {
        const done = current > s.num;
        const active = current === s.num;
        return (
          <div key={s.num} className="flex flex-col items-center flex-1">
            <div className="flex items-center w-full">
              {i > 0 && (
                <div
                  className={`flex-1 h-0.5 ${
                    done || active ? "bg-[#0f1f45]" : "bg-gray-200"
                  }`}
                />
              )}
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 z-10 flex-shrink-0 transition-colors
                  ${
                    active
                      ? "bg-[#0f1f45] border-[#0f1f45] text-white"
                      : done
                      ? "bg-[#0f1f45] border-[#0f1f45] text-white"
                      : "bg-white border-gray-300 text-gray-400"
                  }`}
              >
                {done ? (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  s.num
                )}
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className={`flex-1 h-0.5 ${
                    done ? "bg-[#0f1f45]" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
            <span
              className={`mt-1.5 text-xs font-medium ${
                active || done ? "text-[#0f1f45]" : "text-gray-400"
              }`}
            >
              {s.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/* ─── Field wrapper ──────────────────────────────────────── */
function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-semibold text-gray-700">
        {label}{" "}
        {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}

const inputCls =
  "w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-right bg-white outline-none focus:border-[#0f1f45] focus:ring-2 focus:ring-[#0f1f45]/10 transition placeholder:text-gray-300";

/* ─── Yes/No Question ────────────────────────────────────── */
function YesNoQuestion({
  item,
  onChange,
}: {
  item: YesNoItem;
  onChange: (id: string, field: "answer" | "detail", val: string) => void;
}) {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-4">
      <p className="text-sm font-medium text-gray-800 mb-3">{item.question}</p>
      <div className="flex gap-3 justify-end">
        {(["yes", "no"] as const).map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => onChange(item.id, "answer", v)}
            className={`px-5 py-1.5 rounded-full text-sm font-semibold border transition
              ${
                item.answer === v
                  ? v === "yes"
                    ? "bg-[#0f1f45] text-white border-[#0f1f45]"
                    : "bg-gray-600 text-white border-gray-600"
                  : "bg-white text-gray-500 border-gray-200 hover:border-[#0f1f45]"
              }`}
          >
            {v === "yes" ? "כן" : "לא"}
          </button>
        ))}
      </div>
      {item.answer === "yes" && (
        <div className="mt-3 fade-in">
          <textarea
            className={`${inputCls} resize-none`}
            rows={2}
            placeholder="אנא פרט..."
            value={item.detail}
            onChange={(e) => onChange(item.id, "detail", e.target.value)}
          />
        </div>
      )}
    </div>
  );
}

/* ─── Step nav buttons ───────────────────────────────────── */
function StepButtons({
  onBack,
  onNext,
  nextLabel = "הבא",
}: {
  onBack: () => void;
  onNext: () => void;
  nextLabel?: string;
}) {
  return (
    <div className="px-6 pb-6 flex justify-between items-center border-t border-gray-100 pt-4 mt-2">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-2 text-gray-500 text-sm hover:text-[#0f1f45] transition font-medium"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19l-7-7 7-7"
          />
        </svg>
        חזור
      </button>
      <button
        type="button"
        onClick={onNext}
        className="flex items-center gap-2 bg-[#0f1f45] hover:bg-[#162d58] text-white font-bold px-7 py-2.5 rounded-xl transition shadow"
      >
        {nextLabel}
        <svg
          className="w-4 h-4 rotate-180"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </div>
  );
}

/* ─── Section heading inside card ────────────────────────── */
function CardHeading({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="px-6 pt-6 pb-4 flex items-center gap-3 border-b border-gray-100">
      <div className="w-9 h-9 bg-[#0f1f45] rounded-lg flex items-center justify-center flex-shrink-0 text-white">
        {icon}
      </div>
      <div>
        <h2 className="text-lg font-bold text-[#0f1f45]">{title}</h2>
        <div className="h-0.5 w-16 bg-[#e8b420] mt-1 rounded-full" />
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════ */
export default function HealthForm() {
  const [step, setStep] = useState(1);
  const [personal, setPersonal] = useState<PersonalData>(defaultPersonal);
  const [general, setGeneral] = useState<YesNoItem[]>(
    GENERAL_QUESTIONS.map((q) => ({ ...q, answer: "", detail: "" }))
  );
  const [medical, setMedical] = useState<YesNoItem[]>(
    MEDICAL_QUESTIONS.map((q) => ({ ...q, answer: "", detail: "" }))
  );
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof PersonalData, string>>
  >({});
  const [stepError, setStepError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  /* helpers */
  const setP = (k: keyof PersonalData, v: string) =>
    setPersonal((p) => ({ ...p, [k]: v }));

  const updateQ = (
    list: YesNoItem[],
    setList: React.Dispatch<React.SetStateAction<YesNoItem[]>>,
    id: string,
    field: "answer" | "detail",
    val: string
  ) => setList(list.map((q) => (q.id === id ? { ...q, [field]: val } : q)));

  /* validation */
  const validatePersonal = () => {
    const e: Partial<Record<keyof PersonalData, string>> = {};
    if (!personal.firstName.trim()) e.firstName = "שדה חובה";
    if (!personal.lastName.trim()) e.lastName = "שדה חובה";
    if (!personal.idNumber.trim() || !/^\d{9}$/.test(personal.idNumber))
      e.idNumber = "ת.ז. חייבת להכיל 9 ספרות";
    if (!personal.birthDate) e.birthDate = "שדה חובה";
    if (!personal.phone.trim()) e.phone = "שדה חובה";
    if (!personal.email.trim() || !/\S+@\S+\.\S+/.test(personal.email))
      e.email = "כתובת מייל לא תקינה";
    if (!personal.address.trim()) e.address = "שדה חובה";
    if (!personal.occupation.trim()) e.occupation = "שדה חובה";
    if (!personal.gender) e.gender = "יש לבחור מין";
    setFieldErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateYesNo = (list: YesNoItem[]) =>
    list.every((q) => q.answer !== "");

  /* navigation */
  const next = () => {
    setStepError("");
    if (step === 1 && !validatePersonal()) return;
    if (step === 2 && !validateYesNo(general)) {
      setStepError("אנא ענה על כל השאלות לפני המשך.");
      return;
    }
    if (step === 3 && !validateYesNo(medical)) {
      setStepError("אנא ענה על כל השאלות לפני המשך.");
      return;
    }
    setStep((s) => s + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const back = () => {
    setStepError("");
    setStep((s) => s - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const reset = () => {
    setPersonal(defaultPersonal);
    setGeneral(GENERAL_QUESTIONS.map((q) => ({ ...q, answer: "", detail: "" })));
    setMedical(MEDICAL_QUESTIONS.map((q) => ({ ...q, answer: "", detail: "" })));
    setFieldErrors({});
    setStepError("");
  };

  /* submit */
  const submit = async () => {
    setLoading(true);
    setSubmitError("");
    try {
      const payload = {
        personal,
        general: general.map(({ question, answer, detail }) => ({
          question,
          answer: answer === "yes" ? "כן" : "לא",
          detail,
        })),
        medical: medical.map(({ question, answer, detail }) => ({
          question,
          answer: answer === "yes" ? "כן" : "לא",
          detail,
        })),
      };
      const res = await fetch("/api/send-health-form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "שגיאה בשליחה");
      setSuccess(true);
    } catch (err: unknown) {
      setSubmitError(
        err instanceof Error ? err.message : "שגיאה לא צפויה"
      );
    } finally {
      setLoading(false);
    }
  };

  /* ── Summary helper ── */
  function SummaryRow({ label, value }: { label: string; value: string }) {
    return (
      <div className="flex justify-between py-2 border-b border-gray-100 last:border-0 text-sm gap-4">
        <span className="text-gray-800 text-right flex-1">{value || "—"}</span>
        <span className="text-gray-400 font-medium whitespace-nowrap">{label}</span>
      </div>
    );
  }

  /* ════════════════════════════════════════════════════════ */
  return (
    <div className="min-h-screen bg-[#f0f2f7] flex flex-col" dir="rtl">

      {/* ── Header ── */}
      <header className="bg-[#0f1f45] px-4 md:px-8 py-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full border-2 border-[#e8b420] flex items-center justify-center">
            <svg
              className="w-4 h-4 text-[#e8b420]"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2L4 5v6c0 5.25 3.5 10.15 8 11.35C16.5 21.15 20 16.25 20 11V5l-8-3z" />
            </svg>
          </div>
          <span className="text-white font-bold text-lg">הצהרת בריאות</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="text-right leading-tight">
            <div className="text-white font-bold text-base leading-none">
              מנורה
            </div>
            <div className="text-white font-bold text-base leading-none">
              מבטחים
            </div>
          </div>
          <svg
            className="w-10 h-10 text-[#e8b420]"
            viewBox="0 0 60 60"
            fill="currentColor"
          >
            <ellipse cx="30" cy="52" rx="22" ry="6" opacity="0.3" />
            <rect x="27" y="20" width="6" height="32" rx="3" />
            <rect x="14" y="26" width="6" height="26" rx="3" />
            <rect x="40" y="26" width="6" height="26" rx="3" />
            <circle cx="30" cy="13" r="7" />
            <circle cx="17" cy="19" r="5" />
            <circle cx="43" cy="19" r="5" />
          </svg>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-8">

        {/* Step bar */}
        <div className="bg-white rounded-2xl px-6 py-6 mb-5 shadow-sm">
          <StepBar current={step} />
        </div>

        {/* Notice */}
        {!success && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 mb-5 flex items-start gap-3">
            <svg
              className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2a10 10 0 100 20A10 10 0 0012 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
            </svg>
            <p className="text-sm text-amber-800 leading-relaxed">
              עליך לענות באופן מלא, מפורט ומדויק. אי הצהרת אמת עלולה להשפיע
              ואף לפטור את מנורה מבטחים בע&quot;מ מתשלום.
            </p>
          </div>
        )}

        {/* ════ SUCCESS ════ */}
        {success && (
          <div className="bg-white rounded-2xl p-10 shadow-sm text-center fade-in">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <svg
                className="w-10 h-10 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-[#0f1f45] mb-2">
              ההצהרה נשלחה בהצלחה
            </h2>
            <p className="text-gray-500 text-sm">
              פרטיך התקבלו ויטופלו בהקדם.
            </p>
          </div>
        )}

        {/* ════ STEP 1 ════ */}
        {!success && step === 1 && (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden fade-in">
            <CardHeading
              icon={
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                </svg>
              }
              title="פרטי המבוטח הראשי"
            />

            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label="שם פרטי" required error={fieldErrors.firstName}>
                <input
                  className={`${inputCls} ${fieldErrors.firstName ? "border-red-400" : ""}`}
                  placeholder="שם פרטי"
                  value={personal.firstName}
                  onChange={(e) => setP("firstName", e.target.value)}
                />
              </Field>

              <Field label="שם משפחה" required error={fieldErrors.lastName}>
                <input
                  className={`${inputCls} ${fieldErrors.lastName ? "border-red-400" : ""}`}
                  placeholder="שם משפחה"
                  value={personal.lastName}
                  onChange={(e) => setP("lastName", e.target.value)}
                />
              </Field>

              <Field label="מספר זהות" required error={fieldErrors.idNumber}>
                <input
                  className={`${inputCls} ${fieldErrors.idNumber ? "border-red-400" : ""}`}
                  placeholder="000000000"
                  maxLength={9}
                  value={personal.idNumber}
                  onChange={(e) =>
                    setP("idNumber", e.target.value.replace(/\D/g, ""))
                  }
                />
              </Field>

              <Field label="תאריך לידה" required error={fieldErrors.birthDate}>
                <input
                  type="date"
                  className={`${inputCls} ${fieldErrors.birthDate ? "border-red-400" : ""}`}
                  value={personal.birthDate}
                  onChange={(e) => setP("birthDate", e.target.value)}
                />
              </Field>

              <Field label="מספר נייד" required error={fieldErrors.phone}>
                <input
                  className={`${inputCls} ${fieldErrors.phone ? "border-red-400" : ""}`}
                  placeholder="050-1234567"
                  value={personal.phone}
                  onChange={(e) => setP("phone", e.target.value)}
                />
              </Field>

              <Field label='דוא"ל' required error={fieldErrors.email}>
                <input
                  type="email"
                  className={`${inputCls} ${fieldErrors.email ? "border-red-400" : ""}`}
                  placeholder="example@email.com"
                  value={personal.email}
                  onChange={(e) => setP("email", e.target.value)}
                />
              </Field>

              <div className="sm:col-span-2">
                <Field label="כתובת מלאה" required error={fieldErrors.address}>
                  <input
                    className={`${inputCls} ${fieldErrors.address ? "border-red-400" : ""}`}
                    placeholder="רחוב, מספר, עיר, מיקוד"
                    value={personal.address}
                    onChange={(e) => setP("address", e.target.value)}
                  />
                </Field>
              </div>

              <Field label="מקצוע" required error={fieldErrors.occupation}>
                <input
                  className={`${inputCls} ${fieldErrors.occupation ? "border-red-400" : ""}`}
                  placeholder="הקלד/י את מקצועך"
                  value={personal.occupation}
                  onChange={(e) => setP("occupation", e.target.value)}
                />
              </Field>

              <Field label="מעסיק">
                <input
                  className={inputCls}
                  placeholder="שם מקום העבודה"
                  value={personal.employer}
                  onChange={(e) => setP("employer", e.target.value)}
                />
              </Field>

              <div className="sm:col-span-2">
                <Field label="מין" required error={fieldErrors.gender}>
                  <div className="flex gap-3">
                    {(["male", "female"] as const).map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setP("gender", g)}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border text-sm font-medium transition
                          ${
                            personal.gender === g
                              ? "bg-[#0f1f45] border-[#0f1f45] text-white"
                              : "bg-white border-gray-200 text-gray-600 hover:border-[#0f1f45]"
                          }`}
                      >
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                        </svg>
                        {g === "male" ? "זכר" : "נקבה"}
                      </button>
                    ))}
                  </div>
                </Field>
              </div>
            </div>

            <div className="px-6 pb-6 flex justify-between items-center border-t border-gray-100 pt-4">
              <button
                type="button"
                onClick={reset}
                className="flex items-center gap-2 text-gray-400 text-sm hover:text-red-400 transition"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                נקה טופס
              </button>
              <button
                type="button"
                onClick={next}
                className="flex items-center gap-2 bg-[#0f1f45] hover:bg-[#162d58] text-white font-bold px-7 py-2.5 rounded-xl transition shadow"
              >
                הבא
                <svg
                  className="w-4 h-4 rotate-180"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* ════ STEP 2 ════ */}
        {!success && step === 2 && (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden fade-in">
            <CardHeading
              icon={
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              }
              title="שאלות כלליות"
            />
            <div className="p-6 flex flex-col gap-4">
              {general.map((q) => (
                <YesNoQuestion
                  key={q.id}
                  item={q}
                  onChange={(id, field, val) =>
                    updateQ(general, setGeneral, id, field, val)
                  }
                />
              ))}
            </div>
            {stepError && (
              <p className="px-6 pb-3 text-sm text-red-500">{stepError}</p>
            )}
            <StepButtons onBack={back} onNext={next} />
          </div>
        )}

        {/* ════ STEP 3 ════ */}
        {!success && step === 3 && (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden fade-in">
            <CardHeading
              icon={
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              }
              title="מצב רפואי"
            />
            <div className="p-6 flex flex-col gap-4">
              {medical.map((q) => (
                <YesNoQuestion
                  key={q.id}
                  item={q}
                  onChange={(id, field, val) =>
                    updateQ(medical, setMedical, id, field, val)
                  }
                />
              ))}
            </div>
            {stepError && (
              <p className="px-6 pb-3 text-sm text-red-500">{stepError}</p>
            )}
            <StepButtons onBack={back} onNext={next} />
          </div>
        )}

        {/* ════ STEP 4: Summary ════ */}
        {!success && step === 4 && (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden fade-in">
            <CardHeading
              icon={
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              }
              title="סיכום ואישור"
            />

            <div className="p-6 space-y-6">
              {/* Personal summary */}
              <section>
                <h3 className="font-bold text-[#0f1f45] text-xs uppercase tracking-wide border-b-2 border-[#e8b420] pb-1 mb-2">
                  פרטים אישיים
                </h3>
                <SummaryRow label="שם פרטי" value={personal.firstName} />
                <SummaryRow label="שם משפחה" value={personal.lastName} />
                <SummaryRow label="תעודת זהות" value={personal.idNumber} />
                <SummaryRow label="תאריך לידה" value={personal.birthDate} />
                <SummaryRow label="טלפון" value={personal.phone} />
                <SummaryRow label='דוא"ל' value={personal.email} />
                <SummaryRow label="כתובת" value={personal.address} />
                <SummaryRow label="מקצוע" value={personal.occupation} />
                <SummaryRow
                  label="מין"
                  value={
                    personal.gender === "male"
                      ? "זכר"
                      : personal.gender === "female"
                      ? "נקבה"
                      : ""
                  }
                />
              </section>

              {/* General summary */}
              <section>
                <h3 className="font-bold text-[#0f1f45] text-xs uppercase tracking-wide border-b-2 border-[#e8b420] pb-1 mb-2">
                  שאלות כלליות
                </h3>
                {general.map((q) => (
                  <div
                    key={q.id}
                    className="py-2 border-b border-gray-100 last:border-0"
                  >
                    <div className="flex justify-between text-sm gap-3">
                      <span
                        className={`font-semibold px-2 py-0.5 rounded text-xs flex-shrink-0 ${
                          q.answer === "yes"
                            ? "bg-red-50 text-red-600"
                            : "bg-green-50 text-green-700"
                        }`}
                      >
                        {q.answer === "yes" ? "כן" : "לא"}
                      </span>
                      <span className="text-gray-600 text-right flex-1">
                        {q.question}
                      </span>
                    </div>
                    {q.detail && (
                      <p className="text-xs text-gray-400 mt-1 text-right">
                        פירוט: {q.detail}
                      </p>
                    )}
                  </div>
                ))}
              </section>

              {/* Medical summary */}
              <section>
                <h3 className="font-bold text-[#0f1f45] text-xs uppercase tracking-wide border-b-2 border-[#e8b420] pb-1 mb-2">
                  מצב רפואי
                </h3>
                {medical.map((q) => (
                  <div
                    key={q.id}
                    className="py-2 border-b border-gray-100 last:border-0"
                  >
                    <div className="flex justify-between text-sm gap-3">
                      <span
                        className={`font-semibold px-2 py-0.5 rounded text-xs flex-shrink-0 ${
                          q.answer === "yes"
                            ? "bg-red-50 text-red-600"
                            : "bg-green-50 text-green-700"
                        }`}
                      >
                        {q.answer === "yes" ? "כן" : "לא"}
                      </span>
                      <span className="text-gray-600 text-right flex-1">
                        {q.question}
                      </span>
                    </div>
                    {q.detail && (
                      <p className="text-xs text-gray-400 mt-1 text-right">
                        פירוט: {q.detail}
                      </p>
                    )}
                  </div>
                ))}
              </section>

              {/* Declaration text */}
              <div className="bg-gray-50 rounded-xl p-4 text-xs text-gray-500 leading-relaxed border border-gray-100">
                אני מצהיר/ה בזאת כי כל הפרטים שמסרתי לעיל הינם נכונים, מלאים
                ומדויקים. ידוע לי כי מסירת פרטים שגויים או הסתרת מידע רלוונטי
                עלולה לגרום לביטול הפוליסה ו/או לפטור את המבטח מחבות.
              </div>
            </div>

            {submitError && (
              <p className="px-6 pb-2 text-sm text-red-500">{submitError}</p>
            )}

            <div className="px-6 pb-6 flex justify-between items-center border-t border-gray-100 pt-4">
              <button
                type="button"
                onClick={back}
                className="flex items-center gap-2 text-gray-500 text-sm hover:text-[#0f1f45] transition font-medium"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                חזור
              </button>
              <button
                type="button"
                onClick={submit}
                disabled={loading}
                className="flex items-center gap-2 bg-[#e8b420] hover:bg-[#c99a10] text-[#0f1f45] font-bold px-7 py-2.5 rounded-xl transition shadow disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <svg
                      className="w-4 h-4 animate-spin"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      />
                    </svg>
                    שולח...
                  </>
                ) : (
                  <>
                    שליחת הצהרה
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </main>

      {/* ── Footer ── */}
      <footer className="mt-auto">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-center gap-2 text-xs text-gray-400">
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          המידע שלך מוגן ומאובטח. המידע ישמש אך ורק לצורך הערכת סיכונים
          וביטוח.
        </div>
        <div className="bg-[#0f1f45] text-center py-3">
          <p className="text-white/60 text-xs">
            © מנורה מבטחים בע&quot;מ. כל הזכויות שמורות.
          </p>
        </div>
      </footer>
    </div>
  );
}
