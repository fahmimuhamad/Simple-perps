import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const symbol = searchParams.get("symbol") ?? "BTCUSDT";

  const url = `https://api.bybit.com/v5/market/tickers?category=linear&symbol=${symbol}`;
  const res = await fetch(url, { next: { revalidate: 0 } });
  const data = await res.json();

  return NextResponse.json(data, {
    headers: { "Cache-Control": "no-store" },
  });
}
