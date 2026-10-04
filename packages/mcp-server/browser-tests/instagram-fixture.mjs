export const png =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jW1sAAAAASUVORK5CYII=";
export const spec = {
  query: "Independent photographers with booking information",
  threshold: 0.9,
  evidenceSchema: "profile-v2",
  criteria: [
    {
      id: "photographer",
      statement: "Literal text describes a photographer.",
      basis: "text",
      role: "required",
      unknown: "review",
    },
    {
      id: "booking",
      statement: "Literal text offers bookings.",
      basis: "text",
      role: "preferred",
      unknown: "review",
    },
  ],
};
export function row(id, status) {
  const summary = {
    profileId: String(id),
    username: `creator_${id}`,
    instagramUrl: `https://www.instagram.com/creator_${id}/`,
    split: "development",
    observedAt: id === 2 ? "=HOSTILE()" : "2026-10-04",
    requestHash: "c".repeat(64),
    evidenceHash: "d".repeat(64),
    policyHash: "b".repeat(64),
    imageCount: 0,
  };
  if (status === "pending") return { ...summary, status, reason: "provider_http_529" };
  return {
    ...summary,
    status,
    reasons:
      status === "review"
        ? ["photographer:unknown_or_unverified"]
        : status === "exclude"
          ? ["photographer:contradicted"]
          : [],
    criteria: {
      photographer: {
        judgment:
          status === "review" ? "unknown" : status === "exclude" ? "contradicts" : "supports",
        probabilities:
          status === "review"
            ? { supports: 0.05, contradicts: 0.05, unknown: 0.9 }
            : status === "exclude"
              ? { supports: 0.02, contradicts: 0.96, unknown: 0.02 }
              : { supports: 0.96, contradicts: 0.02, unknown: 0.02 },
        evidence: status === "review" ? "none" : "biography",
        evidenceProbability: 0.98,
      },
      booking: {
        judgment: "unknown",
        probabilities: { supports: 0.05, contradicts: 0.05, unknown: 0.9 },
        evidence: "none",
        evidenceProbability: 0.99,
      },
    },
    evidence: {
      photographer: {
        source: status === "review" ? "none" : "biography",
        value: status === "review" ? null : "Photographer",
        image: null,
      },
      booking: { source: "none", value: null, image: null },
    },
    preferenceScore: 0.05,
    recordedAt: "2026-10-04",
    rawJudgmentsReused: true,
  };
}
export function evaluation(offset = 0, options = {}) {
  const results =
    offset === 0
      ? [row(1, "accept"), row(2, "review"), row(3, "exclude"), row(4, "pending")]
      : [row(5, "accept"), row(6, "review")];
  const counts = { accept: 0, review: 0, exclude: 0, pending: 0 };
  results.forEach((row) => counts[row.status]++);
  return {
    stage: "private_evaluation",
    datasetId: "demo_photographers",
    revision: "a".repeat(64),
    policyHash: "b".repeat(64),
    spec,
    totalProfiles: 6,
    offset,
    scanned: results.length,
    counts,
    results,
    nextCursor: offset === 0 ? "next" : null,
    inferenceCalls: 0,
    customerCreditsSpent: 0,
    note: "Synthetic MCP fixture",
    ...options,
  };
}
export function initial(options = {}) {
  return {
    version: 1,
    view: "dmfaster.instagram_workspace",
    datasets: [
      {
        datasetId: "demo_photographers",
        label: "Example photographers · synthetic data",
        revision: "a".repeat(64),
        spec,
        totalProfiles: 6,
        withBiography: 4,
        withSavedImages: 1,
        development: 6,
        holdout: 0,
      },
    ],
    evaluation: evaluation(0, options),
  };
}
export function installInstagramHost({ payload, options, png, second }) {
  window.__calls = [];
  window.__contexts = [];
  window.__links = [];
  window.__pending = [];
  window.__release = (name) => {
    const index = window.__pending.findIndex((p) => p.name === name);
    if (index >= 0) {
      const [entry] = window.__pending.splice(index, 1);
      entry.respond(entry.value);
    }
  };
  window.addEventListener("message", (event) => {
    const message = event.data;
    if (message?.jsonrpc !== "2.0" || typeof message.id !== "number" || !message.method) return;
    const respond = (value) =>
      window.postMessage({ jsonrpc: "2.0", id: message.id, result: value }, "*");
    if (message.method === "ui/initialize") {
      respond({
        hostCapabilities: { serverTools: {}, updateModelContext: {}, openLinks: {} },
        hostContext: { theme: options.theme ?? "light" },
      });
      setTimeout(
        () =>
          window.postMessage(
            {
              jsonrpc: "2.0",
              method: "ui/notifications/tool-result",
              params: { structuredContent: payload },
            },
            "*",
          ),
        0,
      );
      return;
    }
    if (message.method === "ui/update-model-context") {
      window.__contexts.push(message.params);
      respond({});
      return;
    }
    if (message.method === "ui/open-link") {
      window.__links.push(message.params.url);
      respond({});
      return;
    }
    if (message.method !== "tools/call") return;
    const { name, arguments: args } = message.params;
    window.__calls.push({ name, args });
    let value;
    if (name === "instagram_profiles_evaluate") value = { structuredContent: second };
    else if (name === "instagram_workspace")
      value = {
        structuredContent: {
          ...payload,
          evaluation: { ...payload.evaluation, ...(args.spec ? { spec: args.spec } : {}) },
        },
      };
    else if (name === "instagram_acquisition_quote")
      value = options.failQuote
        ? {
            isError: true,
            structuredContent: {
              quote: { ok: false, error: { message: "Workspace permission required" } },
            },
          }
        : {
            structuredContent: {
              quote: {
                ok: true,
                data: { message: "Up to 1000 profiles and 1000 credits. No extraction started." },
              },
            },
          };
    else if (name === "instagram_profile_inspect")
      value = {
        structuredContent: {
          datasetId: args.datasetId,
          revision: args.revision,
          profileId: args.profileId,
          split: "development",
          profile: {
            id: args.profileId,
            username: `creator_${args.profileId}`,
            name: `Example creator ${args.profileId}`,
            biography: 'Photographer\n<img src=x onerror="window.__injected=true">',
            city: "Oslo",
            category: "Photographer",
            pronouns: [],
            followerCount: 1018,
            isPrivate: false,
            isVerified: false,
            observedAt: "2026-10-04",
            discovery: [],
          },
          imageManifest: [
            {
              kind: "avatar",
              content_type: "image/png",
              sha256: "e".repeat(64),
              width: 1,
              height: 1,
            },
          ],
          imageAvailability: "available",
          inferenceCalls: 0,
          customerCreditsSpent: 0,
        },
        _meta: {
          instagramImages: [
            {
              sha256: "e".repeat(64),
              content_type: "image/png",
              url: `data:image/png;base64,${png}`,
            },
          ],
        },
      };
    else {
      respond({ isError: true, content: [{ type: "text", text: "Unexpected tool" }] });
      return;
    }
    if (
      (options.holdMore && name === "instagram_profiles_evaluate") ||
      (options.holdProfiles && name === "instagram_profile_inspect")
    )
      window.__pending.push({ name, value, respond });
    else respond(value);
  });
}
