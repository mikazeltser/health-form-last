import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { prisma } from "@/lib/prisma";
import { buildEmailHtml, type QItem, type PersonalData } from "@/lib/emailTemplate";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body     = await req.json();
    const personal = body.personal as PersonalData;
    const general  = body.general  as QItem[];
    const medical  = body.medical  as QItem[];

    // ── 1. Save to database ────────────────────────────────
    const record = await prisma.healthForm.create({
      data: {
        firstName:     personal.firstName,
        lastName:      personal.lastName,
        idNumber:      personal.idNumber,
        birthDate:     personal.birthDate,
        phone:         personal.phone,
        email:         personal.email,
        address:       personal.address,
        occupation:    personal.occupation,
        employer:      personal.employer || "",
        gender:        personal.gender,
        generalAnswers: general as object[],
        medicalAnswers: medical as object[],
        status:        "completed",
      },
    });

    // ── 2. Send email ──────────────────────────────────────
    const resend  = new Resend(process.env.RESEND_API_KEY);
    const toEmail = process.env.TO_EMAIL || "ohad@levsaar.co.il";
    const now     = new Date();
    const html    = buildEmailHtml(personal, general, medical, now);

    const { error: emailError } = await resend.emails.send({
      from:    "הצהרת בריאות <onboarding@resend.dev>",
      to:      [toEmail],
      subject: `📋 הצהרת בריאות חדשה — ${personal.firstName} ${personal.lastName}`,
      html,
    });

    if (emailError) {
      console.error("[send-health-form] Resend error:", emailError);
      // DB save succeeded — don't block the user
      return NextResponse.json({
        success: true,
        id: record.id,
        emailError: emailError.message,
      });
    }

    return NextResponse.json({ success: true, id: record.id });
  } catch (err) {
    console.error("[POST /api/send-health-form]", err);
    return NextResponse.json({ error: "שגיאה פנימית בשרת" }, { status: 500 });
  }
}
