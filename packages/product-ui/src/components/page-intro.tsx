import type { ReactNode } from "react";

export function PageIntro({
  eyebrow,
  title,
  body,
  actions,
}: {
  eyebrow?: string;
  title: string;
  body?: string;
  actions?: ReactNode;
}) {
  const visibleEyebrow = eyebrow?.trim() !== title.trim() ? eyebrow : undefined;
  return (
    <header data-slot="page-intro">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between lg:gap-4">
        <div className="max-w-3xl">
          {visibleEyebrow ? (
            <p className="hidden text-xs font-medium text-muted-foreground lg:block">
              {visibleEyebrow}
            </p>
          ) : null}
          <h1
            className={`${visibleEyebrow ? "lg:mt-1.5 " : ""}text-2xl font-semibold leading-tight tracking-tight text-foreground`}
          >
            {title}
          </h1>
          {body ? (
            <p className="mt-1.5 max-w-[48rem] text-sm leading-5 text-muted-foreground lg:mt-2 lg:text-[0.9375rem] lg:leading-6">
              {body}
            </p>
          ) : null}
        </div>
        {actions ? (
          <div className="flex w-full flex-wrap items-center gap-2 lg:w-auto lg:shrink-0 lg:justify-end">
            {actions}
          </div>
        ) : null}
      </div>
    </header>
  );
}
