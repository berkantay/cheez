"use client"

import {
  forwardRef,
  useState,
  type ComponentPropsWithoutRef,
  type MouseEvent,
  type ReactNode,
} from "react"

import { Cheez } from "../cheez"
import type { CheezCharacter } from "../cheez-core/cheez-definition"
import {
  MARKED_FEEDBACK_APPEARANCES,
  type MarkedFeedbackType,
} from "../cheez-ui/marked-feedback"
import { joinCheezClassNames } from "../cheez-ui/marked-label"
import type { CheezType } from "../mark-catalog"
import "../cheez-ui/cheez-ui.css"

export type MarkedBadgeTone = MarkedFeedbackType
export type MarkedBadgeVariant = "outline" | "filled" | "quiet"

export interface MarkedBadgeProps
  extends Omit<ComponentPropsWithoutRef<"span">, "children" | "color"> {
  announceTone?: boolean
  character?: CheezCharacter
  children?: ReactNode
  closeColor?: string
  count?: number
  defaultVisible?: boolean
  fillMark?: CheezType
  frameColor?: string
  frameMark?: CheezType
  getCountLabel?: (count: number, displayedCount: string) => string
  maxCount?: number
  onRemove?: (event: MouseEvent<HTMLButtonElement>) => void
  onVisibleChange?: (visible: boolean) => void
  quietMark?: CheezType
  removable?: boolean
  removeLabel?: string
  showStatus?: boolean
  size?: "small" | "medium" | "large"
  statusColor?: string
  statusMark?: CheezType
  statusPosition?: "start" | "end"
  thickness?: number
  tone?: MarkedBadgeTone
  variant?: MarkedBadgeVariant
  visible?: boolean
}

export const MarkedBadge = forwardRef<HTMLSpanElement, MarkedBadgeProps>(
  function MarkedBadge(
    {
      announceTone = true,
      character = "rushed",
      children,
      className,
      closeColor = "#ff5fa2",
      count,
      defaultVisible = true,
      fillMark = "marker-swipe",
      frameColor,
      frameMark = "rounded-box",
      getCountLabel,
      maxCount = 99,
      onRemove,
      onVisibleChange,
      quietMark = "underline",
      removable = false,
      removeLabel = "remove badge",
      showStatus,
      size = "medium",
      statusColor,
      statusMark,
      statusPosition = "start",
      thickness,
      tone = "default",
      variant = "outline",
      visible: controlledVisible,
      ...props
    },
    ref,
  ) {
    const [uncontrolledVisible, setUncontrolledVisible] =
      useState(defaultVisible)
    const visible = controlledVisible ?? uncontrolledVisible

    if (!visible) return null

    const appearance = MARKED_FEEDBACK_APPEARANCES[tone]
    const resolvedColor = frameColor ?? appearance.color
    const resolvedStatusColor = statusColor ?? appearance.color
    const resolvedStatusMark = statusMark ?? appearance.mark
    const resolvedShowStatus = showStatus ?? tone !== "default"
    const normalizedMaxCount = Math.max(0, Math.floor(maxCount))
    const normalizedCount =
      count === undefined ? undefined : Math.max(0, Math.floor(count))
    const displayedCount =
      normalizedCount === undefined
        ? undefined
        : normalizedCount > normalizedMaxCount
          ? `${normalizedMaxCount}+`
          : String(normalizedCount)
    const content = children ?? displayedCount
    const countLabel =
      normalizedCount !== undefined && displayedCount && getCountLabel
        ? getCountLabel(normalizedCount, displayedCount)
        : undefined

    const hide = () => {
      if (controlledVisible === undefined) {
        setUncontrolledVisible(false)
      }
      onVisibleChange?.(false)
    }

    const status = resolvedShowStatus ? (
      tone === "loading" && statusMark === undefined ? (
        <span
          className="cheez-badge__loading"
          style={{ color: resolvedStatusColor }}
          aria-hidden="true"
        >
          <span />
          <span />
          <span />
        </span>
      ) : (
        <Cheez
          className="cheez-badge__status"
          type={resolvedStatusMark}
          character={character}
          color={resolvedStatusColor}
          thickness={thickness}
          trigger="mount"
        >
          <span aria-hidden="true" />
        </Cheez>
      )
    ) : null

    return (
      <span
        {...props}
        ref={ref}
        className={joinCheezClassNames("cheez-ui cheez-badge", className)}
        data-count={normalizedCount !== undefined ? "" : undefined}
        data-size={size}
        data-status-position={statusPosition}
        data-tone={tone}
        data-variant={variant}
      >
        {variant === "outline" ? (
          <Cheez
            className="cheez-badge__frame"
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
            className="cheez-badge__fill"
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
            className="cheez-badge__quiet-mark"
            type={quietMark}
            character={character}
            color={resolvedColor}
            thickness={thickness}
            trigger="mount"
          >
            <span aria-hidden="true" />
          </Cheez>
        ) : null}

        <span className="cheez-badge__content">
          {announceTone && tone !== "default" ? (
            <span className="cheez-badge__sr-only">{tone}: </span>
          ) : null}
          {statusPosition === "start" ? status : null}
          <span aria-hidden={countLabel ? "true" : undefined}>{content}</span>
          {countLabel ? (
            <span className="cheez-badge__sr-only">{countLabel}</span>
          ) : null}
          {statusPosition === "end" ? status : null}
          {removable ? (
            <button
              type="button"
              className="cheez-badge__remove"
              aria-label={removeLabel}
              onClick={(event) => {
                onRemove?.(event)
                if (!event.defaultPrevented) hide()
              }}
            >
              <Cheez
                type="cross"
                character={character}
                color={closeColor}
                thickness={thickness}
                trigger="mount"
              >
                <span aria-hidden="true" />
              </Cheez>
            </button>
          ) : null}
        </span>
      </span>
    )
  },
)
