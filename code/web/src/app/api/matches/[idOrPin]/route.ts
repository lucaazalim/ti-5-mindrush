import { type NextRequest, NextResponse } from "next/server";
import { Match } from "~/lib/types";
import { selectMatchByIdOrPin } from "~/server/data/match";
import { APIError, apiErrorResponse } from "../../api";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ idOrPin: string }> },
): Promise<NextResponse<Match | APIError>> {
  const { idOrPin } = await params;
  const match = await selectMatchByIdOrPin(idOrPin);

  if (!match) {
    return apiErrorResponse({
      status: 404,
      message: "Match not found.",
      code: "match_not_found",
    });
  }

  return NextResponse.json(match, { status: 200 });
}
