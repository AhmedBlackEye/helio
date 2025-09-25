"use client";

import { statusFilterAtom } from "@/atoms";
import { getCountryFlagUrl, getCountryFromTimezone } from "@/lib/country-utils";
import { api } from "@workspace/backend/_generated/api";
import { InfiniteScrollTrigger } from "@workspace/ui/components/ai/infinite-scroll-trigger";
import { ConversationStatusIcon } from "@workspace/ui/components/conversation-status-icon";
import { DicebearAvatar } from "@workspace/ui/components/dicebear-avatar";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { useInfiniteScroll } from "@workspace/ui/hooks/use-infinite-scroll";
import { cn } from "@workspace/ui/lib/utils";
import { usePaginatedQuery } from "convex/react";
import { formatDistanceToNow } from "date-fns";
import { useAtomValue, useSetAtom } from "jotai";
import {
  ArrowRightIcon,
  ArrowUpIcon,
  CheckIcon,
  CornerUpLeftIcon,
  ListIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const selectItems = [
  {
    icon: ListIcon,
    value: "All",
  },
  {
    icon: ArrowRightIcon,
    value: "Unresolved",
  },
  {
    icon: ArrowUpIcon,
    value: "Escalated",
  },
  {
    icon: CheckIcon,
    value: "Resolved",
  },
];

export const ConversationsPanel = () => {
  const pathname = usePathname();
  const statusFilter = useAtomValue(statusFilterAtom);
  const setStatusFilter = useSetAtom(statusFilterAtom);
  const conversations = usePaginatedQuery(
    api.private.conversations.getMany,
    { status: statusFilter === "all" ? undefined : statusFilter },
    {
      initialNumItems: 10,
    },
  );

  const {
    topEelementRef,
    handleLoadMore,
    canLoadMore,
    isLoadingMore,
    isLoadingFirstPage,
  } = useInfiniteScroll({
    status: conversations.status,
    loadMore: conversations.loadMore,
    loadSize: 10,
  });
  return (
    <div className="bg-background text-sidebar-foreground flex h-full w-full flex-col">
      <div className="flex flex-col gap-3.5 border-b p-2">
        <Select
          defaultValue="all"
          onValueChange={(value) => {
            setStatusFilter(
              value as "unresolved" | "escalated" | "resolved" | "all",
            );
          }}
          value={statusFilter}
        >
          <SelectTrigger className="hover:bg-accent hover:text-accent-foreground h-8 border-none px-1.5 shadow-none ring-0 focus-visible:ring-0">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            {selectItems.map((item) => (
              <SelectItem value={item.value.toLowerCase()} key={item.value}>
                <div className="flex items-center gap-2">
                  <item.icon className="size-4" />
                  <span>{item.value}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {isLoadingFirstPage ? (
        <SkeletonConversations />
      ) : (
        <ScrollArea className="max-h-[calc(100vh-53px)]">
          <div className="flex w-full flex-1 flex-col text-sm">
            {conversations.results.map((conversation) => (
              <ConversationLink
                conversation={conversation}
                pathname={pathname}
              />
            ))}
            <InfiniteScrollTrigger
              canLoadMore={canLoadMore}
              isLoadingMore={isLoadingMore}
              onLoadMore={handleLoadMore}
              ref={topEelementRef}
            />
          </div>
        </ScrollArea>
      )}
    </div>
  );
};

type ConversationsQuery = ReturnType<
  typeof usePaginatedQuery<typeof api.private.conversations.getMany>
>;

interface ConversationLinkProps {
  conversation: ConversationsQuery["results"][number];
  pathname: string;
}

const ConversationLink = ({
  conversation,
  pathname,
}: ConversationLinkProps) => {
  const isLastMsgFromOperator = conversation.lastMsg?.message?.role !== "user";
  const country = getCountryFromTimezone(
    conversation.contactSession.metadata?.timezone,
  );

  const countryFlagUrl = country?.code
    ? getCountryFlagUrl(country.code)
    : undefined;
  const url = `/conversations/${conversation._id}`;

  return (
    <Link
      key={conversation._id}
      href={url}
      className={cn(
        "hover:bg-accent hover:text-accent-foreground relative flex cursor-pointer items-start gap-3 border-b p-4 text-sm leading-tight",
        pathname === url && "bg-accent text-accent-foreground",
      )}
    >
      <div
        className={cn(
          "absolute left-0 top-1/2 h-[64%] w-1 -translate-y-1/2 rounded-r-full bg-neutral-300 opacity-0 transition-opacity",
          pathname === url && "opacity-100",
        )}
      />
      <DicebearAvatar
        seed={conversation.contactSession._id}
        badgeImageUrl={countryFlagUrl}
        size={40}
        className="shrink-40"
      />
      <div className="flex-1">
        <div className="flex w-full items-center gap-2">
          <span className="truncate font-bold">
            {conversation.contactSession.name}
          </span>
          <span className="text-muted-foreground ml-auto shrink-0 text-xs">
            {formatDistanceToNow(conversation.contactSession._creationTime)}
          </span>
        </div>
        <div className="mt-1 flex items-center justify-between gap-1">
          {isLastMsgFromOperator && (
            <CornerUpLeftIcon className="text-muted-foreground size-3 shrink-0" />
          )}
          <span
            className={cn(
              "text-muted-foreground line-clamp-1 text-sm",
              !isLastMsgFromOperator && "font-bold text-black",
            )}
          >
            {conversation.lastMsg?.text}
          </span>
        </div>
        <ConversationStatusIcon status={conversation.status} />
      </div>
    </Link>
  );
};

const SkeletonConversations = () => {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-auto">
      <div className="relative flex w-full min-w-0 flex-col p-2">
        <div className="w-full space-y-2">
          {Array.from({ length: 8 }).map((_, index) => (
            <div className="flex items-start gap-3 rounded-lg p-4" key={index}>
              <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
              <div className="flex w-full items-center gap-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="ml-auto h-3 w-12 shrink-0" />
              </div>
              <div className="mt-2">
                <Skeleton className="h-3 w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
