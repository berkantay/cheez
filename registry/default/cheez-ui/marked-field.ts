"use client"

import {
  useId,
  useState,
  type AriaAttributes,
  type ReactNode,
} from "react"

import type { CheezCharacter } from "../cheez-core/cheez-definition"
import type { CheezType } from "../mark-catalog"

type FieldValue = string | number | readonly string[]

export interface MarkedFieldVisualProps {
  character?: CheezCharacter
  errorColor?: string
  errorMark?: CheezType
  filled?: boolean
  interactionColor?: string
  interactionMark?: CheezType
  mark?: CheezType
  markColor?: string
  marked?: boolean
  thickness?: number
}

interface UseMarkedFieldOptions extends MarkedFieldVisualProps {
  ariaDescribedBy?: string
  ariaInvalid?: AriaAttributes["aria-invalid"]
  defaultValue?: FieldValue
  description?: ReactNode
  disabled?: boolean
  error?: ReactNode
  id?: string
  readOnly?: boolean
  value?: FieldValue
}

export function useMarkedField({
  ariaDescribedBy,
  ariaInvalid,
  defaultValue,
  description,
  disabled,
  error,
  errorColor = "#ff5fa2",
  errorMark = "wavy-underline",
  filled,
  id,
  interactionColor,
  interactionMark = "short-underline",
  mark = "rounded-box",
  markColor,
  marked,
  readOnly,
  value,
}: UseMarkedFieldOptions) {
  const generatedId = useId().replaceAll(":", "")
  const controlId = id ?? `cheez-field-${generatedId}`
  const descriptionId = `${controlId}-description`
  const errorId = `${controlId}-error`
  const [focused, setFocused] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [uncontrolledFilled, setUncontrolledFilled] = useState(
    defaultValue !== undefined && String(defaultValue).length > 0,
  )

  const invalid =
    Boolean(error) || ariaInvalid === true || ariaInvalid === "true"
  const hasValue =
    filled ??
    (value !== undefined ? String(value).length > 0 : uncontrolledFilled)
  const interactive = !disabled && !readOnly
  const active =
    !disabled &&
    (marked ?? (invalid || (interactive && (focused || hovered))))
  const activeMark = invalid
    ? errorMark
    : focused || marked
      ? mark
      : interactionMark
  const activeColor = invalid
    ? errorColor
    : focused || marked
      ? markColor
      : (interactionColor ?? markColor)
  const describedBy = [
    ariaDescribedBy,
    description ? descriptionId : undefined,
    error ? errorId : undefined,
  ]
    .filter(Boolean)
    .join(" ")

  return {
    active,
    activeColor,
    activeMark,
    blur: () => setFocused(false),
    controlId,
    describedBy: describedBy || undefined,
    descriptionId,
    errorId,
    focus: () => setFocused(true),
    focused,
    hasValue,
    hovered,
    invalid,
    pointerEnter: () => setHovered(true),
    pointerLeave: () => setHovered(false),
    setCurrentValue: (currentValue: string) =>
      setUncontrolledFilled(currentValue.length > 0),
  }
}
