"use client"

import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type CSSProperties,
} from "react"

import { Cheez } from "../cheez"
import type { CheezCharacter } from "../cheez-core/cheez-definition"
import { joinCheezClassNames } from "../cheez-ui/marked-label"
import type { CheezType } from "../mark-catalog"
import "../cheez-ui/cheez-ui.css"

export type MarkedCardVariant = "outline" | "filled" | "quiet" | "pinned"
export type MarkedCardOrientation = "vertical" | "horizontal"
export type MarkedCardSize = "compact" | "default" | "large"
export type MarkedCardTone =
  | "neutral"
  | "orange"
  | "purple"
  | "lime"
  | "pink"
  | "cyan"
export type MarkedCardMediaAspect = "auto" | "square" | "video" | "wide"
export type MarkedCardMediaBleed = "none" | "top" | "inline" | "all"

export const MARKED_CARD_COLORS: Record<MarkedCardTone, string> = {
  neutral: "#625f59",
  orange: "#ff4f2e",
  purple: "#8f74ff",
  lime: "#b7ff3c",
  pink: "#ff5fa2",
  cyan: "#35d9ff",
}

interface CardStyle extends CSSProperties {
  "--cheez-card-color": string
  "--cheez-card-foreground": string
  "--cheez-card-selected": string
  "--cheez-card-stroke": string
}

export interface MarkedCardProps
  extends Omit<ComponentPropsWithoutRef<"article">, "color"> {
  character?: CheezCharacter
  color?: string
  fillMark?: CheezType
  foregroundColor?: string
  frameMark?: CheezType
  interactive?: boolean
  muted?: boolean
  orientation?: MarkedCardOrientation
  pinColor?: string
  pinMark?: CheezType
  quietMark?: CheezType
  selected?: boolean
  selectedColor?: string
  selectedMark?: CheezType
  size?: MarkedCardSize
  thickness?: number
  tone?: MarkedCardTone
  variant?: MarkedCardVariant
}

export const MarkedCard = forwardRef<HTMLElement, MarkedCardProps>(
  function MarkedCard(
    {
      character = "rushed",
      children,
      className,
      color,
      fillMark = "marker-swipe",
      foregroundColor,
      frameMark = "rounded-box",
      interactive = false,
      muted = false,
      orientation = "vertical",
      pinColor,
      pinMark = "asterisk",
      quietMark = "long-underline",
      selected = false,
      selectedColor = "#b7ff3c",
      selectedMark = "corner-box",
      size = "default",
      style,
      thickness,
      tone = "neutral",
      variant = "outline",
      ...props
    },
    ref,
  ) {
    const resolvedColor = color ?? MARKED_CARD_COLORS[tone]
    const resolvedForeground =
      foregroundColor ?? (variant === "filled" ? "#000000" : "#f4f0e6")
    const cardStyle: CardStyle = {
      ...style,
      "--cheez-card-color": resolvedColor,
      "--cheez-card-foreground": resolvedForeground,
      "--cheez-card-selected": selectedColor,
      "--cheez-card-stroke": `${2.4 * (thickness ?? 1)}px`,
    }

    return (
      <article
        {...props}
        ref={ref}
        className={joinCheezClassNames("cheez-ui cheez-card", className)}
        data-interactive={interactive ? "" : undefined}
        data-muted={muted ? "" : undefined}
        data-orientation={orientation}
        data-selected={selected ? "" : undefined}
        data-size={size}
        data-tone={tone}
        data-variant={variant}
        style={cardStyle}
      >
        {variant === "outline" || variant === "pinned" ? (
          <Cheez
            className="cheez-card__frame"
            type={frameMark}
            character={character}
            color={resolvedColor}
            thickness={thickness}
            trigger="mount"
          >
            <span aria-hidden="true" />
          </Cheez>
        ) : null}

        {variant === "filled" ? (
          <Cheez
            className="cheez-card__fill"
            type={fillMark}
            character={character}
            color={resolvedColor}
            fillColor={resolvedColor}
            trigger="mount"
          >
            <span aria-hidden="true" />
          </Cheez>
        ) : null}

        {variant === "quiet" ? (
          <Cheez
            className="cheez-card__quiet-mark"
            type={quietMark}
            character={character}
            color={resolvedColor}
            thickness={thickness}
            trigger="mount"
          >
            <span aria-hidden="true" />
          </Cheez>
        ) : null}

        {variant === "pinned" ? (
          <Cheez
            className="cheez-card__pin"
            type={pinMark}
            character={character}
            color={pinColor ?? resolvedColor}
            thickness={thickness}
            trigger="mount"
          >
            <span aria-hidden="true" />
          </Cheez>
        ) : null}

        {selected ? (
          <>
            <Cheez
              className="cheez-card__selection-frame"
              type={selectedMark}
              character={character}
              color={selectedColor}
              thickness={thickness}
              trigger="mount"
            >
              <span aria-hidden="true" />
            </Cheez>
            <Cheez
              className="cheez-card__selection-check"
              type="check"
              character={character}
              color={selectedColor}
              thickness={thickness}
              trigger="mount"
            >
              <span aria-hidden="true" />
            </Cheez>
          </>
        ) : null}

        {children}
      </article>
    )
  },
)

export const MarkedCardHeader = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<"div">
>(function MarkedCardHeader({ className, ...props }, ref) {
  return (
    <div
      {...props}
      ref={ref}
      className={joinCheezClassNames("cheez-card__header", className)}
    />
  )
})

export const MarkedCardEyebrow = forwardRef<
  HTMLSpanElement,
  ComponentPropsWithoutRef<"span">
>(function MarkedCardEyebrow({ className, ...props }, ref) {
  return (
    <span
      {...props}
      ref={ref}
      className={joinCheezClassNames("cheez-card__eyebrow", className)}
    />
  )
})

export interface MarkedCardTitleProps
  extends ComponentPropsWithoutRef<"h3"> {
  level?: 2 | 3 | 4
}

export const MarkedCardTitle = forwardRef<
  HTMLHeadingElement,
  MarkedCardTitleProps
>(function MarkedCardTitle({ className, level = 3, ...props }, ref) {
  const Heading = `h${level}` as "h2" | "h3" | "h4"

  return (
    <Heading
      {...props}
      ref={ref}
      className={joinCheezClassNames("cheez-card__title", className)}
    />
  )
})

export const MarkedCardDescription = forwardRef<
  HTMLParagraphElement,
  ComponentPropsWithoutRef<"p">
>(function MarkedCardDescription({ className, ...props }, ref) {
  return (
    <p
      {...props}
      ref={ref}
      className={joinCheezClassNames("cheez-card__description", className)}
    />
  )
})

export const MarkedCardContent = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<"div">
>(function MarkedCardContent({ className, ...props }, ref) {
  return (
    <div
      {...props}
      ref={ref}
      className={joinCheezClassNames("cheez-card__content", className)}
    />
  )
})

export interface MarkedCardMediaProps
  extends ComponentPropsWithoutRef<"div"> {
  aspect?: MarkedCardMediaAspect
  bleed?: MarkedCardMediaBleed
}

export const MarkedCardMedia = forwardRef<
  HTMLDivElement,
  MarkedCardMediaProps
>(function MarkedCardMedia(
  { aspect = "auto", bleed = "none", className, ...props },
  ref,
) {
  return (
    <div
      {...props}
      ref={ref}
      className={joinCheezClassNames("cheez-card__media", className)}
      data-aspect={aspect}
      data-bleed={bleed}
    />
  )
})

export const MarkedCardFooter = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<"div">
>(function MarkedCardFooter({ className, ...props }, ref) {
  return (
    <div
      {...props}
      ref={ref}
      className={joinCheezClassNames("cheez-card__footer", className)}
    />
  )
})

export const MarkedCardActions = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<"div">
>(function MarkedCardActions({ className, ...props }, ref) {
  return (
    <div
      {...props}
      ref={ref}
      className={joinCheezClassNames("cheez-card__actions", className)}
    />
  )
})
