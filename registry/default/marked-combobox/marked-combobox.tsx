"use client"

import { Combobox } from "@base-ui/react/combobox"
import {
  createContext,
  forwardRef,
  useContext,
  useId,
  type CSSProperties,
  type ReactNode,
} from "react"
import type {
  ComboboxChipProps,
  ComboboxChipRemoveProps,
  ComboboxChipsProps,
  ComboboxClearProps,
  ComboboxCollectionProps,
  ComboboxEmptyProps,
  ComboboxGroupLabelProps,
  ComboboxGroupProps,
  ComboboxInputGroupProps,
  ComboboxInputProps,
  ComboboxItemProps,
  ComboboxListProps,
  ComboboxPositionerProps,
  ComboboxRootProps,
  ComboboxStatusProps,
  ComboboxTriggerProps,
  ComboboxValueProps,
} from "@base-ui/react/combobox"

import { Cheez } from "../cheez"
import type { CheezCharacter } from "../cheez-core/cheez-definition"
import { joinCheezClassNames } from "../cheez-ui/marked-label"
import type { CheezType } from "../mark-catalog"
import "../cheez-ui/cheez-ui.css"
import "./marked-combobox.css"

export type MarkedComboboxSize = "small" | "medium" | "large"
export type MarkedComboboxTone =
  | "neutral"
  | "orange"
  | "purple"
  | "lime"
  | "pink"
  | "cyan"

export const MARKED_COMBOBOX_COLORS: Record<MarkedComboboxTone, string> = {
  neutral: "#f4f0e6",
  orange: "#ff4f2e",
  purple: "#8f74ff",
  lime: "#b7ff3c",
  pink: "#ff5fa2",
  cyan: "#35d9ff",
}

interface ComboboxVisualContextValue {
  character: CheezCharacter
  controlId: string
  describedBy?: string
  error: boolean
  errorColor: string
  highlightColor: string
  interactionColor: string
  interactionMark: CheezType
  selectedColor: string
  selectedMark: CheezType
  size: MarkedComboboxSize
  thickness?: number
}

const ComboboxVisualContext = createContext<ComboboxVisualContextValue | null>(null)

function useComboboxVisuals() {
  const context = useContext(ComboboxVisualContext)

  if (!context) {
    throw new Error("MarkedCombobox parts must be used inside MarkedCombobox")
  }

  return context
}

interface MarkedComboboxVisualProps {
  character?: CheezCharacter
  color?: string
  error?: ReactNode
  errorColor?: string
  highlightColor?: string
  interactionMark?: CheezType
  selectedColor?: string
  selectedMark?: CheezType
  size?: MarkedComboboxSize
  thickness?: number
  tone?: MarkedComboboxTone
}

export type MarkedComboboxProps<
  Value,
  Multiple extends boolean | undefined = false,
> = Omit<ComboboxRootProps<Value, Multiple>, "children"> &
  MarkedComboboxVisualProps & {
    children: ReactNode
    className?: string
    description?: ReactNode
    label: ReactNode
  }

export function MarkedCombobox<
  Value,
  Multiple extends boolean | undefined = false,
>({
  character = "rushed",
  children,
  className,
  color,
  description,
  disabled = false,
  error,
  errorColor = "#ff5fa2",
  highlightColor = "#b7ff3c",
  interactionMark = "rounded-box",
  label,
  required = false,
  selectedColor = "#8f74ff",
  selectedMark = "check",
  size = "medium",
  thickness,
  tone = "orange",
  ...props
}: MarkedComboboxProps<Value, Multiple>) {
  const generatedId = useId().replaceAll(":", "")
  const controlId = `cheez-combobox-${generatedId}`
  const descriptionId = `${controlId}-description`
  const errorId = `${controlId}-error`
  const interactionColor = color ?? MARKED_COMBOBOX_COLORS[tone]
  const visuals: ComboboxVisualContextValue = {
    character,
    controlId,
    describedBy: error ? errorId : description ? descriptionId : undefined,
    error: Boolean(error),
    errorColor,
    highlightColor,
    interactionColor,
    interactionMark,
    selectedColor,
    selectedMark,
    size,
    thickness,
  }
  const style = {
    "--cheez-combobox-color": interactionColor,
  } as CSSProperties

  return (
    <div
      className={joinCheezClassNames("cheez-combobox", className)}
      data-disabled={disabled ? "" : undefined}
      data-invalid={error ? "" : undefined}
      data-size={size}
      style={style}
    >
      <Combobox.Root {...props} disabled={disabled} required={required}>
        <label className="cheez-combobox__label" htmlFor={controlId}>
          {label}
          {required ? (
            <span className="cheez-combobox__required" aria-hidden="true">*</span>
          ) : null}
        </label>

        <ComboboxVisualContext.Provider value={visuals}>
          {children}
        </ComboboxVisualContext.Provider>
      </Combobox.Root>

      {error ? (
        <span className="cheez-combobox__message" id={errorId} role="alert">
          {error}
        </span>
      ) : description ? (
        <span className="cheez-combobox__description" id={descriptionId}>
          {description}
        </span>
      ) : null}
    </div>
  )
}

export interface MarkedComboboxInputGroupProps
  extends Omit<ComboboxInputGroupProps, "className"> {
  className?: string
  children: ReactNode
}

export const MarkedComboboxInputGroup = forwardRef<
  HTMLDivElement,
  MarkedComboboxInputGroupProps
>(function MarkedComboboxInputGroup({ children, className, ...props }, ref) {
  const visuals = useComboboxVisuals()
  const color = visuals.error ? visuals.errorColor : visuals.interactionColor

  return (
    <Combobox.InputGroup
      {...props}
      ref={ref}
      className={joinCheezClassNames("cheez-combobox__input-group", className)}
    >
      <Cheez
        className="cheez-combobox__input-mark"
        type={visuals.error ? "wavy-underline" : visuals.interactionMark}
        character={visuals.character}
        color={color}
        thickness={visuals.thickness}
        trigger="mount"
      >
        <div className="cheez-combobox__input-body">{children}</div>
      </Cheez>
    </Combobox.InputGroup>
  )
})

export interface MarkedComboboxInputProps
  extends Omit<ComboboxInputProps, "className"> {
  className?: string
}

export const MarkedComboboxInput = forwardRef<
  HTMLInputElement,
  MarkedComboboxInputProps
>(function MarkedComboboxInput({ className, id, ...props }, ref) {
  const visuals = useComboboxVisuals()

  return (
    <Combobox.Input
      {...props}
      ref={ref}
      id={id ?? visuals.controlId}
      aria-describedby={visuals.describedBy}
      aria-invalid={visuals.error || undefined}
      className={joinCheezClassNames("cheez-combobox__input", className)}
    />
  )
})

export interface MarkedComboboxTriggerProps
  extends Omit<ComboboxTriggerProps, "children" | "className"> {
  className?: string
  label?: string
}

export const MarkedComboboxTrigger = forwardRef<
  HTMLButtonElement,
  MarkedComboboxTriggerProps
>(function MarkedComboboxTrigger(
  { className, label = "open suggestions", ...props },
  ref,
) {
  return (
    <Combobox.Trigger
      {...props}
      ref={ref}
      className={joinCheezClassNames("cheez-combobox__trigger", className)}
      aria-label={label}
    >
      <svg viewBox="0 0 16 16" aria-hidden="true">
        <path d="M2.2 5.1 7.7 10.8 13.9 4.7" />
      </svg>
    </Combobox.Trigger>
  )
})

export interface MarkedComboboxClearProps
  extends Omit<ComboboxClearProps, "children" | "className"> {
  className?: string
  label?: string
}

export const MarkedComboboxClear = forwardRef<
  HTMLButtonElement,
  MarkedComboboxClearProps
>(function MarkedComboboxClear(
  { className, keepMounted = true, label = "clear selection", ...props },
  ref,
) {
  return (
    <Combobox.Clear
      {...props}
      ref={ref}
      keepMounted={keepMounted}
      className={joinCheezClassNames("cheez-combobox__clear", className)}
      aria-label={label}
    >
      <span aria-hidden="true">×</span>
    </Combobox.Clear>
  )
})

export interface MarkedComboboxContentProps
  extends Omit<ComboboxPositionerProps, "children" | "className"> {
  children: ReactNode
  className?: string
  loading?: boolean
  loadingLabel?: ReactNode
}

export function MarkedComboboxContent({
  align = "start",
  children,
  className,
  loading = false,
  loadingLabel = "searching…",
  sideOffset = 8,
  ...props
}: MarkedComboboxContentProps) {
  const visuals = useComboboxVisuals()

  return (
    <Combobox.Portal>
      <Combobox.Positioner
        {...props}
        align={align}
        className="cheez-combobox__positioner"
        sideOffset={sideOffset}
      >
        <Combobox.Popup
          className={joinCheezClassNames("cheez-combobox__popup", className)}
        >
          <Cheez
            className="cheez-combobox__popup-mark"
            type="rounded-box"
            character={visuals.character}
            color={visuals.interactionColor}
            thickness={visuals.thickness}
            trigger="mount"
          >
            <div className="cheez-combobox__popup-body">
              <Combobox.Status className="cheez-combobox__loading">
                {loading ? (
                  <><span aria-hidden="true" />{loadingLabel}</>
                ) : null}
              </Combobox.Status>
              {children}
            </div>
          </Cheez>
        </Combobox.Popup>
      </Combobox.Positioner>
    </Combobox.Portal>
  )
}

export const MarkedComboboxList = forwardRef<
  HTMLDivElement,
  ComboboxListProps
>(function MarkedComboboxList({ className, ...props }, ref) {
  return (
    <Combobox.List
      {...props}
      ref={ref}
      className={joinCheezClassNames(
        "cheez-combobox__list",
        typeof className === "string" ? className : undefined,
      )}
    />
  )
})

export interface MarkedComboboxItemProps
  extends Omit<ComboboxItemProps, "children" | "className" | "render"> {
  children: ReactNode
  className?: string
}

export const MarkedComboboxItem = forwardRef<
  HTMLDivElement,
  MarkedComboboxItemProps
>(function MarkedComboboxItem({ children, className, ...props }, ref) {
  const visuals = useComboboxVisuals()

  return (
    <Combobox.Item
      {...props}
      ref={ref}
      className={joinCheezClassNames("cheez-combobox__item", className)}
      render={(itemProps, state) => (
        <div {...itemProps}>
          <Combobox.ItemIndicator
            className="cheez-combobox__item-indicator"
            keepMounted
          >
            <Cheez
              className="cheez-combobox__selected-mark"
              type={visuals.selectedMark}
              character={visuals.character}
              color={visuals.selectedColor}
              thickness={visuals.thickness}
              trigger={state.selected ? "mount" : "manual"}
            >
              <span aria-hidden="true" />
            </Cheez>
          </Combobox.ItemIndicator>
          <Cheez
            className="cheez-combobox__item-mark"
            type="bottom-highlight"
            character={visuals.character}
            color={visuals.highlightColor}
            thickness={visuals.thickness}
            trigger={state.highlighted ? "mount" : "manual"}
          >
            <span className="cheez-combobox__item-text">{children}</span>
          </Cheez>
        </div>
      )}
    />
  )
})

export const MarkedComboboxGroup = forwardRef<
  HTMLDivElement,
  ComboboxGroupProps
>(function MarkedComboboxGroup({ className, ...props }, ref) {
  return (
    <Combobox.Group
      {...props}
      ref={ref}
      className={joinCheezClassNames(
        "cheez-combobox__group",
        typeof className === "string" ? className : undefined,
      )}
    />
  )
})

export const MarkedComboboxGroupLabel = forwardRef<
  HTMLDivElement,
  ComboboxGroupLabelProps
>(function MarkedComboboxGroupLabel({ className, ...props }, ref) {
  return (
    <Combobox.GroupLabel
      {...props}
      ref={ref}
      className={joinCheezClassNames(
        "cheez-combobox__group-label",
        typeof className === "string" ? className : undefined,
      )}
    />
  )
})

export const MarkedComboboxEmpty = forwardRef<
  HTMLDivElement,
  ComboboxEmptyProps
>(function MarkedComboboxEmpty({ className, ...props }, ref) {
  return (
    <Combobox.Empty
      {...props}
      ref={ref}
      className={joinCheezClassNames(
        "cheez-combobox__empty",
        typeof className === "string" ? className : undefined,
      )}
    />
  )
})

export const MarkedComboboxStatus = forwardRef<
  HTMLDivElement,
  ComboboxStatusProps
>(function MarkedComboboxStatus({ className, ...props }, ref) {
  return (
    <Combobox.Status
      {...props}
      ref={ref}
      className={joinCheezClassNames(
        "cheez-combobox__status",
        typeof className === "string" ? className : undefined,
      )}
    />
  )
})

export function MarkedComboboxCollection(props: ComboboxCollectionProps) {
  return <Combobox.Collection {...props} />
}

export function MarkedComboboxValue(props: ComboboxValueProps) {
  return <Combobox.Value {...props} />
}

export const MarkedComboboxChips = forwardRef<
  HTMLDivElement,
  ComboboxChipsProps
>(function MarkedComboboxChips({ className, ...props }, ref) {
  return (
    <Combobox.Chips
      {...props}
      ref={ref}
      className={joinCheezClassNames(
        "cheez-combobox__chips",
        typeof className === "string" ? className : undefined,
      )}
    />
  )
})

export interface MarkedComboboxChipProps
  extends Omit<ComboboxChipProps, "children" | "className"> {
  children: ReactNode
  className?: string
}

export const MarkedComboboxChip = forwardRef<
  HTMLDivElement,
  MarkedComboboxChipProps
>(function MarkedComboboxChip({ children, className, ...props }, ref) {
  const visuals = useComboboxVisuals()

  return (
    <Combobox.Chip
      {...props}
      ref={ref}
      className={joinCheezClassNames("cheez-combobox__chip", className)}
    >
      <Cheez
        className="cheez-combobox__chip-mark"
        type="rounded-box"
        character={visuals.character}
        color={visuals.selectedColor}
        thickness={visuals.thickness}
        trigger="mount"
      >
        <span className="cheez-combobox__chip-body">{children}</span>
      </Cheez>
    </Combobox.Chip>
  )
})

export interface MarkedComboboxChipRemoveProps
  extends Omit<ComboboxChipRemoveProps, "children" | "className"> {
  className?: string
  label: string
}

export const MarkedComboboxChipRemove = forwardRef<
  HTMLButtonElement,
  MarkedComboboxChipRemoveProps
>(function MarkedComboboxChipRemove({ className, label, ...props }, ref) {
  return (
    <Combobox.ChipRemove
      {...props}
      ref={ref}
      className={joinCheezClassNames("cheez-combobox__chip-remove", className)}
      aria-label={label}
    >
      <span aria-hidden="true">×</span>
    </Combobox.ChipRemove>
  )
})
