import type { AgentToolInputMap } from "@dmfaster/sdk";

export type SavedListCommand =
  | "lists.list"
  | "list.inspect"
  | "list.target.remove"
  | "campaign.draft.prepare";

function options(args: string[], allowed: string[]) {
  const result = new Map<string, string>();
  for (let index = 0; index < args.length; index += 2) {
    const key = args[index]!;
    const value = args[index + 1];
    if (!allowed.includes(key) || !value || value.startsWith("--") || result.has(key))
      throw new Error("Use each supported option once, with a value. See dmfaster --help.");
    result.set(key, value);
  }
  return result;
}
function bounded(value: unknown, max: number) {
  if (typeof value !== "string" || !value.trim() || value.length > max)
    throw new Error(`Expected text of 1–${max} characters.`);
  return value.trim();
}
function integer(value: unknown, min: number, max: number) {
  const number =
    typeof value === "number"
      ? value
      : typeof value === "string" && /^\d+$/.test(value)
        ? Number(value)
        : NaN;
  if (!Number.isInteger(number) || number < min || number > max)
    throw new Error(`Expected an integer from ${min} to ${max}.`);
  return number;
}
function handle(value: unknown) {
  const result = bounded(value, 64).replace(/^@/, "").toLowerCase();
  if (!/^[a-z0-9_](?:[a-z0-9_.]{0,28}[a-z0-9_])?$/.test(result) || result.includes(".."))
    throw new Error("Provide a valid Instagram username.");
  return result;
}
function version(value: unknown) {
  const result = bounded(value, 27);
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,6})?Z$/.test(result))
    throw new Error("Use the exact updatedAt from list inspect as the expected version.");
  return result;
}
function newContactsOnly(value: unknown) {
  if (value !== true)
    throw new Error(
      "Instagram campaigns always skip known contacts. Set onlyNewChats and skipPreviouslyMessaged to true.",
    );
  return true as const;
}

export async function parseSavedListCommand(
  tool: SavedListCommand,
  args: string[],
  read: (file: string) => Promise<string>,
): Promise<AgentToolInputMap[SavedListCommand]> {
  if (tool === "campaign.draft.prepare") {
    const opts = options(args, ["--input"]);
    const text = await read(bounded(opts.get("--input"), 4096));
    if (Buffer.byteLength(text, "utf8") > 32_768) throw new Error("Draft input exceeds 32 KiB.");
    const data: unknown = JSON.parse(text);
    if (!data || typeof data !== "object" || Array.isArray(data))
      throw new Error("Draft input must be a JSON object.");
    const value = data as Record<string, unknown>;
    const allowed = [
      "listId",
      "expectedListUpdatedAt",
      "expectedTargetCount",
      "name",
      "messageVariants",
      "dailyCap",
      "pacingSeconds",
      "onlyNewChats",
      "skipPreviouslyMessaged",
      "idempotencyKey",
    ];
    if (Object.keys(value).some((key) => !allowed.includes(key)))
      throw new Error("Unsupported draft field. Launch and activation are separate commands.");
    if (
      !Array.isArray(value.messageVariants) ||
      value.messageVariants.length < 1 ||
      value.messageVariants.length > 4
    )
      throw new Error("Supply 1–4 message variations.");
    const messageVariants = value.messageVariants.map((body) => {
      bounded(body, 1000);
      return body as string;
    });
    const idempotencyKey = bounded(value.idempotencyKey, 160);
    if (!/^[A-Za-z0-9._:-]+$/.test(idempotencyKey)) throw new Error("Invalid idempotency key.");
    return {
      listId: bounded(value.listId, 160),
      expectedListUpdatedAt: version(value.expectedListUpdatedAt),
      expectedTargetCount: integer(value.expectedTargetCount, 1, Number.MAX_SAFE_INTEGER),
      name: bounded(value.name, 120),
      messageVariants,
      dailyCap: integer(value.dailyCap, 1, 60),
      pacingSeconds: integer(value.pacingSeconds, 12, 3600),
      onlyNewChats: newContactsOnly(value.onlyNewChats),
      skipPreviouslyMessaged: newContactsOnly(value.skipPreviouslyMessaged),
      idempotencyKey,
    };
  }
  const listId = tool === "lists.list" ? undefined : bounded(args[0], 160);
  const opts = options(
    listId ? args.slice(1) : args,
    tool === "lists.list"
      ? ["--query", "--limit", "--offset"]
      : tool === "list.inspect"
        ? ["--username", "--limit", "--offset"]
        : ["--username", "--expected-version"],
  );
  if (tool === "list.target.remove")
    return {
      listId: listId!,
      username: handle(opts.get("--username")),
      expectedListUpdatedAt: version(opts.get("--expected-version")),
    };
  const page = {
    ...(opts.has("--limit")
      ? { limit: integer(opts.get("--limit"), 1, tool === "lists.list" ? 25 : 100) }
      : {}),
    ...(opts.has("--offset") ? { offset: integer(opts.get("--offset"), 0, 1_000_000) } : {}),
  };
  if (tool === "list.inspect")
    return {
      listId: listId!,
      ...page,
      ...(opts.has("--username") ? { username: handle(opts.get("--username")) } : {}),
    };
  return { ...page, ...(opts.has("--query") ? { query: bounded(opts.get("--query"), 120) } : {}) };
}
