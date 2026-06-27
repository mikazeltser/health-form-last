export interface QItem {
  question: string;
  answer: string; // "כן" | "לא"
  detail?: string;
}

export interface PersonalData {
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
}

function personalRow(label: string, value: string): string {
  return `
  <tr>
    <td style="padding:10px 16px;font-weight:700;font-size:13px;color:#0f1f45;
               background:#f7f9fc;border:1px solid #dde5f8;width:140px;
               white-space:nowrap;direction:rtl;text-align:right">
      ${label}
    </td>
    <td style="padding:10px 16px;font-size:13px;color:#2d3a5a;
               border:1px solid #dde5f8;direction:rtl;text-align:right">
      ${value || "—"}
    </td>
  </tr>`;
}

function questionRow(q: QItem, index: number): string {
  const isYes  = q.answer === "כן";
  const rowBg  = index % 2 === 0 ? "#ffffff" : "#f9fafc";
  const badge  = isYes
    ? `background:#fffbeb;border:1px solid #e8b420;color:#92600a`
    : `background:#f0fdf4;border:1px solid #86efac;color:#166534`;

  return `
  <tr style="background:${rowBg}">
    <td style="padding:10px 16px;font-size:13px;color:#2d3a5a;
               border:1px solid #dde5f8;direction:rtl;text-align:right">
      ${q.question}
      ${q.detail
        ? `<div style="margin-top:4px;font-size:12px;color:#6b7280;font-style:italic">
             💬 פירוט: ${q.detail}
           </div>`
        : ""}
    </td>
    <td style="padding:10px 16px;border:1px solid #dde5f8;
               text-align:center;width:70px;white-space:nowrap">
      <span style="display:inline-block;padding:3px 10px;border-radius:20px;
                   font-size:12px;font-weight:700;${badge}">
        ${q.answer}
      </span>
    </td>
  </tr>`;
}

function sectionHeader(emoji: string, title: string): string {
  return `
  <tr>
    <td colspan="2" style="padding:20px 16px 8px;direction:rtl">
      <table cellpadding="0" cellspacing="0">
        <tr>
          <td style="width:30px;height:30px;background:#0f1f45;border-radius:8px;
                     text-align:center;vertical-align:middle;font-size:15px">
            ${emoji}
          </td>
          <td style="padding-right:10px;direction:rtl">
            <div style="font-size:16px;font-weight:800;color:#0f1f45">${title}</div>
            <div style="height:3px;width:44px;background:#e8b420;
                        border-radius:2px;margin-top:3px"></div>
          </td>
        </tr>
      </table>
    </td>
  </tr>`;
}

export function buildEmailHtml(
  personal: PersonalData,
  general: QItem[],
  medical: QItem[],
  submittedAt: Date
): string {
  const dateStr = submittedAt.toLocaleString("he-IL", {
    timeZone: "Asia/Jerusalem",
    dateStyle: "full",
    timeStyle: "short",
  });

  const genderLabel = personal.gender === "male" ? "זכר" : "נקבה";

  const allQA     = [...general, ...medical];
  const yesCount  = allQA.filter((q) => q.answer === "כן").length;
  const noCount   = allQA.length - yesCount;
  const yesItems  = allQA.filter((q) => q.answer === "כן");

  const statCell = (value: string | number, label: string, color: string) => `
    <td style="padding-left:10px">
      <div style="background:rgba(255,255,255,0.12);border-radius:10px;
                  padding:10px 16px;text-align:center;min-width:80px">
        <div style="color:${color};font-size:22px;font-weight:800">${value}</div>
        <div style="color:#a0b4d6;font-size:11px;margin-top:2px">${label}</div>
      </div>
    </td>`;

  return `<!DOCTYPE html>
<html dir="rtl" lang="he">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>הצהרת בריאות חדשה</title>
</head>
<body style="margin:0;padding:0;background:#f0f2f7;font-family:Arial,Helvetica,sans-serif;direction:rtl">

<table width="100%" cellpadding="0" cellspacing="0"
       style="background:#f0f2f7;padding:32px 16px">
  <tr>
    <td align="center">

      <!-- ══════════════ CARD ══════════════ -->
      <table width="640" cellpadding="0" cellspacing="0"
             style="max-width:640px;width:100%;background:#ffffff;
                    border-radius:16px;overflow:hidden;
                    border:1px solid #dde5f8;
                    box-shadow:0 4px 24px rgba(15,31,69,0.10)">

        <!-- ── HEADER ── -->
        <tr>
          <td style="background:linear-gradient(135deg,#0f1f45 0%,#1e3a6e 100%);
                     padding:28px 32px">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="direction:rtl">
                  <div style="width:36px;height:36px;border-radius:50%;
                              border:2px solid #e8b420;display:inline-block;
                              text-align:center;line-height:34px;
                              font-size:16px;color:#e8b420;margin-bottom:8px">
                    ✦
                  </div>
                  <div style="color:#ffffff;font-size:22px;font-weight:800;
                              line-height:1.2">
                    הצהרת בריאות חדשה התקבלה
                  </div>
                  <div style="color:#a0b4d6;font-size:13px;margin-top:4px">
                    ${dateStr}
                  </div>
                </td>
                <td style="text-align:left;vertical-align:top;
                           padding-right:16px;white-space:nowrap">
                  <div style="color:#ffffff;font-size:17px;
                              font-weight:800;line-height:1.3">
                    מנורה<br/>מבטחים
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- ── STATS BAR ── -->
        <tr>
          <td style="background:#0f1f45;padding:0 32px 24px">
            <table cellpadding="0" cellspacing="0">
              <tr>
                ${statCell(allQA.length,  "שאלות",       "#e8b420")}
                ${statCell(yesCount,      'תשובות "כן"', "#f87171")}
                ${statCell(noCount,       'תשובות "לא"', "#86efac")}
              </tr>
            </table>
          </td>
        </tr>

        <!-- ── BODY ── -->
        <tr>
          <td style="padding:28px 32px">
            <table width="100%" cellpadding="0" cellspacing="0">

              <!-- Personal -->
              ${sectionHeader("👤", "פרטים אישיים")}
              <tr>
                <td colspan="2" style="padding-bottom:20px">
                  <table width="100%" cellpadding="0" cellspacing="0"
                         style="border-collapse:collapse;
                                border:1px solid #dde5f8;border-radius:10px;
                                overflow:hidden">
                    ${personalRow("שם פרטי",    personal.firstName)}
                    ${personalRow("שם משפחה",   personal.lastName)}
                    ${personalRow("תעודת זהות", personal.idNumber)}
                    ${personalRow("תאריך לידה", personal.birthDate)}
                    ${personalRow("טלפון",       personal.phone)}
                    ${personalRow('דוא"ל',       personal.email)}
                    ${personalRow("כתובת",       personal.address)}
                    ${personalRow("מקצוע",       personal.occupation)}
                    ${personal.employer ? personalRow("מעסיק", personal.employer) : ""}
                    ${personalRow("מין",         genderLabel)}
                  </table>
                </td>
              </tr>

              <!-- General Questions -->
              ${sectionHeader("❓", "שאלות כלליות")}
              <tr>
                <td colspan="2" style="padding-bottom:20px">
                  <table width="100%" cellpadding="0" cellspacing="0"
                         style="border-collapse:collapse;
                                border:1px solid #dde5f8;border-radius:10px;
                                overflow:hidden">
                    <tr style="background:#0f1f45">
                      <th style="padding:10px 16px;color:#fff;font-size:12px;
                                 font-weight:700;text-align:right;direction:rtl;
                                 border:1px solid #1e3a6e">
                        שאלה
                      </th>
                      <th style="padding:10px 16px;color:#fff;font-size:12px;
                                 font-weight:700;text-align:center;width:70px;
                                 border:1px solid #1e3a6e">
                        תשובה
                      </th>
                    </tr>
                    ${general.map((q, i) => questionRow(q, i)).join("")}
                  </table>
                </td>
              </tr>

              <!-- Medical Questions -->
              ${sectionHeader("🏥", "מצב רפואי")}
              <tr>
                <td colspan="2" style="padding-bottom:20px">
                  <table width="100%" cellpadding="0" cellspacing="0"
                         style="border-collapse:collapse;
                                border:1px solid #dde5f8;border-radius:10px;
                                overflow:hidden">
                    <tr style="background:#0f1f45">
                      <th style="padding:10px 16px;color:#fff;font-size:12px;
                                 font-weight:700;text-align:right;direction:rtl;
                                 border:1px solid #1e3a6e">
                        שאלה
                      </th>
                      <th style="padding:10px 16px;color:#fff;font-size:12px;
                                 font-weight:700;text-align:center;width:70px;
                                 border:1px solid #1e3a6e">
                        תשובה
                      </th>
                    </tr>
                    ${medical.map((q, i) => questionRow(q, i)).join("")}
                  </table>
                </td>
              </tr>

              <!-- YES Highlights -->
              ${yesItems.length > 0 ? `
              <tr>
                <td colspan="2" style="padding-bottom:8px">
                  <table width="100%" cellpadding="0" cellspacing="0"
                         style="background:#fffbeb;border:1px solid #e8b420;
                                border-radius:12px;overflow:hidden">
                    <tr>
                      <td style="padding:16px 20px">
                        <div style="font-size:14px;font-weight:800;
                                    color:#92600a;margin-bottom:12px;
                                    direction:rtl">
                          ⚠️ סיכום תשובות "כן" — לתשומת לבך
                        </div>
                        ${yesItems.map((q) => `
                        <div style="margin-bottom:10px;padding-bottom:10px;
                                    border-bottom:1px solid #fde68a;direction:rtl">
                          <div style="font-size:13px;font-weight:700;
                                      color:#0f1f45">${q.question}</div>
                          ${q.detail
                            ? `<div style="font-size:12px;color:#6b7280;margin-top:3px">
                                 פירוט: ${q.detail}
                               </div>`
                            : ""}
                        </div>`).join("")}
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>` : ""}

            </table>
          </td>
        </tr>

        <!-- ── FOOTER ── -->
        <tr>
          <td style="background:#f7f9fc;border-top:1px solid #dde5f8;
                     padding:20px 32px;text-align:center">
            <div style="color:#9aabbf;font-size:11px;direction:rtl">
              המידע שלך מוגן ומאובטח. המידע ישמש אך ורק לצורך הערכת סיכונים וביטוח.
            </div>
            <div style="color:#9aabbf;font-size:11px;margin-top:4px">
              © מנורה מבטחים בע"מ. כל הזכויות שמורות.
            </div>
          </td>
        </tr>

      </table>
      <!-- ══════════════ END CARD ══════════════ -->

    </td>
  </tr>
</table>

</body>
</html>`;
}
