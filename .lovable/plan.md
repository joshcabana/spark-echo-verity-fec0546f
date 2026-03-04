

## Pull-to-Refresh for Lobby and Spark History

### Testing Note
The skeleton loading states, data export, account deletion, and typing indicators all require an authenticated session to verify. You'll need to log in via the preview first, then I can run browser tests. The code for all of these is in place.

### Pull-to-Refresh Plan

Create a reusable `usePullToRefresh` hook and integrate it into Lobby and Spark History pages.

**1. Create `src/hooks/usePullToRefresh.ts`**
- Custom hook that listens for touch events (`touchstart`, `touchmove`, `touchend`) on a ref element
- Detects downward swipe when scrolled to top (scrollTop === 0)
- Returns `{ pullDistance, isRefreshing, containerRef }` for UI binding
- Triggers an `onRefresh` callback (returns Promise) when threshold is exceeded (e.g. 80px pull)
- Sets `isRefreshing = true` while the refresh promise resolves

**2. Create `src/components/PullToRefreshIndicator.tsx`**
- Small visual indicator: rotating `RefreshCw` icon + "Pull to refresh" / "Refreshing..." text
- Positioned at top of scroll container, height driven by `pullDistance`
- Animate spinner when `isRefreshing` is true

**3. Edit `src/pages/Lobby.tsx`**
- Wrap main content with the pull-to-refresh container ref
- On refresh: invalidate `["drops"]`, `["my-rsvps"]`, `["rsvp-counts"]` queries
- Show `PullToRefreshIndicator` above the drops list

**4. Edit `src/pages/SparkHistory.tsx`**
- Wrap main content with the pull-to-refresh container ref
- On refresh: invalidate `["sparks"]` query
- Show `PullToRefreshIndicator` above the sparks/vault content

### Files
- **Create**: `src/hooks/usePullToRefresh.ts`, `src/components/PullToRefreshIndicator.tsx`
- **Edit**: `src/pages/Lobby.tsx`, `src/pages/SparkHistory.tsx`

