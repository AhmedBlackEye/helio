"use client";

import { Button } from "@workspace/ui/components/button";
import WidgetHeader from "./header";
import { ArrowLeftIcon, MenuIcon } from "lucide-react";
import { useAtomValue, useSetAtom } from "jotai";
import {
  contactSessionAtomFamily,
  conversationIdAtom,
  organizationIdAtom,
  screenAtom,
} from "@/atoms/screen";
import { useAction, useQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { toUIMessages, useThreadMessages } from "@convex-dev/agent/react";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AIConversation,
  AIConversationContent,
} from "@workspace/ui/components/ai/conversation";
import {
  AIMessage,
  AIMessageContent,
} from "@workspace/ui/components/ai/message";
import { AIResponse } from "@workspace/ui/components/ai/response";
import { Form, FormField } from "@workspace/ui/components/form";
import {
  AIInput,
  AIInputSubmit,
  AIInputTextarea,
  AIInputToolbar,
  AIInputTools,
} from "@workspace/ui/components/ai/input";
import { useInfiniteScroll } from "@workspace/ui/hooks/use-infinite-scroll";
import { InfiniteScrollTrigger } from "@workspace/ui/components/ai/infinite-scroll-trigger";
import { DicebearAvatar } from "@workspace/ui/components/dicebear-avatar";

const formSchema = z.object({
  message: z.string().min(1, "Message is required"),
});
type FormSchema = z.infer<typeof formSchema>;

export const WidgetChatScreen = () => {
  const setScreen = useSetAtom(screenAtom);
  const setConversationId = useSetAtom(conversationIdAtom);
  const conversationId = useAtomValue(conversationIdAtom);
  const organizationId = useAtomValue(organizationIdAtom);
  const contactSessionId = useAtomValue(
    contactSessionAtomFamily(organizationId || ""),
  );

  const conversation = useQuery(
    api.public.conversations.getOne,
    conversationId && contactSessionId
      ? { conversationId, contactSessionId }
      : "skip",
  );

  const messages = useThreadMessages(
    api.public.messages.getMany,
    conversation?.threadId && contactSessionId
      ? { threadId: conversation.threadId, contactSessionId }
      : "skip",
    { initialNumItems: 10 },
  );

  const { topEelementRef, handleLoadMore, canLoadMore, isLoadingMore } =
    useInfiniteScroll({
      status: messages.status,
      loadMore: messages.loadMore,
      loadSize: 10,
    });

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });

  const createMsg = useAction(api.public.messages.create);
  const handleOnSubmit = async (values: FormSchema) => {
    if (!conversation || !contactSessionId) return;
    form.reset();
    await createMsg({
      threadId: conversation.threadId,
      prompt: values.message,
      contactSessionId: contactSessionId,
    });
  };

  const handleOnBack = () => {
    setConversationId(null);
    setScreen("selection");
  };
  return (
    <>
      <WidgetHeader className="flex items-center justify-between">
        <Button size="icon" variant="transparent" onClick={handleOnBack}>
          <ArrowLeftIcon />
        </Button>
        <p>Chat</p>
        <Button size="icon" variant="transparent">
          <MenuIcon />
        </Button>
      </WidgetHeader>
      <AIConversation>
        <AIConversationContent>
          <InfiniteScrollTrigger
            canLoadMore={canLoadMore}
            isLoadingMore={isLoadingMore}
            onLoadMore={handleLoadMore}
            ref={topEelementRef}
          />
          {toUIMessages(messages.results ?? [])?.map((msg) => (
            <AIMessage
              from={msg.role === "user" ? "user" : "assistant"}
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
                {/* TODO: Add Avatar component */}
              </AIMessageContent>
            </AIMessage>
          ))}
        </AIConversationContent>
      </AIConversation>
      {/* TODO: Add suggestions */}

      <Form {...form}>
        <AIInput onSubmit={form.handleSubmit(handleOnSubmit)} className="">
          <FormField
            control={form.control}
            disabled={conversation?.status === "resolved"}
            name="message"
            render={({ field }) => (
              <AIInputTextarea
                disabled={conversation?.status === "resolved"}
                onChange={field.onChange}
                value={field.value}
                placeholder={
                  conversation?.status === "resolved"
                    ? "This conversation has been resolved"
                    : "Type your message..."
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
            <AIInputTools />
            <AIInputSubmit
              disabled={
                conversation?.status === "resolved" || !form.formState.isValid
              }
              status="ready"
              type="submit"
            />
          </AIInputToolbar>
        </AIInput>
      </Form>
    </>
  );
};
