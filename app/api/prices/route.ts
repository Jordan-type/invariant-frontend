import { NextResponse } from "next/server";

type PriceMap = Record<string, number>;

export async function POST(req: Request) {
  const body = (await req.json()) as { ids: string[] };
  const ids = Array.from(new Set(body.ids)).filter(Boolean);

  if (!ids.length) return NextResponse.json({ prices: {} satisfies PriceMap });

  // CoinGecko simple price endpoint
  const url =
    "https://api.coingecko.com/api/v3/simple/price?vs_currencies=usd&ids=" +
    encodeURIComponent(ids.join(","));

  const r = await fetch(url, {
    // helps Next cache; tweak later
    next: { revalidate: 60 },
  });

  if (!r.ok) return NextResponse.json({ prices: {} satisfies PriceMap }, { status: 200 });

  const json = (await r.json()) as Record<string, { usd: number }>;
  const prices: PriceMap = {};

  for (const id of ids) {
    prices[id] = json?.[id]?.usd ?? 0;
  }

  return NextResponse.json({ prices });
}
