"use client";

import WidgetFooter from "./widget-footer";
import WidgetHeader from "./widget-header";

const WidgetView = ({ organizationId }: { organizationId: string }) => {
  return (
    <main className="min-w-screen bg-muted flex h-full min-h-screen flex-col overflow-hidden rounded-xl border">
      <WidgetHeader>
        <div className="flex flex-col justify-between gap-y-2 px-2 py-6 font-semibold">
          <p className="text-3xl">Hi there 👋</p>
          <p className="text-lg">How can I help you today?</p>
        </div>
      </WidgetHeader>
      <div className="flex flex-1">Widget View: {organizationId}</div>
      <WidgetFooter />
    </main>
  );
};

export default WidgetView;
