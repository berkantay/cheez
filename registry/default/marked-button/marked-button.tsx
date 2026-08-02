"use client"

import {
  forwardRef,
  useState,
  type ButtonHTMLAttributes,
  type ReactNode,
} from "react"

import type { CheezCharacter } from "../cheez-core/cheez-definition"
import { CheezMark } from "../cheez-core/cheez-mark"
import type { CheezType } from "../mark-catalog"
import {
  joinCheezClassNames,
  MarkedLabel,
} from "../cheez-ui/marked-label"
import "../cheez-ui/cheez-ui.css"
import { getButtonFrameDefinition } from "./button-frame.definition"

export interface MarkedButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  character?: CheezCharacter
  fillColor?: string
  loading?: boolean
  loadingLabel?: ReactNode
  mark?: CheezType
  markColor?: string
  marked?: boolean
  size?: "small" | "medium" | "large"
  thickness?: number
  variant?: "outline" | "solid" | "quiet"
}

export const MarkedButton = forwardRef<HTMLButtonElement, MarkedButtonProps>(
  function MarkedButton(
    {
      character,
      children,
      className,
      disabled,
      fillColor = "var(--cheez-foreground, #f4f0e6)",
      loading = false,
      loadingLabel = "working",
      mark,
      markColor,
      marked,
      onBlur,
      onFocus,
      onPointerDown,
      onPointerEnter,
      onPointerLeave,
      size = "medium",
      thickness,
      variant = "outline",
      ...props
    },
    ref,
  ) {
    const [replayKey, setReplayKey] = useState(0)
    const [focused, setFocused] = useState(false)
    const [hovered, setHovered] = useState(false)
    const unavailable = disabled || loading
    const interactionActive = !unavailable && (focused || hovered)
    const markActive =
      loading || (marked ?? (variant !== "quiet" || interactionActive))
    const resolvedMark = mark ?? (variant === "quiet" ? "underline" : "rounded-box")
    const resolvedCharacter = character ?? "rushed"
    const content = loading ? loadingLabel : children

    const replayBorder = () => {
      if (!unavailable && markActive) {
        setReplayKey((key) => key + 1)
      }
    }

    return (
      <button
        {...props}
        ref={ref}
        className={joinCheezClassNames("cheez-ui cheez-button", className)}
        aria-busy={loading || undefined}
        data-active={markActive || undefined}
        data-loading={loading || undefined}
        data-size={size}
        data-variant={variant}
        disabled={unavailable}
        onBlur={(event) => {
          setFocused(false)
          onBlur?.(event)
        }}
        onFocus={(event) => {
          setFocused(true)
          replayBorder()
          onFocus?.(event)
        }}
        onPointerEnter={(event) => {
          setHovered(true)
          replayBorder()
          onPointerEnter?.(event)
        }}
        onPointerLeave={(event) => {
          setHovered(false)
          onPointerLeave?.(event)
        }}
        onPointerDown={(event) => {
          replayBorder()
          onPointerDown?.(event)
        }}
      >
        {variant === "solid" ? (
          <CheezMark
            key={`${markActive ? "active" : "idle"}-${replayKey}`}
            className="cheez-button__mark"
            color={markColor ?? "var(--cheez-accent, #ff4f2e)"}
            definition={getButtonFrameDefinition(resolvedMark, resolvedCharacter)}
            fillColor={fillColor}
            thickness={thickness}
            trigger={markActive ? "mount" : "manual"}
          >
            {content}
          </CheezMark>
        ) : (
          <MarkedLabel
            active={markActive}
            animationKey={replayKey}
            character={resolvedCharacter}
            className="cheez-button__mark"
            color={markColor}
            mark={resolvedMark}
            thickness={thickness}
          >
            {content}
          </MarkedLabel>
        )}
      </button>
    )
  },
)
