"use client"

import { Eye, EyeSlash, MagnifyingGlassMini } from "@medusajs/icons"
import { VariantProps, cva } from "cva"
import * as React from "react"

import { clx } from "@/utils/clx"

const inputBaseStyles = clx(
  "caret-ui-fg-base bg-ui-bg-field hover:bg-ui-bg-field-hover text-ui-fg-base placeholder-ui-fg-muted",
  "relative w-full appearance-none rounded-xl outline-none",
  "border border-ui-border-base transition-all duration-300 ease-out",
  "hover:border-ui-border-interactive hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)] hover:bg-ui-bg-base",
  "focus-visible:border-ui-border-interactive focus-visible:ring-[3px] focus-visible:ring-ui-border-interactive focus-visible:ring-opacity-20 focus-visible:shadow-[0_4px_12px_rgba(0,0,0,0.1)] focus-visible:bg-ui-bg-base",
  "disabled:text-ui-fg-disabled disabled:!bg-ui-bg-disabled disabled:placeholder-ui-fg-disabled disabled:cursor-not-allowed disabled:border-ui-border-disabled disabled:opacity-50 disabled:hover:shadow-none",
  "aria-[invalid=true]:border-ui-border-error aria-[invalid=true]:ring-[3px] aria-[invalid=true]:ring-ui-border-error aria-[invalid=true]:ring-opacity-20 invalid:border-ui-border-error invalid:ring-[3px] invalid:ring-ui-border-error invalid:ring-opacity-20",
  "placeholder:transition-opacity placeholder:duration-200 focus-visible:placeholder:opacity-50"
)

const inputVariants = cva({
  base: clx(
    inputBaseStyles,
    "[&::--webkit-search-cancel-button]:hidden [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden"
  ),
  variants: {
    size: {
      base: "txt-compact-small h-10 px-4 py-2.5",
      small: "txt-compact-small h-8 px-3 py-2",
    },
  },
  defaultVariants: {
    size: "base",
  },
})

interface InputProps
  extends VariantProps<typeof inputVariants>,
  Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> { }

/**
 * This component is based on the `input` element and supports all of its props
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      /**
       * The input's size.
       */
      size = "base",
      ...props
    }: InputProps,
    ref
  ) => {
    const [typeState, setTypeState] = React.useState(type)

    const isPassword = type === "password"
    const isSearch = type === "search"

    return (
      <div className="relative">
        <input
          ref={ref}
          type={isPassword ? typeState : type}
          className={clx(
            inputVariants({ size: size }),
            {
              "pl-10": isSearch && size === "base",
              "pr-12": isPassword && size === "base",
              "pl-8": isSearch && size === "small",
              "pr-10": isPassword && size === "small",
            },
            className
          )}
          {...props}
        />
        {isSearch && (
          <div
            className={clx(
              "text-ui-fg-muted pointer-events-none absolute bottom-0 left-0 flex items-center justify-center transition-colors duration-200",
              {
                "h-10 w-10 pl-3": size === "base",
                "h-8 w-8 pl-2.5": size === "small",
              }
            )}
            role="img"
          >
            <MagnifyingGlassMini className="w-4 h-4" />
          </div>
        )}
        {isPassword && (
          <div
            className={clx(
              "absolute bottom-0 right-0 flex items-center justify-center border-l border-ui-border-base",
              {
                "h-10 w-12 pr-2": size === "base",
                "h-8 w-10 pr-1.5": size === "small",
              }
            )}
          >
            <button
              className="text-ui-fg-muted hover:text-ui-fg-base focus-visible:text-ui-fg-base focus-visible:ring-2 focus-visible:ring-ui-border-interactive focus-visible:ring-offset-1 active:text-ui-fg-base h-fit w-fit rounded-lg p-1.5 outline-none transition-all duration-200 hover:bg-ui-bg-subtle active:scale-95"
              type="button"
              onClick={() => {
                setTypeState(typeState === "password" ? "text" : "password")
              }}
            >
              <span className="sr-only">
                {typeState === "password" ? "Show password" : "Hide password"}
              </span>
              {typeState === "password" ? <Eye className="w-4 h-4" /> : <EyeSlash className="w-4 h-4" />}
            </button>
          </div>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input, inputBaseStyles }
