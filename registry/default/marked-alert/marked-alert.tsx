"use client"

import {
  createContext,
  forwardRef,
  useContext,
  useState,
  type ButtonHTMLAttributes,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react"

import { Cheez } from "../cheez"
import type { CheezCharacter } from "../cheez-core/cheez-definition"
import {
  MARKED_FEEDBACK_APPEARANCES,
  type MarkedFeedbackType,
} from "../cheez-ui/marked-feedback"
import {
  joinCheezClassNames,
  MarkedLabel,
} from "../cheez-ui/marked-label"
import type { CheezType } from "../mark-catalog"
import "../cheez-ui/cheez-ui.css"

export type MarkedAlertType = MarkedFeedbackType
export type MarkedAlertVariant = "outline" | "filled" | "quiet"
export type MarkedAlertPriority = "polite" | "urgent" | "off"

interface AlertVisualContextValue {
  character: CheezCharacter
  closeColor: string
  dismiss: () => void
  statusColor: string
  statusMark: CheezType
  thickness?: number
  titleColor: string
  titleMark: CheezType
}

const AlertVisualContext = createContext<AlertVisualContextValue | null>(null)

function useAlertVisuals() {
  const context = useContext(AlertVisualContext)

  if (!context) {
    throw new Error("MarkedAlert parts must be used inside MarkedAlert")
  }

  return context
}

export interface MarkedAlertProps
  extends Omit<ComponentPropsWithoutRef<"div">, "children" | "color"> {
  character?: CheezCharacter
  children: ReactNode
  closeColor?: string
  defaultOpen?: boolean
  dismissible?: boolean
  fillMark?: CheezType
  frameColor?: string
  frameMark?: CheezType
  layout?: "card" | "banner"
  onOpenChange?: (open: boolean) => void
  open?: boolean
  priority?: MarkedAlertPriority
  size?: "small" | "medium" | "large"
  statusColor?: string
  statusMark?: CheezType
  thickness?: number
  titleColor?: string
  titleMark?: CheezType
  tone?: MarkedAlertType
  variant?: MarkedAlertVariant
}

export const MarkedAlert = forwardRef<HTMLDivElement, MarkedAlertProps>(
  function MarkedAlert(
    {
      "aria-live": ariaLive,
      character = "rushed",
      children,
      className,
      closeColor = "#ff5fa2",
      defaultOpen = true,
      dismissible = false,
      fillMark = "brush-highlight",
      frameColor,
      frameMark = "rounded-box",
      layout = "card",
      onOpenChange,
      open: controlledOpen,
      priority,
      role,
      size = "medium",
      statusColor,
      statusMark,
      thickness,
      titleColor,
      titleMark = "underline",
      tone = "default",
      variant = "outline",
      ...props
    },
    ref,
  ) {
    const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen)
    const open = controlledOpen ?? uncontrolledOpen
    const appearance = MARKED_FEEDBACK_APPEARANCES[tone]
    const resolvedPriority =
      priority ?? (tone === "error" ? "urgent" : "polite")
    const resolvedColor = frameColor ?? appearance.color

    const setOpen = (nextOpen: boolean) => {
      if (controlledOpen === undefined) {
        setUncontrolledOpen(nextOpen)
      }
      onOpenChange?.(nextOpen)
    }

    if (!open) return null

    const visuals: AlertVisualContextValue = {
      character,
      closeColor,
      dismiss: () => setOpen(false),
      statusColor: statusColor ?? appearance.color,
      statusMark: statusMark ?? appearance.mark,
      thickness,
      titleColor: titleColor ?? appearance.color,
      titleMark,
    }

    return (
      <AlertVisualContext.Provider value={visuals}>
        <div
          {...props}
          ref={ref}
          className={joinCheezClassNames("cheez-ui cheez-alert", className)}
          aria-atomic="true"
          aria-live={
            ariaLive ??
            (resolvedPriority === "off"
              ? "off"
              : resolvedPriority === "urgent"
                ? "assertive"
                : "polite")
          }
          data-layout={layout}
          data-size={size}
          data-tone={tone}
          data-variant={variant}
          role={
            role ??
            (resolvedPriority === "urgent"
              ? "alert"
              : resolvedPriority === "off"
                ? undefined
                : "status")
          }
        >
          {variant === "outline" ? (
            <Cheez
              className="cheez-alert__frame"
              type={frameMark}
              character={character}
              color={resolvedColor}
              thickness={thickness}
              trigger="mount"
            >
              <span aria-hidden="true" />
            </Cheez>
          ) : null}

          {variant === "filled" ? (
            <Cheez
              className="cheez-alert__fill"
              type={fillMark}
              character={character}
              color={resolvedColor}
              fillColor={resolvedColor}
              trigger="mount"
            >
              <span aria-hidden="true" />
            </Cheez>
          ) : null}

          <div className="cheez-alert__content">
            <Cheez
              className="cheez-alert__status"
              type={visuals.statusMark}
              character={character}
              color={visuals.statusColor}
              thickness={thickness}
              trigger="mount"
              data-loading={tone === "loading" ? "" : undefined}
            >
              <span aria-hidden="true" />
            </Cheez>
            <div className="cheez-alert__body">{children}</div>
            {dismissible ? <MarkedAlertClose /> : null}
          </div>
        </div>
      </AlertVisualContext.Provider>
    )
  },
)

export interface MarkedAlertTitleProps
  extends Omit<ComponentPropsWithoutRef<"h3">, "color"> {
  color?: string
  mark?: CheezType
}

export const MarkedAlertTitle = forwardRef<
  HTMLHeadingElement,
  MarkedAlertTitleProps
>(function MarkedAlertTitle(
  { children, className, color, mark, ...props },
  ref,
) {
  const visuals = useAlertVisuals()

  return (
    <h3
      {...props}
      ref={ref}
      className={joinCheezClassNames("cheez-alert__title", className)}
    >
      <MarkedLabel
        active
        character={visuals.character}
        color={color ?? visuals.titleColor}
        mark={mark ?? visuals.titleMark}
        thickness={visuals.thickness}
      >
        {children}
      </MarkedLabel>
    </h3>
  )
})

export const MarkedAlertDescription = forwardRef<
  HTMLParagraphElement,
  ComponentPropsWithoutRef<"p">
>(function MarkedAlertDescription({ className, ...props }, ref) {
  return (
    <p
      {...props}
      ref={ref}
      className={joinCheezClassNames("cheez-alert__description", className)}
    />
  )
})

export const MarkedAlertActions = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<"div">
>(function MarkedAlertActions({ className, ...props }, ref) {
  return (
    <div
      {...props}
      ref={ref}
      className={joinCheezClassNames("cheez-alert__actions", className)}
    />
  )
})

export interface MarkedAlertCloseProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode
}

export const MarkedAlertClose = forwardRef<
  HTMLButtonElement,
  MarkedAlertCloseProps
>(function MarkedAlertClose(
  { children = "dismiss", className, onClick, type = "button", ...props },
  ref,
) {
  const visuals = useAlertVisuals()

  return (
    <button
      {...props}
      ref={ref}
      type={type}
      className={joinCheezClassNames("cheez-alert__close", className)}
      onClick={(event) => {
        onClick?.(event)
        if (!event.defaultPrevented) visuals.dismiss()
      }}
    >
      <Cheez
        type="cross"
        character={visuals.character}
        color={visuals.closeColor}
        thickness={visuals.thickness}
        trigger="mount"
      >
        <span aria-hidden="true" />
      </Cheez>
      <span className="cheez-alert__close-label">{children}</span>
    </button>
  )
})
