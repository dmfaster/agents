import assert from "node:assert/strict";
import test from "node:test";
import { McpAppBridge } from "../ui/bridge.ts";
function fixture(t: any) {
  const properties = new Map<string, string>();
  const listeners: Array<(event: any) => void> = [];
  const requests: any[] = [];
  const parent = {
    postMessage(message: any) {
      requests.push(message);
      if (message.id)
        queueMicrotask(() =>
          listeners.forEach((f) =>
            f({ source: parent, data: { jsonrpc: "2.0", id: message.id, result: {} } }),
          ),
        );
    },
  };
  const previousWindow = Object.getOwnPropertyDescriptor(globalThis, "window");
  const previousDocument = Object.getOwnPropertyDescriptor(globalThis, "document");
  t.after(() => {
    if (previousWindow) Object.defineProperty(globalThis, "window", previousWindow);
    else Reflect.deleteProperty(globalThis, "window");
    if (previousDocument) Object.defineProperty(globalThis, "document", previousDocument);
    else Reflect.deleteProperty(globalThis, "document");
  });
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: {
      addEventListener(type: string, callback: any) {
        if (type === "message") listeners.push(callback);
      },
      parent,
      setTimeout,
      clearTimeout,
    },
  });
  Object.defineProperty(globalThis, "document", {
    configurable: true,
    value: {
      documentElement: {
        dataset: {},
        style: {
          setProperty(k: string, v: string) {
            properties.set(k, v);
          },
        },
        classList: { toggle() {} },
      },
    },
  });
  const bridge = new McpAppBridge();
  bridge.standard = true;
  bridge.capabilities = { message: { text: {} }, experimental: { "openai/message": {} } };
  bridge.context = { platform: "desktop" };
  return { bridge, requests, properties };
}
test("chat drafting never submits automatically, for both active and new conversations", async (t) => {
  const { bridge, requests } = fixture(t);
  for (const target of ["active", "new"] as const)
    await bridge.draftMessage([{ type: "text", text: "Review these companies" }], target);
  assert.deepEqual(
    requests.map((r) => r.params._meta),
    [
      { "openai/message": { target: "active", send: false } },
      { "openai/message": { target: "new", send: false } },
    ],
  );
});
test("mobile, unknown platforms and absent extension capabilities cannot use immediate-message fallbacks", async (t) => {
  const { bridge, requests } = fixture(t);
  for (const platform of ["mobile", undefined] as const) {
    bridge.context = { platform };
    await assert.rejects(bridge.draftMessage([]), /editable chat draft/);
  }
  bridge.context = { platform: "desktop" };
  bridge.capabilities = { message: {} };
  await assert.rejects(bridge.draftMessage([]));
  await assert.rejects(bridge.updateModelContext({ content: [] }), /cannot add/);
  assert.deepEqual(requests, []);
});
test("safe-area changes apply finite nonnegative values and clear old insets", (t) => {
  const { bridge, properties } = fixture(t);
  bridge.applyHostContext({ safeAreaInsets: { top: 18, right: -1, bottom: 88, left: Infinity } });
  assert.equal(properties.get("--dm-safe-area-top"), "18px");
  assert.equal(properties.get("--dm-safe-area-right"), "0px");
  assert.equal(properties.get("--dm-safe-area-bottom"), "88px");
  assert.equal(properties.get("--dm-safe-area-left"), "0px");
  bridge.applyHostContext({ safeAreaInsets: { top: 0, right: 0, bottom: 0, left: 0 } });
  assert.equal(properties.get("--dm-safe-area-bottom"), "0px");
});
