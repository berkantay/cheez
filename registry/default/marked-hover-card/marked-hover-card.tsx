"use client"

import { PreviewCard } from "@base-ui/react/preview-card"
import {
  createContext,
  forwardRef,
  useContext,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react"
import type {
  PreviewCardPopupProps,
  PreviewCardPositionerProps,
  PreviewCardRootProps,
  PreviewCardTriggerProps,
} from "@base-ui/react/preview-card"

import { Cheez } from "../cheez"
import type { CheezCharacter } from "../cheez-core/cheez-definition"
import { joinCheezClassNames, MarkedLabel } from "../cheez-ui/marked-label"
import type { CheezType } from "../mark-catalog"
import "../cheez-ui/cheez-ui.css"
import "./marked-hover-card.css"

export type MarkedHoverCardTone = "orange" | "purple" | "lime" | "pink" | "cyan" | "neutral"
export type MarkedHoverCardSize = "small" | "medium" | "large"

const TONE_COLORS: Record<MarkedHoverCardTone, string> = {
  orange: "#ff4f2e",
  purple: "#8f74ff",
  lime: "#b7ff3c",
  pink: "#ff5fa2",
  cyan: "#35d9ff",
  neutral: "#f4f0e6",
}

interface HoverCardVisuals {
  accentColor: string
  character: CheezCharacter
  frameColor: string
  frameMark: CheezType
  size: MarkedHoverCardSize
  thickness?: number
  triggerColor: string
  triggerMark: CheezType
}

const VisualContext = createContext<HoverCardVisuals | null>(null)

function useVisuals() {
  const context = useContext(VisualContext)
  if (!context) throw new Error("MarkedHoverCard parts must be used inside MarkedHoverCard")
  return context
}

export interface MarkedHoverCardProps extends Omit<PreviewCardRootProps, "children"> {
  accentColor?: string
  character?: CheezCharacter
  children: ReactNode
  frameColor?: string
  frameMark?: CheezType
  size?: MarkedHoverCardSize
  thickness?: number
  tone?: MarkedHoverCardTone
  triggerColor?: string
  triggerMark?: CheezType
}

export function MarkedHoverCard({
  accentColor = "#b7ff3c",
  character = "calm",
  children,
  frameColor,
  frameMark = "loose-circle",
  size = "medium",
  thickness,
  tone = "purple",
  triggerColor = "#35d9ff",
  triggerMark = "short-underline",
  ...props
}: MarkedHoverCardProps) {
  const visuals: HoverCardVisuals = {
    accentColor,
    character,
    frameColor: frameColor ?? TONE_COLORS[tone],
    frameMark,
    size,
    thickness,
    triggerColor,
    triggerMark,
  }

  return <VisualContext.Provider value={visuals}><PreviewCard.Root {...props}>{children}</PreviewCard.Root></VisualContext.Provider>
}

export interface MarkedHoverCardTriggerProps extends Omit<PreviewCardTriggerProps, "children" | "className" | "render"> {
  children: ReactNode
  className?: string
  color?: string
  mark?: CheezType
}

export const MarkedHoverCardTrigger = forwardRef<HTMLAnchorElement, MarkedHoverCardTriggerProps>(
  function MarkedHoverCardTrigger({ children, className, color, mark, ...props }, ref) {
    const visuals = useVisuals()
    return (
      <PreviewCard.Trigger
        {...props}
        ref={ref}
        className={joinCheezClassNames("cheez-hover-card__trigger", className)}
        render={(triggerProps, state) => (
          <a {...triggerProps}>
            <MarkedLabel active={state.open} character={visuals.character} color={color ?? visuals.triggerColor} mark={mark ?? visuals.triggerMark} thickness={visuals.thickness}>
              {children}
            </MarkedLabel>
          </a>
        )}
      />
    )
  },
)

export interface MarkedHoverCardContentProps
  extends Omit<PreviewCardPopupProps, "className">,
    Pick<PreviewCardPositionerProps, "align" | "side" | "sideOffset"> {
  className?: string
  keepMounted?: boolean
  positionerClassName?: string
  showArrow?: boolean
}

export const MarkedHoverCardContent = forwardRef<HTMLDivElement, MarkedHoverCardContentProps>(
  function MarkedHoverCardContent({ align = "center", children, className, keepMounted, positionerClassName, showArrow = true, side = "bottom", sideOffset = 13, ...props }, ref) {
    const visuals = useVisuals()
    return (
      <PreviewCard.Portal keepMounted={keepMounted}>
        <PreviewCard.Positioner align={align} side={side} sideOffset={sideOffset} className={joinCheezClassNames("cheez-hover-card__positioner", positionerClassName)}>
          <PreviewCard.Popup {...props} ref={ref} className={joinCheezClassNames("cheez-hover-card__popup", className)} data-size={visuals.size}>
            <Cheez className="cheez-hover-card__frame" type={visuals.frameMark} character={visuals.character} color={visuals.frameColor} thickness={visuals.thickness} trigger="mount"><span aria-hidden="true" /></Cheez>
            {showArrow ? <PreviewCard.Arrow className="cheez-hover-card__arrow"><span /></PreviewCard.Arrow> : null}
            {children}
          </PreviewCard.Popup>
        </PreviewCard.Positioner>
      </PreviewCard.Portal>
    )
  },
)

type PartProps = ComponentPropsWithoutRef<"div">

export const MarkedHoverCardHeader = forwardRef<HTMLDivElement, PartProps>(function MarkedHoverCardHeader({ className, ...props }, ref) {
  return <div {...props} ref={ref} className={joinCheezClassNames("cheez-hover-card__header", className)} />
})

export const MarkedHoverCardContentBody = forwardRef<HTMLDivElement, PartProps>(function MarkedHoverCardContentBody({ className, ...props }, ref) {
  return <div {...props} ref={ref} className={joinCheezClassNames("cheez-hover-card__body", className)} />
})

export const MarkedHoverCardTitle = forwardRef<HTMLDivElement, PartProps>(function MarkedHoverCardTitle({ className, ...props }, ref) {
  const visuals = useVisuals()
  return <div {...props} ref={ref} className={joinCheezClassNames("cheez-hover-card__title", className)} style={{ borderColor: visuals.accentColor, ...props.style }} />
})

export const MarkedHoverCardDescription = forwardRef<HTMLDivElement, PartProps>(function MarkedHoverCardDescription({ className, ...props }, ref) {
  return <div {...props} ref={ref} className={joinCheezClassNames("cheez-hover-card__description", className)} />
})

export const MarkedHoverCardMeta = forwardRef<HTMLDivElement, PartProps>(function MarkedHoverCardMeta({ className, ...props }, ref) {
  return <div {...props} ref={ref} className={joinCheezClassNames("cheez-hover-card__meta", className)} />
})
