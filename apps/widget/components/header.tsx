import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";
import { HomeIcon, Inbox } from "lucide-react";

const WidgetHeader = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const screen = "selection";
  return (
    <header
      className={cn(
        "bg-sidebar-primary text-sidebar-primary-foreground",
        className,
      )}
    >
      {children}
    </header>
  );
};

export default WidgetHeader;
