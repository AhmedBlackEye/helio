"use client";

import WidgetAuthScreen from "./auth-screen";
import WidgetFooter from "./footer";
import WidgetHeader from "./header";

const WidgetView = ({ organizationId }: { organizationId: string }) => {
  return (
    <main className="min-w-screen bg-muted flex h-full min-h-screen flex-col overflow-hidden rounded-xl border">
      <WidgetAuthScreen />
      {/* <WidgetFooter /> */}
    </main>
  );
};

export default WidgetView;
