import { cn } from "@workspace/ui/lib/utils";

const WidgetHeader = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <header
      className={cn(
        "bg-sidebar-primary text-sidclearebar-primary-foreground",
        className,
      )}
    >
      {children}
    </header>
  );
};

export default WidgetHeader;
