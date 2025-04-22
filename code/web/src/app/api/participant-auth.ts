import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";
import { env } from "~/env";
import { fail, Result, succeed } from "~/lib/result";
import { isUuid, Uuid } from "~/lib/types";

export function authParticipant(req: NextRequest): Result<Uuid, string> {
  const rawAuth = req.headers.get("Authorization");

  if (!rawAuth?.startsWith("Bearer ")) {
    return fail(
      "You need to provide a participant token using the 'Authorization: Bearer <token>' header.",
    );
  }

  const participantToken = rawAuth.slice("Bearer ".length);
  const participantId = jwt.verify(participantToken, env.PARTICIPANT_TOKEN_SECRET_KEY);

  if (typeof participantId !== "string" || !isUuid(participantId)) {
    return fail("The provided participant token is invalid.");
  }

  return succeed(participantId);
}
