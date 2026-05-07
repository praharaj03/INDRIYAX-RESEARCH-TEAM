import { NextRequest, NextResponse } from "next/server";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const PRICING_FILE = join(process.cwd(), "data", "pricing.json");

function readPricing() {
  try {
    return JSON.parse(readFileSync(PRICING_FILE, "utf-8"));
  } catch {
    return { pro_monthly: 199, elite_annual: 1499 };
  }
}

export async function GET() {
  return NextResponse.json(readPricing());
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const current = readPricing();

  const updated = {
    pro_monthly:  Number(body.pro_monthly)  || current.pro_monthly,
    elite_annual: Number(body.elite_annual) || current.elite_annual,
  };

  writeFileSync(PRICING_FILE, JSON.stringify(updated, null, 2));
  return NextResponse.json(updated);
}
