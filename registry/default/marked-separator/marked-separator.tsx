"use client"

import { Separator as BaseSeparator } from "@base-ui/react/separator"
import { forwardRef, type CSSProperties, type ReactNode } from "react"
import type { SeparatorProps } from "@base-ui/react/separator"

import { Cheez } from "../cheez"
import type {
  CheezCharacter,
  CheezDefinition,
} from "../cheez-core/cheez-definition"
import { CheezMark } from "../cheez-core/cheez-mark"
import { joinCheezClassNames } from "../cheez-ui/marked-label"
import type { CheezType } from "../mark-catalog"
import "../cheez-ui/cheez-ui.css"

export type MarkedSeparatorOrientation = "horizontal" | "vertical"
export type MarkedSeparatorVariant =
  | "line"
  | "double"
  | "wavy"
  | "zigzag"
  | "directional"
export type MarkedSeparatorDirection = "forward" | "backward"
export type MarkedSeparatorLabelPosition = "start" | "center" | "end"
export type MarkedSeparatorSpacing = "compact" | "normal" | "loose"
export type MarkedSeparatorTone =
  | "neutral"
  | "orange"
  | "purple"
  | "lime"
  | "pink"
  | "cyan"

export const MARKED_SEPARATOR_COLORS: Record<MarkedSeparatorTone, string> = {
  neutral: "#625f59",
  orange: "#ff4f2e",
  purple: "#8f74ff",
  lime: "#b7ff3c",
  pink: "#ff5fa2",
  cyan: "#35d9ff",
}

const DEFAULT_MARKS: Record<
  Exclude<MarkedSeparatorVariant, "directional">,
  CheezType
> = {
  line: "long-underline",
  double: "double-underline",
  wavy: "wavy-underline",
  zigzag: "zigzag-underline",
}

type SegmentPosition = "single" | "start" | "end"

const VERTICAL_PATHS: Record<MarkedSeparatorVariant, readonly string[]> = {
  line: ["M10 -4 C7 22 13 48 9 104"],
  double: [
    "M6 -4 C3 24 9 51 5 104",
    "M14 -2 C11 20 17 55 13 103",
  ],
  wavy: [
    "M10 0 Q3 8 10 16 T10 32 T10 48 T10 64 T10 80 T10 96 T10 104",
  ],
  zigzag: [
    "M7 0 L14 10 L7 20 L14 30 L7 40 L14 50 L7 60 L14 70 L7 80 L14 90 L7 100",
  ],
  directional: ["M10 -4 C7 22 13 48 9 99", "M3 88 L9 102 L17 88"],
}

const CHARACTER_TIMING: Record<
  CheezCharacter,
  { duration: number; rotation: number; width: number }
> = {
  calm: { duration: 440, rotation: 0, width: 2.1 },
  rushed: { duration: 330, rotation: -0.5, width: 2.25 },
  chaotic: { duration: 275, rotation: 0.9, width: 2.4 },
}

function createVerticalDefinition(
  variant: MarkedSeparatorVariant,
  direction: MarkedSeparatorDirection,
  character: CheezCharacter,
): CheezDefinition {
  const appearance = CHARACTER_TIMING[character]
  const sourcePaths = VERTICAL_PATHS[variant]
  const paths =
    variant === "directional" && direction === "backward"
      ? sourcePaths.map((path) => ({
          path,
          transform: "rotate(180 10 50)",
        }))
      : sourcePaths.map((path) => ({ path, transform: undefined }))

  return {
    name: `separator-${variant}-${direction}-${character}`,
    viewBox: "0 0 20 100",
    placement: { top: "-2%", left: "0", width: "100%", height: "104%" },
    layer: "front",
    preserveAspectRatio: "none",
    layers: paths.map(({ path, transform }, index) => ({
      type: "stroke" as const,
      path,
      strokeWidth: appearance.width,
      transform: [
        transform,
        appearance.rotation
          ? `rotate(${appearance.rotation} 10 50)`
          : undefined,
      ]
        .filter(Boolean)
        .join(" ") || undefined,
      timing: {
        duration: appearance.duration,
        delay: index * Math.round(appearance.duration * 0.22),
      },
    })),
  }
}

const VERTICAL_DEFINITIONS = Object.fromEntries(
  (["line", "double", "wavy", "zigzag", "directional"] as const).map(
    (variant) => [
      variant,
      Object.fromEntries(
        (["forward", "backward"] as const).map((direction) => [
          direction,
          Object.fromEntries(
            (["calm", "rushed", "chaotic"] as const).map((character) => [
              character,
              createVerticalDefinition(variant, direction, character),
            ]),
          ) as Record<CheezCharacter, CheezDefinition>,
        ]),
      ) as Record<MarkedSeparatorDirection, Record<CheezCharacter, CheezDefinition>>,
    ],
  ),
) as Record<
  MarkedSeparatorVariant,
  Record<MarkedSeparatorDirection, Record<CheezCharacter, CheezDefinition>>
>

function getDirectionalMark(
  orientation: MarkedSeparatorOrientation,
  direction: MarkedSeparatorDirection,
) {
  if (orientation === "vertical") {
    return direction === "forward" ? "arrow-down" : "arrow-up"
  }

  return direction === "forward" ? "underline-arrow" : "arrow-left"
}

export interface MarkedSeparatorProps
  extends Omit<
    SeparatorProps,
    "children" | "className" | "orientation" | "role"
  > {
  character?: CheezCharacter
  className?: string
  color?: string
  decorative?: boolean
  direction?: MarkedSeparatorDirection
  label?: ReactNode
  labelColor?: string
  labelMark?: CheezType
  labelPosition?: MarkedSeparatorLabelPosition
  length?: CSSProperties["width"]
  mark?: CheezType
  markLabel?: boolean
  orientation?: MarkedSeparatorOrientation
  spacing?: MarkedSeparatorSpacing
  thickness?: number
  tone?: MarkedSeparatorTone
  variant?: MarkedSeparatorVariant
}

export const MarkedSeparator = forwardRef<
  HTMLDivElement,
  MarkedSeparatorProps
>(function MarkedSeparator(
  {
    "aria-label": ariaLabel,
    character = "rushed",
    className,
    color,
    decorative,
    direction = "forward",
    label,
    labelColor,
    labelMark = "marker-swipe",
    labelPosition = "center",
    length,
    mark,
    markLabel = true,
    orientation = "horizontal",
    spacing = "normal",
    style,
    thickness,
    tone = "neutral",
    variant = "line",
    ...props
  },
  ref,
) {
  const hasLabel = label !== undefined && label !== null
  const resolvedDecorative = decorative ?? !hasLabel
  const resolvedColor = color ?? MARKED_SEPARATOR_COLORS[tone]
  const resolvedLabelColor = labelColor ?? resolvedColor
  const resolvedAriaLabel =
    ariaLabel ?? (typeof label === "string" ? label : undefined)
  const rootStyle: CSSProperties = {
    ...style,
    ...(length === undefined
      ? null
      : orientation === "horizontal"
        ? { width: length }
        : { height: length }),
  }

  const resolveMark = (position: SegmentPosition): CheezType => {
    if (mark) return mark
    if (variant !== "directional") return DEFAULT_MARKS[variant]

    const directionalPosition = direction === "forward" ? "end" : "start"
    if (position === "single" || position === directionalPosition) {
      return getDirectionalMark(orientation, direction)
    }

    return "long-underline"
  }

  const renderStroke = (position: SegmentPosition) => (
    <span className="cheez-separator__segment" data-position={position}>
      {orientation === "vertical" ? (
        <CheezMark
          className="cheez-separator__stroke"
          definition={
            VERTICAL_DEFINITIONS[
              variant === "directional" &&
              position !== "single" &&
              position !== (direction === "forward" ? "end" : "start")
                ? "line"
                : variant
            ][direction][character]
          }
          color={resolvedColor}
          thickness={thickness}
          trigger="mount"
          aria-hidden="true"
        >
          <span />
        </CheezMark>
      ) : (
        <Cheez
          className="cheez-separator__stroke"
          type={resolveMark(position)}
          character={character}
          color={resolvedColor}
          thickness={thickness}
          trigger="mount"
          aria-hidden="true"
        >
          <span />
        </Cheez>
      )}
    </span>
  )

  return (
    <BaseSeparator
      {...props}
      ref={ref}
      className={joinCheezClassNames(
        "cheez-ui cheez-separator",
        className,
      )}
      aria-hidden={resolvedDecorative ? true : undefined}
      aria-label={resolvedDecorative ? undefined : resolvedAriaLabel}
      data-direction={direction}
      data-labelled={hasLabel ? "" : undefined}
      data-label-position={labelPosition}
      data-spacing={spacing}
      data-tone={tone}
      data-variant={variant}
      orientation={orientation}
      role={resolvedDecorative ? "presentation" : "separator"}
      style={rootStyle}
    >
      {hasLabel ? renderStroke("start") : renderStroke("single")}

      {hasLabel ? (
        <span className="cheez-separator__label">
          {markLabel ? (
            <Cheez
              className="cheez-separator__label-mark"
              type={labelMark}
              character={character}
              color={resolvedLabelColor}
              fillColor={resolvedLabelColor}
              trigger="mount"
            >
              <span>{label}</span>
            </Cheez>
          ) : (
            label
          )}
        </span>
      ) : null}

      {hasLabel ? renderStroke("end") : null}
    </BaseSeparator>
  )
})
