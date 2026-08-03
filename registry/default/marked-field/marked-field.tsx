"use client"

import { Field } from "@base-ui/react/field"
import {
  createContext,
  forwardRef,
  useContext,
  type ReactNode,
} from "react"
import type {
  FieldControlProps,
  FieldDescriptionProps,
  FieldErrorProps,
  FieldItemProps,
  FieldLabelProps,
  FieldRootProps,
  FieldRootState,
} from "@base-ui/react/field"

import { Cheez } from "../cheez"
import type { CheezCharacter } from "../cheez-core/cheez-definition"
import { joinCheezClassNames, MarkedLabel } from "../cheez-ui/marked-label"
import type { CheezType } from "../mark-catalog"
import "../cheez-ui/cheez-ui.css"
import "./marked-field.css"

export type MarkedFieldTone = "orange" | "purple" | "lime" | "pink" | "cyan" | "neutral"
export type MarkedFieldSize = "small" | "medium" | "large"

const TONE_COLORS: Record<MarkedFieldTone, string> = {
  orange: "#ff4f2e",
  purple: "#8f74ff",
  lime: "#b7ff3c",
  pink: "#ff5fa2",
  cyan: "#35d9ff",
  neutral: "#f4f0e6",
}

interface FieldVisuals {
  character: CheezCharacter
  color: string
  errorColor: string
  errorMark: CheezType
  focusColor: string
  focusMark: CheezType
  frameMark: CheezType
  labelColor: string
  labelMark: CheezType
  size: MarkedFieldSize
  thickness?: number
}

const VisualContext = createContext<FieldVisuals | null>(null)
const StateContext = createContext<FieldRootState | null>(null)

function useVisuals() {
  const context = useContext(VisualContext)
  if (!context) throw new Error("MarkedField parts must be used inside MarkedField")
  return context
}

export interface MarkedFieldProps extends Omit<FieldRootProps, "className" | "render"> {
  character?: CheezCharacter
  className?: string
  color?: string
  errorColor?: string
  errorMark?: CheezType
  focusColor?: string
  focusMark?: CheezType
  frameMark?: CheezType
  labelColor?: string
  labelMark?: CheezType
  size?: MarkedFieldSize
  thickness?: number
  tone?: MarkedFieldTone
}

export const MarkedField = forwardRef<HTMLDivElement, MarkedFieldProps>(function MarkedField({
  character = "rushed",
  children,
  className,
  color,
  errorColor = "#ff5fa2",
  errorMark = "wavy-underline",
  focusColor = "#35d9ff",
  focusMark = "rounded-box",
  frameMark = "rounded-box",
  labelColor = "#b7ff3c",
  labelMark = "short-underline",
  size = "medium",
  thickness,
  tone = "orange",
  ...props
}, ref) {
  const visuals: FieldVisuals = { character, color: color ?? TONE_COLORS[tone], errorColor, errorMark, focusColor, focusMark, frameMark, labelColor, labelMark, size, thickness }
  return (
    <VisualContext.Provider value={visuals}>
      <Field.Root {...props} ref={ref} className={joinCheezClassNames("cheez-field", className)} data-size={size} render={(rootProps, state) => <div {...rootProps} data-dirty={state.dirty ? "" : undefined} data-filled={state.filled ? "" : undefined} data-focused={state.focused ? "" : undefined} data-invalid={state.valid === false ? "" : undefined} data-touched={state.touched ? "" : undefined}><StateContext.Provider value={state}>{children}</StateContext.Provider></div>} />
    </VisualContext.Provider>
  )
})

export interface MarkedFieldLabelProps extends Omit<FieldLabelProps, "children" | "className" | "render"> {
  children: ReactNode
  className?: string
  required?: boolean
}

export const MarkedFieldLabel = forwardRef<HTMLElement, MarkedFieldLabelProps>(function MarkedFieldLabel({ children, className, required = false, ...props }, ref) {
  const visuals = useVisuals()
  return <Field.Label {...props} ref={ref} className={joinCheezClassNames("cheez-field__label", className)} render={(labelProps, state) => <label {...labelProps}><MarkedLabel active={state.focused} character={visuals.character} color={visuals.labelColor} mark={visuals.labelMark} thickness={visuals.thickness}>{children}</MarkedLabel>{required ? <span className="cheez-field__required" aria-hidden="true">*</span> : null}</label>} />
})

export interface MarkedFieldControlProps extends Omit<FieldControlProps, "className" | "render"> { className?: string }

export const MarkedFieldControl = forwardRef<HTMLElement, MarkedFieldControlProps>(function MarkedFieldControl({ className, ...props }, ref) {
  const visuals = useVisuals()
  return <Field.Control {...props} ref={ref} className={joinCheezClassNames("cheez-field__control", className)} render={(controlProps, state) => {
    const invalid = state.valid === false
    return <Cheez className="cheez-field__frame" type={invalid ? visuals.errorMark : state.focused ? visuals.focusMark : visuals.frameMark} character={visuals.character} color={invalid ? visuals.errorColor : state.focused ? visuals.focusColor : visuals.color} thickness={visuals.thickness} trigger="mount"><input {...controlProps} data-filled={state.filled ? "" : undefined} /></Cheez>
  }} />
})

export interface MarkedFieldDescriptionProps extends Omit<FieldDescriptionProps, "className"> { className?: string }
export const MarkedFieldDescription = forwardRef<HTMLParagraphElement, MarkedFieldDescriptionProps>(function MarkedFieldDescription({ className, ...props }, ref) {
  return <Field.Description {...props} ref={ref} className={joinCheezClassNames("cheez-field__description", className)} />
})

export interface MarkedFieldErrorProps extends Omit<FieldErrorProps, "className"> { className?: string }
export const MarkedFieldError = forwardRef<HTMLDivElement, MarkedFieldErrorProps>(function MarkedFieldError({ className, ...props }, ref) {
  return <Field.Error {...props} ref={ref} className={joinCheezClassNames("cheez-field__error", className)} />
})

export interface MarkedFieldItemProps extends Omit<FieldItemProps, "className"> { className?: string }
export const MarkedFieldItem = forwardRef<HTMLDivElement, MarkedFieldItemProps>(function MarkedFieldItem({ className, ...props }, ref) {
  return <Field.Item {...props} ref={ref} className={joinCheezClassNames("cheez-field__item", className)} />
})

export const MarkedFieldValidity = Field.Validity

export interface MarkedFieldStateProps { children: (state: FieldRootState) => ReactNode }
export function MarkedFieldState({ children }: MarkedFieldStateProps) {
  const state = useContext(StateContext)
  if (!state) throw new Error("MarkedFieldState must be used inside MarkedField")
  return children(state)
}
