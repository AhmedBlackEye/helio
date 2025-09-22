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
import { useQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";

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
      <div className="lex flex-1 flex-col gap-y-4 p-4">
        <p className="text-sm">{JSON.stringify(conversation)}</p>
      </div>
    </>
  );
};
