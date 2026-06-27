import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const forms = await prisma.healthForm.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id:        true,
        createdAt: true,
        firstName: true,
        lastName:  true,
        idNumber:  true,
        phone:     true,
        email:     true,
        status:    true,
      },
    });

    return NextResponse.json(forms);
  } catch (err) {
    console.error("[GET /api/admin]", err);
    return NextResponse.json({ error: "שגיאה בטעינת הנתונים" }, { status: 500 });
  }
}
