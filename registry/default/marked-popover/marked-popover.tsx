"use client"

import { Popover } from "@base-ui/react/popover"
import {
  createContext,
  forwardRef,
  useContext,
  useState,
  type ReactNode,
} from "react"
import type {
  PopoverCloseProps,
  PopoverDescriptionProps,
  PopoverPopupProps,
  PopoverPositionerProps,
  PopoverRootProps,
  PopoverTitleProps,
  PopoverTriggerProps,
} from "@base-ui/react/popover"

import { Cheez } from "../cheez"
import type { CheezCharacter } from "../cheez-core/cheez-definition"
import {
  joinCheezClassNames,
  MarkedLabel,
} from "../cheez-ui/marked-label"
import type { CheezType } from "../mark-catalog"
import "../cheez-ui/cheez-ui.css"

type PopoverSize = "small" | "medium" | "large"

interface PopoverVisualContextValue {
  arrowColor: string
  arrowMark: CheezType
  character: CheezCharacter
  closeColor: string
  frameColor: string
  frameMark: CheezType
  pinColor: string
  pinMark: CheezType
  size: PopoverSize
  thickness?: number
  titleColor: string
  titleMark: CheezType
  triggerColor: string
  triggerMark: CheezType
}

const PopoverVisualContext =
  createContext<PopoverVisualContextValue | null>(null)

function usePopoverVisuals() {
  const context = useContext(PopoverVisualContext)

  if (!context) {
    throw new Error("MarkedPopover parts must be used inside MarkedPopover")
  }

  return context
}

export interface MarkedPopoverProps
  extends Omit<PopoverRootProps, "children"> {
  arrowColor?: string
  arrowMark?: CheezType
  character?: CheezCharacter
  children: ReactNode
  closeColor?: string
  frameColor?: string
  frameMark?: CheezType
  pinColor?: string
  pinMark?: CheezType
  size?: PopoverSize
  thickness?: number
  titleColor?: string
  titleMark?: CheezType
  triggerColor?: string
  triggerMark?: CheezType
}

export function MarkedPopover({
  arrowColor,
  arrowMark = "pointer",
  character = "rushed",
  children,
  closeColor = "#ff5fa2",
  frameColor = "#8f74ff",
  frameMark = "corner-box",
  pinColor = "#b7ff3c",
  pinMark = "asterisk",
  size = "medium",
  thickness,
  titleColor = "#35d9ff",
  titleMark = "underline",
  triggerColor = "#ff4f2e",
  triggerMark = "rounded-box",
  ...props
}: MarkedPopoverProps) {
  const visuals: PopoverVisualContextValue = {
    arrowColor: arrowColor ?? frameColor,
    arrowMark,
    character,
    closeColor,
    frameColor,
    frameMark,
    pinColor,
    pinMark,
    size,
    thickness,
    titleColor,
    titleMark,
    triggerColor,
    triggerMark,
  }

  return (
    <PopoverVisualContext.Provider value={visuals}>
      <Popover.Root {...props}>{children}</Popover.Root>
    </PopoverVisualContext.Provider>
  )
}

export interface MarkedPopoverTriggerProps
  extends Omit<PopoverTriggerProps, "children" | "className" | "render"> {
  children: ReactNode
  className?: string
  color?: string
  mark?: CheezType
  marked?: boolean
}

export const MarkedPopoverTrigger = forwardRef<
  HTMLButtonElement,
  MarkedPopoverTriggerProps
>(function MarkedPopoverTrigger(
  {
    children,
    className,
    color,
    disabled,
    mark,
    marked,
    onBlur,
    onFocus,
    onPointerEnter,
    onPointerLeave,
    ...props
  },
  ref,
) {
  const visuals = usePopoverVisuals()
  const [focused, setFocused] = useState(false)
  const [hovered, setHovered] = useState(false)

  return (
    <Popover.Trigger
      {...props}
      ref={ref}
      className={joinCheezClassNames("cheez-popover__trigger", className)}
      disabled={disabled}
      onBlur={(event) => {
        setFocused(false)
        onBlur?.(event)
      }}
      onFocus={(event) => {
        setFocused(true)
        onFocus?.(event)
      }}
      onPointerEnter={(event) => {
        setHovered(true)
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
              !state.disabled &&
              (marked ?? (state.open || focused || hovered))
            }
            character={visuals.character}
            color={color ?? visuals.triggerColor}
            mark={mark ?? visuals.triggerMark}
            thickness={visuals.thickness}
          >
            {children}
          </MarkedLabel>
        </button>
      )}
    />
  )
})

export interface MarkedPopoverContentProps
  extends Omit<
    PopoverPositionerProps,
    "children" | "className" | "render"
  > {
  backdrop?: boolean
  children: ReactNode
  className?: string
  finalFocus?: PopoverPopupProps["finalFocus"]
  initialFocus?: PopoverPopupProps["initialFocus"]
  keepMounted?: boolean
  showArrow?: boolean
  showClose?: boolean
  showPin?: boolean
}

export const MarkedPopoverContent = forwardRef<
  HTMLDivElement,
  MarkedPopoverContentProps
>(function MarkedPopoverContent(
  {
    align = "center",
    backdrop = false,
    children,
    className,
    finalFocus,
    initialFocus,
    keepMounted,
    showArrow = true,
    showClose = true,
    showPin = true,
    side = "bottom",
    sideOffset = 16,
    ...props
  },
  ref,
) {
  const visuals = usePopoverVisuals()

  return (
    <Popover.Portal keepMounted={keepMounted}>
      {backdrop ? <Popover.Backdrop className="cheez-popover__backdrop" /> : null}
      <Popover.Positioner
        {...props}
        align={align}
        className="cheez-popover__positioner"
        side={side}
        sideOffset={sideOffset}
      >
        <Popover.Popup
          ref={ref}
          className={joinCheezClassNames(
            "cheez-ui cheez-popover__popup",
            className,
          )}
          data-size={visuals.size}
          finalFocus={finalFocus}
          initialFocus={initialFocus}
        >
          <Cheez
            className="cheez-popover__frame"
            type={visuals.frameMark}
            character={visuals.character}
            color={visuals.frameColor}
            thickness={visuals.thickness}
            trigger="mount"
          >
            <span aria-hidden="true" />
          </Cheez>
          {showPin ? (
            <Cheez
              className="cheez-popover__pin"
              type={visuals.pinMark}
              character={visuals.character}
              color={visuals.pinColor}
              thickness={visuals.thickness}
              trigger="mount"
            >
              <span aria-hidden="true" />
            </Cheez>
          ) : null}
          {showClose ? <MarkedPopoverClose /> : null}
          {showArrow ? (
            <Popover.Arrow className="cheez-floating__arrow">
              <Cheez
                className="cheez-floating__arrow-mark"
                type={visuals.arrowMark}
                character={visuals.character}
                color={visuals.arrowColor}
                thickness={visuals.thickness}
                trigger="mount"
              >
                <span aria-hidden="true" />
              </Cheez>
            </Popover.Arrow>
          ) : null}
          <div className="cheez-popover__body">{children}</div>
        </Popover.Popup>
      </Popover.Positioner>
    </Popover.Portal>
  )
})

export interface MarkedPopoverTitleProps
  extends Omit<PopoverTitleProps, "children" | "className"> {
  children: ReactNode
  className?: string
  color?: string
  mark?: CheezType
}

export const MarkedPopoverTitle = forwardRef<
  HTMLHeadingElement,
  MarkedPopoverTitleProps
>(function MarkedPopoverTitle(
  { children, className, color, mark, ...props },
  ref,
) {
  const visuals = usePopoverVisuals()

  return (
    <Popover.Title
      {...props}
      ref={ref}
      className={joinCheezClassNames("cheez-popover__title", className)}
    >
      <MarkedLabel
        active
        character={visuals.character}
        color={color ?? visuals.titleColor}
        mark={mark ?? visuals.titleMark}
        thickness={visuals.thickness}
      >
        {children}
      </MarkedLabel>
    </Popover.Title>
  )
})

export interface MarkedPopoverDescriptionProps
  extends Omit<PopoverDescriptionProps, "className"> {
  className?: string
}

export const MarkedPopoverDescription = forwardRef<
  HTMLParagraphElement,
  MarkedPopoverDescriptionProps
>(function MarkedPopoverDescription({ className, ...props }, ref) {
  return (
    <Popover.Description
      {...props}
      ref={ref}
      className={joinCheezClassNames(
        "cheez-popover__description",
        className,
      )}
    />
  )
})

export interface MarkedPopoverCloseProps
  extends Omit<PopoverCloseProps, "children" | "className"> {
  children?: ReactNode
  className?: string
  color?: string
  mark?: CheezType
}

export const MarkedPopoverClose = forwardRef<
  HTMLButtonElement,
  MarkedPopoverCloseProps
>(function MarkedPopoverClose(
  {
    "aria-label": ariaLabel,
    children,
    className,
    color,
    mark = "cross",
    ...props
  },
  ref,
) {
  const visuals = usePopoverVisuals()
  const iconOnly = children == null

  return (
    <Popover.Close
      {...props}
      ref={ref}
      className={joinCheezClassNames("cheez-popover__close", className)}
      aria-label={iconOnly ? (ariaLabel ?? "close popover") : ariaLabel}
      data-icon={iconOnly ? "" : undefined}
    >
      {iconOnly ? (
        <Cheez
          className="cheez-popover__close-mark"
          type={mark}
          character={visuals.character}
          color={color ?? visuals.closeColor}
          thickness={visuals.thickness}
          trigger="none"
        >
          <span aria-hidden="true" />
        </Cheez>
      ) : (
        <MarkedLabel
          active
          character={visuals.character}
          color={color ?? visuals.closeColor}
          mark="rounded-box"
          thickness={visuals.thickness}
        >
          {children}
        </MarkedLabel>
      )}
    </Popover.Close>
  )
})

export interface MarkedPopoverHeaderProps {
  children: ReactNode
  className?: string
}

export function MarkedPopoverHeader({
  children,
  className,
}: MarkedPopoverHeaderProps) {
  return (
    <div className={joinCheezClassNames("cheez-popover__header", className)}>
      {children}
    </div>
  )
}

export interface MarkedPopoverFooterProps {
  children: ReactNode
  className?: string
}

export function MarkedPopoverFooter({
  children,
  className,
}: MarkedPopoverFooterProps) {
  return (
    <div className={joinCheezClassNames("cheez-popover__footer", className)}>
      {children}
    </div>
  )
}

