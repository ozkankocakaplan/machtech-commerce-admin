import { cva, type VariantProps } from "cva"
import { Slot } from "radix-ui"
import * as React from "react"

import { clx } from "@/utils/clx"
import { Spinner } from "@medusajs/icons"

const buttonVariants = cva({
  base: clx(
    "relative inline-flex w-fit items-center justify-center overflow-hidden rounded-xl outline-none",
    "font-medium transition-all duration-300 ease-out",
    "transform-gpu will-change-transform",
    "hover:scale-[1.02] active:scale-[0.98]",
    "focus-visible:ring-[3px] focus-visible:ring-opacity-20",
    "disabled:transform-none disabled:bg-ui-bg-disabled disabled:border-ui-border-base disabled:text-ui-fg-disabled disabled:shadow-none disabled:after:hidden disabled:cursor-not-allowed disabled:opacity-50",
    "after:absolute after:inset-0 after:content-[''] after:transition-all after:duration-300"
  ),
  variants: {
    variant: {
      primary: clx(
        "shadow-[0_2px_8px_rgba(147,51,234,0.3)] text-white bg-[#9333ea] after:hidden",
        "hover:bg-[#a855f7] hover:shadow-[0_4px_12px_rgba(147,51,234,0.4)]",
        "active:bg-[#7e22ce] active:shadow-[0_1px_4px_rgba(147,51,234,0.3)]",
        "focus-visible:!shadow-[0_4px_16px_rgba(147,51,234,0.5)] focus-visible:ring-[#9333ea]"
      ),
      secondary: clx(
        "shadow-[0_1px_4px_rgba(0,0,0,0.08)] text-ui-fg-base bg-ui-button-neutral after:button-neutral-gradient",
        "hover:bg-ui-button-neutral-hover hover:shadow-[0_2px_8px_rgba(0,0,0,0.12)] hover:after:button-neutral-hover-gradient",
        "active:bg-ui-button-neutral-pressed active:shadow-[0_1px_2px_rgba(0,0,0,0.08)] active:after:button-neutral-pressed-gradient",
        "focus-visible:shadow-[0_4px_12px_rgba(0,0,0,0.12)] focus-visible:ring-ui-border-interactive"
      ),
      transparent: clx(
        "after:hidden",
        "text-ui-fg-base bg-ui-button-transparent",
        "hover:bg-ui-button-transparent-hover hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)]",
        "active:bg-ui-button-transparent-pressed active:shadow-none",
        "focus-visible:shadow-[0_2px_8px_rgba(0,0,0,0.08)] focus-visible:bg-ui-bg-base focus-visible:ring-ui-border-interactive",
        "disabled:!bg-transparent disabled:!shadow-none"
      ),
      danger: clx(
        "shadow-[0_2px_8px_rgba(220,38,38,0.2)] text-ui-fg-on-color bg-ui-button-danger after:button-danger-gradient",
        "hover:bg-ui-button-danger-hover hover:shadow-[0_4px_12px_rgba(220,38,38,0.25)] hover:after:button-danger-hover-gradient",
        "active:bg-ui-button-danger-pressed active:shadow-[0_1px_4px_rgba(220,38,38,0.2)] active:after:button-danger-pressed-gradient",
        "focus-visible:shadow-[0_4px_16px_rgba(220,38,38,0.3)] focus-visible:ring-ui-border-error"
      ),
    },
    size: {
      small: "txt-compact-small-plus gap-x-1.5 px-3 py-1.5",
      base: "txt-compact-small-plus gap-x-2 px-4 py-2",
      large: "txt-compact-medium-plus gap-x-2 px-5 py-3",
      xlarge: "txt-compact-large-plus gap-x-2.5 px-6 py-4",
    },
  },
  defaultVariants: {
    size: "base",
    variant: "primary",
  },
})

interface ButtonProps
  extends React.ComponentPropsWithoutRef<"button">,
  VariantProps<typeof buttonVariants> {
  isLoading?: boolean
  asChild?: boolean
}

/**
 * This component is based on the `button` element and supports all of its props
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      /**
       * The button's style.
       */
      variant = "primary",
      /**
       * The button's size.
       */
      size = "base",
      className,
      /**
       * Whether to remove the wrapper `button` element and use the
       * passed child element instead.
       */
      asChild = false,
      children,
      /**
       * Whether to show a loading spinner.
       */
      isLoading = false,
      disabled,
      ...props
    }: ButtonProps,
    ref
  ) => {
    const Component = asChild ? Slot.Root : "button"

    /**
     * In the case of a button where asChild is true, and isLoading is true, we ensure that
     * only on element is passed as a child to the Slot component. This is because the Slot
     * component only accepts a single child.
     */
    const renderInner = () => {
      if (isLoading) {
        return (
          <span className="relative inline-flex items-center justify-center">
            <span className="opacity-0">{children}</span>
            <span className="absolute inset-0 flex items-center justify-center">
              <Spinner className="h-4 w-4 animate-spin text-current" />
            </span>
          </span>
        )
      }

      return children
    }

    return (
      <Component
        ref={ref}
        {...props}
        className={clx(buttonVariants({ variant, size }), className)}
        disabled={disabled || isLoading}
      >
        {renderInner()}
      </Component>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
