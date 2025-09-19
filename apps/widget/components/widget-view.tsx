"use client";

import { useAtomValue } from "jotai";
import { JSX } from "react";

import { screenAtom } from "@/atoms/screen";
import { WidgetScreen } from "@/types";

import WidgetAuthScreen from "./auth-screen";
import WidgetFooter from "./footer";
import WidgetHeader from "./header";

const screenComponents: Record<WidgetScreen, JSX.Element> = {
  error: <p>TODO: Error</p>,
  loading: <p>TODO: Loading</p>,
  selection: <p>TODO: Selection</p>,
  voice: <p>TODO: Voice</p>,
  auth: <WidgetAuthScreen />,
  inbox: <p>TODO: Inbox</p>,
  chat: <p>TODO: Chat</p>,
  contact: <p>TODO: Contact</p>,
};

const WidgetView = ({ organizationId }: { organizationId: string }) => {
  const screen = useAtomValue(screenAtom);

  return (
    <main className="min-w-screen bg-muted flex h-full min-h-screen flex-col overflow-hidden rounded-xl border">
      {screenComponents[screen]}
      {/* <WidgetAuthScreen /> */}
      {/* <WidgetFooter /> */}
    </main>
  );
};

export default WidgetView;
