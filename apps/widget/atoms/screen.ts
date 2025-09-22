import { atom } from "jotai";
import { WidgetScreen } from "@/types";
import { atomFamily, atomWithStorage } from "jotai/utils";
import { Id } from "@workspace/backend/_generated/dataModel";

const CONSTACT_SESSION_KEY = "helio_contact_session";

export const organizationIdAtom = atom<string | null>(null);
export const screenAtom = atom<WidgetScreen>("loading");
export const contactSessionAtomFamily = atomFamily((organizationId) => {
  const key = `${CONSTACT_SESSION_KEY}_${organizationId}`;
  return atomWithStorage<Id<"contactSessions"> | null>(key, null);
});

export const errorMsgAtom = atom<string | null>(null);
export const loadingMsgAtom = atom<string | null>(null);
export const conversationIdAtom = atom<Id<"conversations"> | null>();
