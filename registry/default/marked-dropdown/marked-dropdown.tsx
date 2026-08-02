"use client"

import { Menu } from "@base-ui/react/menu"
import {
  forwardRef,
  useState,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react"
import type {
  MenuCheckboxItemProps,
  MenuGroupLabelProps,
  MenuGroupProps,
  MenuItemProps,
  MenuPopupProps,
  MenuPositionerProps,
  MenuRadioItemProps,
  MenuTriggerProps,
} from "@base-ui/react/menu"

import type { CheezCharacter } from "../cheez-core/cheez-definition"
import type { CheezType } from "../mark-catalog"
import {
  joinCheezClassNames,
  MarkedLabel,
} from "../cheez-ui/marked-label"
import "../cheez-ui/cheez-ui.css"

export const MarkedDropdown = Menu.Root

interface DropdownMarkProps {
  character?: CheezCharacter
  interactionColor?: string
  interactionMark?: CheezType
  mark?: CheezType
  markColor?: string
  marked?: boolean
  thickness?: number
}

export interface MarkedDropdownTriggerProps
  extends Omit<MenuTriggerProps, "children" | "className" | "render">,
    DropdownMarkProps {
  children: ReactNode
  className?: string
  size?: "small" | "medium" | "large"
}

export const MarkedDropdownTrigger = forwardRef<
  HTMLButtonElement,
  MarkedDropdownTriggerProps
>(function MarkedDropdownTrigger(
  {
    character,
    children,
    className,
    disabled,
    interactionColor,
    interactionMark = "short-underline",
    mark = "circle",
    markColor,
    marked,
    onBlur,
    onFocus,
    onPointerDown,
    onPointerEnter,
    onPointerLeave,
    size = "medium",
    thickness,
    ...props
  },
  ref,
) {
  const [focused, setFocused] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [replayKey, setReplayKey] = useState(0)

  const replayMark = () => {
    if (!disabled) setReplayKey((key) => key + 1)
  }

  return (
    <Menu.Trigger
      {...props}
      ref={ref}
      className={joinCheezClassNames(
        "cheez-ui cheez-dropdown__trigger",
        className,
      )}
      disabled={disabled}
      data-size={size}
      onBlur={(event) => {
        setFocused(false)
        onBlur?.(event)
      }}
      onFocus={(event) => {
        setFocused(true)
        replayMark()
        onFocus?.(event)
      }}
      onPointerDown={(event) => {
        replayMark()
        onPointerDown?.(event)
      }}
      onPointerEnter={(event) => {
        setHovered(true)
        replayMark()
        onPointerEnter?.(event)
      }}
      onPointerLeave={(event) => {
        setHovered(false)
        onPointerLeave?.(event)
      }}
      render={(triggerProps, state) => (
        <button {...triggerProps}>
          <MarkedLabel
            active={
              !state.disabled && (marked ?? (state.open || focused || hovered))
            }
            animationKey={replayKey}
            character={character}
            color={state.open ? markColor : (interactionColor ?? markColor)}
            mark={state.open ? mark : interactionMark}
            thickness={thickness}
          >
            {children}
          </MarkedLabel>
          <span className="cheez-dropdown__caret" aria-hidden="true">
            <svg viewBox="0 0 12 8" focusable="false">
              <path d="M1.5 1.5 6 6l4.5-4.5" />
            </svg>
          </span>
        </button>
      )}
    />
  )
})

export interface MarkedDropdownContentProps
  extends Omit<MenuPopupProps, "className">,
    Pick<MenuPositionerProps, "align" | "side" | "sideOffset"> {
  className?: string
  positionerClassName?: string
}

export const MarkedDropdownContent = forwardRef<
  HTMLDivElement,
  MarkedDropdownContentProps
>(function MarkedDropdownContent(
  {
    align = "start",
    className,
    positionerClassName,
    side = "bottom",
    sideOffset = 8,
    ...props
  },
  ref,
) {
  return (
    <Menu.Portal>
      <Menu.Positioner
        align={align}
        side={side}
        sideOffset={sideOffset}
        className={joinCheezClassNames(
          "cheez-ui cheez-dropdown__positioner",
          positionerClassName,
        )}
      >
        <Menu.Popup
          {...props}
          ref={ref}
          className={joinCheezClassNames(
            "cheez-dropdown__popup",
            className,
          )}
        />
      </Menu.Positioner>
    </Menu.Portal>
  )
})

interface DropdownItemMarkProps extends DropdownMarkProps {
  children: ReactNode
  className?: string
}

export interface MarkedDropdownItemProps
  extends Omit<MenuItemProps, "children" | "className" | "render">,
    DropdownItemMarkProps {
  tone?: "default" | "danger"
}

export const MarkedDropdownItem = forwardRef<
  HTMLElement,
  MarkedDropdownItemProps
>(function MarkedDropdownItem(
  {
    character = "calm",
    children,
    className,
    interactionColor,
    interactionMark,
    mark = "short-underline",
    markColor,
    marked,
    thickness,
    tone = "default",
    ...props
  },
  ref,
) {
  return (
    <Menu.Item
      {...props}
      ref={ref}
      className={joinCheezClassNames("cheez-dropdown__item", className)}
      data-tone={tone}
      render={(itemProps, state) => (
        <div {...itemProps}>
          <MarkedLabel
            active={!state.disabled && (marked ?? state.highlighted)}
            character={character}
            color={interactionColor ?? markColor}
            mark={interactionMark ?? mark}
            thickness={thickness}
          >
            {children}
          </MarkedLabel>
        </div>
      )}
    />
  )
})

export interface MarkedDropdownCheckboxItemProps
  extends Omit<MenuCheckboxItemProps, "children" | "className" | "render">,
    DropdownItemMarkProps {}

export const MarkedDropdownCheckboxItem = forwardRef<
  HTMLElement,
  MarkedDropdownCheckboxItemProps
>(function MarkedDropdownCheckboxItem(
  {
    character = "calm",
    children,
    className,
    interactionColor,
    interactionMark = "short-underline",
    mark = "circle",
    markColor,
    marked,
    thickness,
    ...props
  },
  ref,
) {
  return (
    <Menu.CheckboxItem
      {...props}
      ref={ref}
      className={joinCheezClassNames("cheez-dropdown__item", className)}
      render={(itemProps, state) => (
        <div {...itemProps}>
          <MarkedLabel
            active={
              !state.disabled &&
              (marked ?? (state.checked || state.highlighted))
            }
            character={character}
            color={
              state.checked ? markColor : (interactionColor ?? markColor)
            }
            mark={state.checked ? mark : interactionMark}
            thickness={thickness}
          >
            {children}
          </MarkedLabel>
          <span className="cheez-dropdown__status" aria-hidden="true">
            {state.checked ? "yes" : "no"}
          </span>
        </div>
      )}
    />
  )
})

export const MarkedDropdownRadioGroup = Menu.RadioGroup

export interface MarkedDropdownRadioItemProps
  extends Omit<MenuRadioItemProps, "children" | "className" | "render">,
    DropdownItemMarkProps {}

export const MarkedDropdownRadioItem = forwardRef<
  HTMLElement,
  MarkedDropdownRadioItemProps
>(function MarkedDropdownRadioItem(
  {
    character = "calm",
    children,
    className,
    interactionColor,
    interactionMark = "short-underline",
    mark = "circle",
    markColor,
    marked,
    thickness,
    ...props
  },
  ref,
) {
  return (
    <Menu.RadioItem
      {...props}
      ref={ref}
      className={joinCheezClassNames("cheez-dropdown__item", className)}
      render={(itemProps, state) => (
        <div {...itemProps}>
          <MarkedLabel
            active={
              !state.disabled &&
              (marked ?? (state.checked || state.highlighted))
            }
            character={character}
            color={
              state.checked ? markColor : (interactionColor ?? markColor)
            }
            mark={state.checked ? mark : interactionMark}
            thickness={thickness}
          >
            {children}
          </MarkedLabel>
          <span className="cheez-dropdown__status" aria-hidden="true">
            {state.checked ? "selected" : ""}
          </span>
        </div>
      )}
    />
  )
})

export interface MarkedDropdownGroupProps
  extends Omit<MenuGroupProps, "className"> {
  className?: string
}

export const MarkedDropdownGroup = forwardRef<
  HTMLDivElement,
  MarkedDropdownGroupProps
>(function MarkedDropdownGroup({ className, ...props }, ref) {
  return (
    <Menu.Group
      {...props}
      ref={ref}
      className={joinCheezClassNames("cheez-dropdown__group", className)}
    />
  )
})

export interface MarkedDropdownLabelProps
  extends Omit<MenuGroupLabelProps, "className"> {
  className?: string
}

export const MarkedDropdownLabel = forwardRef<
  HTMLDivElement,
  MarkedDropdownLabelProps
>(function MarkedDropdownLabel({ className, ...props }, ref) {
  return (
    <Menu.GroupLabel
      {...props}
      ref={ref}
      className={joinCheezClassNames("cheez-dropdown__label", className)}
    />
  )
})

type MarkedDropdownSeparatorProps = Omit<
  ComponentPropsWithoutRef<typeof Menu.Separator>,
  "className"
> & {
  className?: string
}

export function MarkedDropdownSeparator({
  className,
  ...props
}: MarkedDropdownSeparatorProps) {
  return (
    <Menu.Separator
      {...props}
      className={joinCheezClassNames(
        "cheez-dropdown__separator",
        className,
      )}
    />
  )
}
