import { completeEvidencePage } from "../ui/company-evidence-data.ts";
const companyReads = new Set(["companies_search", "company_inspect", "companies_evidence_results"]);

function unsupportedProjection(error) {
  return (
    (error?.code === "invalid_input" && /projection/u.test(error.message)) ||
    (error?.code === "invalid_request" && error.message === "The agent tool input is invalid.")
  );
}

// The live review host cannot spend research credits or change a workspace,
// even when the owner's existing local credential has broader permissions.
export async function createPreviewReader(client) {
  const { createAgentToolDefinitions } = await import("../src/tools.ts");
  const reads = new Map(
    createAgentToolDefinitions(client)
      .filter((definition) => companyReads.has(definition.name))
      .map((definition) => [definition.name, definition]),
  );
  let legacyProjection = false;
  return async (name, input) => {
    const definition = reads.get(name);
    if (!definition)
      throw new Error(
        "This preview allows only company search, profile and saved evidence result reads.",
      );
    const parsed = definition.inputSchema.parse(input);
    const isList = name === "companies_search" && parsed.projection === "list";
    const { projection, ...richInput } = parsed;
    let result;
    try {
      result = await definition.call(isList && legacyProjection ? richInput : parsed);
    } catch (error) {
      if (!isList || legacyProjection || !unsupportedProjection(error)) throw error;
      legacyProjection = true;
      result = await definition.call(richInput);
    }
    // During code review the public server may precede the optional list
    // projection. Retry only that presentation field; never remove criteria.
    if (isList && !legacyProjection && result.ok === false && unsupportedProjection(result.error)) {
      legacyProjection = true;
      result = await definition.call(richInput);
    }
    return { structuredContent: result };
  };
}

export function previewPayload(value) {
  const envelope = value?.structuredContent ?? value;
  const result = envelope?.view === "dmfaster.workspace" ? envelope.result : envelope;
  const evidence = result?.tool === "companies.evidence.results";
  if (result?.tool !== "companies.search" && !evidence)
    throw new Error(
      "The preview needs an official companies.search or companies.evidence.results receipt.",
    );
  if (result.ok === true) {
    const data = result.data;
    if (evidence) completeEvidencePage(data);
    else if (
      data?.totalExact !== true ||
      !Number.isSafeInteger(data.total) ||
      data.total < 0 ||
      !Array.isArray(data.companies) ||
      data.companies.length > 100 ||
      !data.expectedRevision ||
      !data.querySignature ||
      !Array.isArray(data.filters?.countries)
    )
      throw new Error("The preview needs an exact count and the original search identities.");
  } else if (result.ok !== false) throw new Error("Invalid company search result.");
  return {
    version: 1,
    view: "dmfaster.workspace",
    section: "companies",
    ...(!evidence ? { filters: result.data?.filters ?? envelope.filters } : {}),
    result,
  };
}

export function isPreviewRequestAllowed(request, port) {
  const origin = `http://127.0.0.1:${port}`;
  return (
    request.headers.host === `127.0.0.1:${port}` &&
    (request.method !== "POST" || request.headers.origin === origin)
  );
}

export function installLivePreviewHost({ theme }) {
  let initialized = false;
  let latest;
  let serialized;
  const publish = (payload) => {
    const next = JSON.stringify(payload);
    if (next === serialized) return;
    latest = payload;
    serialized = next;
    if (initialized)
      window.postMessage(
        {
          jsonrpc: "2.0",
          method: "ui/notifications/tool-result",
          params: { structuredContent: payload },
        },
        "*",
      );
  };
  let ready;
  const initial = new Promise((resolve) => {
    ready = resolve;
  });
  const events = new EventSource("/preview/events");
  events.onmessage = (event) => {
    publish(JSON.parse(event.data));
    ready();
  };
  window.addEventListener("message", async (event) => {
    const message = event.data;
    if (
      event.source !== window.parent ||
      message?.jsonrpc !== "2.0" ||
      typeof message.id !== "number" ||
      !message.method
    )
      return;
    const respond = (result) =>
      window.postMessage(
        {
          jsonrpc: "2.0",
          id: message.id,
          result,
        },
        "*",
      );
    if (message.method === "ui/initialize") {
      respond({
        hostCapabilities: { serverTools: {} },
        hostContext: { displayMode: "fullscreen", theme },
      });
      await initial;
      initialized = true;
      window.postMessage(
        {
          jsonrpc: "2.0",
          method: "ui/notifications/tool-result",
          params: { structuredContent: latest },
        },
        "*",
      );
    } else if (message.method === "tools/call") {
      try {
        const response = await fetch("/preview/read", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(message.params),
        });
        respond(await response.json());
      } catch {
        respond({
          isError: true,
          structuredContent: {
            ok: false,
            error: { message: "The local preview read is unavailable. Retry." },
          },
        });
      }
    } else respond({});
  });
}
