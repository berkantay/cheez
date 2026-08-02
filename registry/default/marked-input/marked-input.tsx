"use client"

import {
  forwardRef,
  useState,
  type InputHTMLAttributes,
  type ReactNode,
} from "react"

import { Cheez } from "../cheez"
import {
  useMarkedField,
  type MarkedFieldVisualProps,
} from "../cheez-ui/marked-field"
import { joinCheezClassNames } from "../cheez-ui/marked-label"
import "../cheez-ui/cheez-ui.css"

export interface MarkedInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size">,
    MarkedFieldVisualProps {
  className?: string
  description?: ReactNode
  error?: ReactNode
  hidePasswordLabel?: string
  inputClassName?: string
  inputSize?: "small" | "medium" | "large"
  label?: ReactNode
  leading?: ReactNode
  revealable?: boolean
  showPasswordLabel?: string
  trailing?: ReactNode
}

export const MarkedInput = forwardRef<HTMLInputElement, MarkedInputProps>(
  function MarkedInput(
    {
      "aria-describedby": ariaDescribedBy,
      "aria-invalid": ariaInvalid,
      character = "rushed",
      className,
      defaultValue,
      description,
      disabled,
      error,
      errorColor = "#ff5fa2",
      errorMark = "wavy-underline",
      filled,
      hidePasswordLabel = "hide password",
      id,
      inputClassName,
      inputSize = "medium",
      interactionColor,
      interactionMark = "short-underline",
      label,
      leading,
      mark = "rounded-box",
      markColor,
      marked,
      onBlur,
      onChange,
      onFocus,
      onPointerEnter,
      onPointerLeave,
      readOnly,
      revealable = false,
      showPasswordLabel = "show password",
      thickness,
      trailing,
      type = "text",
      value,
      ...props
    },
    ref,
  ) {
    const [passwordVisible, setPasswordVisible] = useState(false)
    const hasPasswordToggle = type === "password" && revealable
    const resolvedType = hasPasswordToggle && passwordVisible ? "text" : type
    const field = useMarkedField({
      ariaDescribedBy,
      ariaInvalid,
      defaultValue,
      description,
      disabled,
      error,
      errorColor,
      errorMark,
      filled,
      id,
      interactionColor,
      interactionMark,
      mark,
      markColor,
      marked,
      readOnly,
      value,
    })

    return (
      <div
        className={joinCheezClassNames("cheez-ui cheez-input", className)}
        data-disabled={disabled ? "" : undefined}
        data-filled={field.hasValue ? "" : undefined}
        data-focused={field.focused ? "" : undefined}
        data-hovered={field.hovered ? "" : undefined}
        data-invalid={field.invalid ? "" : undefined}
        data-readonly={readOnly ? "" : undefined}
        data-size={inputSize}
      >
        {label ? (
          <label className="cheez-input__label" htmlFor={field.controlId}>
            {label}
          </label>
        ) : null}

        <Cheez
          className="cheez-input__mark"
          type={field.activeMark}
          character={character}
          color={field.activeColor}
          thickness={thickness}
          trigger={field.active ? "mount" : "manual"}
        >
          <span className="cheez-input__control">
            {leading ? (
              <span className="cheez-input__adornment" aria-hidden="true">
                {leading}
              </span>
            ) : null}
            <input
              {...props}
              ref={ref}
              id={field.controlId}
              aria-describedby={field.describedBy}
              aria-invalid={field.invalid || undefined}
              className={joinCheezClassNames(
                "cheez-input__native",
                inputClassName,
              )}
              defaultValue={defaultValue}
              disabled={disabled}
              readOnly={readOnly}
              type={resolvedType}
              value={value}
              onBlur={(event) => {
                field.blur()
                onBlur?.(event)
              }}
              onChange={(event) => {
                field.setCurrentValue(event.currentTarget.value)
                onChange?.(event)
              }}
              onFocus={(event) => {
                field.focus()
                onFocus?.(event)
              }}
              onPointerEnter={(event) => {
                field.pointerEnter()
                onPointerEnter?.(event)
              }}
              onPointerLeave={(event) => {
                field.pointerLeave()
                onPointerLeave?.(event)
              }}
            />
            {trailing ? (
              <span className="cheez-input__adornment" aria-hidden="true">
                {trailing}
              </span>
            ) : null}
            {hasPasswordToggle ? (
              <button
                className="cheez-input__password-toggle"
                type="button"
                aria-label={
                  passwordVisible ? hidePasswordLabel : showPasswordLabel
                }
                aria-pressed={passwordVisible}
                disabled={disabled}
                onBlur={field.blur}
                onClick={() => setPasswordVisible((visible) => !visible)}
                onFocus={field.focus}
                onPointerDown={(event) => event.preventDefault()}
              >
                {passwordVisible ? "hide" : "show"}
              </button>
            ) : null}
          </span>
        </Cheez>

        {error ? (
          <span className="cheez-input__message" id={field.errorId} role="alert">
            {error}
          </span>
        ) : description ? (
          <span className="cheez-input__description" id={field.descriptionId}>
            {description}
          </span>
        ) : null}
      </div>
    )
  },
)
