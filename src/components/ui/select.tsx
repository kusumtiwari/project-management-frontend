import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type SelectProps = React.ComponentProps<typeof SelectPrimitive.Root>;
type TriggerProps = React.ComponentProps<typeof SelectPrimitive.Trigger> & { size?: "sm" | "default" };
type ContentProps = React.ComponentProps<typeof SelectPrimitive.Content> & { position?: "popper" | "item-aligned" };
type ItemProps = React.ComponentProps<typeof SelectPrimitive.Item>;

// Root
export const Select: React.FC<SelectProps> = (props) => {
  return <SelectPrimitive.Root {...props} />;
};

// Group
export const SelectGroup: React.FC<React.ComponentProps<typeof SelectPrimitive.Group>> = (props) => {
  return <SelectPrimitive.Group {...props} />;
};

// Value
export const SelectValue: React.FC<React.ComponentProps<typeof SelectPrimitive.Value>> = (props) => {
  return <SelectPrimitive.Value {...props} />;
};

// Trigger
export const SelectTrigger: React.FC<TriggerProps> = ({ size = "default", children, className, ...props }) => {
  return (
    <SelectPrimitive.Trigger
      className={cn(
        "flex w-fit items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring transition",
        size === "sm" ? "h-8" : "h-9",
        className
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDownIcon className="w-4 h-4 opacity-50" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
};

// Content
export const SelectContent: React.FC<ContentProps> = ({ children, position = "popper", className, ...props }) => {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        position={position}
        className={cn(
          "bg-popover rounded-md border shadow-md overflow-auto z-50",
          className
        )}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport className="p-1">{children}</SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
};

// Label
export const SelectLabel: React.FC<React.ComponentProps<typeof SelectPrimitive.Label>> = ({ className, ...props }) => (
  <SelectPrimitive.Label className={cn("text-xs text-muted-foreground px-2 py-1.5", className)} {...props} />
);

// Item
export const SelectItem: React.FC<ItemProps> = ({ children, className, ...props }) => (
  <SelectPrimitive.Item
    className={cn(
      "relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none select-none focus:bg-accent focus:text-accent-foreground data-[disabled]:opacity-50 data-[disabled]:pointer-events-none",
      className
    )}
    {...props}
  >
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    <SelectPrimitive.ItemIndicator className="absolute right-2 flex items-center justify-center">
      <CheckIcon className="w-4 h-4" />
    </SelectPrimitive.ItemIndicator>
  </SelectPrimitive.Item>
);

// Separator
export const SelectSeparator: React.FC<React.ComponentProps<typeof SelectPrimitive.Separator>> = (props) => (
  <SelectPrimitive.Separator className="h-px bg-border my-1" {...props} />
);

// Scroll Buttons
export const SelectScrollUpButton: React.FC<React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>> = (props) => (
  <SelectPrimitive.ScrollUpButton className="flex items-center justify-center py-1" {...props}>
    <ChevronUpIcon className="w-4 h-4" />
  </SelectPrimitive.ScrollUpButton>
);

export const SelectScrollDownButton: React.FC<React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>> = (props) => (
  <SelectPrimitive.ScrollDownButton className="flex items-center justify-center py-1" {...props}>
    <ChevronDownIcon className="w-4 h-4" />
  </SelectPrimitive.ScrollDownButton>
);
