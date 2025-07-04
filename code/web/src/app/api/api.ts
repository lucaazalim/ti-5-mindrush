import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import { env } from "~/env";
import { selectParticipantById } from "~/lib/data/participant";
import { isUuid } from "~/lib/parsers";
import { fail, Result, succeed } from "~/lib/result";
import { Participant } from "~/lib/types";

export type APIError = {
  status: number;
  message: string;
  code: string;
};

export function apiErrorResponse(error: APIError): NextResponse<APIError> {
  return NextResponse.json(error, {
    status: error.status,
  });
}

export async function authParticipant(req: NextRequest): Promise<Result<Participant, APIError>> {
  const rawAuth = req.headers.get("Authorization");

  if (!rawAuth?.startsWith("Bearer ")) {
    return fail({
      status: 401,
      message:
        "You need to provide a participant token using the 'Authorization: Bearer <token>' header.",
      code: "missing_token",
    });
  }

  const participantToken = rawAuth.slice("Bearer ".length);
  const participantId = jwt.verify(participantToken, env.PARTICIPANT_TOKEN_SECRET_KEY);

  if (typeof participantId !== "string" || !isUuid(participantId)) {
    return fail({
      status: 401,
      message: "The provided participant token is invalid.",
      code: "invalid_token",
    });
  }

  return succeed(await selectParticipantById(participantId));
}
