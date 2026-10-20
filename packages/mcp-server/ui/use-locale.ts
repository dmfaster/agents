import { useSyncExternalStore } from "react";
import { language } from "./locale.ts";

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
  window.addEventListener("openai:set_globals", onChange);
  window.addEventListener("languagechange", onChange);
  return () => {
    observer.disconnect();
    window.removeEventListener("openai:set_globals", onChange);
    window.removeEventListener("languagechange", onChange);
  };
}

// Re-render the mounted view without remounting it or repeating tool reads.
export function useLocale() {
  return useSyncExternalStore(subscribe, language, () => "en" as const);
}
