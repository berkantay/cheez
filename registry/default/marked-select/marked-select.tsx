"use client"

import { Select } from "@base-ui/react/select"
import {
  createContext,
  forwardRef,
  useContext,
  useId,
  useState,
  type ReactNode,
} from "react"
import type {
  SelectGroupLabelProps,
  SelectGroupProps,
  SelectItemProps,
  SelectPositionerProps,
  SelectRootProps,
  SelectTriggerProps,
} from "@base-ui/react/select"
import type { SeparatorProps } from "@base-ui/react/separator"

import { Cheez } from "../cheez"
import type { CheezCharacter } from "../cheez-core/cheez-definition"
import { joinCheezClassNames } from "../cheez-ui/marked-label"
import type { CheezType } from "../mark-catalog"
import "../cheez-ui/cheez-ui.css"

type SelectSize = "small" | "medium" | "large"

interface SelectVisualContextValue {
  character: CheezCharacter
  describedBy?: string
  error: boolean
  errorColor: string
  highlightColor: string
  interactionColor: string
  interactionMark: CheezType
  openColor: string
  openMark: CheezType
  selectedColor: string
  selectedMark: CheezType
  size: SelectSize
  thickness?: number
}

const SelectVisualContext = createContext<SelectVisualContextValue | null>(null)

function useSelectVisuals() {
  const context = useContext(SelectVisualContext)

  if (!context) {
    throw new Error("MarkedSelect parts must be used inside MarkedSelect")
  }

  return context
}

export interface MarkedSelectProps
  extends Omit<SelectRootProps<string, false>, "children" | "multiple"> {
  character?: CheezCharacter
  children: ReactNode
  className?: string
  description?: ReactNode
  error?: ReactNode
  errorColor?: string
  highlightColor?: string
  interactionColor?: string
  interactionMark?: CheezType
  label: ReactNode
  openColor?: string
  openMark?: CheezType
  selectedColor?: string
  selectedMark?: CheezType
  size?: SelectSize
  thickness?: number
}

export function MarkedSelect({
  character = "rushed",
  children,
  className,
  description,
  disabled = false,
  error,
  errorColor = "#ff5fa2",
  highlightColor = "#b7ff3c",
  interactionColor = "#8f74ff",
  interactionMark = "corner-box",
  label,
  openColor = "#35d9ff",
  openMark = "rounded-box",
  required = false,
  selectedColor = "#ff5fa2",
  selectedMark = "asterisk",
  size = "medium",
  thickness,
  ...props
}: MarkedSelectProps) {
  const generatedId = useId().replaceAll(":", "")
  const descriptionId = `cheez-select-${generatedId}-description`
  const errorId = `cheez-select-${generatedId}-error`
  const visuals: SelectVisualContextValue = {
    character,
    describedBy: error ? errorId : description ? descriptionId : undefined,
    error: Boolean(error),
    errorColor,
    highlightColor,
    interactionColor,
    interactionMark,
    openColor,
    openMark,
    selectedColor,
    selectedMark,
    size,
    thickness,
  }

  return (
    <div
      className={joinCheezClassNames("cheez-ui cheez-select__field", className)}
      data-disabled={disabled ? "" : undefined}
      data-invalid={error ? "" : undefined}
      data-size={size}
    >
      <Select.Root {...props} disabled={disabled} required={required}>
        <Select.Label className="cheez-select__label">
          {label}
          {required ? (
            <span className="cheez-select__required" aria-hidden="true">*</span>
          ) : null}
        </Select.Label>

        <SelectVisualContext.Provider value={visuals}>
          {children}
        </SelectVisualContext.Provider>
      </Select.Root>

      {error ? (
        <span className="cheez-select__message" id={errorId} role="alert">
          {error}
        </span>
      ) : description ? (
        <span className="cheez-select__description" id={descriptionId}>
          {description}
        </span>
      ) : null}
    </div>
  )
}

export interface MarkedSelectTriggerProps
  extends Omit<SelectTriggerProps, "children" | "className" | "render"> {
  className?: string
  placeholder?: ReactNode
}

export const MarkedSelectTrigger = forwardRef<
  HTMLButtonElement,
  MarkedSelectTriggerProps
>(function MarkedSelectTrigger(
  { className, placeholder = "select", onBlur, onFocus, onPointerEnter, onPointerLeave, ...props },
  ref,
) {
  const visuals = useSelectVisuals()
  const [focused, setFocused] = useState(false)
  const [hovered, setHovered] = useState(false)

  return (
    <Select.Trigger
      {...props}
      ref={ref}
      className={joinCheezClassNames("cheez-select__trigger", className)}
      aria-describedby={visuals.describedBy}
      aria-invalid={visuals.error ? true : undefined}
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
      render={(triggerProps, state) => {
        const active = visuals.error || state.open || focused || hovered
        const mark = state.open ? visuals.openMark : visuals.interactionMark
        const color = visuals.error
          ? visuals.errorColor
          : state.open
            ? visuals.openColor
            : visuals.interactionColor

        return (
          <button {...triggerProps} data-cheez-active={active ? "" : undefined}>
            <Cheez
              className="cheez-select__trigger-mark"
              type={mark}
              character={visuals.character}
              color={color}
              thickness={visuals.thickness}
              trigger={active ? "mount" : "manual"}
            >
              <span className="cheez-select__trigger-body">
                <Select.Value className="cheez-select__value" placeholder={placeholder} />
                <Select.Icon className="cheez-select__icon" aria-hidden="true">
                  <svg viewBox="0 0 16 16">
                    <path d="M2.2 5.1 7.7 10.8 13.9 4.7" />
                  </svg>
                </Select.Icon>
              </span>
            </Cheez>
          </button>
        )
      }}
    />
  )
})

export interface MarkedSelectContentProps
  extends Omit<SelectPositionerProps, "children" | "className"> {
  children: ReactNode
  className?: string
}

export function MarkedSelectContent({
  alignItemWithTrigger = false,
  children,
  className,
  sideOffset = 6,
  ...props
}: MarkedSelectContentProps) {
  const visuals = useSelectVisuals()

  return (
    <Select.Portal>
      <Select.Positioner
        {...props}
        className="cheez-select__positioner"
        alignItemWithTrigger={alignItemWithTrigger}
        sideOffset={sideOffset}
      >
        <Select.Popup className={joinCheezClassNames("cheez-select__popup", className)}>
          <Cheez
            className="cheez-select__popup-mark"
            type="rounded-box"
            character={visuals.character}
            color={visuals.openColor}
            thickness={visuals.thickness}
            trigger="mount"
          >
            <Select.ScrollUpArrow className="cheez-select__scroll-arrow">↑</Select.ScrollUpArrow>
            <Select.List className="cheez-select__list">{children}</Select.List>
            <Select.ScrollDownArrow className="cheez-select__scroll-arrow">↓</Select.ScrollDownArrow>
          </Cheez>
        </Select.Popup>
      </Select.Positioner>
    </Select.Portal>
  )
}

export interface MarkedSelectItemProps
  extends Omit<SelectItemProps, "children" | "className" | "render"> {
  children: ReactNode
  className?: string
}

export const MarkedSelectItem = forwardRef<HTMLElement, MarkedSelectItemProps>(
  function MarkedSelectItem({ children, className, ...props }, ref) {
    const visuals = useSelectVisuals()

    return (
      <Select.Item
        {...props}
        ref={ref}
        className={joinCheezClassNames("cheez-select__item", className)}
        render={(itemProps, state) => (
          <div {...itemProps}>
            <Select.ItemIndicator className="cheez-select__item-indicator" keepMounted>
              <Cheez
                className="cheez-select__selected-mark"
                type={visuals.selectedMark}
                character={visuals.character}
                color={visuals.selectedColor}
                thickness={visuals.thickness}
                trigger={state.selected ? "mount" : "manual"}
              >
                <span aria-hidden="true" />
              </Cheez>
            </Select.ItemIndicator>
            <Cheez
              className="cheez-select__item-mark"
              type="bottom-highlight"
              character={visuals.character}
              color={visuals.highlightColor}
              trigger={state.highlighted ? "mount" : "manual"}
            >
              <Select.ItemText className="cheez-select__item-text">{children}</Select.ItemText>
            </Cheez>
          </div>
        )}
      />
    )
  },
)

export const MarkedSelectGroup = forwardRef<HTMLDivElement, SelectGroupProps>(
  function MarkedSelectGroup({ className, ...props }, ref) {
    return <Select.Group {...props} ref={ref} className={joinCheezClassNames("cheez-select__group", typeof className === "string" ? className : undefined)} />
  },
)

export const MarkedSelectGroupLabel = forwardRef<
  HTMLDivElement,
  SelectGroupLabelProps
>(function MarkedSelectGroupLabel({ className, ...props }, ref) {
  return <Select.GroupLabel {...props} ref={ref} className={joinCheezClassNames("cheez-select__group-label", typeof className === "string" ? className : undefined)} />
})

export const MarkedSelectSeparator = forwardRef<HTMLDivElement, SeparatorProps>(
  function MarkedSelectSeparator({ className, ...props }, ref) {
    return <Select.Separator {...props} ref={ref} className={joinCheezClassNames("cheez-select__separator", typeof className === "string" ? className : undefined)} />
  },
)
