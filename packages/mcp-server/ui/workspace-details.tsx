import { useEffect, useRef, useState, type ReactNode } from "react";
import type { AgentToolDataMap } from "@dmfaster/sdk";
import type { McpAppBridge } from "./bridge.ts";

// Extra reads happen only when the user opens the corresponding disclosure.
function ReadSection<T>({
  title,
  tool,
  input,
  bridge,
  children,
}: {
  title: string;
  tool: string;
  input: Record<string, unknown>;
  bridge: McpAppBridge;
  children: (data: T) => ReactNode;
}) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const requested = useRef(false);
  const alive = useRef(true);
  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);
  async function read() {
    requested.current = true;
    setBusy(true);
    setError("");
    try {
      const response = (await bridge.callTool(tool, input)) as {
        structuredContent?: Record<string, unknown>;
        isError?: boolean;
      };
      const payload = response?.structuredContent ?? (response as Record<string, unknown>);
      if (!payload || response?.isError || payload.ok === false) {
        const failure = payload?.error as { message?: string } | undefined;
        throw new Error(failure?.message || "Could not load this information.");
      }
      const next = tool === "connection_status" ? payload : payload.data;
      if (!next || typeof next !== "object") throw new Error("This information is unavailable.");
      if (alive.current) setData(next as T);
    } catch (failure) {
      if (alive.current) setError(failure instanceof Error ? failure.message : String(failure));
    } finally {
      if (alive.current) setBusy(false);
    }
  }
  return (
    <details
      className="workspace-disclosure"
      onToggle={(event) => {
        if (event.currentTarget.open && !requested.current && bridge.canCallTools()) void read();
      }}
    >
      <summary>{title}</summary>
      <div className="workspace-disclosure-body">
        {busy ? <p role="status">Loading…</p> : null}
        {error ? <p role="alert">{error}</p> : null}
        {data ? children(data) : null}
        {!bridge.canCallTools() ? (
          <p>Ask your assistant to load this information.</p>
        ) : (
          <button
            type="button"
            className="workspace-link"
            disabled={busy}
            onClick={() => void read()}
          >
            {error ? "Retry" : "Refresh"}
          </button>
        )}
      </div>
    </details>
  );
}

function Copy({ label, messages }: { label: string; messages: string[] }) {
  return messages.length ? (
    <section className="workspace-copy">
      <h3>{label}</h3>
      {messages.map((message, index) => (
        <p key={index} className="workspace-message">
          {message}
        </p>
      ))}
    </section>
  ) : null;
}

export function CampaignDetails({
  detail,
  bridge,
}: {
  detail: AgentToolDataMap["campaign.inspect"];
  bridge: McpAppBridge;
}) {
  const input = { campaignId: detail.campaign.id };
  const settings = detail.settings;
  const time = (minute: number) =>
    `${String(Math.floor(minute / 60)).padStart(2, "0")}:${String(minute % 60).padStart(2, "0")}`;
  return (
    <div className="workspace-sections">
      <ReadSection<AgentToolDataMap["campaign.copy.inspect"]>
        title="Messages"
        tool="campaign_copy_inspect"
        input={input}
        bridge={bridge}
      >
        {(copy) => (
          <>
            <Copy label="Instagram / Facebook" messages={copy.messageVariants} />
            {copy.channels.includes("linkedin") ? (
              <>
                <Copy
                  label="LinkedIn invitation"
                  messages={
                    copy.linkedinInviteMode === "invite_with_note" && copy.linkedinInviteNote
                      ? [copy.linkedinInviteNote]
                      : []
                  }
                />
                {copy.linkedinInviteMode === "invite_only" ? (
                  <p>LinkedIn invitation without a note.</p>
                ) : null}
                <Copy
                  label="After acceptance"
                  messages={copy.linkedinAcceptedMessage.messageVariants}
                />
              </>
            ) : null}
            {!copy.messageVariants.length && !copy.channels.includes("linkedin") ? (
              <p>No social message copy saved.</p>
            ) : null}
          </>
        )}
      </ReadSection>
      <details className="workspace-disclosure">
        <summary>Delivery</summary>
        <div className="workspace-disclosure-body">
          <dl className="workspace-facts">
            <div>
              <dt>Daily limit</dt>
              <dd>{detail.campaign.dailyCap.toLocaleString()}</dd>
            </div>
            {settings ? (
              <>
                <div>
                  <dt>Pacing</dt>
                  <dd>{settings.pacingSeconds}s</dd>
                </div>
                <div>
                  <dt>Sending window</dt>
                  <dd>
                    {settings.instagramSendingWindowEnabled
                      ? `${time(settings.instagramSendingWindowStartMinute)}–${time(settings.instagramSendingWindowEndMinute)}`
                      : "Off"}
                  </dd>
                </div>
                {settings.instagramSendingWindowEnabled ? (
                  <div>
                    <dt>Days</dt>
                    <dd>
                      {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
                        .filter((_, day) => settings.instagramSendingWindowWeekdays & (1 << day))
                        .join(", ") || "None"}
                    </dd>
                  </div>
                ) : null}
                <div>
                  <dt>Timezone</dt>
                  <dd>{settings.timezone}</dd>
                </div>
              </>
            ) : null}
          </dl>
        </div>
      </details>
      <ReadSection<AgentToolDataMap["replies.list"]>
        title="Replies & pipeline"
        tool="replies_list"
        input={{ ...input, limit: 5 }}
        bridge={bridge}
      >
        {(replies) => (
          <>
            <dl className="workspace-facts">
              <div>
                <dt>Replies</dt>
                <dd>{replies.totalReplies.toLocaleString()}</dd>
              </div>
              {detail.pipeline ? (
                <>
                  <div>
                    <dt>Calls booked</dt>
                    <dd>{detail.pipeline.call_booked.toLocaleString()}</dd>
                  </div>
                  <div>
                    <dt>Closed</dt>
                    <dd>{detail.pipeline.closed.toLocaleString()}</dd>
                  </div>
                </>
              ) : null}
            </dl>
            {replies.replies.length ? (
              <>
                <p className="workspace-muted">
                  Showing {replies.replies.length} of {replies.totalReplies.toLocaleString()} reply
                  contacts.
                </p>
                <ul className="workspace-replies">
                  {replies.replies.map((reply) => (
                    <li key={reply.id}>
                      {reply.companyName || reply.contactName || reply.handle}
                      <span>{reply.stage.replaceAll("_", " ")}</span>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <p>No reply contacts yet.</p>
            )}
          </>
        )}
      </ReadSection>
      <ReadSection<AgentToolDataMap["sending.inspect"]>
        title="Sending health"
        tool="sending_inspect"
        input={input}
        bridge={bridge}
      >
        {(health) => (
          <>
            <p>{health.summary}</p>
            {health.issues.length ? (
              <ul>
                {health.issues
                  .filter((issue) => issue.message !== health.summary)
                  .map((issue) => (
                    <li key={issue.code}>{issue.message}</li>
                  ))}
              </ul>
            ) : null}
            {health.assessment?.nextAction ? (
              <p className="workspace-next">{health.assessment.nextAction}</p>
            ) : null}
          </>
        )}
      </ReadSection>
    </div>
  );
}

type Connection = {
  status: string;
  actionRequired?: string;
  user?: { name?: string; email?: string };
  workspace?: { name?: string };
  credential?: { scopes?: string[] };
};
export function ConnectionDetails({ bridge }: { bridge: McpAppBridge }) {
  return (
    <ReadSection<Connection> title="Connection" tool="connection_status" input={{}} bridge={bridge}>
      {(connection) => (
        <>
          <dl className="workspace-facts">
            <div>
              <dt>Status</dt>
              <dd>{connection.status === "authenticated" ? "Connected" : "Not connected"}</dd>
            </div>
            {connection.user ? (
              <div>
                <dt>Account</dt>
                <dd>{connection.user.email || connection.user.name || "Unavailable"}</dd>
              </div>
            ) : null}
            {connection.workspace ? (
              <div>
                <dt>Workspace</dt>
                <dd>{connection.workspace.name || "Unavailable"}</dd>
              </div>
            ) : null}
          </dl>
          {connection.credential?.scopes ? (
            <dl className="workspace-facts">
              {[
                ["Campaigns", "campaigns:read"],
                ["Replies", "inbox:read"],
                ["Sending health", "sending:read"],
              ].map(([label, scope]) => (
                <div key={scope}>
                  <dt>{label}</dt>
                  <dd>
                    {connection.credential!.scopes!.includes(scope!)
                      ? "Read enabled"
                      : "Permission needed"}
                  </dd>
                </div>
              ))}
            </dl>
          ) : null}
          {connection.status !== "authenticated" ? (
            <p>{connection.actionRequired || "Reconnect DM Faster in your host."}</p>
          ) : null}
        </>
      )}
    </ReadSection>
  );
}
