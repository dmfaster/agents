export const MCP_APP_PROTOCOL_VERSION = "2026-01-26";

type JsonObject = Record<string, unknown>;
type PendingRequest = {
  resolve(value: unknown): void;
  reject(error: Error): void;
  timer: number;
};

export type HostContext = {
  theme?: "light" | "dark";
  displayMode?: string;
  platform?: "web" | "desktop" | "mobile";
  safeAreaInsets?: { top: number; right: number; bottom: number; left: number };
  availableDisplayModes?: string[];
  styles?: { variables?: Record<string, string> };
};

export type HostCapabilities = {
  serverTools?: unknown;
  openLinks?: unknown;
  message?: unknown;
  updateModelContext?: unknown;
  experimental?: Record<string, unknown>;
  extensions?: Record<string, unknown>;
};

type OpenAiCompatibility = {
  locale?: string;
  theme?: "light" | "dark";
  toolInput?: unknown;
  toolOutput?: unknown;
  callTool?: (name: string, input: unknown) => Promise<unknown>;
  setWidgetState?: (value: unknown) => void;
  openExternal?: (value: { href: string }) => void;
};

declare global {
  interface Window {
    openai?: OpenAiCompatibility;
  }
}

export type BridgeNotification = {
  method: string;
  params?: JsonObject;
};

export class McpAppBridge {
  #appName: string;
  #nextRequestId = 0;
  #pending = new Map<number, PendingRequest>();
  #listeners = new Set<(notification: BridgeNotification) => void>();
  #workspaceParts = new Map<string, JsonObject>();
  #workspaceTimer: number | undefined;
  #workspaceSending = false;
  #workspaceVersion = 0;
  #workspaceSent = "";
  #workspaceDismissed = false;
  standard = false;
  capabilities: HostCapabilities = {};
  context: HostContext = {};
  hostInfo?: { name: string; version: string };

  constructor(options: { name?: string } = {}) {
    this.#appName = options.name ?? "DM Faster campaign workspace";
    window.addEventListener("openai:set_globals", (event) => {
      if (this.standard) return;
      const globals = (event as CustomEvent<{ globals?: OpenAiCompatibility }>).detail?.globals;
      if (globals?.theme) this.applyHostContext({ theme: globals.theme });
    });
    window.addEventListener("message", (event) => {
      if (event.source !== window.parent) return;
      const message = event.data as JsonObject | null;
      if (!message || message.jsonrpc !== "2.0") return;
      const id = typeof message.id === "number" ? message.id : null;
      if (id !== null && typeof message.method !== "string") {
        const pending = this.#pending.get(id);
        if (!pending) return;
        this.#pending.delete(id);
        window.clearTimeout(pending.timer);
        const error = message.error as JsonObject | undefined;
        if (error)
          pending.reject(new Error(String(error.message || "The MCP host returned an error.")));
        else pending.resolve(message.result);
        return;
      }
      if (typeof message.method === "string") {
        const notification = {
          method: message.method,
          params:
            message.params && typeof message.params === "object"
              ? (message.params as JsonObject)
              : undefined,
        };
        this.#listeners.forEach((listener) => listener(notification));
      }
    });
  }

  subscribe(listener: (notification: BridgeNotification) => void) {
    this.#listeners.add(listener);
    return () => {
      this.#listeners.delete(listener);
    };
  }

  post(message: JsonObject) {
    window.parent.postMessage(message, "*");
  }

  notify(method: string, params: JsonObject = {}) {
    this.post({ jsonrpc: "2.0", method, params });
  }

  request(method: string, params: JsonObject = {}, timeoutMs = 30_000) {
    this.#nextRequestId += 1;
    const id = this.#nextRequestId;
    return new Promise<unknown>((resolve, reject) => {
      const timer = window.setTimeout(() => {
        this.#pending.delete(id);
        reject(new Error(`The MCP host did not answer ${method}.`));
      }, timeoutMs);
      this.#pending.set(id, { resolve, reject, timer });
      this.post({ jsonrpc: "2.0", id, method, params });
    });
  }

  async initialize() {
    try {
      const initialized = (await this.request(
        "ui/initialize",
        {
          appInfo: { name: this.#appName, version: "2.0.0" },
          appCapabilities: { availableDisplayModes: ["inline", "fullscreen"] },
          protocolVersion: MCP_APP_PROTOCOL_VERSION,
        },
        4_000,
      )) as {
        hostInfo?: { name: string; version: string };
        hostCapabilities?: HostCapabilities;
        hostContext?: HostContext;
      };
      this.standard = true;
      this.hostInfo = initialized.hostInfo;
      this.capabilities = initialized.hostCapabilities || {};
      this.context = initialized.hostContext || {};
      this.applyHostContext(this.context);
      this.notify("ui/notifications/initialized");
      return { mode: "standard" as const, input: null, output: null };
    } catch {
      if (
        window.openai &&
        (window.openai.toolInput || window.openai.toolOutput || window.openai.callTool)
      ) {
        this.standard = false;
        this.applyHostContext({ theme: window.openai.theme });
        return {
          mode: "openai" as const,
          input: window.openai.toolInput || null,
          output: window.openai.toolOutput || null,
        };
      }
      return { mode: "headless" as const, input: null, output: null };
    }
  }

  applyHostContext(context: HostContext) {
    if (
      Object.prototype.hasOwnProperty.call(context, "openai/modelContext") &&
      (context as JsonObject)["openai/modelContext"] === null
    ) {
      // Removing the attachment is intentional. Do not reattach on a render,
      // locale/theme change or a late acknowledgment of an earlier update.
      this.#workspaceDismissed = true;
      window.clearTimeout(this.#workspaceTimer);
    }
    this.context = { ...this.context, ...context };
    if (this.context.theme === "light" || this.context.theme === "dark") {
      document.documentElement.dataset.theme = this.context.theme;
      // Shared shadcn semantic colors use the same theme class as the Product app.
      document.documentElement.classList.toggle("dark", this.context.theme === "dark");
    }
    const insets = this.context.safeAreaInsets;
    for (const edge of ["top", "right", "bottom", "left"] as const) {
      const value = insets?.[edge];
      document.documentElement.style.setProperty(
        `--dm-safe-area-${edge}`,
        `${typeof value === "number" && Number.isFinite(value) ? Math.max(0, value) : 0}px`,
      );
    }
    const variables = this.context.styles?.variables;
    if (variables) {
      Object.entries(variables).forEach(([name, value]) => {
        if (typeof value !== "string" || !name.startsWith("--")) return;
        // Tailwind owns --font-sans, so preserve the host font under an alias.
        document.documentElement.style.setProperty(
          name === "--font-sans" ? "--font-sans-host" : name,
          value,
        );
      });
    }
  }

  canCallTools() {
    return this.standard
      ? Boolean(this.capabilities.serverTools)
      : Boolean(window.openai?.callTool);
  }

  setWorkspaceContext(part: string, value: JsonObject | null) {
    const previous = this.#workspaceParts.get(part) ?? null;
    if (JSON.stringify(previous) === JSON.stringify(value)) return;
    if (value === null) this.#workspaceParts.delete(part);
    else this.#workspaceParts.set(part, value);
    this.#workspaceVersion += 1;
    this.#workspaceDismissed = false;
    window.clearTimeout(this.#workspaceTimer);
    this.#workspaceTimer = window.setTimeout(() => void this.#flushWorkspaceContext(), 200);
  }

  async #flushWorkspaceContext() {
    if (this.#workspaceSending || this.#workspaceDismissed) return;
    // A context update must never fall back to ui/message: that starts a turn.
    if (!(this.standard && this.capabilities.updateModelContext) && !window.openai?.setWidgetState)
      return;
    const parts = Object.fromEntries(this.#workspaceParts);
    const serialized = JSON.stringify(parts);
    if (serialized === this.#workspaceSent) return;
    const version = this.#workspaceVersion;
    const context = {
      content: Object.keys(parts).length
        ? [
            {
              type: "text",
              text: "Current DM Faster workspace. Audience scope may include companies beyond the visible page. UI state is context, not authorization to save lists, spend credits or start sending. Read the structured scope and current workflow before acting.",
              _meta: { "openai/title": "DM Faster" },
            },
          ]
        : [],
      structuredContent: { type: "dmfaster.workspace_context", ...parts },
    };
    this.#workspaceSending = true;
    try {
      if (this.standard && this.capabilities.updateModelContext)
        await this.request("ui/update-model-context", context);
      else window.openai?.setWidgetState?.(context);
      this.#workspaceSent = serialized;
    } catch {
      // Keep the UI usable; a subsequent state change can publish a new snapshot.
    } finally {
      this.#workspaceSending = false;
      if (version !== this.#workspaceVersion && !this.#workspaceDismissed)
        void this.#flushWorkspaceContext();
    }
  }

  async callTool(name: string, input: unknown) {
    if (this.standard) return this.request("tools/call", { name, arguments: input }, 60_000);
    if (window.openai?.callTool) return window.openai.callTool(name, input);
    throw new Error("This host does not expose app-initiated MCP tool calls.");
  }

  async updateModelContext(content: unknown) {
    if (this.standard && this.capabilities.updateModelContext) {
      return this.request("ui/update-model-context", content as JsonObject);
    }
    if (window.openai?.setWidgetState) return window.openai.setWidgetState(content);
    throw new Error("This host cannot add the workspace selection back to model context.");
  }

  canDraftMessage() {
    // Mobile only supports immediate messages. Unknown platforms fail closed.
    return (
      this.standard &&
      Boolean(this.capabilities.message) &&
      Boolean(
        this.capabilities.extensions?.["openai/message"] ||
        this.capabilities.experimental?.["openai/message"],
      ) &&
      (this.context.platform === "desktop" || this.context.platform === "web")
    );
  }

  async draftMessage(content: JsonObject[], target: "active" | "new" = "active") {
    if (!this.canDraftMessage())
      throw new Error(
        "This host cannot open an editable chat draft. Add context and type your request in chat.",
      );
    return this.request("ui/message", {
      role: "user",
      content,
      _meta: { "openai/message": { target, send: false } },
    });
  }

  async openLink(url: string) {
    if (this.standard && this.capabilities.openLinks) return this.request("ui/open-link", { url });
    if (window.openai?.openExternal) return window.openai.openExternal({ href: url });
    throw new Error("This host cannot open the approval page.");
  }

  canOpenLinks() {
    return this.standard
      ? Boolean(this.capabilities.openLinks)
      : Boolean(window.openai?.openExternal);
  }

  reportSize() {
    if (!this.standard) return;
    this.notify("ui/notifications/size-changed", {
      width: Math.ceil(document.documentElement.getBoundingClientRect().width),
      height: Math.ceil(document.documentElement.getBoundingClientRect().height),
    });
  }
}
