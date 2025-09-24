"use client";

import { useAtomValue } from "jotai";
import { JSX } from "react";

import { screenAtom } from "@/atoms/screen";
import { WidgetScreen } from "@/types";

import WidgetAuthScreen from "./auth-screen";
import { WidgetErrorScreen } from "./error-screen";
import { WidgetLoadingScreen } from "./loading-screen";
import { WidgetSelectionScreen } from "./selection-screen";
import { WidgetChatScreen } from "./chat-screen";
import { WidgetInboxScreen } from "./inbox-screen";

const WidgetView = ({ organizationId }: { organizationId: string }) => {
  const screen = useAtomValue(screenAtom);
  const screenComponents: Record<WidgetScreen, JSX.Element> = {
    error: <WidgetErrorScreen />,
    loading: <WidgetLoadingScreen organizationId={organizationId} />,
    selection: <WidgetSelectionScreen />,
    voice: <p>TODO: Voice</p>,
    auth: <WidgetAuthScreen />,
    inbox: <WidgetInboxScreen />,
    chat: <WidgetChatScreen />,
    contact: <p>TODO: Contact</p>,
  };

  return (
    <main className="min-w-screen bg-muted flex h-full min-h-screen flex-col overflow-hidden rounded-xl border">
      {screenComponents[screen]}
    </main>
  );
};

export default WidgetView;
