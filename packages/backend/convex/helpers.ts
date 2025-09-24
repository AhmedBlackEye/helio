import { ConvexError } from "convex/values";
import { Id } from "./_generated/dataModel";
import { MutationCtx, QueryCtx } from "./_generated/server";

interface getSessionOrThrowProps {
  ctx: QueryCtx | MutationCtx;
  sessionId: Id<"contactSessions">;
}
export const getSessionOrThrow = async (
  ctx: QueryCtx | MutationCtx,
  sessionId: Id<"contactSessions">,
) => {
  const session = await ctx.db.get(sessionId);

  if (!session || session.expiresAt < Date.now()) {
    throw new ConvexError({
      code: "UNAUTHORIZED",
      message: "Invalid session",
    });
  }
  return session;
};
