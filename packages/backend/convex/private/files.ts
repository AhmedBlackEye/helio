import { ConvexError, v } from "convex/values";
import { action, mutation } from "../_generated/server";
import { getIdentityOrThrow } from "../helpers";
import {
  contentHashFromArrayBuffer,
  guessMimeTypeFromContents,
  guessMimeTypeFromExtension,
  vEntryId,
} from "@convex-dev/rag";
import { extractTextContent } from "../lib/extractTextContent";
import rag from "../system/ai/rag";
import { Id } from "../_generated/dataModel";

export const addFile = action({
  args: {
    filename: v.string(),
    mimeType: v.string(),
    bytes: v.bytes(),
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await getIdentityOrThrow(ctx);

    const orgId = identity.orgId as string;
    if (!orgId) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Organization not found",
      });
    }
    const mimeType =
      args.mimeType ||
      guessMimeTypeFromExtension(args.filename) ||
      guessMimeTypeFromContents(args.bytes);
    const blob = new Blob([args.bytes], { type: mimeType });

    const storageId = await ctx.storage.store(blob);

    const text = await extractTextContent(ctx, {
      filename: args.filename,
      bytes: args.bytes,
      mimeType,
      storageId,
    });

    const { entryId, created } = await rag.add(ctx, {
      namespace: orgId,
      text,
      key: args.filename,
      title: args.filename,
      metadata: {
        storageId,
        uploadedBy: orgId, //  for deletion
        filename: args.filename,
        category: args.category ?? null,
      },
      contentHash: await contentHashFromArrayBuffer(args.bytes),
    });

    if (!created) {
      console.debug("entry already exists, skipping upload metadata");
      await ctx.storage.delete(storageId);
    }

    return {
      url: await ctx.storage.getUrl(storageId),
      entryId,
    };
  },
});

export const deleteFile = mutation({
  args: {
    entryId: vEntryId,
  },
  handler: async (ctx, args) => {
    const identity = await getIdentityOrThrow(ctx);

    const orgId = identity.orgId as string;
    if (!orgId) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Organization not found",
      });
    }

    const namespace = await rag.getNamespace(ctx, {
      namespace: orgId,
    });

    if (!namespace) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Invalid namespace",
      });
    }

    const entry = await rag.getEntry(ctx, {
      entryId: args.entryId,
    });

    if (!entry) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Entry not found",
      });
    }

    if (entry.metadata?.uploadedBy !== orgId) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Invalid Organization",
      });
    }

    if (entry.metadata?.storageId) {
      await ctx.storage.delete(entry.metadata.storageId as Id<"_storage">);
    }

    await rag.deleteAsync(ctx, {
      entryId: args.entryId,
    });
  },
});
