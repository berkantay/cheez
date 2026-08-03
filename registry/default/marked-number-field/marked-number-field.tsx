"use client"

import { NumberField } from "@base-ui/react/number-field"
import {
  createContext,
  forwardRef,
  useContext,
  useId,
  useState,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react"
import type {
  NumberFieldDecrementProps,
  NumberFieldGroupProps,
  NumberFieldIncrementProps,
  NumberFieldInputProps,
  NumberFieldRootProps,
  NumberFieldScrubAreaProps,
} from "@base-ui/react/number-field"

import { Cheez } from "../cheez"
import type { CheezCharacter } from "../cheez-core/cheez-definition"
import { joinCheezClassNames, MarkedLabel } from "../cheez-ui/marked-label"
import type { CheezType } from "../mark-catalog"
import "../cheez-ui/cheez-ui.css"
import "./marked-number-field.css"

export type MarkedNumberFieldTone = "orange" | "purple" | "lime" | "pink" | "cyan" | "neutral"
export type MarkedNumberFieldSize = "small" | "medium" | "large"

const TONE_COLORS: Record<MarkedNumberFieldTone, string> = {
  orange: "#ff4f2e",
  purple: "#8f74ff",
  lime: "#b7ff3c",
  pink: "#ff5fa2",
  cyan: "#35d9ff",
  neutral: "#f4f0e6",
}

interface NumberFieldVisuals {
  character: CheezCharacter
  color: string
  controlId: string
  descriptionId: string
  errorColor: string
  errorId: string
  errorMark: CheezType
  focusColor: string
  focusMark: CheezType
  frameMark: CheezType
  invalid: boolean
  size: MarkedNumberFieldSize
  stepColor: string
  thickness?: number
}

const VisualContext = createContext<NumberFieldVisuals | null>(null)

function useVisuals() {
  const context = useContext(VisualContext)
  if (!context) throw new Error("MarkedNumberField parts must be used inside MarkedNumberField")
  return context
}

export interface MarkedNumberFieldProps extends Omit<NumberFieldRootProps, "className"> {
  character?: CheezCharacter
  className?: string
  color?: string
  errorColor?: string
  errorMark?: CheezType
  focusColor?: string
  focusMark?: CheezType
  frameMark?: CheezType
  invalid?: boolean
  size?: MarkedNumberFieldSize
  stepColor?: string
  thickness?: number
  tone?: MarkedNumberFieldTone
}

export const MarkedNumberField = forwardRef<HTMLDivElement, MarkedNumberFieldProps>(function MarkedNumberField({
  character = "rushed",
  children,
  className,
  color,
  errorColor = "#ff5fa2",
  errorMark = "wavy-underline",
  focusColor = "#35d9ff",
  focusMark = "rounded-box",
  frameMark = "rounded-box",
  id,
  invalid = false,
  size = "medium",
  stepColor = "#b7ff3c",
  thickness,
  tone = "orange",
  ...props
}, ref) {
  const generatedId = useId()
  const controlId = id ?? `cheez-number-${generatedId.replace(/:/g, "")}`
  const visuals: NumberFieldVisuals = {
    character,
    color: color ?? TONE_COLORS[tone],
    controlId,
    descriptionId: `${controlId}-description`,
    errorColor,
    errorId: `${controlId}-error`,
    errorMark,
    focusColor,
    focusMark,
    frameMark,
    invalid,
    size,
    stepColor,
    thickness,
  }

  return <VisualContext.Provider value={visuals}><NumberField.Root {...props} ref={ref} id={controlId} className={joinCheezClassNames("cheez-number-field", className)} data-invalid={invalid ? "" : undefined} data-size={size}>{children}</NumberField.Root></VisualContext.Provider>
})

export interface MarkedNumberFieldLabelProps extends ComponentPropsWithoutRef<"label"> {}
export const MarkedNumberFieldLabel = forwardRef<HTMLLabelElement, MarkedNumberFieldLabelProps>(function MarkedNumberFieldLabel({ children, className, ...props }, ref) {
  const visuals = useVisuals()
  return <label {...props} ref={ref} htmlFor={visuals.controlId} className={joinCheezClassNames("cheez-number-field__label", className)}>{children}</label>
})

export interface MarkedNumberFieldScrubAreaProps extends Omit<NumberFieldScrubAreaProps, "className" | "render"> { children: ReactNode; className?: string }
export const MarkedNumberFieldScrubArea = forwardRef<HTMLSpanElement, MarkedNumberFieldScrubAreaProps>(function MarkedNumberFieldScrubArea({ children, className, ...props }, ref) {
  const visuals = useVisuals()
  return <NumberField.ScrubArea {...props} ref={ref} className={joinCheezClassNames("cheez-number-field__scrub", className)} render={(scrubProps, state) => <span {...scrubProps}><MarkedLabel active={state.scrubbing} character={visuals.character} color={visuals.stepColor} mark="double-underline" thickness={visuals.thickness}>{children}</MarkedLabel><NumberField.ScrubAreaCursor className="cheez-number-field__cursor">↔</NumberField.ScrubAreaCursor></span>} />
})

export interface MarkedNumberFieldGroupProps extends Omit<NumberFieldGroupProps, "className" | "render"> { className?: string }
export const MarkedNumberFieldGroup = forwardRef<HTMLDivElement, MarkedNumberFieldGroupProps>(function MarkedNumberFieldGroup({ className, ...props }, ref) {
  const visuals = useVisuals()
  return <NumberField.Group {...props} ref={ref} className={joinCheezClassNames("cheez-number-field__group", className)} render={(groupProps, state) => {
    const hasError = visuals.invalid || state.valid === false
    return <Cheez className="cheez-number-field__frame" type={hasError ? visuals.errorMark : state.focused ? visuals.focusMark : visuals.frameMark} character={visuals.character} color={hasError ? visuals.errorColor : state.focused ? visuals.focusColor : visuals.color} thickness={visuals.thickness} trigger="mount"><div {...groupProps} data-invalid={hasError ? "" : undefined} /></Cheez>
  }} />
})

export interface MarkedNumberFieldInputProps extends Omit<NumberFieldInputProps, "className"> { className?: string }
export const MarkedNumberFieldInput = forwardRef<HTMLInputElement, MarkedNumberFieldInputProps>(function MarkedNumberFieldInput({ "aria-describedby": describedBy, className, ...props }, ref) {
  const visuals = useVisuals()
  return <NumberField.Input {...props} ref={ref} className={joinCheezClassNames("cheez-number-field__input", className)} aria-describedby={describedBy ?? (visuals.invalid ? visuals.errorId : visuals.descriptionId)} aria-invalid={visuals.invalid || undefined} />
})

interface StepContentProps { active: boolean; children: ReactNode; direction: "decrement" | "increment" }
function StepContent({ active, children, direction }: StepContentProps) {
  const visuals = useVisuals()
  return <MarkedLabel active={active} character={visuals.character} color={visuals.stepColor} mark={direction === "increment" ? "circle" : "short-underline"} thickness={visuals.thickness}><span className="cheez-number-field__step-copy"><span aria-hidden="true">{direction === "increment" ? "+" : "−"}</span><span className="cheez-number-field__step-label">{children}</span></span></MarkedLabel>
}

export interface MarkedNumberFieldIncrementProps extends Omit<NumberFieldIncrementProps, "children" | "className" | "render"> { children?: ReactNode; className?: string }
export const MarkedNumberFieldIncrement = forwardRef<HTMLButtonElement, MarkedNumberFieldIncrementProps>(function MarkedNumberFieldIncrement({ children = "increase", className, onBlur, onFocus, onPointerEnter, onPointerLeave, ...props }, ref) {
  const [active, setActive] = useState(false)
  return <NumberField.Increment {...props} ref={ref} className={joinCheezClassNames("cheez-number-field__step", className)} onFocus={(event) => { setActive(true); onFocus?.(event) }} onBlur={(event) => { setActive(false); onBlur?.(event) }} onPointerEnter={(event) => { setActive(true); onPointerEnter?.(event) }} onPointerLeave={(event) => { setActive(false); onPointerLeave?.(event) }} render={(buttonProps) => <button {...buttonProps}><StepContent active={active} direction="increment">{children}</StepContent></button>} />
})

export interface MarkedNumberFieldDecrementProps extends Omit<NumberFieldDecrementProps, "children" | "className" | "render"> { children?: ReactNode; className?: string }
export const MarkedNumberFieldDecrement = forwardRef<HTMLButtonElement, MarkedNumberFieldDecrementProps>(function MarkedNumberFieldDecrement({ children = "decrease", className, onBlur, onFocus, onPointerEnter, onPointerLeave, ...props }, ref) {
  const [active, setActive] = useState(false)
  return <NumberField.Decrement {...props} ref={ref} className={joinCheezClassNames("cheez-number-field__step", className)} onFocus={(event) => { setActive(true); onFocus?.(event) }} onBlur={(event) => { setActive(false); onBlur?.(event) }} onPointerEnter={(event) => { setActive(true); onPointerEnter?.(event) }} onPointerLeave={(event) => { setActive(false); onPointerLeave?.(event) }} render={(buttonProps) => <button {...buttonProps}><StepContent active={active} direction="decrement">{children}</StepContent></button>} />
})

type MessageProps = ComponentPropsWithoutRef<"span">
export const MarkedNumberFieldDescription = forwardRef<HTMLSpanElement, MessageProps>(function MarkedNumberFieldDescription({ className, ...props }, ref) { const visuals = useVisuals(); return <span {...props} ref={ref} id={visuals.descriptionId} className={joinCheezClassNames("cheez-number-field__message", className)} /> })
export const MarkedNumberFieldError = forwardRef<HTMLSpanElement, MessageProps>(function MarkedNumberFieldError({ className, ...props }, ref) { const visuals = useVisuals(); return <span {...props} ref={ref} id={visuals.errorId} role="alert" className={joinCheezClassNames("cheez-number-field__message cheez-number-field__error", className)} /> })
