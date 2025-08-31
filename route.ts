import { type NextRequest, NextResponse } from "next/server"
import { certsStore } from "@/lib/store"

export async function POST(req: NextRequest) {
  const { certificateId, commitment } = await req.json().catch(() => ({}))
  if (!certificateId || !commitment) return NextResponse.json({ error: "missing_fields" }, { status: 400 })
  const rec = certsStore.get(certificateId)
  if (!rec) return NextResponse.json({ error: "not_found" }, { status: 404 })
  if (!rec.bio?.commitment) return NextResponse.json({ ok: false, reason: "no_biometric_on_record" }, { status: 400 })

  const ok = commitment === rec.bio.commitment
  return NextResponse.json({ ok })
}
