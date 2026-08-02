"use client"

import { Radio } from "@base-ui/react/radio"
import { RadioGroup } from "@base-ui/react/radio-group"
import {
  createContext,
  forwardRef,
  useContext,
  useId,
  useState,
  type ReactNode,
} from "react"
import type { RadioRootProps } from "@base-ui/react/radio"
import type { RadioGroupProps } from "@base-ui/react/radio-group"

import { Cheez } from "../cheez"
import type { CheezCharacter } from "../cheez-core/cheez-definition"
import { joinCheezClassNames } from "../cheez-ui/marked-label"
import type { CheezType } from "../mark-catalog"
import "../cheez-ui/cheez-ui.css"

type RadioSize = "small" | "medium" | "large"

interface RadioVisualContextValue {
  character: CheezCharacter
  disabled: boolean
  error: boolean
  interactionColor: string
  interactionMark: CheezType
  selectedColor: string
  selectedMark: CheezType
  size: RadioSize
  thickness?: number
}

const RadioVisualContext = createContext<RadioVisualContextValue | null>(null)

function useRadioVisuals() {
  const context = useContext(RadioVisualContext)

  if (!context) {
    throw new Error("MarkedRadio must be used inside MarkedRadioGroup")
  }

  return context
}

export interface MarkedRadioGroupProps
  extends Omit<RadioGroupProps<string>, "className"> {
  character?: CheezCharacter
  children: ReactNode
  className?: string
  description?: ReactNode
  error?: ReactNode
  interactionColor?: string
  interactionMark?: CheezType
  label: ReactNode
  orientation?: "horizontal" | "vertical"
  selectedColor?: string
  selectedMark?: CheezType
  size?: RadioSize
  thickness?: number
}

export const MarkedRadioGroup = forwardRef<
  HTMLDivElement,
  MarkedRadioGroupProps
>(function MarkedRadioGroup(
  {
    "aria-describedby": ariaDescribedBy,
    "aria-labelledby": ariaLabelledBy,
    character = "rushed",
    children,
    className,
    description,
    disabled = false,
    error,
    interactionColor = "#8f74ff",
    interactionMark = "loose-circle",
    label,
    orientation = "vertical",
    required = false,
    selectedColor = "#b7ff3c",
    selectedMark = "asterisk",
    size = "medium",
    thickness,
    ...props
  },
  ref,
) {
  const generatedId = useId().replaceAll(":", "")
  const labelId = `cheez-radio-${generatedId}-label`
  const descriptionId = `cheez-radio-${generatedId}-description`
  const errorId = `cheez-radio-${generatedId}-error`
  const describedBy =
    ariaDescribedBy ?? (error ? errorId : description ? descriptionId : undefined)

  const visuals: RadioVisualContextValue = {
    character,
    disabled,
    error: Boolean(error),
    interactionColor,
    interactionMark,
    selectedColor,
    selectedMark,
    size,
    thickness,
  }

  return (
    <fieldset
      className={joinCheezClassNames(
        "cheez-ui cheez-radio-group__field",
        className,
      )}
      data-disabled={disabled ? "" : undefined}
      data-invalid={error ? "" : undefined}
      data-orientation={orientation}
      data-size={size}
      disabled={disabled}
    >
      <legend className="cheez-radio-group__legend" id={labelId}>
        {label}
        {required ? (
          <span className="cheez-radio-group__required" aria-hidden="true">
            *
          </span>
        ) : null}
      </legend>

      {description && !error ? (
        <p className="cheez-radio-group__description" id={descriptionId}>
          {description}
        </p>
      ) : null}

      <RadioVisualContext.Provider value={visuals}>
        <RadioGroup
          {...props}
          ref={ref}
          className="cheez-radio-group"
          aria-describedby={describedBy}
          aria-invalid={error ? true : undefined}
          aria-labelledby={ariaLabelledBy ?? labelId}
          disabled={disabled}
          required={required}
        >
          {children}
        </RadioGroup>
      </RadioVisualContext.Provider>

      {error ? (
        <p className="cheez-radio-group__message" id={errorId} role="alert">
          {error}
        </p>
      ) : null}
    </fieldset>
  )
})

export interface MarkedRadioProps
  extends Omit<RadioRootProps<string>, "children" | "className" | "render"> {
  children: ReactNode
  className?: string
  description?: ReactNode
  labelPosition?: "start" | "end"
  marked?: boolean
}

export const MarkedRadio = forwardRef<HTMLElement, MarkedRadioProps>(
  function MarkedRadio(
    {
      children,
      className,
      description,
      disabled = false,
      labelPosition = "end",
      marked,
      onBlur,
      onFocus,
      onPointerEnter,
      onPointerLeave,
      ...props
    },
    ref,
  ) {
    const visuals = useRadioVisuals()
    const [focused, setFocused] = useState(false)
    const [hovered, setHovered] = useState(false)
    const isDisabled = disabled || visuals.disabled

    return (
      <label
        className={joinCheezClassNames(
          "cheez-radio__field",
          className,
        )}
        data-disabled={isDisabled ? "" : undefined}
        data-label-position={labelPosition}
        data-size={visuals.size}
      >
        <Radio.Root
          {...props}
          ref={ref}
          className="cheez-radio"
          disabled={isDisabled}
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
              !isDisabled &&
              (marked ??
                (visuals.error || state.checked || focused || hovered))
            const activeMark =
              visuals.error || !state.checked
                ? visuals.interactionMark
                : visuals.selectedMark
            const activeColor = visuals.error
              ? "#ff5fa2"
              : state.checked
                ? visuals.selectedColor
                : visuals.interactionColor
            const visualState = visuals.error
              ? "error"
              : state.checked
                ? "selected"
                : "interaction"

            return (
              <span
                {...rootProps}
                data-cheez-active={active ? "" : undefined}
                data-cheez-state={visualState}
              >
                <Cheez
                  className="cheez-radio__mark"
                  type={activeMark}
                  character={visuals.character}
                  color={activeColor}
                  thickness={visuals.thickness}
                  trigger={active ? "mount" : "manual"}
                >
                  <span className="cheez-radio__ring" aria-hidden="true" />
                </Cheez>
              </span>
            )
          }}
        />

        <span className="cheez-radio__copy">
          <span className="cheez-radio__label">{children}</span>
          {description ? (
            <span className="cheez-radio__description">{description}</span>
          ) : null}
        </span>
      </label>
    )
  },
)
