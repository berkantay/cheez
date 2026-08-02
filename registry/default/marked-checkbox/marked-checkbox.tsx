"use client"

import { Checkbox } from "@base-ui/react/checkbox"
import {
  forwardRef,
  useId,
  useState,
  type ReactNode,
} from "react"
import type { CheckboxRootProps } from "@base-ui/react/checkbox"

import { Cheez } from "../cheez"
import type { CheezCharacter } from "../cheez-core/cheez-definition"
import { joinCheezClassNames } from "../cheez-ui/marked-label"
import type { CheezType } from "../mark-catalog"
import "../cheez-ui/cheez-ui.css"

export interface MarkedCheckboxProps
  extends Omit<CheckboxRootProps, "children" | "className" | "render"> {
  checkedColor?: string
  checkedMark?: CheezType
  children: ReactNode
  character?: CheezCharacter
  className?: string
  description?: ReactNode
  error?: ReactNode
  errorColor?: string
  indeterminateColor?: string
  indeterminateMark?: CheezType
  interactionColor?: string
  interactionMark?: CheezType
  labelPosition?: "start" | "end"
  marked?: boolean
  size?: "small" | "medium" | "large"
  thickness?: number
}

export const MarkedCheckbox = forwardRef<HTMLElement, MarkedCheckboxProps>(
  function MarkedCheckbox(
    {
      checkedColor = "#b7ff3c",
      checkedMark = "check",
      children,
      character = "rushed",
      className,
      description,
      disabled,
      error,
      errorColor = "#ff5fa2",
      id,
      indeterminateColor = "#ff4f2e",
      indeterminateMark = "short-underline",
      interactionColor = "#8f74ff",
      interactionMark = "rounded-box",
      labelPosition = "end",
      marked,
      onBlur,
      onFocus,
      onPointerDown,
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
    const controlId = id ?? `cheez-checkbox-${generatedId}`
    const descriptionId = `${controlId}-description`
    const errorId = `${controlId}-error`
    const [focused, setFocused] = useState(false)
    const [hovered, setHovered] = useState(false)

    return (
      <label
        className={joinCheezClassNames(
          "cheez-ui cheez-checkbox__field",
          className,
        )}
        data-disabled={disabled ? "" : undefined}
        data-invalid={error ? "" : undefined}
        data-label-position={labelPosition}
        data-size={size}
      >
        <Checkbox.Root
          {...props}
          ref={ref}
          id={controlId}
          className="cheez-checkbox"
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
          onPointerDown={(event) => {
            onPointerDown?.(event)
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
              !state.disabled &&
              (marked ??
                (Boolean(error) ||
                  state.checked ||
                  state.indeterminate ||
                  focused ||
                  hovered))
            const activeMark = error
              ? interactionMark
              : state.indeterminate
                ? indeterminateMark
                : state.checked
                  ? checkedMark
                  : interactionMark
            const activeColor = error
              ? errorColor
              : state.indeterminate
                ? indeterminateColor
                : state.checked
                  ? checkedColor
                  : interactionColor
            const visualState = error
              ? "error"
              : state.indeterminate
                ? "indeterminate"
                : state.checked
                  ? "checked"
                  : "interaction"

            return (
              <span {...rootProps} data-cheez-state={visualState}>
                <Cheez
                  className="cheez-checkbox__mark"
                  type={activeMark}
                  character={character}
                  color={activeColor}
                  thickness={thickness}
                  trigger={active ? "mount" : "manual"}
                >
                  <span className="cheez-checkbox__box" aria-hidden="true" />
                </Cheez>
              </span>
            )
          }}
        />

        <span className="cheez-checkbox__copy">
          <span className="cheez-checkbox__label">
            {children}
            {required ? (
              <span className="cheez-checkbox__required" aria-hidden="true">
                *
              </span>
            ) : null}
          </span>
          {error ? (
            <span className="cheez-checkbox__message" id={errorId} role="alert">
              {error}
            </span>
          ) : description ? (
            <span className="cheez-checkbox__description" id={descriptionId}>
              {description}
            </span>
          ) : null}
        </span>
      </label>
    )
  },
)
