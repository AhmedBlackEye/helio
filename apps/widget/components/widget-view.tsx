"use client";

import { useAtomValue } from "jotai";
import { JSX } from "react";

import { screenAtom } from "@/atoms/screen";
import { WidgetScreen } from "@/types";

import WidgetAuthScreen from "./auth-screen";
import WidgetFooter from "./footer";
import WidgetHeader from "./header";
import { WidgetErrorScreen } from "./error-screen";
import { WidgetLoadingScreen } from "./loading-screen";

const WidgetView = ({ organizationId }: { organizationId: string }) => {
  const screen = useAtomValue(screenAtom);
  const screenComponents: Record<WidgetScreen, JSX.Element> = {
    error: <WidgetErrorScreen />,
    loading: <WidgetLoadingScreen organizationId={organizationId} />,
    selection: <p>TODO: Selection</p>,
    voice: <p>TODO: Voice</p>,
    auth: <WidgetAuthScreen />,
    inbox: <p>TODO: Inbox</p>,
    chat: <p>TODO: Chat</p>,
    contact: <p>TODO: Contact</p>,
  };

  return (
    <main className="min-w-screen bg-muted flex h-full min-h-screen flex-col overflow-hidden rounded-xl border">
      {screenComponents[screen]}
      {/* <WidgetAuthScreen /> */}
      {/* <WidgetFooter /> */}
    </main>
  );
};

export default WidgetView;
