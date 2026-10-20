import type { ComponentProps, CSSProperties } from "react";
import { cn } from "cn";

/** Single-value controls retain the browser's keyboard, touch and form behavior. */
export function NativeSlider({
  className,
  style,
  value,
  min = 0,
  max = 100,
  ...props
}: Omit<ComponentProps<"input">, "type" | "value" | "defaultValue" | "min" | "max"> & {
  value: number;
  min?: number;
  max?: number;
}) {
  const progress = max > min ? Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100)) : 0;
  return (
    <input
      {...props}
      type="range"
      data-slot="native-slider"
      min={min}
      max={max}
      value={value}
      style={{ "--slider-progress": `${progress}%`, ...style } as CSSProperties}
      className={cn(
        "m-0 block h-11 w-full min-w-0 cursor-pointer appearance-none bg-transparent outline-none disabled:cursor-default disabled:opacity-50",
        "[&::-webkit-slider-runnable-track]:h-1 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-[linear-gradient(to_right,var(--primary)_var(--slider-progress),var(--muted)_var(--slider-progress))]",
        "[&::-webkit-slider-thumb]:-mt-1 [&::-webkit-slider-thumb]:size-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-ring [&::-webkit-slider-thumb]:bg-background",
        "[&::-moz-range-track]:h-1 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-muted [&::-moz-range-progress]:h-1 [&::-moz-range-progress]:rounded-full [&::-moz-range-progress]:bg-primary",
        "[&::-moz-range-thumb]:size-3 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border [&::-moz-range-thumb]:border-ring [&::-moz-range-thumb]:bg-background",
        "focus-visible:[&::-webkit-slider-thumb]:ring-3 focus-visible:[&::-webkit-slider-thumb]:ring-ring/50 focus-visible:[&::-moz-range-thumb]:ring-3 focus-visible:[&::-moz-range-thumb]:ring-ring/50",
        className,
      )}
    />
  );
}
