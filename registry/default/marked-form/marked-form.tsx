"use client"

import { Form } from "@base-ui/react/form"
import {
  createContext,
  forwardRef,
  useContext,
  type ComponentPropsWithoutRef,
  type CSSProperties,
  type ReactNode,
  type Ref,
} from "react"
import type { FormProps } from "@base-ui/react/form"

import type { CheezCharacter } from "../cheez-core/cheez-definition"
import { MarkedButton, type MarkedButtonProps } from "../marked-button/marked-button"
import { joinCheezClassNames, MarkedLabel } from "../cheez-ui/marked-label"
import type { CheezType } from "../mark-catalog"
import "../cheez-ui/cheez-ui.css"
import "./marked-form.css"

export type MarkedFormTone = "orange" | "purple" | "lime" | "pink" | "cyan" | "neutral"
export type MarkedFormStatusState = "idle" | "pending" | "success" | "error"

const TONE_COLORS: Record<MarkedFormTone, string> = {
  orange: "#ff4f2e",
  purple: "#8f74ff",
  lime: "#b7ff3c",
  pink: "#ff5fa2",
  cyan: "#35d9ff",
  neutral: "#f4f0e6",
}

interface FormVisuals {
  character: CheezCharacter
  color: string
  dividerColor: string
  errorColor: string
  successColor: string
  thickness?: number
}

const VisualContext = createContext<FormVisuals | null>(null)

function useVisuals() {
  const context = useContext(VisualContext)
  if (!context) throw new Error("MarkedForm parts must be used inside MarkedForm")
  return context
}

export interface MarkedFormProps<FormValues extends Record<string, unknown> = Record<string, unknown>> extends Omit<FormProps<FormValues>, "className"> {
  character?: CheezCharacter
  className?: string
  color?: string
  dividerColor?: string
  errorColor?: string
  layout?: "stack" | "grid"
  ref?: Ref<HTMLFormElement>
  successColor?: string
  thickness?: number
  tone?: MarkedFormTone
}

export function MarkedForm<FormValues extends Record<string, unknown> = Record<string, unknown>>({
  character = "rushed",
  children,
  className,
  color,
  dividerColor = "#35d9ff",
  errorColor = "#ff5fa2",
  layout = "stack",
  ref,
  successColor = "#b7ff3c",
  thickness,
  tone = "orange",
  ...props
}: MarkedFormProps<FormValues>) {
  const visuals: FormVisuals = {
    character,
    color: color ?? TONE_COLORS[tone],
    dividerColor,
    errorColor,
    successColor,
    thickness,
  }

  return (
    <VisualContext.Provider value={visuals}>
      <Form<FormValues>
        {...props}
        ref={ref}
        className={joinCheezClassNames("cheez-form", className)}
        data-layout={layout}
      >
        {children}
      </Form>
    </VisualContext.Provider>
  )
}

export interface MarkedFormSectionProps extends Omit<ComponentPropsWithoutRef<"fieldset">, "color"> {
  color?: string
}

export const MarkedFormSection = forwardRef<HTMLFieldSetElement, MarkedFormSectionProps>(function MarkedFormSection({ className, color, style, ...props }, ref) {
  const visuals = useVisuals()
  const sectionStyle = {
    ...style,
    "--cheez-form-divider": color ?? visuals.dividerColor,
  } as CSSProperties

  return <fieldset {...props} ref={ref} className={joinCheezClassNames("cheez-form__section", className)} style={sectionStyle} />
})

export interface MarkedFormLegendProps extends ComponentPropsWithoutRef<"legend"> { eyebrow?: ReactNode }
export const MarkedFormLegend = forwardRef<HTMLLegendElement, MarkedFormLegendProps>(function MarkedFormLegend({ children, className, eyebrow, ...props }, ref) {
  const visuals = useVisuals()
  return <legend {...props} ref={ref} className={joinCheezClassNames("cheez-form__legend", className)}>{eyebrow ? <span>{eyebrow}</span> : null}<MarkedLabel active character={visuals.character} color={visuals.color} mark="short-underline" thickness={visuals.thickness}>{children}</MarkedLabel></legend>
})

export interface MarkedFormActionsProps extends ComponentPropsWithoutRef<"div"> { align?: "start" | "end" | "between" }
export const MarkedFormActions = forwardRef<HTMLDivElement, MarkedFormActionsProps>(function MarkedFormActions({ align = "end", className, ...props }, ref) {
  return <div {...props} ref={ref} className={joinCheezClassNames("cheez-form__actions", className)} data-align={align} />
})

export type MarkedFormSubmitProps = Omit<MarkedButtonProps, "type"> & { type?: "submit" }
export const MarkedFormSubmit = forwardRef<HTMLButtonElement, MarkedFormSubmitProps>(function MarkedFormSubmit({ children = "submit", ...props }, ref) {
  const visuals = useVisuals()
  return <MarkedButton {...props} ref={ref} type="submit" character={props.character ?? visuals.character} markColor={props.markColor ?? visuals.color}>{children}</MarkedButton>
})

export type MarkedFormResetProps = Omit<MarkedButtonProps, "type"> & { type?: "reset" }
export const MarkedFormReset = forwardRef<HTMLButtonElement, MarkedFormResetProps>(function MarkedFormReset({ children = "reset", variant = "quiet", ...props }, ref) {
  const visuals = useVisuals()
  return <MarkedButton {...props} ref={ref} type="reset" variant={variant} character={props.character ?? visuals.character}>{children}</MarkedButton>
})

export interface MarkedFormStatusProps extends ComponentPropsWithoutRef<"div"> {
  state?: MarkedFormStatusState
}

export const MarkedFormStatus = forwardRef<HTMLDivElement, MarkedFormStatusProps>(function MarkedFormStatus({ children, className, state = "idle", ...props }, ref) {
  const visuals = useVisuals()
  const color = state === "error" ? visuals.errorColor : state === "success" ? visuals.successColor : visuals.color
  const mark: CheezType = state === "error" ? "wavy-underline" : state === "success" ? "check" : state === "pending" ? "triple-underline" : "short-underline"
  return <div {...props} ref={ref} className={joinCheezClassNames("cheez-form__status", className)} data-state={state} role={state === "error" ? "alert" : "status"} aria-live={state === "error" ? "assertive" : "polite"}><MarkedLabel active={state !== "idle"} character={visuals.character} color={color} mark={mark} thickness={visuals.thickness}>{children}</MarkedLabel></div>
})

export interface MarkedFormErrorSummaryProps extends Omit<ComponentPropsWithoutRef<"div">, "children" | "title"> {
  errors: Record<string, string | string[] | undefined>
  heading?: ReactNode
  labels?: Record<string, string>
}

export const MarkedFormErrorSummary = forwardRef<HTMLDivElement, MarkedFormErrorSummaryProps>(function MarkedFormErrorSummary({ className, errors, heading = "check these fields", labels = {}, ...props }, ref) {
  const entries = Object.entries(errors).flatMap(([name, messages]) => (Array.isArray(messages) ? messages : messages ? [messages] : []).map((message) => ({ name, message })))
  if (entries.length === 0) return null
  return <div {...props} ref={ref} className={joinCheezClassNames("cheez-form__summary", className)} role="alert"><strong>{heading}</strong><ul>{entries.map(({ name, message }, index) => <li key={`${name}-${index}`}><a href={`#${name}`}>{labels[name] ?? name}</a><span>{message}</span></li>)}</ul></div>
})
