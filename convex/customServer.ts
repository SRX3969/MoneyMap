import {
  query as rawQuery,
  mutation as rawMutation,
  internalQuery as rawInternalQuery,
  internalMutation as rawInternalMutation,
} from "./_generated/server";
import { v } from "convex/values";
import { QueryBuilder, MutationBuilder } from "convex/server";
import type { DataModel } from "./_generated/dataModel";

/**
 * Custom query wrapper typed correctly as a Convex QueryBuilder.
 */
export const query: QueryBuilder<DataModel, "public"> = ((definition: any) => {
  return rawQuery({
    args: {
      ...definition.args,
      userId: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
      const { userId, ...restArgs } = args;
      const customCtx = {
        ...ctx,
        userId: userId || "guest_user",
      };
      return definition.handler(customCtx, restArgs);
    },
  });
}) as any;

/**
 * Custom mutation wrapper typed correctly as a Convex MutationBuilder.
 */
export const mutation: MutationBuilder<DataModel, "public"> = ((definition: any) => {
  return rawMutation({
    args: {
      ...definition.args,
      userId: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
      const { userId, ...restArgs } = args;
      const customCtx = {
        ...ctx,
        userId: userId || "guest_user",
      };
      return definition.handler(customCtx, restArgs);
    },
  });
}) as any;

export const internalQuery = rawInternalQuery;
export const internalMutation = rawInternalMutation;
