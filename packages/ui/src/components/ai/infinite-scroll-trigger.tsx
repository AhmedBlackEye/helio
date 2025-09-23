import { cn } from "@workspace/ui/lib/utils";
import { Button } from "@workspace/ui/components/button";

interface InfiniteScrollTriggerProps {
  canLoadMore: boolean;
  isLoadingMore: boolean;
  onLoadMore: () => void;
  loadMoreText?: string;
  noMoreText?: string;
  className?: string;
  ref?: React.Ref<HTMLDivElement>;
}

export const InfiniteScrollTrigger = ({
  canLoadMore,
  isLoadingMore,
  onLoadMore,
  loadMoreText = "Load more",
  noMoreText = "No more items",
  className,
  ref,
}: InfiniteScrollTriggerProps) => {
  const text = isLoadingMore
    ? "Loading..."
    : canLoadMore
      ? loadMoreText
      : noMoreText;

  return (
    <div className={cn("flex w-full justify-center py-2", className)} ref={ref}>
      <Button
        disabled={isLoadingMore || !canLoadMore}
        onClick={onLoadMore}
        size="sm"
        variant="ghost"
      >
        {text}
      </Button>
    </div>
  );
};
