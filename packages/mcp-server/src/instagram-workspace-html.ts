import {
  INSTAGRAM_WORKSPACE_APP_JAVASCRIPT,
  INSTAGRAM_WORKSPACE_APP_CSS,
} from "./instagram-workspace-assets.generated.ts";

export const INSTAGRAM_WORKSPACE_HTML = `<!doctype html><html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Instagram prospecting</title><style>${INSTAGRAM_WORKSPACE_APP_CSS}</style>
</head><body><div id="root" aria-live="polite"></div><script>${INSTAGRAM_WORKSPACE_APP_JAVASCRIPT}</script></body></html>`;
