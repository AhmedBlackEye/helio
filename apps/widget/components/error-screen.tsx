"use client";

import { useAtomValue } from "jotai";
import { AlertTriangleIcon } from "lucide-react";

import { errorMsgAtom } from "@/atoms/screen";

import WidgetHeader from "./header";

export const WidgetErrorScreen = () => {
  const errorMessage = useAtomValue(errorMsgAtom);

  return (
    <>
      <WidgetHeader>
        <div className="flex flex-col justify-between gap-y-2 px-2 py-6 font-semibold">
          <p className="text-3xl">Hi there 👋</p>
          <p className="text-lg">Let&apos;s get you started</p>
        </div>
      </WidgetHeader>
      <div className="text-muted-foreground flex flex-1 flex-col items-center justify-center gap-y-4 p-4">
        <AlertTriangleIcon />
        <p className="text-sm">
          {errorMessage || "Oops, something went wrong!"}
        </p>
      </div>
    </>
  );
};
