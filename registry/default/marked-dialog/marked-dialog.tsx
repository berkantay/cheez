"use client"

import { Dialog } from "@base-ui/react/dialog"
import {
  createContext,
  forwardRef,
  useContext,
  useState,
  type ReactNode,
} from "react"
import type {
  DialogCloseProps,
  DialogDescriptionProps,
  DialogPopupProps,
  DialogRootProps,
  DialogTitleProps,
  DialogTriggerProps,
} from "@base-ui/react/dialog"

import { Cheez } from "../cheez"
import type { CheezCharacter } from "../cheez-core/cheez-definition"
import {
  joinCheezClassNames,
  MarkedLabel,
} from "../cheez-ui/marked-label"
import type { CheezType } from "../mark-catalog"
import "../cheez-ui/cheez-ui.css"

type DialogSize = "small" | "medium" | "large"

interface DialogVisualContextValue {
  character: CheezCharacter
  closeColor: string
  frameColor: string
  frameMark: CheezType
  size: DialogSize
  thickness?: number
  titleColor: string
  titleMark: CheezType
}

const DialogVisualContext = createContext<DialogVisualContextValue | null>(null)

function useDialogVisuals() {
  const context = useContext(DialogVisualContext)

  if (!context) {
    throw new Error("MarkedDialog parts must be used inside MarkedDialog")
  }

  return context
}

export interface MarkedDialogProps
  extends Omit<DialogRootProps, "children"> {
  character?: CheezCharacter
  children: ReactNode
  closeColor?: string
  frameColor?: string
  frameMark?: CheezType
  size?: DialogSize
  thickness?: number
  titleColor?: string
  titleMark?: CheezType
}

export function MarkedDialog({
  character = "rushed",
  children,
  closeColor = "#ff5fa2",
  frameColor = "#8f74ff",
  frameMark = "rounded-box",
  size = "medium",
  thickness,
  titleColor = "#b7ff3c",
  titleMark = "underline",
  ...props
}: MarkedDialogProps) {
  const visuals: DialogVisualContextValue = {
    character,
    closeColor,
    frameColor,
    frameMark,
    size,
    thickness,
    titleColor,
    titleMark,
  }

  return (
    <DialogVisualContext.Provider value={visuals}>
      <Dialog.Root {...props}>{children}</Dialog.Root>
    </DialogVisualContext.Provider>
  )
}

export interface MarkedDialogTriggerProps
  extends Omit<DialogTriggerProps, "children" | "className" | "render"> {
  children: ReactNode
  className?: string
  color?: string
  mark?: CheezType
  marked?: boolean
}

export const MarkedDialogTrigger = forwardRef<
  HTMLButtonElement,
  MarkedDialogTriggerProps
>(function MarkedDialogTrigger(
  {
    children,
    className,
    color,
    disabled,
    mark = "rounded-box",
    marked,
    onBlur,
    onFocus,
    onPointerEnter,
    onPointerLeave,
    ...props
  },
  ref,
) {
  const visuals = useDialogVisuals()
  const [focused, setFocused] = useState(false)
  const [hovered, setHovered] = useState(false)

  return (
    <Dialog.Trigger
      {...props}
      ref={ref}
      className={joinCheezClassNames("cheez-dialog__trigger", className)}
      disabled={disabled}
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
      render={(triggerProps, state) => (
        <button {...triggerProps}>
          <MarkedLabel
            active={
              !state.disabled &&
              (marked ?? (state.open || focused || hovered))
            }
            character={visuals.character}
            color={color ?? visuals.frameColor}
            mark={mark}
            thickness={visuals.thickness}
          >
            {children}
          </MarkedLabel>
        </button>
      )}
    />
  )
})

export interface MarkedDialogContentProps
  extends Omit<DialogPopupProps, "children" | "className"> {
  children: ReactNode
  className?: string
  keepMounted?: boolean
  showClose?: boolean
}

export const MarkedDialogContent = forwardRef<
  HTMLDivElement,
  MarkedDialogContentProps
>(function MarkedDialogContent(
  {
    children,
    className,
    keepMounted,
    showClose = true,
    ...props
  },
  ref,
) {
  const visuals = useDialogVisuals()

  return (
    <Dialog.Portal keepMounted={keepMounted}>
      <Dialog.Backdrop className="cheez-ui cheez-dialog__backdrop" />
      <Dialog.Viewport className="cheez-dialog__viewport">
        <Dialog.Popup
          {...props}
          ref={ref}
          className={joinCheezClassNames(
            "cheez-ui cheez-dialog__popup",
            className,
          )}
          data-size={visuals.size}
        >
          <Cheez
            className="cheez-dialog__frame"
            type={visuals.frameMark}
            character={visuals.character}
            color={visuals.frameColor}
            thickness={visuals.thickness}
            trigger="mount"
          >
            <span aria-hidden="true" />
          </Cheez>
          {showClose ? <MarkedDialogClose /> : null}
          <div className="cheez-dialog__body">{children}</div>
        </Dialog.Popup>
      </Dialog.Viewport>
    </Dialog.Portal>
  )
})

export interface MarkedDialogTitleProps
  extends Omit<DialogTitleProps, "children" | "className"> {
  children: ReactNode
  className?: string
  color?: string
  mark?: CheezType
}

export const MarkedDialogTitle = forwardRef<
  HTMLHeadingElement,
  MarkedDialogTitleProps
>(function MarkedDialogTitle(
  { children, className, color, mark, ...props },
  ref,
) {
  const visuals = useDialogVisuals()

  return (
    <Dialog.Title
      {...props}
      ref={ref}
      className={joinCheezClassNames("cheez-dialog__title", className)}
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
    </Dialog.Title>
  )
})

export interface MarkedDialogDescriptionProps
  extends Omit<DialogDescriptionProps, "className"> {
  className?: string
}

export const MarkedDialogDescription = forwardRef<
  HTMLParagraphElement,
  MarkedDialogDescriptionProps
>(function MarkedDialogDescription({ className, ...props }, ref) {
  return (
    <Dialog.Description
      {...props}
      ref={ref}
      className={joinCheezClassNames("cheez-dialog__description", className)}
    />
  )
})

export interface MarkedDialogCloseProps
  extends Omit<DialogCloseProps, "children" | "className"> {
  children?: ReactNode
  className?: string
  color?: string
  mark?: CheezType
}

export const MarkedDialogClose = forwardRef<
  HTMLButtonElement,
  MarkedDialogCloseProps
>(function MarkedDialogClose(
  {
    "aria-label": ariaLabel,
    children,
    className,
    color,
    mark = "cross",
    ...props
  },
  ref,
) {
  const visuals = useDialogVisuals()
  const iconOnly = children == null

  return (
    <Dialog.Close
      {...props}
      ref={ref}
      className={joinCheezClassNames("cheez-dialog__close", className)}
      aria-label={iconOnly ? (ariaLabel ?? "close dialog") : ariaLabel}
      data-icon={iconOnly ? "" : undefined}
    >
      {iconOnly ? (
        <Cheez
          className="cheez-dialog__close-mark"
          type={mark}
          character={visuals.character}
          color={color ?? visuals.closeColor}
          thickness={visuals.thickness}
          trigger="none"
        >
          <span aria-hidden="true" />
        </Cheez>
      ) : (
        <MarkedLabel
          active
          character={visuals.character}
          color={color ?? visuals.closeColor}
          mark="rounded-box"
          thickness={visuals.thickness}
        >
          {children}
        </MarkedLabel>
      )}
    </Dialog.Close>
  )
})

export interface MarkedDialogHeaderProps {
  children: ReactNode
  className?: string
}

export function MarkedDialogHeader({
  children,
  className,
}: MarkedDialogHeaderProps) {
  return (
    <div className={joinCheezClassNames("cheez-dialog__header", className)}>
      {children}
    </div>
  )
}

export interface MarkedDialogFooterProps {
  children: ReactNode
  className?: string
}

export function MarkedDialogFooter({
  children,
  className,
}: MarkedDialogFooterProps) {
  return (
    <div className={joinCheezClassNames("cheez-dialog__footer", className)}>
      {children}
    </div>
  )
}
