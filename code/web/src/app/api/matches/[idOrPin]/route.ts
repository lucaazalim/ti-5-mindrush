import { type NextRequest, NextResponse } from "next/server";
import { getMatchByIdOrPin } from "~/server/actions/match-actions";
import {isFailure} from "~/lib/result";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ idOrPin: string }> },
) {
  const { idOrPin } = await params;
  const result = await getMatchByIdOrPin(idOrPin);

  if (isFailure(result)) {
    return NextResponse.json(result.error.message, {
      status: result.error.status,
    });
  }

  return NextResponse.json(result.data, { status: 200 });
}
