"use client"

import { Progress } from "@base-ui/react/progress"
import { forwardRef, useId, type CSSProperties, type ReactNode } from "react"
import type { ProgressRootProps } from "@base-ui/react/progress"

import { Cheez } from "../cheez"
import type { CheezCharacter } from "../cheez-core/cheez-definition"
import { joinCheezClassNames } from "../cheez-ui/marked-label"
import type { CheezType } from "../mark-catalog"
import "../cheez-ui/cheez-ui.css"

export type MarkedProgressVariant = "line" | "marker" | "boxed"
export type MarkedProgressValuePosition = "label" | "track" | "none"

const DEFAULT_INDICATOR_MARKS: Record<MarkedProgressVariant, CheezType> = {
  line: "long-underline",
  marker: "marker-swipe",
  boxed: "highlight-band",
}

function clampPercentage(value: number | null, min: number, max: number) {
  if (value === null || max <= min) return 0
  return Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100))
}

export interface MarkedProgressProps
  extends Omit<ProgressRootProps, "children" | "className" | "value"> {
  buffer?: number
  bufferColor?: string
  character?: CheezCharacter
  className?: string
  color?: string
  completeColor?: string
  completeMark?: CheezType
  description?: ReactNode
  formatValue?: (value: number | null, percentage: number) => ReactNode
  indicatorMark?: CheezType
  label: ReactNode
  segments?: number
  size?: "small" | "medium" | "large"
  thickness?: number
  trackColor?: string
  trackMark?: CheezType
  value: number | null
  valuePosition?: MarkedProgressValuePosition
  variant?: MarkedProgressVariant
}

export const MarkedProgress = forwardRef<HTMLDivElement, MarkedProgressProps>(
  function MarkedProgress(
    {
      "aria-describedby": ariaDescribedBy,
      buffer,
      bufferColor = "rgba(143, 116, 255, 0.42)",
      character = "rushed",
      className,
      color = "#8f74ff",
      completeColor = "#b7ff3c",
      completeMark = "check",
      description,
      formatValue,
      indicatorMark,
      label,
      max = 100,
      min = 0,
      segments = 0,
      size = "medium",
      style,
      thickness,
      trackColor = "rgba(244, 240, 230, 0.2)",
      trackMark = "rounded-box",
      value,
      valuePosition = "label",
      variant = "line",
      ...props
    },
    ref,
  ) {
    const generatedId = useId()
    const descriptionId = description
      ? `cheez-progress-description-${generatedId.replaceAll(":", "")}`
      : undefined
    const normalizedValue =
      value === null ? null : Math.min(max, Math.max(min, value))
    const percentage = clampPercentage(normalizedValue, min, max)
    const bufferPercentage = clampPercentage(buffer ?? null, min, max)
    const complete = normalizedValue === max
    const segmentCount = Math.min(20, Math.max(0, Math.floor(segments)))
    const resolvedIndicatorMark =
      indicatorMark ?? DEFAULT_INDICATOR_MARKS[variant]
    const resolvedColor = complete ? completeColor : color
    const describedBy = [ariaDescribedBy, descriptionId]
      .filter(Boolean)
      .join(" ")
    const renderValue = (_formattedValue: string | null, currentValue: number | null) =>
      formatValue
        ? formatValue(currentValue, percentage)
        : currentValue === null
          ? null
          : `${Math.round(percentage)}%`

    return (
      <Progress.Root
        {...props}
        ref={ref}
        className={joinCheezClassNames(
          "cheez-ui cheez-progress",
          className,
        )}
        aria-describedby={describedBy || undefined}
        data-size={size}
        data-variant={variant}
        max={max}
        min={min}
        value={normalizedValue}
        style={
          {
            ...style,
            "--cheez-progress-buffer": `${bufferPercentage}%`,
            "--cheez-progress-color": resolvedColor,
            "--cheez-progress-track": trackColor,
            "--cheez-progress-value": `${percentage}%`,
          } as CSSProperties
        }
      >
        <div className="cheez-progress__header">
          <Progress.Label className="cheez-progress__label">
            {label}
          </Progress.Label>

          <div className="cheez-progress__meta">
            {complete ? (
              <Cheez
                className="cheez-progress__complete"
                type={completeMark}
                character={character}
                color={completeColor}
                thickness={thickness}
                trigger="mount"
              >
                <span aria-hidden="true" />
              </Cheez>
            ) : null}
            {valuePosition === "label" ? (
              <Progress.Value className="cheez-progress__value">
                {renderValue}
              </Progress.Value>
            ) : null}
          </div>
        </div>

        <Progress.Track className="cheez-progress__track">
          {variant === "boxed" ? (
            <Cheez
              className="cheez-progress__track-frame"
              type={trackMark}
              character={character}
              color={trackColor}
              thickness={thickness}
              trigger="mount"
            >
              <span aria-hidden="true" />
            </Cheez>
          ) : null}

          {segmentCount > 1 ? (
            <span className="cheez-progress__segments" aria-hidden="true">
              {Array.from({ length: segmentCount - 1 }, (_, index) => (
                <span
                  key={index}
                  style={{ left: `${((index + 1) / segmentCount) * 100}%` }}
                />
              ))}
            </span>
          ) : null}

          {buffer !== undefined && normalizedValue !== null ? (
            <span className="cheez-progress__buffer" aria-hidden="true">
              <Cheez
                type={resolvedIndicatorMark}
                character={character}
                color={bufferColor}
                fillColor={bufferColor}
                thickness={thickness}
                trigger="mount"
              >
                <span />
              </Cheez>
            </span>
          ) : null}

          <Progress.Indicator className="cheez-progress__indicator">
            <Cheez
              key={`${resolvedIndicatorMark}-${normalizedValue === null ? "moving" : "fixed"}-${complete ? "complete" : "active"}`}
              className="cheez-progress__ink"
              type={resolvedIndicatorMark}
              character={character}
              color={resolvedColor}
              fillColor={resolvedColor}
              thickness={thickness}
              trigger="mount"
            >
              <span aria-hidden="true" />
            </Cheez>
          </Progress.Indicator>

          {valuePosition === "track" ? (
            <Progress.Value className="cheez-progress__track-value">
              {renderValue}
            </Progress.Value>
          ) : null}
        </Progress.Track>

        {description ? (
          <p className="cheez-progress__description" id={descriptionId}>
            {description}
          </p>
        ) : null}
      </Progress.Root>
    )
  },
)
