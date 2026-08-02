"use client"

import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type CSSProperties,
  type ReactNode,
} from "react"

import { Cheez } from "../cheez"
import type { CheezCharacter } from "../cheez-core/cheez-definition"
import { joinCheezClassNames } from "../cheez-ui/marked-label"
import type { CheezType } from "../mark-catalog"
import "../cheez-ui/cheez-ui.css"

export type MarkedSkeletonShape = "line" | "block" | "rounded" | "circle"
export type MarkedSkeletonMotion = "draw" | "breathe" | "none"
export type MarkedSkeletonTone =
  | "neutral"
  | "purple"
  | "lime"
  | "pink"
  | "cyan"
  | "orange"

export const MARKED_SKELETON_COLORS: Record<MarkedSkeletonTone, string> = {
  neutral: "#625f59",
  purple: "#8f74ff",
  lime: "#b7ff3c",
  pink: "#ff5fa2",
  cyan: "#35d9ff",
  orange: "#ff4f2e",
}

const DEFAULT_MARKS: Record<MarkedSkeletonShape, CheezType> = {
  line: "brush-highlight",
  block: "marker-swipe",
  rounded: "highlight-blob",
  circle: "spotlight",
}

const DEFAULT_SIZES: Record<
  MarkedSkeletonShape,
  { width: CSSProperties["width"]; height: CSSProperties["height"] }
> = {
  line: { width: "100%", height: 14 },
  block: { width: "100%", height: 128 },
  rounded: { width: "100%", height: 72 },
  circle: { width: 48, height: 48 },
}

interface SkeletonStyle extends CSSProperties {
  "--cheez-skeleton-delay": string
  "--cheez-skeleton-duration": string
}

export interface MarkedSkeletonProps
  extends Omit<ComponentPropsWithoutRef<"span">, "children" | "color"> {
  character?: CheezCharacter
  color?: string
  delay?: number
  duration?: number
  height?: CSSProperties["height"]
  mark?: CheezType
  motion?: MarkedSkeletonMotion
  shape?: MarkedSkeletonShape
  tone?: MarkedSkeletonTone
  width?: CSSProperties["width"]
}

export const MarkedSkeleton = forwardRef<HTMLSpanElement, MarkedSkeletonProps>(
  function MarkedSkeleton(
    {
      character = "rushed",
      className,
      color,
      delay = 0,
      duration = 1800,
      height,
      mark,
      motion = "draw",
      shape = "line",
      style,
      tone = "neutral",
      width,
      ...props
    },
    ref,
  ) {
    const defaults = DEFAULT_SIZES[shape]
    const resolvedColor = color ?? MARKED_SKELETON_COLORS[tone]
    const skeletonStyle: SkeletonStyle = {
      ...style,
      "--cheez-skeleton-delay": `${delay}ms`,
      "--cheez-skeleton-duration": `${Math.max(200, duration)}ms`,
      color: resolvedColor,
      height: height ?? defaults.height,
      width: width ?? defaults.width,
    }

    return (
      <span
        {...props}
        ref={ref}
        className={joinCheezClassNames(
          "cheez-ui cheez-skeleton",
          className,
        )}
        aria-hidden="true"
        data-motion={motion}
        data-shape={shape}
        data-tone={tone}
        style={skeletonStyle}
      >
        <span className="cheez-skeleton__base" />
        <Cheez
          className="cheez-skeleton__ink"
          type={mark ?? DEFAULT_MARKS[shape]}
          character={character}
          color={resolvedColor}
          fillColor={resolvedColor}
          trigger="mount"
        >
          <span />
        </Cheez>
      </span>
    )
  },
)

export interface MarkedSkeletonTextProps
  extends Omit<ComponentPropsWithoutRef<"div">, "children" | "color"> {
  character?: CheezCharacter
  color?: string
  delay?: number
  duration?: number
  gap?: CSSProperties["gap"]
  lastLineWidth?: CSSProperties["width"]
  lineHeight?: CSSProperties["height"]
  lines?: number
  lineWidths?: ReadonlyArray<CSSProperties["width"]>
  mark?: CheezType
  motion?: MarkedSkeletonMotion
  tone?: MarkedSkeletonTone
  width?: CSSProperties["width"]
}

export const MarkedSkeletonText = forwardRef<
  HTMLDivElement,
  MarkedSkeletonTextProps
>(function MarkedSkeletonText(
  {
    character,
    className,
    color,
    delay = 0,
    duration,
    gap = 8,
    lastLineWidth = "68%",
    lineHeight = 12,
    lines = 3,
    lineWidths,
    mark,
    motion,
    style,
    tone,
    width,
    ...props
  },
  ref,
) {
  const lineCount = Math.max(1, Math.floor(lines))

  return (
    <div
      {...props}
      ref={ref}
      className={joinCheezClassNames(
        "cheez-ui cheez-skeleton-text",
        className,
      )}
      style={{ ...style, gap, width }}
    >
      {Array.from({ length: lineCount }, (_, index) => (
        <MarkedSkeleton
          key={index}
          character={character}
          color={color}
          delay={delay + index * 110}
          duration={duration}
          height={lineHeight}
          mark={mark}
          motion={motion}
          tone={tone}
          width={
            lineWidths?.[index] ??
            (index === lineCount - 1 ? lastLineWidth : "100%")
          }
        />
      ))}
    </div>
  )
})

export interface MarkedSkeletonGroupProps
  extends Omit<ComponentPropsWithoutRef<"div">, "children" | "role"> {
  busy?: boolean
  children: ReactNode
  label?: string
  politeness?: "off" | "polite" | "assertive"
}

export const MarkedSkeletonGroup = forwardRef<
  HTMLDivElement,
  MarkedSkeletonGroupProps
>(function MarkedSkeletonGroup(
  {
    busy = true,
    children,
    className,
    label = "loading content",
    politeness = "polite",
    ...props
  },
  ref,
) {
  return (
    <div
      {...props}
      ref={ref}
      className={joinCheezClassNames(
        "cheez-ui cheez-skeleton-group",
        className,
      )}
      role="status"
      aria-busy={busy}
      aria-live={politeness}
    >
      <span className="cheez-skeleton__sr-only">{label}</span>
      {children}
    </div>
  )
})
