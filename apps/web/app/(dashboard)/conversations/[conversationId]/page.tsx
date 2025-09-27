"use client";

import { api } from "@workspace/backend/_generated/api";
import { Doc, Id } from "@workspace/backend/_generated/dataModel";
import { Button } from "@workspace/ui/components/button";
import { useAction, useMutation, useQuery } from "convex/react";
import { MoreHorizontalIcon, Wand2Icon } from "lucide-react";
import { use, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AIConversation,
  AIConversationContent,
  AIConversationScrollButton,
} from "@workspace/ui/components/ai/conversation";
import {
  AIMessage,
  AIMessageContent,
} from "@workspace/ui/components/ai/message";
import { AIResponse } from "@workspace/ui/components/ai/response";
import { Form, FormField } from "@workspace/ui/components/form";
import {
  AIInput,
  AIInputButton,
  AIInputSubmit,
  AIInputTextarea,
  AIInputToolbar,
  AIInputTools,
} from "@workspace/ui/components/ai/input";
import { useInfiniteScroll } from "@workspace/ui/hooks/use-infinite-scroll";
import { InfiniteScrollTrigger } from "@workspace/ui/components/ai/infinite-scroll-trigger";
import { DicebearAvatar } from "@workspace/ui/components/dicebear-avatar";
import { toUIMessages, useThreadMessages } from "@convex-dev/agent/react";
import { ConversationStatusButton } from "@/components/conversations/status-button";
import { cn } from "@workspace/ui/lib/utils";
import { Skeleton } from "@workspace/ui/components/skeleton";
const formSchema = z.object({
  message: z.string().min(1, "Message is required"),
});

type FormSchema = z.infer<typeof formSchema>;

const ConversationPage = ({
  params,
}: {
  params: Promise<{ conversationId: Id<"conversations"> }>;
}) => {
  const { conversationId } = use(params);

  const conversation = useQuery(api.private.conversations.getOne, {
    conversationId,
  });

  const messages = useThreadMessages(
    api.private.messages.getMany,
    conversation?.threadId ? { threadId: conversation.threadId } : "skip",
    { initialNumItems: 10 },
  );

  const createMessage = useMutation(api.private.messages.create);

  const updateConversationStatus = useMutation(
    api.private.conversations.updateStatus,
  );

  const enhanceResponse = useAction(api.private.messages.enhanceResponse);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });

  const { topEelementRef, handleLoadMore, canLoadMore, isLoadingMore } =
    useInfiniteScroll({
      status: messages.status,
      loadMore: messages.loadMore,
      loadSize: 10,
    });

  const handleOnSubmit = async (values: FormSchema) => {
    try {
      await createMessage({
        conversationId,
        prompt: values.message,
      });

      form.reset();
    } catch (err) {
      console.log(err);
    }
  };

  const handleToggleStatus = async () => {
    if (!conversation) return;

    let newStatus: Doc<"conversations">["status"];

    if (conversation.status === "unresolved") {
      newStatus = "escalated";
    } else if (conversation.status === "escalated") {
      newStatus = "resolved";
    } else {
      newStatus = "unresolved";
    }

    try {
      await updateConversationStatus({
        conversationId,
        status: newStatus,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const [isEnhancing, setIsEnhancing] = useState(false);
  const handleEnhanceResponse = async () => {
    const currentValue = form.getValues("message");

    try {
      setIsEnhancing(true);
      const response = await enhanceResponse({ prompt: currentValue });
      // console.log(response);
      form.setValue("message", response);
    } catch (err) {
      console.log(err);
    } finally {
      setIsEnhancing(false);
    }
  };

  if (conversation === undefined || messages.status === "LoadingFirstPage") {
    return <LoadingSkeleton />;
  }

  return (
    <div className="bg-muted flex h-full flex-col">
      <header className="bg-background flex items-center justify-between border-b p-2.5">
        <Button size="sm" variant="ghost">
          <MoreHorizontalIcon />
        </Button>
        {!!conversation && (
          <ConversationStatusButton
            status={conversation.status}
            onClick={handleToggleStatus}
          />
        )}
      </header>
      <AIConversation className="max-h-[calc(100vh-10px)]">
        <AIConversationContent>
          <InfiniteScrollTrigger
            canLoadMore={canLoadMore}
            isLoadingMore={isLoadingMore}
            onLoadMore={handleLoadMore}
            ref={topEelementRef}
          />
          {toUIMessages(messages.results ?? [])?.map((msg) => (
            <AIMessage
              from={msg.role === "user" ? "assistant" : "user"}
              key={msg.id}
            >
              <AIMessageContent>
                {msg.parts.map((part, i) => {
                  switch (part.type) {
                    case "text":
                      return (
                        <AIResponse key={`${msg.id}-${i}`}>
                          {part.text}
                        </AIResponse>
                      );
                    default:
                      return null;
                  }
                })}
              </AIMessageContent>
              {msg.role === "assistant" && (
                <DicebearAvatar
                  seed={conversation?.contactSessionId ?? "user"}
                  size={32}
                />
              )}
            </AIMessage>
          ))}
        </AIConversationContent>
        <AIConversationScrollButton />
      </AIConversation>

      <div className="p-2">
        <Form {...form}>
          <AIInput onSubmit={form.handleSubmit(handleOnSubmit)}>
            <FormField
              control={form.control}
              disabled={conversation?.status === "resolved"}
              name="message"
              render={({ field }) => (
                <AIInputTextarea
                  disabled={
                    conversation?.status === "resolved" ||
                    form.formState.isSubmitting
                  }
                  onChange={field.onChange}
                  value={field.value}
                  placeholder={
                    conversation?.status === "resolved"
                      ? "This conversation has been resolved"
                      : "Type your message as an operator..."
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      form.handleSubmit(handleOnSubmit)();
                    }
                  }}
                />
              )}
            />
            <AIInputToolbar>
              <AIInputTools>
                <AIInputButton
                  onClick={handleEnhanceResponse}
                  disabled={
                    conversation?.status === "resolved" ||
                    isEnhancing ||
                    !form.formState.isValid
                  }
                >
                  <Wand2Icon />
                  {isEnhancing ? "Enhancing..." : "Enhance"}
                </AIInputButton>
              </AIInputTools>
              <AIInputSubmit
                disabled={
                  conversation?.status === "resolved" ||
                  !form.formState.isValid ||
                  isEnhancing ||
                  form.formState.isSubmitting
                }
                status="ready"
                type="submit"
              />
            </AIInputToolbar>
          </AIInput>
        </Form>
      </div>
    </div>
  );
};

export default ConversationPage;

const LoadingSkeleton = () => {
  return (
    <div className="bg-muted flex h-full flex-col">
      <header className="bg-background flex items-center justify-between border-b p-2.5">
        <Button disabled size="sm" variant="ghost">
          <MoreHorizontalIcon />
        </Button>
      </header>
      <AIConversation className="max-h-[calc(100vh-10px)]">
        <AIConversationContent>
          {Array.from({ length: 8 }).map((_, index) => {
            const isUser = index % 2 === 0;
            const widths = ["w-48", "w-60", "w-70"];
            const width = widths[index % widths.length];

            return (
              <div
                key={index}
                className={cn(
                  "group flex w-full items-end gap-2 py-2 [&>div]:max-w-[80%]",
                  isUser ? "is-user" : "is-assistant flex-row-reverse",
                )}
              >
                <Skeleton
                  className={cn("h-9 rounded-lg bg-neutral-200", width)}
                />
                <Skeleton className="size-8 rounded-full bg-neutral-200" />
              </div>
            );
          })}
        </AIConversationContent>
        <AIConversationScrollButton />
      </AIConversation>
      <div className="p-2">
        <AIInput>
          <AIInputTextarea
            disabled
            placeholder="Type your response as an operator..."
          />
          <AIInputToolbar>
            <AIInputTools />
            <AIInputSubmit disabled status="ready" />
          </AIInputToolbar>
        </AIInput>
      </div>
    </div>
  );
};
