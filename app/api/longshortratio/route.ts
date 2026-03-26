import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const symbol = searchParams.get("symbol") ?? "BTCUSDT";

  const url = `https://api.bybit.com/v5/market/account-ratio?category=linear&symbol=${symbol}&period=1h&limit=1`;
  const res = await fetch(url, { next: { revalidate: 0 } });
  const data = await res.json();

  return NextResponse.json(data, {
    headers: { "Cache-Control": "no-store" },
  });
}
