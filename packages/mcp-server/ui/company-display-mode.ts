import type { McpAppBridge } from "./bridge.ts";

// A company profile benefits from the host's larger surface. Expansion is
// optional and must never delay the row summary or prevent closing the drawer.
export async function expandCompanyDetails(bridge: McpAppBridge) {
  try {
    if (bridge.standard) {
      if (
        bridge.context.displayMode !== "inline" ||
        !bridge.context.availableDisplayModes?.includes("fullscreen")
      )
        return;
      const result = (await bridge.request("ui/request-display-mode", { mode: "fullscreen" })) as {
        mode?: string;
      };
      if (result?.mode) bridge.applyHostContext({ displayMode: result.mode });
    } else {
      const host = window.openai as typeof window.openai & {
        displayMode?: string;
        requestDisplayMode?: (input: { mode: "fullscreen" }) => Promise<unknown>;
      };
      if (host?.displayMode === "inline" && host.requestDisplayMode)
        await host.requestDisplayMode({ mode: "fullscreen" });
    }
  } catch {
    // Hosts may decline expansion; the accessible in-panel drawer stays usable.
  }
}
