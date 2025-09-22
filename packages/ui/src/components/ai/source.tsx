"use client";

import type { HTMLAttributes } from "react";
import { memo } from "react";
import ReactMarkdown, { type Options } from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@workspace/ui/lib/utils";

export type AIResponseProps = HTMLAttributes<HTMLDivElement> & {
  options?: Options;
  children: Options["children"];
};

const components: Options["components"] = {
  ol: ({ children, className, ...props }) => (
    <ol className={cn("ml-4 list-outside list-decimal", className)} {...props}>
      {children}
    </ol>
  ),
  li: ({ children, className, ...props }) => (
    <li className={cn("py-1", className)} {...props}>
      {children}
    </li>
  ),
  ul: ({ children, className, ...props }) => (
    <ul className={cn("ml-4 list-outside list-decimal", className)} {...props}>
      {children}
    </ul>
  ),
  strong: ({ children, className, ...props }) => (
    <span className={cn("font-semibold", className)} {...props}>
      {children}
    </span>
  ),
  a: ({ children, className, ...props }) => (
    <a
      className={cn("text-primary font-medium underline", className)}
      rel="noreferrer"
      target="_blank"
      {...props}
    >
      {children}
    </a>
  ),
  h1: ({ children, className, ...props }) => (
    <h1
      className={cn("mb-2 mt-6 text-3xl font-semibold", className)}
      {...props}
    >
      {children}
    </h1>
  ),
  h2: ({ children, className, ...props }) => (
    <h2
      className={cn("mb-2 mt-6 text-2xl font-semibold", className)}
      {...props}
    >
      {children}
    </h2>
  ),
  h3: ({ children, className, ...props }) => (
    <h3 className={cn("mb-2 mt-6 text-xl font-semibold", className)} {...props}>
      {children}
    </h3>
  ),
  h4: ({ children, className, ...props }) => (
    <h4 className={cn("mb-2 mt-6 text-lg font-semibold", className)} {...props}>
      {children}
    </h4>
  ),
  h5: ({ children, className, ...props }) => (
    <h5
      className={cn("mb-2 mt-6 text-base font-semibold", className)}
      {...props}
    >
      {children}
    </h5>
  ),
  h6: ({ children, className, ...props }) => (
    <h6 className={cn("mb-2 mt-6 text-sm font-semibold", className)} {...props}>
      {children}
    </h6>
  ),
};

export const AIResponse = memo(
  ({ className, options, children, ...props }: AIResponseProps) => (
    <div
      className={cn(
        "size-full [&>*:first-child]:mt-0 [&>*:last-child]:mb-0",
        className,
      )}
      {...props}
    >
      <ReactMarkdown
        components={components}
        remarkPlugins={[remarkGfm]}
        {...options}
      >
        {children}
      </ReactMarkdown>
    </div>
  ),
  (prevProps, nextProps) => prevProps.children === nextProps.children,
);

AIResponse.displayName = "AIResponse";
