import { MutationCtx, QueryCtx } from "./_generated/server";

/**
 * Resolves the user identifier from the request context.
 * If a custom session userId is present in the context, it uses it.
 * If standard authentication is active, it returns the tokenIdentifier.
 * Otherwise, it falls back to 'guest_user' for local sandbox testing.
 */
export async function getUserId(ctx: any): Promise<string> {
  if (ctx.userId) {
    return ctx.userId;
  }
  const identity = await ctx.auth.getUserIdentity();
  if (identity) {
    return identity.subject || identity.tokenIdentifier;
  }
  return "guest_user";
}
