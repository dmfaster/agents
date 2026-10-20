"use client";
import * as React from "react";
import { useId } from "react";

export function InstagramIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="3 3 18 18" fill="none" className={className} aria-hidden="true">
      <rect x="5" y="5" width="14" height="14" rx="4" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="3.2" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="16.2" cy="7.8" r="1" fill="currentColor" />
    </svg>
  );
}

export function FacebookIcon({
  className = "h-4 w-4",
  monochrome = false,
}: {
  className?: string;
  monochrome?: boolean;
}) {
  return (
    <svg viewBox="2 2 20 20" fill="none" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="8" fill="currentColor" />
      <path
        d="M13.25 18v-5.2h1.75l.32-2.05h-2.07V9.42c0-.58.18-.98 1-.98h1.14V6.6c-.55-.08-1.1-.12-1.66-.12-1.65 0-2.78 1.02-2.78 2.86v1.41H9.08v2.05h1.87V18h2.3Z"
        fill={monochrome ? "var(--card)" : "white"}
      />
    </svg>
  );
}

export function LinkedInIcon({
  className = "h-4 w-4",
  monochrome = false,
}: {
  className?: string;
  monochrome?: boolean;
}) {
  return (
    <svg viewBox="3 3 18 18" fill="none" className={className} aria-hidden="true">
      <rect x="4.5" y="4.5" width="15" height="15" rx="3.2" fill="currentColor" />
      <path
        d="M8.15 10.25h2.1v6.1h-2.1v-6.1Zm1.05-2.9a1.18 1.18 0 1 1 0 2.36 1.18 1.18 0 0 1 0-2.36Zm2.35 2.9h2v.82c.32-.5.95-.98 1.98-.98 2.05 0 2.47 1.35 2.47 3.1v3.16h-2.1v-2.8c0-.65-.02-1.48-.9-1.48-.9 0-1.05.7-1.05 1.43v2.85h-2.4v-6.1Z"
        fill={monochrome ? "var(--card)" : "white"}
      />
    </svg>
  );
}

export function GmailIcon({ className = "h-4 w-4" }: { className?: string }) {
  const gradientId = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const sideGradientId = `gmail-side-${gradientId}`;
  const flapGradientId = `gmail-flap-${gradientId}`;

  return (
    <svg viewBox="0 0 192 192" fill="none" className={className} aria-hidden="true">
      <path
        fill={`url(#${sideGradientId})`}
        d="M146 44h38v110c0 6.627-5.373 12-12 12h-20a6 6 0 0 1-6-6z"
      />
      <path fill="#fc413d" d="M46 44H8v110c0 6.627 5.373 12 12 12h20a6 6 0 0 0 6-6z" />
      <path
        fill={`url(#${flapGradientId})`}
        d="M39.226 30.456c-8.033-6.752-20.018-5.714-26.77 2.319-6.752 8.032-5.714 20.017 2.319 26.77l76.078 63.949a8 8 0 0 0 10.295 0l76.078-63.95c8.032-6.752 9.07-18.737 2.318-26.77-6.752-8.032-18.737-9.07-26.769-2.318L96 78.18z"
      />
      <defs>
        <linearGradient
          id={sideGradientId}
          x1="165"
          x2="165"
          y1="44"
          y2="166"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#60d673" />
          <stop offset=".17" stopColor="#42c868" />
          <stop offset=".39" stopColor="#0ebc5f" />
          <stop offset=".62" stopColor="#00a9bb" />
          <stop offset=".86" stopColor="#3c90ff" />
          <stop offset="1" stopColor="#3186ff" />
        </linearGradient>
        <linearGradient
          id={flapGradientId}
          x1="8"
          x2="184"
          y1="46.13"
          y2="46.13"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset=".08" stopColor="#ff63a0" />
          <stop offset=".3" stopColor="#fc413d" />
          <stop offset=".5" stopColor="#fc413d" />
          <stop offset=".65" stopColor="#fc413d" />
          <stop offset=".72" stopColor="#fc5c30" />
          <stop offset=".86" stopColor="#feb10c" />
          <stop offset=".91" stopColor="#fec700" />
          <stop offset=".96" stopColor="#ffdb0f" />
        </linearGradient>
      </defs>
    </svg>
  );
}
