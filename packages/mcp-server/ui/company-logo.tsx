import { useState, type CSSProperties } from "react";
import { text, websiteLabel } from "./companies-data.ts";

// The app uses the same public favicon source behind its signed-in logo proxy.
// MCP images cannot depend on the app's browser cookies.
export function companyLogoSource(company: { websiteUrl?: unknown }) {
  const domain = websiteLabel(company.websiteUrl);
  if (!domain) return "";
  const url = new URL("https://www.google.com/s2/favicons");
  url.searchParams.set("domain_url", `https://${domain}`);
  url.searchParams.set("sz", "128");
  return url.href;
}

export function CompanyLogo({
  company,
  large = false,
}: {
  company: { name: string; websiteUrl?: unknown };
  large?: boolean;
}) {
  const source = companyLogoSource(company);
  const [failedSource, setFailedSource] = useState("");
  const [loadedSource, setLoadedSource] = useState("");
  const name = text(company.name);
  const initials =
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => Array.from(word)[0])
      .join("")
      .toUpperCase() || "?";
  const hue = Array.from(name).reduce((sum, letter) => sum + (letter.codePointAt(0) ?? 0), 0) % 360;
  return (
    <span
      className={`company-logo${large ? " company-logo-large" : ""}`}
      style={{ "--company-logo-hue": hue } as CSSProperties}
      aria-hidden="true"
    >
      <span>{initials}</span>
      {source && source !== failedSource ? (
        <img
          src={source}
          alt=""
          loading={large ? "eager" : "lazy"}
          decoding="async"
          referrerPolicy="no-referrer"
          style={{ opacity: loadedSource === source ? 1 : 0 }}
          onLoad={() => setLoadedSource(source)}
          onError={() => setFailedSource(source)}
        />
      ) : null}
    </span>
  );
}
