"use client"

import { Tooltip } from "@base-ui/react/tooltip"
import {
  createContext,
  forwardRef,
  useContext,
  useState,
  type ReactNode,
} from "react"
import type {
  TooltipPositionerProps,
  TooltipProviderProps,
  TooltipRootProps,
  TooltipTriggerProps,
} from "@base-ui/react/tooltip"

import { Cheez } from "../cheez"
import type { CheezCharacter } from "../cheez-core/cheez-definition"
import {
  joinCheezClassNames,
  MarkedLabel,
} from "../cheez-ui/marked-label"
import type { CheezType } from "../mark-catalog"
import "../cheez-ui/cheez-ui.css"

type TooltipSize = "small" | "medium" | "large"

interface TooltipVisualContextValue {
  arrowColor: string
  arrowMark: CheezType
  character: CheezCharacter
  frameColor: string
  frameMark: CheezType
  size: TooltipSize
  thickness?: number
  triggerColor: string
  triggerMark: CheezType
}

const TooltipVisualContext =
  createContext<TooltipVisualContextValue | null>(null)

function useTooltipVisuals() {
  const context = useContext(TooltipVisualContext)

  if (!context) {
    throw new Error("MarkedTooltip parts must be used inside MarkedTooltip")
  }

  return context
}

export function MarkedTooltipProvider({
  closeDelay = 40,
  delay = 450,
  timeout = 320,
  ...props
}: TooltipProviderProps) {
  return (
    <Tooltip.Provider
      {...props}
      closeDelay={closeDelay}
      delay={delay}
      timeout={timeout}
    />
  )
}

export interface MarkedTooltipProps
  extends Omit<TooltipRootProps, "children"> {
  arrowColor?: string
  arrowMark?: CheezType
  character?: CheezCharacter
  children: ReactNode
  frameColor?: string
  frameMark?: CheezType
  size?: TooltipSize
  thickness?: number
  triggerColor?: string
  triggerMark?: CheezType
}

export function MarkedTooltip({
  arrowColor,
  arrowMark = "pointer",
  character = "rushed",
  children,
  frameColor = "#35d9ff",
  frameMark = "rounded-box",
  size = "medium",
  thickness,
  triggerColor = "#b7ff3c",
  triggerMark = "short-underline",
  ...props
}: MarkedTooltipProps) {
  const visuals: TooltipVisualContextValue = {
    arrowColor: arrowColor ?? frameColor,
    arrowMark,
    character,
    frameColor,
    frameMark,
    size,
    thickness,
    triggerColor,
    triggerMark,
  }

  return (
    <TooltipVisualContext.Provider value={visuals}>
      <Tooltip.Root {...props}>{children}</Tooltip.Root>
    </TooltipVisualContext.Provider>
  )
}

export interface MarkedTooltipTriggerProps
  extends Omit<TooltipTriggerProps, "children" | "className" | "render"> {
  children: ReactNode
  className?: string
  color?: string
  mark?: CheezType
  marked?: boolean
  nativeDisabled?: boolean
}

export const MarkedTooltipTrigger = forwardRef<
  HTMLButtonElement,
  MarkedTooltipTriggerProps
>(function MarkedTooltipTrigger(
  {
    children,
    className,
    color,
    disabled,
    mark,
    marked,
    nativeDisabled = false,
    onBlur,
    onFocus,
    onPointerEnter,
    onPointerLeave,
    ...props
  },
  ref,
) {
  const visuals = useTooltipVisuals()
  const [focused, setFocused] = useState(false)
  const [hovered, setHovered] = useState(false)

  return (
    <Tooltip.Trigger
      {...props}
      ref={ref}
      className={joinCheezClassNames("cheez-tooltip__trigger", className)}
      disabled={disabled || nativeDisabled}
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
        <button {...triggerProps} disabled={nativeDisabled}>
          <MarkedLabel
            active={marked ?? (state.open || focused || hovered)}
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

export interface MarkedTooltipContentProps
  extends Omit<
    TooltipPositionerProps,
    "children" | "className" | "render"
  > {
  children: ReactNode
  className?: string
  keepMounted?: boolean
  showArrow?: boolean
}

export const MarkedTooltipContent = forwardRef<
  HTMLDivElement,
  MarkedTooltipContentProps
>(function MarkedTooltipContent(
  {
    align = "center",
    children,
    className,
    keepMounted,
    showArrow = true,
    side = "top",
    sideOffset = 14,
    ...props
  },
  ref,
) {
  const visuals = useTooltipVisuals()

  return (
    <Tooltip.Portal keepMounted={keepMounted}>
      <Tooltip.Positioner
        {...props}
        align={align}
        className="cheez-tooltip__positioner"
        side={side}
        sideOffset={sideOffset}
      >
        <Tooltip.Popup
          ref={ref}
          className={joinCheezClassNames(
            "cheez-ui cheez-tooltip__popup",
            className,
          )}
          data-size={visuals.size}
        >
          <Cheez
            className="cheez-tooltip__frame"
            type={visuals.frameMark}
            character={visuals.character}
            color={visuals.frameColor}
            thickness={visuals.thickness}
            trigger="mount"
          >
            <span aria-hidden="true" />
          </Cheez>
          {showArrow ? (
            <Tooltip.Arrow className="cheez-floating__arrow">
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
            </Tooltip.Arrow>
          ) : null}
          <span className="cheez-tooltip__content">{children}</span>
        </Tooltip.Popup>
      </Tooltip.Positioner>
    </Tooltip.Portal>
  )
})
