"use client"

import { Accordion } from "@base-ui/react/accordion"
import {
  createContext,
  forwardRef,
  useContext,
  useState,
  type ReactNode,
} from "react"
import type {
  AccordionHeaderProps,
  AccordionItemProps,
  AccordionPanelProps,
  AccordionRootProps,
  AccordionTriggerProps,
} from "@base-ui/react/accordion"

import { Cheez } from "../cheez"
import type { CheezCharacter } from "../cheez-core/cheez-definition"
import {
  joinCheezClassNames,
  MarkedLabel,
} from "../cheez-ui/marked-label"
import type { CheezType } from "../mark-catalog"
import "../cheez-ui/cheez-ui.css"

type AccordionSize = "small" | "medium" | "large"

interface AccordionVisualContextValue {
  character: CheezCharacter
  frameColor: string
  frameMark: CheezType
  iconColor: string
  iconMark: CheezType
  interactionColor: string
  interactionMark: CheezType
  openColor: string
  openMark: CheezType
  size: AccordionSize
  thickness?: number
}

const AccordionVisualContext =
  createContext<AccordionVisualContextValue | null>(null)

function useAccordionVisuals() {
  const context = useContext(AccordionVisualContext)

  if (!context) {
    throw new Error("MarkedAccordion parts must be used inside MarkedAccordion")
  }

  return context
}

export interface MarkedAccordionProps
  extends Omit<AccordionRootProps<string>, "className"> {
  character?: CheezCharacter
  className?: string
  frameColor?: string
  frameMark?: CheezType
  iconColor?: string
  iconMark?: CheezType
  interactionColor?: string
  interactionMark?: CheezType
  openColor?: string
  openMark?: CheezType
  size?: AccordionSize
  thickness?: number
}

export const MarkedAccordion = forwardRef<
  HTMLDivElement,
  MarkedAccordionProps
>(function MarkedAccordion(
  {
    character = "rushed",
    className,
    frameColor = "#8f74ff",
    frameMark = "corner-box",
    iconColor = "#ff5fa2",
    iconMark = "cross",
    interactionColor = "#35d9ff",
    interactionMark = "short-underline",
    openColor = "#b7ff3c",
    openMark = "underline",
    size = "medium",
    thickness,
    ...props
  },
  ref,
) {
  const visuals: AccordionVisualContextValue = {
    character,
    frameColor,
    frameMark,
    iconColor,
    iconMark,
    interactionColor,
    interactionMark,
    openColor,
    openMark,
    size,
    thickness,
  }

  return (
    <AccordionVisualContext.Provider value={visuals}>
      <Accordion.Root
        {...props}
        ref={ref}
        className={joinCheezClassNames(
          "cheez-ui cheez-accordion",
          className,
        )}
        data-size={size}
      />
    </AccordionVisualContext.Provider>
  )
})

export interface MarkedAccordionItemProps
  extends Omit<AccordionItemProps, "children" | "className" | "render"> {
  children: ReactNode
  className?: string
  frameColor?: string
  frameMark?: CheezType
  value: string
}

export const MarkedAccordionItem = forwardRef<
  HTMLDivElement,
  MarkedAccordionItemProps
>(function MarkedAccordionItem(
  {
    children,
    className,
    frameColor,
    frameMark,
    ...props
  },
  ref,
) {
  const visuals = useAccordionVisuals()

  return (
    <Accordion.Item
      {...props}
      ref={ref}
      className={joinCheezClassNames("cheez-accordion__item", className)}
      render={(itemProps, state) => (
        <div {...itemProps}>
          {state.open ? (
            <Cheez
              className="cheez-accordion__frame"
              type={frameMark ?? visuals.frameMark}
              character={visuals.character}
              color={frameColor ?? visuals.frameColor}
              thickness={visuals.thickness}
              trigger="mount"
            >
              <span aria-hidden="true" />
            </Cheez>
          ) : null}
          <div className="cheez-accordion__item-body">{children}</div>
        </div>
      )}
    />
  )
})

export interface MarkedAccordionHeaderProps
  extends Omit<AccordionHeaderProps, "className"> {
  className?: string
}

export const MarkedAccordionHeader = forwardRef<
  HTMLHeadingElement,
  MarkedAccordionHeaderProps
>(function MarkedAccordionHeader({ className, ...props }, ref) {
  return (
    <Accordion.Header
      {...props}
      ref={ref}
      className={joinCheezClassNames("cheez-accordion__header", className)}
    />
  )
})

export interface MarkedAccordionTriggerProps
  extends Omit<AccordionTriggerProps, "children" | "className" | "render"> {
  children: ReactNode
  className?: string
  iconColor?: string
  iconMark?: CheezType
  interactionColor?: string
  interactionMark?: CheezType
  openColor?: string
  openMark?: CheezType
}

export const MarkedAccordionTrigger = forwardRef<
  HTMLElement,
  MarkedAccordionTriggerProps
>(function MarkedAccordionTrigger(
  {
    children,
    className,
    disabled,
    iconColor,
    iconMark,
    interactionColor,
    interactionMark,
    onBlur,
    onFocus,
    onPointerEnter,
    onPointerLeave,
    openColor,
    openMark,
    ...props
  },
  ref,
) {
  const visuals = useAccordionVisuals()
  const [focused, setFocused] = useState(false)
  const [hovered, setHovered] = useState(false)

  return (
    <Accordion.Trigger
      {...props}
      ref={ref}
      className={joinCheezClassNames(
        "cheez-accordion__trigger",
        className,
      )}
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
            active={!state.disabled && (state.open || focused || hovered)}
            character={visuals.character}
            color={
              state.open
                ? (openColor ?? visuals.openColor)
                : (interactionColor ?? visuals.interactionColor)
            }
            mark={
              state.open
                ? (openMark ?? visuals.openMark)
                : (interactionMark ?? visuals.interactionMark)
            }
            thickness={visuals.thickness}
          >
            {children}
          </MarkedLabel>
          <Cheez
            className="cheez-accordion__icon"
            type={iconMark ?? visuals.iconMark}
            character={visuals.character}
            color={iconColor ?? visuals.iconColor}
            thickness={visuals.thickness}
            trigger="none"
          >
            <span aria-hidden="true" />
          </Cheez>
        </button>
      )}
    />
  )
})

export interface MarkedAccordionPanelProps
  extends Omit<AccordionPanelProps, "children" | "className"> {
  children: ReactNode
  className?: string
  contentClassName?: string
}

export const MarkedAccordionPanel = forwardRef<
  HTMLDivElement,
  MarkedAccordionPanelProps
>(function MarkedAccordionPanel(
  { children, className, contentClassName, ...props },
  ref,
) {
  return (
    <Accordion.Panel
      {...props}
      ref={ref}
      className={joinCheezClassNames("cheez-accordion__panel", className)}
    >
      <div
        className={joinCheezClassNames(
          "cheez-accordion__content",
          contentClassName,
        )}
      >
        {children}
      </div>
    </Accordion.Panel>
  )
})

