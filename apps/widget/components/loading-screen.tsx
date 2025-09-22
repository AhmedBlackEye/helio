"use client";

import { useAtomValue, useSetAtom } from "jotai";
import { LoaderIcon } from "lucide-react";

import {
  contactSessionAtomFamily,
  errorMsgAtom,
  loadingMsgAtom,
  organizationIdAtom,
  screenAtom,
} from "@/atoms/screen";

import WidgetHeader from "./header";
import { useEffect, useState } from "react";
import { useAction, useMutation } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { Id } from "@workspace/backend/_generated/dataModel";

type InitStep = "org" | "session" | "settings" | "vapi" | "done";

export const WidgetLoadingScreen = ({
  organizationId,
}: {
  organizationId: string | null;
}) => {
  const [step, setStep] = useState<InitStep>("org");
  const [isSessionValid, setIsSessionValid] = useState(false);

  const setOrganizationId = useSetAtom(organizationIdAtom);
  const loadingMsg = useAtomValue(loadingMsgAtom);
  const setLoadingMsg = useSetAtom(loadingMsgAtom);
  const setErrorMsg = useSetAtom(errorMsgAtom);
  const setScreen = useSetAtom(screenAtom);

  const contactSessionId = useAtomValue(
    contactSessionAtomFamily(organizationId || ""),
  );

  const validateOrganization = useAction(api.public.organizations.validate);

  useEffect(() => {
    if (step != "org") return;

    setLoadingMsg("Loading organization ID");

    if (!organizationId) {
      setErrorMsg("Organization ID is required");
      setScreen("error");
      return;
    }

    setLoadingMsg("Verifying organization ID");

    validateOrganization({ organizationId })
      .then((res) => {
        if (res.valid) {
          setOrganizationId(organizationId);
          setStep("session");
        } else {
          setErrorMsg(res.reason || "invalid Config");
          setScreen("error");
        }
      })
      .catch(() => {
        setErrorMsg("Unable to verify organization");
        setScreen("error");
      });
  }, [step, organizationId]);

  const validateContactSession = useMutation(
    api.public.contactSessions.validate,
  );
  useEffect(() => {
    if (step != "session") return;

    setLoadingMsg("Finding contact session ID");

    if (!contactSessionId) {
      setIsSessionValid(false);
      setStep("done");
      return;
    }

    setLoadingMsg("Validating session...");

    validateContactSession({
      contactSessionId: contactSessionId as Id<"contactSessions">,
    })
      .then((res) => {
        setIsSessionValid(res.valid);
        setStep("done");
      })
      .catch(() => {
        setIsSessionValid(false);
        setStep("done");
      });
  }, [step, contactSessionId, validateOrganization]);

  useEffect(() => {
    if (step != "done") return;

    const hasValidSession = contactSessionId && isSessionValid;
    setScreen(hasValidSession ? "selection" : "auth");
  }, [step, contactSessionId, isSessionValid]);

  return (
    <>
      <WidgetHeader>
        <div className="flex flex-col justify-between gap-y-2 px-2 py-6 font-semibold">
          <p className="text-3xl">Hi there 👋</p>
          <p className="text-lg">Let&apos;s get you started</p>
        </div>
      </WidgetHeader>
      <div className="text-muted-foreground flex flex-1 flex-col items-center justify-center gap-y-4 p-4">
        <LoaderIcon className="animate-spin" />
        <p>{loadingMsg || "Loading..."}</p>
      </div>
    </>
  );
};
