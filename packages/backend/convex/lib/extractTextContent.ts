import { google } from "@ai-sdk/google";
import { Id } from "../_generated/dataModel";
import { StorageActionWriter } from "convex/server";
import { assert } from "convex-helpers";
import { generateText } from "ai";

const AI_MODELS = {
  image: google.chat("gemini-2.5-pro"),
  pdf: google.chat("gemini-2.5-pro"),
  html: google.chat("gemini-2.5-pro"),
};

const SUPPORTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
] as const;

const SYSTEM_PROMPTS = {
  image:
    "You can turn images into text. If it is a photo of a document, transcribe it. If is not a document then describe it",
  pdf: "Transform PDF files into text.",
  html: "Transform content files into text.",
};

export type ExtractTextContentArgs = {
  storageId: Id<"_storage">;
  filename: string;
  bytes?: ArrayBuffer;
  mimeType: string;
};

export const extractTextContent = async (
  ctx: { storage: StorageActionWriter },
  args: ExtractTextContentArgs,
) => {
  const url = await ctx.storage.getUrl(args.storageId);
  assert(url, "Failed to get storage URL");

  if (SUPPORTED_IMAGE_TYPES.some((type) => type == args.mimeType)) {
    return extractImageText(url);
  }

  if (args.mimeType.toLowerCase().includes("pdf")) {
    return extractPdfText(args, url);
  }

  if (args.mimeType.toLowerCase().includes("text")) {
    return extractTextFileContent(ctx, args, url);
  }

  throw new Error(`Unsupported MIME type: ${args.mimeType}`);
};

const extractImageText = async (url: string) => {
  const result = await generateText({
    model: AI_MODELS.image,
    system: SYSTEM_PROMPTS.image,
    messages: [
      {
        role: "user",
        content: [{ type: "image", image: new URL(url) }],
      },
    ],
  });
  return result.text;
};

const extractPdfText = async (args: ExtractTextContentArgs, url: string) => {
  const result = await generateText({
    model: AI_MODELS.pdf,
    system: SYSTEM_PROMPTS.pdf,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "file",
            data: new URL(url),
            mediaType: args.mimeType,
            filename: args.filename,
          },
          {
            type: "text",
            text: "Extract the text from the PDF only without any additional explaination or output",
          },
        ],
      },
    ],
  });
  return result.text;
};

const extractTextFileContent = async (
  ctx: { storage: StorageActionWriter },
  args: ExtractTextContentArgs,
  url: string,
) => {
  const blob = await ctx.storage.get(args.storageId);
  const arrayBuf = args.bytes || (await blob?.arrayBuffer());

  if (!arrayBuf) {
    throw new Error("Failed to get file content");
  }

  const text = new TextDecoder().decode(arrayBuf);

  if (args.mimeType.toLowerCase() !== "text/plain") {
    const result = await generateText({
      model: AI_MODELS.html,
      system: SYSTEM_PROMPTS.html,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text,
            },
            {
              type: "text",
              text: "Extract the text into markdown format only without any additional explaination or output",
            },
          ],
        },
      ],
    });
    return result.text;
  }
  return text;
};
