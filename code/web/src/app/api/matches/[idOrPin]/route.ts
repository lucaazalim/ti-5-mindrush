import { type NextRequest, NextResponse } from "next/server";
import { selectMatchByIdOrPin } from "~/server/data/match";

export async function GET(req: NextRequest, { params }: { params: Promise<{ idOrPin: string }> }) {
  const { idOrPin } = await params;
  const match = await selectMatchByIdOrPin(idOrPin);

  if (!match) {
    return NextResponse.json("Match not found.", {
      status: 404,
    });
  }

  return NextResponse.json(match, { status: 200 });
}
