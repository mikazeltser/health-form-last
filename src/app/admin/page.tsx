"use client";

import { useEffect, useState, useCallback } from "react";

interface SubmissionRow {
  id: string;
  createdAt: string;
  firstName: string;
  lastName: string;
  idNumber: string;
  phone: string;
  email: string;
  status: string;
}

interface QItem {
  question: string;
  answer: string;
  detail?: string;
}

interface FullForm {
  id: string;
  createdAt: string;
  firstName: string;
  lastName: string;
  idNumber: string;
  birthDate: string;
  phone: string;
  email: string;
  address: string;
  occupation: string;
  employer: string;
  gender: string;
  generalAnswers: QItem[];
  medicalAnswers: QItem[];
  status: string;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("he-IL", {
    timeZone: "Asia/Jerusalem",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function AnswerBadge({ answer }: { answer: string }) {
  const yes = answer === "כן";
  return (
    <span
      className={`inline-block px-3 py-0.5 rounded-full text-xs font-bold border ${
        yes
          ? "bg-amber-50 border-amber-300 text-amber-800"
          : "bg-green-50 border-green-300 text-green-800"
      }`}
    >
      {answer}
    </span>
  );
}

function DetailModal({
  form,
  onClose,
}: {
  form: FullForm;
  onClose: () => void;
}) {
  const gender = form.gender === "male" ? "זכר" : "נקבה";

  function InfoRow({ label, value }: { label: string; value: string }) {
    return (
      <div className="flex justify-between items-start py-2.5 border-b border-gray-100 last:border-0 text-sm gap-4">
        <span className="text-gray-700 text-right flex-1">{value || "—"}</span>
        <span className="text-gray-400 font-semibold whitespace-nowrap w-28 flex-shrink-0 text-left">
          {label}
        </span>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl z-10"
        dir="rtl"
      >
        {/* Modal Header */}
        <div className="bg-[#0f1f45] px-6 py-5 flex items-center justify-between sticky top-0 z-10 rounded-t-2xl">
          <div>
            <h2 className="text-white font-bold text-xl">
              {form.firstName} {form.lastName}
            </h2>
            <p className="text-blue-300 text-sm mt-0.5">
              {formatDate(form.createdAt)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition"
          >
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Personal */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 bg-[#0f1f45] rounded-lg flex items-center justify-center text-sm">
                👤
              </div>
              <h3 className="font-bold text-[#0f1f45] text-base">
                פרטים אישיים
              </h3>
              <div className="h-0.5 flex-1 bg-[#e8b420] rounded-full" />
            </div>
            <div className="bg-gray-50 rounded-xl px-4 py-1">
              <InfoRow label="שם פרטי" value={form.firstName} />
              <InfoRow label="שם משפחה" value={form.lastName} />
              <InfoRow label="תעודת זהות" value={form.idNumber} />
              <InfoRow label="תאריך לידה" value={form.birthDate} />
              <InfoRow label="טלפון" value={form.phone} />
              <InfoRow label='דוא"ל' value={form.email} />
              <InfoRow label="כתובת" value={form.address} />
              <InfoRow label="מקצוע" value={form.occupation} />
              {form.employer && (
                <InfoRow label="מעסיק" value={form.employer} />
              )}
              <InfoRow label="מין" value={gender} />
            </div>
          </section>

          {/* General */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 bg-[#0f1f45] rounded-lg flex items-center justify-center text-sm">
                ❓
              </div>
              <h3 className="font-bold text-[#0f1f45] text-base">
                שאלות כלליות
              </h3>
              <div className="h-0.5 flex-1 bg-[#e8b420] rounded-full" />
            </div>
            <div className="space-y-2">
              {form.generalAnswers.map((q, i) => (
                <div
                  key={i}
                  className={`rounded-xl px-4 py-3 border ${
                    q.answer === "כן"
                      ? "bg-amber-50 border-amber-200"
                      : "bg-gray-50 border-gray-100"
                  }`}
                >
                  <div className="flex justify-between items-start gap-3">
                    <AnswerBadge answer={q.answer} />
                    <p className="text-sm text-gray-700 text-right flex-1">
                      {q.question}
                    </p>
                  </div>
                  {q.detail && (
                    <p className="text-xs text-gray-500 mt-2 text-right">
                      💬 פירוט: {q.detail}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Medical */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 bg-[#0f1f45] rounded-lg flex items-center justify-center text-sm">
                🏥
              </div>
              <h3 className="font-bold text-[#0f1f45] text-base">מצב רפואי</h3>
              <div className="h-0.5 flex-1 bg-[#e8b420] rounded-full" />
            </div>
            <div className="space-y-2">
              {form.medicalAnswers.map((q, i) => (
                <div
                  key={i}
                  className={`rounded-xl px-4 py-3 border ${
                    q.answer === "כן"
                      ? "bg-amber-50 border-amber-200"
                      : "bg-gray-50 border-gray-100"
                  }`}
                >
                  <div className="flex justify-between items-start gap-3">
                    <AnswerBadge answer={q.answer} />
                    <p className="text-sm text-gray-700 text-right flex-1">
                      {q.question}
                    </p>
                  </div>
                  {q.detail && (
                    <p className="text-xs text-gray-500 mt-2 text-right">
                      💬 פירוט: {q.detail}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="px-6 pb-6 flex justify-end border-t border-gray-100 pt-4">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-[#0f1f45] text-white rounded-xl font-semibold text-sm hover:bg-[#162d58] transition"
          >
            סגור
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const [rows, setRows] = useState<SubmissionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<FullForm | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const fetchList = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin");
      if (!res.ok) throw new Error("שגיאה בטעינה");
      setRows(await res.json());
    } catch {
      setError("לא ניתן לטעון את הנתונים");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  const openDetail = async (id: string) => {
    setLoadingId(id);
    try {
      const res = await fetch(`/api/admin/${id}`);
      const data = await res.json();
      setSelected(data);
    } catch {
      alert("שגיאה בטעינת הפרטים");
    } finally {
      setLoadingId(null);
    }
  };

  const filtered = rows.filter((r) => {
    const q = search.toLowerCase();
    return (
      r.firstName.toLowerCase().includes(q) ||
      r.lastName.toLowerCase().includes(q) ||
      r.idNumber.includes(q) ||
      r.email.toLowerCase().includes(q) ||
      r.phone.includes(q)
    );
  });

  const today = new Date().toDateString();
  const week = Date.now() - 7 * 86400000;

  return (
    <div className="min-h-screen bg-[#f0f2f7]" dir="rtl">
      {/* Header */}
      <header className="bg-[#0f1f45] px-6 py-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-[#e8b420] flex items-center justify-center">
            <svg
              className="w-4 h-4 text-[#e8b420]"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2L4 5v6c0 5.25 3.5 10.15 8 11.35C16.5 21.15 20 16.25 20 11V5l-8-3z" />
            </svg>
          </div>
          <div>
            <div className="text-white font-bold text-lg leading-none">
              לוח בקרה
            </div>
            <div className="text-blue-300 text-xs mt-0.5">הצהרות בריאות</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="bg-[#e8b420] text-[#0f1f45] text-xs font-bold px-3 py-1 rounded-full">
            {rows.length} הצהרות
          </span>
          <button
            onClick={fetchList}
            className="text-white/70 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition"
            title="רענן"
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
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            {
              label: "סה״כ הצהרות",
              value: rows.length,
              icon: "📋",
              color: "text-blue-700",
              bg: "bg-blue-50 border-blue-200",
            },
            {
              label: "השבוע",
              value: rows.filter((r) => new Date(r.createdAt).getTime() > week)
                .length,
              icon: "📅",
              color: "text-green-700",
              bg: "bg-green-50 border-green-200",
            },
            {
              label: "היום",
              value: rows.filter(
                (r) => new Date(r.createdAt).toDateString() === today
              ).length,
              icon: "⚡",
              color: "text-amber-700",
              bg: "bg-amber-50 border-amber-200",
            },
            {
              label: "הושלמו",
              value: rows.filter((r) => r.status === "completed").length,
              icon: "✅",
              color: "text-purple-700",
              bg: "bg-purple-50 border-purple-200",
            },
          ].map((s) => (
            <div
              key={s.label}
              className={`bg-white rounded-xl border ${s.bg} p-4 shadow-sm`}
            >
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-bold text-[#0f1f45] text-lg">כל הממלאים</h2>
              <div className="h-0.5 w-12 bg-[#e8b420] rounded-full mt-1" />
            </div>
            <input
              type="text"
              placeholder="חיפוש לפי שם, ת.ז., מייל, טלפון..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-72 rounded-xl border border-gray-200 px-4 py-2 text-sm text-right outline-none focus:border-[#0f1f45] focus:ring-2 focus:ring-[#0f1f45]/10 transition"
            />
          </div>

          {loading && (
            <div className="py-16 text-center text-gray-400">
              <div className="w-8 h-8 border-2 border-[#0f1f45] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              טוען נתונים...
            </div>
          )}

          {error && (
            <div className="py-12 text-center text-red-500 text-sm">
              {error}
            </div>
          )}

          {!loading && !error && filtered.length === 0 && (
            <div className="py-16 text-center text-gray-400">
              <div className="text-4xl mb-3">📭</div>
              {search ? "לא נמצאו תוצאות לחיפוש" : "טרם התקבלו הצהרות"}
            </div>
          )}

          {!loading && !error && filtered.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/80">
                    <th className="px-4 py-3 text-right font-semibold text-gray-500 text-xs">
                      תאריך ושעה
                    </th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-500 text-xs">
                      שם מלא
                    </th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-500 text-xs hidden sm:table-cell">
                      תעודת זהות
                    </th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-500 text-xs hidden md:table-cell">
                      טלפון
                    </th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-500 text-xs hidden lg:table-cell">
                      אימייל
                    </th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-500 text-xs">
                      סטטוס
                    </th>
                    <th className="px-4 py-3 text-center font-semibold text-gray-500 text-xs">
                      פרטים
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r, i) => (
                    <tr
                      key={r.id}
                      className={`border-b border-gray-50 hover:bg-blue-50/40 transition ${
                        i % 2 === 0 ? "" : "bg-gray-50/30"
                      }`}
                    >
                      <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                        {formatDate(r.createdAt)}
                      </td>
                      <td className="px-4 py-3 font-semibold text-[#0f1f45]">
                        {r.firstName} {r.lastName}
                      </td>
                      <td className="px-4 py-3 text-gray-600 hidden sm:table-cell font-mono text-xs">
                        {r.idNumber}
                      </td>
                      <td className="px-4 py-3 text-gray-600 hidden md:table-cell">
                        {r.phone}
                      </td>
                      <td className="px-4 py-3 text-gray-600 hidden lg:table-cell text-xs">
                        {r.email}
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                          הושלם
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => openDetail(r.id)}
                          disabled={loadingId === r.id}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0f1f45] text-white rounded-lg text-xs font-semibold hover:bg-[#162d58] transition disabled:opacity-50"
                        >
                          {loadingId === r.id ? (
                            <svg
                              className="w-3 h-3 animate-spin"
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
                          ) : (
                            <svg
                              className="w-3 h-3"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                          )}
                          צפה
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {selected && (
        <DetailModal form={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
