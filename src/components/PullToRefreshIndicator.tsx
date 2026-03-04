import { RefreshCw } from "lucide-react";

interface Props {
  pullDistance: number;
  isRefreshing: boolean;
}

const PullToRefreshIndicator = ({ pullDistance, isRefreshing }: Props) => {
  if (pullDistance <= 0 && !isRefreshing) return null;

  return (
    <div
      className="flex items-center justify-center overflow-hidden transition-[height] duration-200"
      style={{ height: pullDistance }}
    >
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <RefreshCw
          className={`w-4 h-4 transition-transform ${isRefreshing ? "animate-spin" : ""}`}
          style={{ transform: isRefreshing ? undefined : `rotate(${Math.min(pullDistance * 3, 360)}deg)` }}
        />
        <span>{isRefreshing ? "Refreshing…" : "Pull to refresh"}</span>
      </div>
    </div>
  );
};

export default PullToRefreshIndicator;
