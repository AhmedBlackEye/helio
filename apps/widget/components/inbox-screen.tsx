"use client";

import { useAtomValue, useSetAtom } from "jotai";
import { ArrowLeftIcon } from "lucide-react";

import {
  contactSessionAtomFamily,
  conversationIdAtom,
  organizationIdAtom,
  screenAtom,
} from "@/atoms/screen";

import WidgetHeader from "./header";
import WidgetFooter from "./footer";
import { Button } from "@workspace/ui/components/button";
import { ConversationStatusIcon } from "@workspace/ui/components/conversation-status-icon";
import { usePaginatedQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";

import { formatDistanceToNow } from "date-fns";
import { useInfiniteScroll } from "@workspace/ui/hooks/use-infinite-scroll";
import { InfiniteScrollTrigger } from "@workspace/ui/components/ai/infinite-scroll-trigger";

export const WidgetInboxScreen = () => {
  const setScreen = useSetAtom(screenAtom);
  const organizationId = useAtomValue(organizationIdAtom);
  const setConversationId = useSetAtom(conversationIdAtom);
  const contactSessionId = useAtomValue(
    contactSessionAtomFamily(organizationId || ""),
  );
  const conversations = usePaginatedQuery(
    api.public.conversations.getMany,
    contactSessionId ? { contactSessionId } : "skip",
    { initialNumItems: 10 },
  );

  const { topEelementRef, handleLoadMore, canLoadMore, isLoadingMore } =
    useInfiniteScroll({
      status: conversations.status,
      loadMore: conversations.loadMore,
      loadSize: 10,
    });
  return (
    <>
      <WidgetHeader>
        <div className="flex flex-col justify-between gap-y-2 px-2 py-6 font-semibold">
          <Button
            size="icon"
            variant="transparent"
            onClick={() => setScreen("selection")}
          >
            <ArrowLeftIcon />
          </Button>
          <p>Inbox</p>
        </div>
      </WidgetHeader>
      <div className="text-muted-foreground flex flex-1 flex-col gap-y-2 overflow-y-auto p-4">
        {conversations?.results.length > 0 &&
          conversations.results.map((conversation) => (
            <Button
              className="h-20 w-full justify-between"
              variant="outline"
              key={conversation._id}
              onClick={() => {
                setConversationId(conversation._id);
                setScreen("chat");
              }}
            >
              <div className="flex w-full flex-col gap-4 overflow-hidden text-start">
                <div className="flex w-full items-center justify-between gap-x-2">
                  <p className="text-muted-foreground text-xs">Chat</p>
                  <p className="text-muted-foreground text-xs">
                    {formatDistanceToNow(new Date(conversation._creationTime))}
                  </p>
                </div>
                <div className="flex w-full items-center justify-between gap-x-2">
                  <p className="truncate text-sm">
                    {conversation.lastMsg?.text}
                  </p>
                  <ConversationStatusIcon status={conversation.status} />
                </div>
              </div>
            </Button>
          ))}
        <InfiniteScrollTrigger
          canLoadMore={canLoadMore}
          isLoadingMore={isLoadingMore}
          onLoadMore={handleLoadMore}
          ref={topEelementRef}
        />
      </div>
      <WidgetFooter />
    </>
  );
};
