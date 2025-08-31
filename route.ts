import { NextResponse } from "next/server"
import { getProvider } from "@/lib/chain"

export async function GET(_req: Request, { params }: { params: { txHash: string } }) {
  try {
    const provider = getProvider()
    const tx = await provider.getTransaction(params.txHash)
    if (!tx) return NextResponse.json({ error: "Transaction not found" }, { status: 404 })
    const receipt = await provider.getTransactionReceipt(params.txHash)
    const block = receipt ? await provider.getBlock(receipt.blockNumber) : null
    return NextResponse.json({
      hash: tx.hash,
      from: tx.from,
      to: tx.to,
      input: tx.data, // 0x + hex
      blockNumber: receipt?.blockNumber ?? null,
      status: receipt?.status ?? null,
      timestamp: block?.timestamp ?? null,
      value: tx.value?.toString() ?? "0",
    })
  } catch (err: any) {
    return NextResponse.json({ error: String(err?.message || err) }, { status: 400 })
  }
}
