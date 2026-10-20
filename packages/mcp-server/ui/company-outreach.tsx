import { useWorkspaceContext } from "./use-workspace-context.ts";
import { useRef, useState, useEffect } from "react";
import {
  ArrowRight,
  ChevronDown,
  Send,
  Settings2,
  Users,
  ShieldCheck,
  CircleCheck,
  Check,
  Plus,
  Trash2,
  MessageSquareText,
} from "lucide-react";
import { Button } from "@dmfaster/product-ui/components/button";
import { Input } from "@dmfaster/product-ui/components/input";
import { Textarea } from "@dmfaster/product-ui/components/textarea";
import {
  InstagramIcon,
  FacebookIcon,
  LinkedInIcon,
  GmailIcon,
} from "@dmfaster/product-ui/company-brands";
import { CompanyLogo } from "./company-logo.tsx";
import type { AgentToolDataMap, AgentToolInputMap } from "@dmfaster/sdk";
import type { McpAppBridge } from "./bridge.ts";
import {
  identity,
  readData,
  record,
  text,
  mutationRejected,
  type CompanyRow,
} from "./companies-data.ts";
import { inspectShortlist, verifiedShortlist } from "./company-shortlist-data.ts";
import { t } from "./locale.ts";

export type OutreachState = { locked: boolean; reviewed: boolean; launched: boolean };

type Channel = "instagram" | "facebook" | "linkedin" | "gmail" | "sms";
type SavedList = AgentToolDataMap["companies.list.prepare"];
type Draft = AgentToolDataMap["campaign.draft.prepare"];
type Launch = AgentToolDataMap["campaign.launch"];
const channels: { id: Channel; label: string }[] = [
  { id: "instagram", label: "Instagram" },
  { id: "facebook", label: "Facebook" },
  { id: "linkedin", label: "LinkedIn invitation" },
  { id: "gmail", label: "Email" },
  { id: "sms", label: "SMS" },
];
const channelIcons = {
  instagram: InstagramIcon,
  facebook: FacebookIcon,
  linkedin: LinkedInIcon,
  gmail: GmailIcon,
  sms: MessageSquareText,
};
const contactCount = (list: SavedList, channel: Channel) =>
  list.channelCounts?.[channel === "gmail" ? "email" : channel];
const key = () => `ui:${crypto.randomUUID()}`;

export function CompanyOutreach({
  companies,
  bridge,
  step,
  onState,
  onReviewReady,
  onEdit,
  onLaunched,
}: {
  companies: CompanyRow[];
  bridge: McpAppBridge;
  step: "message" | "review";
  onState(state: OutreachState): void;
  onReviewReady(): void;
  onEdit(): void;
  onLaunched(): void;
}) {
  const [selectedChannels, setSelectedChannels] = useState<Channel[]>(["instagram"]);
  const [linkedinNote, setLinkedinNote] = useState("");
  const hasDirectMessage = selectedChannels.some((item) =>
    ["instagram", "facebook", "gmail"].includes(item),
  );
  const hasEmail = selectedChannels.includes("gmail");
  const hasSms = selectedChannels.includes("sms");
  const [senders, setSenders] = useState<AgentToolDataMap["senders.inspect"] | null>(null);
  const [sendersError, setSendersError] = useState("");
  const [senderRead, setSenderRead] = useState(0);
  const [mailboxId, setMailboxId] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailConsent, setEmailConsent] = useState(false);
  const [smsBody, setSmsBody] = useState("");
  const mailboxes = senders?.emailAvailable
    ? senders.mailboxes.filter(
        (mailbox) =>
          mailbox.status === "connected" &&
          mailbox.sendEnabled &&
          mailbox.canSend &&
          !mailbox.needsReauthorization,
      )
    : [];
  const emailReady = mailboxes.length > 0;
  const smsReady = Boolean(
    senders?.sms?.available &&
    senders.sms.configured &&
    senders.sms.enabled &&
    senders.sms.phoneNumber,
  );
  const visibleChannels = channels.filter(({ id }) =>
    id === "gmail" ? emailReady : id === "sms" ? smsReady : true,
  );
  useEffect(() => {
    let active = true;
    setSendersError("");
    void bridge
      .callTool("senders_inspect", {})
      .then((result) => {
        const data = readData<AgentToolDataMap["senders.inspect"]>(result);
        if (active) setSenders(data);
      })
      .catch(() => {
        if (active) setSendersError(t("Could not check email and SMS setup."));
      });
    return () => {
      active = false;
    };
  }, [bridge, senderRead]);
  const hasLinkedin = selectedChannels.includes("linkedin");
  const [bodies, setBodies] = useState<string[]>([""]);
  const messageVariants = hasDirectMessage
    ? bodies
    : hasLinkedin
      ? [linkedinNote]
      : [smsBody.trim()];
  const [name, setName] = useState(t("Outreach to selected companies"));
  const [dailyCap, setDailyCap] = useState(20);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [list, setList] = useState<SavedList | null>(null);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [launch, setLaunch] = useState<Launch | null>(null);
  const [nextLink, setNextLink] = useState<{ url: string; label: string } | null>(null);
  const listRequest = useRef<AgentToolInputMap["companies.list.prepare"] | null>(null);
  const draftRequest = useRef<AgentToolInputMap["campaign.draft.prepare"] | null>(null);
  const draftKey = useRef(key());
  const launchKey = useRef(key());
  const launchRequest = useRef<AgentToolInputMap["campaign.launch"] | null>(null);
  const lock = useRef(false);
  const selectionKey = companies.map(identity).sort().join("|");
  const previousSelection = useRef(selectionKey);
  function invalidateDraft() {
    setDraft(null);
    setLaunch(null);
    draftRequest.current = null;
    draftKey.current = key();
    launchKey.current = key();
    launchRequest.current = null;
    setError("");
    setNextLink(null);
  }
  useEffect(() => {
    if (previousSelection.current === selectionKey) return;
    previousSelection.current = selectionKey;
    setList(null);
    listRequest.current = null;
    invalidateDraft();
  }, [selectionKey]);
  const navigationLocked =
    busy ||
    Boolean(listRequest.current && !list) ||
    Boolean(draftRequest.current && !draft) ||
    Boolean(launchRequest.current && !launch);
  useEffect(() => {
    onState({ locked: navigationLocked, reviewed: Boolean(draft), launched: Boolean(launch) });
  }, [navigationLocked, draft, launch, onState]);
  const showReview = step === "review" && Boolean(draft);
  useWorkspaceContext(bridge, "outreach", {
    audienceKey: selectionKey,
    companyCount: companies.length,
    channels: selectedChannels,
    message: bodies[0],
    messageVariants,
    linkedinInviteNote: linkedinNote,
    name,
    dailyCap,
    ...(hasEmail ? { emailSubject, mailboxId, emailConsent } : {}),
    ...(hasSms ? { smsBody } : {}),
    campaignId: draft?.campaignId ?? null,
    status: launch
      ? "launch_acknowledged"
      : draft
        ? "disabled_draft"
        : (listRequest.current && !list) || draftRequest.current
          ? "save_unverified"
          : "editing",
    lastError: error || null,
    recovery:
      draftRequest.current && !draft
        ? { tool: "campaign_draft_prepare", input: draftRequest.current }
        : listRequest.current && !list
          ? { tool: "companies_list_prepare", input: listRequest.current }
          : null,
    startAuthorized: Boolean(launchRequest.current),
    deliveryConfirmed: false,
  });

  const valid =
    name.trim() &&
    selectedChannels.length > 0 &&
    (!hasDirectMessage || bodies.every((body) => body.trim() && body.length <= 1000)) &&
    (!hasLinkedin || (linkedinNote.trim() && linkedinNote.length <= 300)) &&
    (!hasEmail ||
      (emailReady &&
        mailboxes.some((mailbox) => mailbox.id === mailboxId) &&
        emailSubject.trim() &&
        emailSubject.length <= 500 &&
        emailConsent)) &&
    (!hasSms || (smsReady && smsBody.trim() && smsBody.length <= 1600)) &&
    Number.isInteger(dailyCap) &&
    dailyCap >= 1 &&
    dailyCap <= 60;

  async function act(work: () => Promise<void>) {
    if (lock.current) return;
    lock.current = true;
    setBusy(true);
    setError("");
    setNextLink(null);
    try {
      await work();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      lock.current = false;
      setBusy(false);
    }
  }
  async function review() {
    if (!valid || !companies.length) return;
    if (draft) {
      onReviewReady();
      return;
    }
    await act(async () => {
      const wasUnverified = Boolean(listRequest.current && !list);
      if (!listRequest.current) {
        listRequest.current = await inspectShortlist(bridge, companies, name);
      }
      let saved = list;
      if (!saved) {
        const submitted = listRequest.current;
        const response = await bridge.callTool("companies_list_prepare", submitted);
        if (
          !wasUnverified &&
          mutationRejected(response, [
            "company_changed",
            "company_not_found",
            "invalid_company_selection",
            "duplicate_company",
            "invalid_input",
            "owner_required",
          ])
        )
          listRequest.current = null;
        saved = verifiedShortlist(response, submitted);
      }
      if (
        saved.total !== companies.length ||
        !saved.expectedUpdatedAt ||
        !saved.channelCounts ||
        !selectedChannels.every(
          (channel) =>
            Number.isSafeInteger(contactCount(saved, channel)) &&
            contactCount(saved, channel)! >= 0 &&
            contactCount(saved, channel)! <= saved.total,
        )
      )
        throw new Error(t("The exact recipient counts are unavailable. Nothing has been started."));
      setList(saved);
      if (selectedChannels.some((item) => !contactCount(saved, item))) {
        setError(t("No selected company has a contact for this channel. Choose another channel."));
        return;
      }
      await prepare(saved);
    });
  }
  async function prepare(list: SavedList) {
    const targetCount = selectedChannels.reduce(
      (total, item) => total + contactCount(list, item)!,
      0,
    );
    const wasUnverified = Boolean(draftRequest.current);
    const input: AgentToolInputMap["campaign.draft.prepare"] = draftRequest.current ?? {
      listId: list.listId,
      expectedListUpdatedAt: list.expectedUpdatedAt!,
      expectedAudienceCount: list.total,
      expectedTargetCount: targetCount,
      channels: selectedChannels,
      ...(hasLinkedin ? { linkedinInviteNote: linkedinNote } : {}),
      name: name.trim(),
      ...(hasEmail
        ? {
            gmailSubject: emailSubject.trim(),
            gmailRecipientConsentConfirmed: true as const,
            mailboxIds: [mailboxId],
          }
        : {}),
      ...(hasSms ? { smsBody: smsBody.trim() } : {}),
      messageVariants,
      dailyCap,
      pacingSeconds: 60,
      onlyNewChats: true,
      skipPreviouslyMessaged: true,
      idempotencyKey: draftKey.current,
    };
    draftRequest.current = input;
    const response = await bridge.callTool("campaign_draft_prepare", input);
    if (
      !wasUnverified &&
      mutationRejected(response, [
        "channel_unavailable",
        "company_audience_required",
        "invalid_input",
        "invalid_linkedin_note",
      ])
    )
      draftRequest.current = null;
    const result = readData<Draft>(response);
    if (
      result.listId !== list.listId ||
      JSON.stringify([...(result.channels || [result.channel])].sort()) !==
        JSON.stringify([...selectedChannels].sort()) ||
      (hasLinkedin && result.linkedinInviteNote !== linkedinNote) ||
      !Number.isSafeInteger(result.targetCount) ||
      result.targetCount < 0 ||
      result.targetCount > targetCount ||
      (hasEmail &&
        (result.gmailSubject !== input.gmailSubject ||
          result.gmailRecipientConsentConfirmed !== true ||
          JSON.stringify(result.mailboxIds) !== JSON.stringify(input.mailboxIds))) ||
      (hasSms && result.smsBody !== input.smsBody) ||
      result.audienceCount !== list.total ||
      result.status !== "Draft" ||
      result.enabled !== false ||
      JSON.stringify(result.messageVariants) !== JSON.stringify(messageVariants) ||
      result.name !== name.trim() ||
      result.dailyCap !== dailyCap ||
      result.pacingSeconds !== 60 ||
      result.onlyNewChats !== true ||
      result.skipPreviouslyMessaged !== true
    )
      throw new Error(t("The draft did not match your review. Nothing has been started."));
    setDraft(result);
    onReviewReady();
    void bridge
      .updateModelContext({
        content: [
          {
            type: "text",
            text: "The user created and reviewed a disabled campaign draft. This is context only; they have not clicked Start campaign.",
          },
        ],
        structuredContent: { type: "dmfaster.company_outreach_draft", draft: result },
      })
      .catch(() => {});
  }
  async function start() {
    if (!draft || !draft.targetCount) return;
    await act(async () => {
      // Preserve an uncertain launch's exact authorization and key. The server
      // handles replay; never submit another command after a lost response.
      if (!launchRequest.current) {
        const ready = readData<AgentToolDataMap["campaign.launch.preflight"]>(
          await bridge.callTool("campaign_launch_preflight", {
            campaignId: draft.campaignId,
            idempotencyKey: launchKey.current,
          }),
        );
        if (ready.status === "setup_required") {
          setNextLink({ url: ready.setup.setupUrl, label: "Connect sending browser" });
          setError(ready.setup.message);
          return;
        }
        const auth = ready.authorization;
        if (
          auth.campaignId !== draft.campaignId ||
          auth.commandId !== launchKey.current ||
          auth.action !== "campaign.launch" ||
          Date.parse(auth.snapshot.campaignUpdatedAt) !== Date.parse(draft.campaignUpdatedAt) ||
          auth.snapshot.targetListId !== draft.listId ||
          auth.snapshot.targetCount !== draft.targetCount ||
          JSON.stringify([...auth.snapshot.channels].sort()) !==
            JSON.stringify([...selectedChannels].sort())
        )
          throw new Error(t("The campaign changed. Review it again before starting."));
        if (ready.status === "approval_required") {
          setNextLink({ url: ready.approvalUrl, label: "Review account approval" });
          return;
        }
        if (ready.status !== "ready") throw new Error(t("The campaign is not ready to start."));
        launchRequest.current = {
          campaignId: draft.campaignId,
          authorizationId: auth.id,
          idempotencyKey: launchKey.current,
        };
      }
      const result = readData<Launch>(
        await bridge.callTool("campaign_launch", launchRequest.current),
      );
      if (
        result.campaign.campaignId !== draft.campaignId ||
        result.action !== "campaign.launch" ||
        result.idempotencyKey !== launchKey.current ||
        result.authorizationId !== launchRequest.current.authorizationId
      )
        throw new Error(
          t("The launch response could not be verified. Check this campaign in chat."),
        );
      setLaunch(result);
      onLaunched();
      void bridge
        .updateModelContext({
          content: [
            {
              type: "text",
              text: "The user explicitly clicked Start campaign. The server returned the attached launch result. Do not launch again or infer confirmed delivery from activation.",
            },
          ],
          structuredContent: { type: "dmfaster.company_outreach_launch", result },
        })
        .catch(() => {});
    });
  }
  const frozen = navigationLocked || Boolean(launch);

  const contactRows = list?.companies || [];
  const recipients = (
    <details className="outreach-audience">
      <summary>
        <span className="outreach-logo-stack">
          {companies.slice(0, 3).map((company) => (
            <CompanyLogo key={identity(company)} company={company} />
          ))}
        </span>
        <span className="outreach-audience-copy">
          <strong>{t("{count} selected companies", { count: companies.length })}</strong>
          <span>
            {draft
              ? t("{count} delivery targets", { count: draft.targetCount })
              : t("Your selected audience")}
          </span>
        </span>
        <ChevronDown size={16} aria-hidden="true" />
      </summary>
      <ul>
        {(contactRows.length ? contactRows : companies).map((item, index) => {
          const company = record(item);
          const contact = selectedChannels
            .map((channel) =>
              text(
                company[
                  channel === "instagram"
                    ? "instagramHandle"
                    : channel === "facebook"
                      ? "facebookHandle"
                      : channel === "linkedin"
                        ? "linkedinProfileUrl"
                        : channel === "gmail"
                          ? "emailAddress"
                          : "phoneNumber"
                ],
              ),
            )
            .filter(Boolean)
            .join(" · ");
          return (
            <li key={index}>
              <span>{text(company.name)}</span>
              {list ? <small>{contact || t("No contact for this channel")}</small> : null}
            </li>
          );
        })}
      </ul>
    </details>
  );
  return (
    <section className="company-outreach" aria-label={t("New campaign")} aria-busy={busy}>
      {recipients}
      {!showReview ? (
        <>
          <fieldset className="outreach-channel-field" disabled={frozen}>
            <legend>{t("Sending channels")}</legend>
            <div className="outreach-channels">
              {visibleChannels.map((c) => {
                const ChannelIcon = channelIcons[c.id];
                return (
                  <label
                    key={c.id}
                    className="outreach-channel"
                    data-selected={selectedChannels.includes(c.id)}
                  >
                    <input
                      type="checkbox"
                      name="outreach-channel"
                      value={c.id}
                      checked={selectedChannels.includes(c.id)}
                      onChange={() => {
                        invalidateDraft();
                        setSelectedChannels((current) =>
                          channels
                            .filter((item) =>
                              item.id === c.id
                                ? !current.includes(item.id)
                                : current.includes(item.id),
                            )
                            .map((item) => item.id),
                        );
                      }}
                      aria-label={t(c.label)}
                    />
                    {selectedChannels.includes(c.id) ? (
                      <Check className="outreach-channel-check" size={14} aria-hidden="true" />
                    ) : null}
                    <ChannelIcon className={`outreach-channel-icon outreach-icon-${c.id}`} />
                    <span>{t(c.label)}</span>
                    {list ? (
                      <small>
                        {t("{count} contacts", { count: contactCount(list, c.id) ?? 0 })}
                      </small>
                    ) : null}
                  </label>
                );
              })}
            </div>
          </fieldset>
          {sendersError ? (
            <p role="status" className="workspace-muted">
              {sendersError}{" "}
              <Button
                variant="link"
                size="sm"
                disabled={frozen}
                onClick={() => setSenderRead((value) => value + 1)}
              >
                {t("Retry channel setup")}
              </Button>
            </p>
          ) : !senders ? (
            <p role="status" className="workspace-muted">
              {t("Checking email and SMS setup…")}
            </p>
          ) : null}
          {hasEmail ? (
            <div className="outreach-email-settings">
              <label htmlFor="outreach-mailbox">{t("Send email from")}</label>
              <select
                id="outreach-mailbox"
                value={mailboxId}
                disabled={frozen}
                onChange={(event) => {
                  invalidateDraft();
                  setMailboxId(event.target.value);
                }}
              >
                <option value="">{t("Choose a connected mailbox")}</option>
                {mailboxes.map((mailbox) => (
                  <option key={mailbox.id} value={mailbox.id}>
                    {mailbox.emailAddress}
                  </option>
                ))}
              </select>
              <label htmlFor="outreach-email-subject">{t("Email subject")}</label>
              <Input
                id="outreach-email-subject"
                value={emailSubject}
                maxLength={500}
                disabled={frozen}
                onChange={(event) => {
                  invalidateDraft();
                  setEmailSubject(event.target.value);
                }}
              />
              <label className="outreach-email-consent">
                <input
                  type="checkbox"
                  checked={emailConsent}
                  disabled={frozen}
                  onChange={(event) => {
                    invalidateDraft();
                    setEmailConsent(event.target.checked);
                  }}
                />
                {t("I have permission to email these recipients.")}
              </label>
            </div>
          ) : null}
          {hasSms ? (
            <p className="workspace-muted">
              {t("SMS sender: {phone}", { phone: senders!.sms!.phoneNumber })}
            </p>
          ) : null}
          {[
            ...(hasDirectMessage
              ? bodies.map((body, index) => ({
                  id: `message-${index}`,
                  variationIndex: index,
                  label:
                    bodies.length === 1 ? t("Message") : t("Message {count}", { count: index + 1 }),
                  value: body,
                  set: (value: string) =>
                    setBodies((current) =>
                      current.map((item, position) => (position === index ? value : item)),
                    ),
                  limit: 1000,
                  icons: selectedChannels.filter((item) =>
                    ["instagram", "facebook", "gmail"].includes(item),
                  ),
                }))
              : []),
            ...(hasSms
              ? [
                  {
                    id: "sms",
                    variationIndex: null,
                    label: t("SMS message"),
                    value: smsBody,
                    set: setSmsBody,
                    limit: 1600,
                    icons: ["sms" as Channel],
                  },
                ]
              : []),
            ...(hasLinkedin
              ? [
                  {
                    id: "linkedin",
                    variationIndex: null,
                    label: t("Invitation note"),
                    value: linkedinNote,
                    set: setLinkedinNote,
                    limit: 300,
                    icons: ["linkedin" as Channel],
                  },
                ]
              : []),
          ].map((editor) => (
            <div className="outreach-composer" key={editor.id}>
              <div className="outreach-composer-label">
                <label htmlFor={`outreach-${editor.id}`}>
                  {editor.icons.map((item) => {
                    const Icon = channelIcons[item];
                    return (
                      <Icon key={item} className={`outreach-channel-icon outreach-icon-${item}`} />
                    );
                  })}
                  {editor.label}
                </label>
                <div className="outreach-composer-actions">
                  <span>
                    {editor.value.length}/{editor.limit}
                  </span>
                  {editor.variationIndex !== null && bodies.length > 1 ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="outreach-remove-variation"
                      aria-label={t("Remove variation {count}", {
                        count: editor.variationIndex + 1,
                      })}
                      title={t("Remove variation {count}", { count: editor.variationIndex + 1 })}
                      disabled={frozen}
                      onClick={() => {
                        invalidateDraft();
                        setBodies((current) =>
                          current.length > 1
                            ? current.filter((_, index) => index !== editor.variationIndex)
                            : current,
                        );
                      }}
                    >
                      <Trash2 size={16} aria-hidden="true" />
                    </Button>
                  ) : null}
                </div>
              </div>
              <Textarea
                id={`outreach-${editor.id}`}
                value={editor.value}
                rows={editor.id === "linkedin" ? 3 : 5}
                maxLength={editor.limit}
                disabled={frozen}
                placeholder={t(
                  editor.id === "linkedin"
                    ? "Write your connection invitation…"
                    : "Write a message that starts a conversation…",
                )}
                onChange={(event) => {
                  invalidateDraft();
                  editor.set(event.target.value);
                }}
              />
            </div>
          ))}
          {hasDirectMessage ? (
            <div className="outreach-variant-actions">
              {bodies.length < 4 ? (
                <Button
                  type="button"
                  variant="link"
                  size="sm"
                  className="workspace-link"
                  disabled={frozen}
                  onClick={() => {
                    invalidateDraft();
                    setBodies((current) => (current.length < 4 ? [...current, ""] : current));
                  }}
                >
                  <Plus size={14} aria-hidden="true" />
                  {t("Add variation")}
                </Button>
              ) : null}
            </div>
          ) : null}
          <details className="outreach-settings">
            <summary>
              <Settings2 size={16} aria-hidden="true" />
              <span>{t("Sending rules")}</span>
              <small>{t("{count} per day", { count: dailyCap })}</small>
              <ChevronDown size={16} aria-hidden="true" />
            </summary>
            <div className="outreach-settings-fields">
              <label>
                {t("Campaign name")}
                <Input
                  value={name}
                  maxLength={120}
                  disabled={frozen}
                  onChange={(e) => {
                    invalidateDraft();
                    setName(e.target.value);
                  }}
                />
              </label>
              <label>
                {t("Daily limit")}
                <Input
                  type="number"
                  min={1}
                  max={60}
                  value={dailyCap}
                  disabled={frozen}
                  onChange={(e) => {
                    invalidateDraft();
                    setDailyCap(Number(e.target.value));
                  }}
                />
              </label>
              <p className="workspace-muted">
                {t(
                  "At least 60 seconds between attempts. Previously contacted companies are skipped.",
                )}
              </p>
            </div>
          </details>
          <p className="outreach-reassurance">
            <ShieldCheck size={15} aria-hidden="true" />
            {t("Nothing sends until you start the campaign.")}
          </p>
        </>
      ) : (
        <>
          {selectedChannels.map((channel) => {
            const Icon = channelIcons[channel];
            return (
              <section
                key={channel}
                className="outreach-review-message"
                aria-label={t(channels.find((item) => item.id === channel)!.label)}
              >
                <header>
                  <Icon className={`outreach-channel-icon outreach-icon-${channel}`} />
                  <strong>{t(channels.find((item) => item.id === channel)!.label)}</strong>
                  <span>{t("{count} contacts", { count: contactCount(list!, channel) ?? 0 })}</span>
                </header>
                {channel === "gmail" ? (
                  <p>
                    {t("From")}:{" "}
                    {mailboxes.find((mailbox) => mailbox.id === mailboxId)?.emailAddress}
                    <br />
                    {t("Subject")}: {draft!.gmailSubject}
                  </p>
                ) : null}
                {channel === "sms" ? (
                  <p>{t("SMS sender: {phone}", { phone: senders!.sms!.phoneNumber })}</p>
                ) : null}
                {(channel === "linkedin"
                  ? [linkedinNote]
                  : channel === "sms"
                    ? [draft!.smsBody!]
                    : bodies
                ).map((body, index) => (
                  <div key={index}>
                    {channel !== "linkedin" && channel !== "sms" && bodies.length > 1 ? (
                      <small className="outreach-variant-label">
                        {t("Message {count}", { count: index + 1 })}
                      </small>
                    ) : null}
                    <blockquote>{body}</blockquote>
                  </div>
                ))}
              </section>
            );
          })}
          <dl className="outreach-review-rules">
            <div>
              <dt>{t("Campaign name")}</dt>
              <dd>{draft!.name}</dd>
            </div>
            <div>
              <dt>{t("Daily limit")}</dt>
              <dd>{t("{count} per day", { count: draft!.dailyCap })}</dd>
            </div>
            <div>
              <dt>{t("Pacing")}</dt>
              <dd>{t("At least 60 seconds")}</dd>
            </div>
            <div>
              <dt>{t("Previously contacted")}</dt>
              <dd>{t("Skipped")}</dd>
            </div>
          </dl>
          <p className="outreach-coverage">
            <Users size={16} aria-hidden="true" />
            {t("{targets} delivery targets · {companies} selected companies", {
              targets: draft!.targetCount,
              companies: companies.length,
            })}
          </p>
          {launch ? (
            <div className="outreach-success" role="status">
              <CircleCheck size={22} aria-hidden="true" />
              <div>
                <strong>
                  {t("Status")}: {launch.campaign.campaignStatus}
                </strong>
                <p>
                  {launch.campaign.deliveryNotice ||
                    t(
                      "Delivery progress appears in Campaigns. Starting is not confirmation that messages were delivered.",
                    )}
                </p>
              </div>
            </div>
          ) : null}
        </>
      )}
      {error ? (
        <p role="alert" className="company-error">
          {t(error)}
        </p>
      ) : null}
      {!launch ? (
        <footer className="outreach-footer">
          {showReview ? (
            <>
              {nextLink ? (
                <Button
                  variant="outline"
                  className="workspace-button"
                  disabled={busy || !bridge.canOpenLinks()}
                  onClick={() =>
                    void act(async () => {
                      await bridge.openLink(nextLink.url);
                    })
                  }
                >
                  {t(nextLink.label)}
                </Button>
              ) : null}
              <Button
                className="outreach-primary"
                disabled={busy || !bridge.canCallTools() || !draft!.targetCount}
                onClick={() => void start()}
              >
                <Send size={16} aria-hidden="true" />
                {t(
                  busy
                    ? "Starting…"
                    : launchRequest.current
                      ? "Check launch result"
                      : "Start campaign",
                )}
              </Button>
              {!launchRequest.current ? (
                <Button
                  variant="link"
                  size="sm"
                  className="workspace-link"
                  disabled={busy}
                  onClick={onEdit}
                >
                  {t("Edit message or channel")}
                </Button>
              ) : null}
            </>
          ) : (
            <Button
              className="outreach-primary"
              disabled={busy || !valid || !bridge.canCallTools()}
              onClick={() => void review()}
            >
              {t(busy ? "Preparing review…" : "Review campaign")}
              <ArrowRight size={16} aria-hidden="true" />
            </Button>
          )}
        </footer>
      ) : null}
    </section>
  );
}
