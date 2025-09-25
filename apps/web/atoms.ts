import { Doc } from "@workspace/backend/_generated/dataModel";
import { atomWithStorage } from "jotai/utils";

const STATUS_FILTER_KEY = "helio-status-filter";

export const statusFilterAtom = atomWithStorage<
  Doc<"conversations">["status"] | "all"
>(STATUS_FILTER_KEY, "all");
