import { NextRequest } from "next/dist/server/web/spec-extension/request";
import { NextResponse } from "next/server";
import { isFailure } from "~/lib/result";
import { Participant } from "~/lib/types";
import { APIError, apiErrorResponse, authParticipant } from "../../api";

export async function GET(req: NextRequest): Promise<NextResponse<Participant | APIError>> {
  const participant = await authParticipant(req);

  if (isFailure(participant)) {
    return apiErrorResponse(participant.error);
  }

  return NextResponse.json(participant.data, { status: 200 });
}
