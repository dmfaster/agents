import { useEffect } from "react";
import type { McpAppBridge } from "./bridge.ts";

// Context is a compact snapshot, never a command or an extra data fetch.
export function useWorkspaceContext(
  bridge: McpAppBridge,
  part: string,
  value: Record<string, unknown> | null,
) {
  const serialized = JSON.stringify(value);
  useEffect(() => {
    bridge.setWorkspaceContext(part, JSON.parse(serialized));
  }, [bridge, part, serialized]);
  useEffect(() => () => bridge.setWorkspaceContext(part, null), [bridge, part]);
}
