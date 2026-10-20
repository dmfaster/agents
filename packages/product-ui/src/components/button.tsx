import * as React from "react";
import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";

const buttonStyles = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-colors outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-xs hover:bg-[color-mix(in_oklch,var(--primary),var(--background)_14%)]",
        outline:
          "border-input bg-card text-foreground shadow-xs hover:bg-muted aria-expanded:bg-muted",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
        ghost: "text-foreground hover:bg-muted aria-expanded:bg-muted",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",
        "destructive-solid":
          "bg-destructive-solid text-on-solid hover:bg-destructive-solid/90 focus-visible:ring-destructive/30",
        brand: "bg-brand-solid text-brand-foreground hover:bg-brand-hover",
        info: "bg-info-solid text-on-solid hover:bg-info-solid/90",
        success: "bg-success-solid text-on-solid hover:bg-success-solid/90",
        "list-row":
          "justify-start rounded-none border-b border-border bg-card text-foreground hover:bg-muted/60 aria-pressed:bg-brand-soft",
        conversation:
          "justify-start rounded-lg bg-card text-foreground hover:bg-muted/60 aria-pressed:bg-brand-soft",
        warning: "border-warning/20 bg-warning-soft text-warning hover:bg-warning/20",
        link: "text-primary underline-offset-4 hover:underline",
        text: "text-foreground hover:underline underline-offset-4",
      },
      size: {
        default:
          "h-11 gap-2 px-4 lg:h-10 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
        xs: "h-11 gap-1 px-2 text-xs lg:h-7 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-11 gap-1.5 px-3 text-sm lg:h-8 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-12 gap-2 px-5",
        compact: "min-h-11 gap-1.5 px-3 text-xs lg:min-h-8",
        row: "h-auto min-h-11 w-full justify-start gap-3 whitespace-normal px-4 py-3 text-left",
        label: "h-auto min-h-11 max-w-full justify-start p-0 text-left font-semibold lg:min-h-6",
        icon: "size-11 lg:size-8",
        "icon-xs": "size-11 lg:size-7 [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-11 lg:size-8 [&_svg:not([class*='size-'])]:size-3.5",
        "icon-lg": "size-11 lg:size-10",
        "icon-touch": "size-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

// Native-anchor compositions need the same resolved classes as Button.
function buttonVariants(options?: Parameters<typeof buttonStyles>[0]) {
  return cn(buttonStyles(options));
}

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={buttonVariants({ variant, size, className })}
      {...props}
    />
  );
}

export { Button, buttonVariants };
