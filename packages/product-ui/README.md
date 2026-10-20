# DM Faster UI and registry

Product and Ops consume the same source-owned shadcn/Base UI components. Their canonical source is `src/components/`; `registry.json` at the repository root points directly to these files. Never maintain a second registry source tree.

## Local registry

From the repository root:

```sh
npm run ui:registry:build
npm run ui:registry:check
npm run ui:registry:dev
```

The development server binds only to loopback at `http://127.0.0.1:4629`. Configure a disposable consumer's `components.json` with:

```json
{
  "registries": {
    "@dmfaster": "http://127.0.0.1:4629/r/{name}.json"
  }
}
```

Install an individual item with `pnpm dlx shadcn@4.21.1 add @dmfaster/button`, or the complete family with `add @dmfaster/design-system`. Import the installed `dmfaster.css` once after Tailwind in the consumer stylesheet and configure the standard class-based dark variant. The CLI places this file under the consumer's configured UI alias, so the actual import path follows that consumer's directory layout.

The verification command validates the official schema and local dependency graph, builds payloads, starts an ephemeral loopback server, and performs an actual CLI install in an independent disposable project. It then checks all component exports with strict TypeScript, compiles Tailwind tokens, and bundles every component for the browser. Payloads, consumer dependencies and results stay under ignored `.local-ci/`. Nothing is hosted publicly by these commands.

## Development conventions

Read `tools/skills/shadcn/SKILL.md` and `docs/architecture/shadcn-adoption.md` before changing primitives. Run CLI `info`, then `docs` and fetch the returned documentation for components in use. Inspect `add --dry-run` and `--diff` before updates. Preserve our mobile sizing, menu links, tabs orientation/activation and focus contracts. Never run blanket overwrite or a preset application against the existing application.

Use component variants for appearance and `className` for composition and layout. Use semantic surface/status tokens; light/dark values belong in `src/styles/globals.css`. Forms compose Field/FieldGroup and shared controls. Input adornments compose InputGroup. Overlay Title components are required; Base UI owns scroll locking, keyboard dismissal and focus. Busy actions retain their existing pending guards and handlers.

Follow `docs/architecture/product-ui-design.md` for the owner’s visual quality standard, control sizes, typography, density and performance evidence. PageIntro is a portable registry item as well as a workspace export. Native links use `buttonVariants`; never narrow one axis of an icon control. A passing registry install verifies reuse and portability, while final design approval remains an owner review.

Labels explicitly target a control ID. Use React `useId` as a component prefix and include stable row keys for repeated fields; keep IDs identical during server rendering and hydration. Field disabled/invalid state mirrors the actual control. Use FieldSet/FieldLegend for semantic groups, and keep secondary actions outside FieldLabel. Checkbox and RadioGroup controls expose their visible accessible role while retaining hidden successful form controls; browser tests should query that role when testing interaction.

Button variants include semantic action/status treatments, flat list rows, and text actions. Sizes provide 44 px mobile targets with compact desktop sizing; `icon-touch` stays 44 px at every viewport and inherits its variant's foreground color. ToggleGroup supports segmented options, choice rows and media selection. Tables remain semantic markup, with pagination and virtualization owned by each app. Inbox and Assistant compose MessageScroller, Message, Bubble, Attachment and Marker; no screen should add another scrolling controller around the shared scroller.

NativeSlider is the registry foundation for a single media seek position. It preserves native range keyboard and touch behavior with a 44 px target and semantic track, thumb and focus colors. Use Slider for multiple values, including the two-ended campaign sending window. Keep accessible labels and formatted value text at each consumer.

Design for a clear hierarchy: the primary entity uses foreground text and semibold weight; supporting metadata uses muted text. A company name opening a profile composes Button's `text` variant and `label` size, while a complete clickable row uses `row`. Use `default` for the main action, `outline` for secondary actions or starting choices, and `ghost` for quiet utilities. Destructive confirmations retain destructive emphasis. Starting choices may include an icon and a short description, with an explicit accessible name when the description is separate.

Page headings name the current workspace concisely; an eyebrow adds context only when it says something different, such as an onboarding step. Dense Inbox, Company and canvas workspaces may use a compact header with an accessible h1. Put width, margin and responsive visibility on NativeSelect's `wrapperClassName`, so its icon remains aligned with the select. Keep status messages concise and actionable for the customer; server configuration details belong in operational diagnostics.

Confirmations use `useConfirmationDialog`, with the returned dialog mounted across all render paths. Preserve pending guards and explicit initial/final focus. `useNotificationDialog` handles acknowledgment requests. Toast uses Base UI's manager and interactive toast roles. Command uses the documented cmdk input/item composition exceptions; normal Base UI triggers use `render` and forward their ref and event props.

Internal imports between shared components are relative so both workspace imports and registry copies resolve without an app-only alias. New item dependencies must use `@dmfaster/item`, because a bare item name resolves to upstream shadcn. Add canonical source and explicit pinned runtime dependencies to root `registry.json`, then run the consumer verification.

Product navigation retains real anchors and `AppPrefetchLink` press behavior. Shared UI must not own workspace permissions, API requests, exact counts, business execution, pagination or virtualized data. Public publication follows the repository's explicit release approval policy.
