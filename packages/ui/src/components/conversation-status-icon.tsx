import { ArrowRightIcon, ArrowUpIcon, CheckIcon } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";

interface ConversationStatusIconProps {
  status: "unresolved" | "escalated" | "resolved";
}

const statusConfig = {
  resolved: {
    icon: CheckIcon,
    bgColor: "bg-green-500",
  },
  unresolved: {
    icon: ArrowRightIcon,
    bgColor: "bg-red-400",
  },
  escalated: {
    icon: ArrowUpIcon,
    bgColor: "bg-yellow-500",
  },
} as const;

export const ConversationStatusIcon = ({
  status,
}: ConversationStatusIconProps) => {
  const config = statusConfig[status];
  const Icon = config.icon;
  return (
    <div
      className={cn(
        "flex size-5 items-center justify-center rounded-full p-2",
        config.bgColor,
      )}
    >
      <Icon className="stroke-3 size-3 text-white" />
    </div>
  );
};
