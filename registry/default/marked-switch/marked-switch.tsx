"use client"

import { Switch } from "@base-ui/react/switch"
import { forwardRef, useId, useState, type ReactNode } from "react"
import type { SwitchRootProps } from "@base-ui/react/switch"

import { Cheez } from "../cheez"
import type { CheezCharacter } from "../cheez-core/cheez-definition"
import { joinCheezClassNames } from "../cheez-ui/marked-label"
import type { CheezType } from "../mark-catalog"
import "../cheez-ui/cheez-ui.css"

export interface MarkedSwitchProps
  extends Omit<SwitchRootProps, "className" | "render"> {
  checkedColor?: string
  checkedMark?: CheezType
  children: ReactNode
  character?: CheezCharacter
  className?: string
  description?: ReactNode
  error?: ReactNode
  interactionColor?: string
  interactionMark?: CheezType
  labelPosition?: "start" | "end"
  marked?: boolean
  size?: "small" | "medium" | "large"
  thickness?: number
}

export const MarkedSwitch = forwardRef<HTMLElement, MarkedSwitchProps>(
  function MarkedSwitch(
    {
      checkedColor = "#b7ff3c",
      checkedMark = "rounded-box",
      children,
      character = "rushed",
      className,
      description,
      disabled = false,
      error,
      id,
      interactionColor = "#8f74ff",
      interactionMark = "loose-circle",
      labelPosition = "end",
      marked,
      onBlur,
      onFocus,
      onPointerEnter,
      onPointerLeave,
      required,
      size = "medium",
      thickness,
      ...props
    },
    ref,
  ) {
    const generatedId = useId().replaceAll(":", "")
    const controlId = id ?? `cheez-switch-${generatedId}`
    const descriptionId = `${controlId}-description`
    const errorId = `${controlId}-error`
    const [focused, setFocused] = useState(false)
    const [hovered, setHovered] = useState(false)

    return (
      <label
        className={joinCheezClassNames(
          "cheez-ui cheez-switch__field",
          className,
        )}
        data-disabled={disabled ? "" : undefined}
        data-invalid={error ? "" : undefined}
        data-label-position={labelPosition}
        data-size={size}
      >
        <Switch.Root
          {...props}
          ref={ref}
          id={controlId}
          className="cheez-switch"
          aria-describedby={
            error ? errorId : description ? descriptionId : undefined
          }
          aria-invalid={error ? true : undefined}
          disabled={disabled}
          required={required}
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
          render={(rootProps, state) => {
            const active =
              !disabled &&
              (marked ?? (Boolean(error) || state.checked || focused || hovered))
            const activeMark = state.checked ? checkedMark : interactionMark
            const activeColor = error
              ? "#ff5fa2"
              : state.checked
                ? checkedColor
                : interactionColor

            return (
              <span
                {...rootProps}
                data-cheez-active={active ? "" : undefined}
                data-cheez-state={error ? "error" : state.checked ? "on" : "off"}
              >
                <Cheez
                  className="cheez-switch__mark"
                  type={activeMark}
                  character={character}
                  color={activeColor}
                  thickness={thickness}
                  trigger={active ? "mount" : "manual"}
                >
                  <span className="cheez-switch__track" aria-hidden="true">
                    <Switch.Thumb className="cheez-switch__thumb" />
                  </span>
                </Cheez>
              </span>
            )
          }}
        />

        <span className="cheez-switch__copy">
          <span className="cheez-switch__label">
            {children}
            {required ? (
              <span className="cheez-switch__required" aria-hidden="true">
                *
              </span>
            ) : null}
          </span>
          {error ? (
            <span className="cheez-switch__message" id={errorId} role="alert">
              {error}
            </span>
          ) : description ? (
            <span className="cheez-switch__description" id={descriptionId}>
              {description}
            </span>
          ) : null}
        </span>
      </label>
    )
  },
)
