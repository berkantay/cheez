"use client"

import {
  forwardRef,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
  type TextareaHTMLAttributes,
} from "react"

import { Cheez } from "../cheez"
import {
  useMarkedField,
  type MarkedFieldVisualProps,
} from "../cheez-ui/marked-field"
import { joinCheezClassNames } from "../cheez-ui/marked-label"
import "../cheez-ui/cheez-ui.css"

export interface MarkedTextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement>,
    MarkedFieldVisualProps {
  autoGrow?: boolean
  className?: string
  description?: ReactNode
  error?: ReactNode
  label?: ReactNode
  maxRows?: number
  resize?: "none" | "vertical"
  showCount?: boolean
  textareaClassName?: string
  textareaSize?: "small" | "medium" | "large"
}

export const MarkedTextarea = forwardRef<
  HTMLTextAreaElement,
  MarkedTextareaProps
>(function MarkedTextarea(
  {
    "aria-describedby": ariaDescribedBy,
    "aria-invalid": ariaInvalid,
    autoGrow = false,
    character = "rushed",
    className,
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
    label,
    mark,
    markColor,
    marked,
    maxLength,
    maxRows = 10,
    onBlur,
    onChange,
    onFocus,
    onPointerEnter,
    onPointerLeave,
    readOnly,
    resize = "vertical",
    rows = 4,
    showCount = maxLength !== undefined,
    textareaClassName,
    textareaSize = "medium",
    thickness,
    value,
    ...props
  },
  forwardedRef,
) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const [uncontrolledLength, setUncontrolledLength] = useState(
    defaultValue === undefined ? 0 : String(defaultValue).length,
  )
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
  const currentLength =
    value === undefined ? uncontrolledLength : String(value).length

  const setRefs = useCallback(
    (node: HTMLTextAreaElement | null) => {
      textareaRef.current = node

      if (typeof forwardedRef === "function") {
        forwardedRef(node)
      } else if (forwardedRef) {
        forwardedRef.current = node
      }
    },
    [forwardedRef],
  )

  const resizeTextarea = useCallback(() => {
    const textarea = textareaRef.current
    if (!autoGrow || !textarea) return

    textarea.style.height = "auto"
    const styles = window.getComputedStyle(textarea)
    const lineHeight = Number.parseFloat(styles.lineHeight) || 20
    const padding =
      Number.parseFloat(styles.paddingTop) +
      Number.parseFloat(styles.paddingBottom)
    const maxHeight = lineHeight * maxRows + padding
    textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`
    textarea.style.overflowY =
      textarea.scrollHeight > maxHeight ? "auto" : "hidden"
  }, [autoGrow, maxRows])

  useLayoutEffect(() => {
    resizeTextarea()
  }, [resizeTextarea, value])

  return (
    <div
      className={joinCheezClassNames("cheez-ui cheez-textarea", className)}
      data-disabled={disabled ? "" : undefined}
      data-filled={field.hasValue ? "" : undefined}
      data-focused={field.focused ? "" : undefined}
      data-hovered={field.hovered ? "" : undefined}
      data-invalid={field.invalid ? "" : undefined}
      data-readonly={readOnly ? "" : undefined}
      data-resize={autoGrow ? "auto" : resize}
      data-size={textareaSize}
    >
      {label ? (
        <label className="cheez-textarea__label" htmlFor={field.controlId}>
          {label}
        </label>
      ) : null}

      <Cheez
        className="cheez-textarea__mark"
        type={field.activeMark}
        character={character}
        color={field.activeColor}
        thickness={thickness}
        trigger={field.active ? "mount" : "manual"}
      >
        <span className="cheez-textarea__control">
          <textarea
            {...props}
            ref={setRefs}
            id={field.controlId}
            aria-describedby={field.describedBy}
            aria-invalid={field.invalid || undefined}
            className={joinCheezClassNames(
              "cheez-textarea__native",
              textareaClassName,
            )}
            defaultValue={defaultValue}
            disabled={disabled}
            maxLength={maxLength}
            readOnly={readOnly}
            rows={rows}
            value={value}
            onBlur={(event) => {
              field.blur()
              onBlur?.(event)
            }}
            onChange={(event) => {
              const currentValue = event.currentTarget.value
              field.setCurrentValue(currentValue)
              setUncontrolledLength(currentValue.length)
              resizeTextarea()
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
        </span>
      </Cheez>

      {error || description || showCount ? (
        <span className="cheez-textarea__footer">
          {error ? (
            <span
              className="cheez-textarea__message"
              id={field.errorId}
              role="alert"
            >
              {error}
            </span>
          ) : description ? (
            <span
              className="cheez-textarea__description"
              id={field.descriptionId}
            >
              {description}
            </span>
          ) : (
            <span />
          )}
          {showCount ? (
            <span className="cheez-textarea__count" aria-live="polite">
              {currentLength}{maxLength === undefined ? "" : ` / ${maxLength}`}
            </span>
          ) : null}
        </span>
      ) : null}
    </div>
  )
})
