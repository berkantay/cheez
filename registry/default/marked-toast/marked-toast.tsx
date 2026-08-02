"use client"

import { Toast } from "@base-ui/react/toast"
import { createContext, useContext, type ReactNode } from "react"
import type {
  ToastObject,
  UseToastManagerReturnValue,
} from "@base-ui/react/toast"
import type { ToastProviderProps } from "@base-ui/react/toast"

import { Cheez } from "../cheez"
import type { CheezCharacter } from "../cheez-core/cheez-definition"
import {
  getMarkedFeedbackType,
  MARKED_FEEDBACK_APPEARANCES,
  type MarkedFeedbackAppearance,
  type MarkedFeedbackType,
} from "../cheez-ui/marked-feedback"
import type { CheezType } from "../mark-catalog"
import "../cheez-ui/cheez-ui.css"

export type MarkedToastType = MarkedFeedbackType

export type MarkedToastPosition =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right"

export interface MarkedToastData {
  character?: CheezCharacter
  frameColor?: string
  frameMark?: CheezType
  statusColor?: string
  statusMark?: CheezType
}

export type MarkedToastAppearance = MarkedFeedbackAppearance

export const MARKED_TOAST_APPEARANCES = MARKED_FEEDBACK_APPEARANCES

interface ToastVisualContextValue {
  character: CheezCharacter
  frameMark: CheezType
  position: MarkedToastPosition
  thickness?: number
}

const ToastVisualContext = createContext<ToastVisualContextValue | null>(null)

function MarkedToastItem({ toast }: { toast: ToastObject<MarkedToastData> }) {
  const visuals = useContext(ToastVisualContext)

  if (!visuals) {
    throw new Error("MarkedToastItem must be used inside MarkedToastProvider")
  }

  const type = getMarkedFeedbackType(toast.type)
  const appearance = MARKED_TOAST_APPEARANCES[type]
  const character = toast.data?.character ?? visuals.character
  const frameColor = toast.data?.frameColor ?? appearance.color
  const frameMark = toast.data?.frameMark ?? visuals.frameMark
  const statusColor = toast.data?.statusColor ?? appearance.color
  const statusMark = toast.data?.statusMark ?? appearance.mark
  const actionProps = toast.actionProps
  const actionLabel = actionProps?.children

  return (
    <Toast.Root
      toast={toast}
      className="cheez-ui cheez-toast__root"
      data-cheez-type={type}
      swipeDirection={
        visuals.position.startsWith("top")
          ? ["up", "right"]
          : ["down", "right"]
      }
    >
      <Cheez
        className="cheez-toast__frame"
        type={frameMark}
        character={character}
        color={frameColor}
        thickness={visuals.thickness}
        trigger="mount"
      >
        <span aria-hidden="true" />
      </Cheez>

      <Toast.Content className="cheez-toast__content">
        <Cheez
          className="cheez-toast__status"
          type={statusMark}
          character={character}
          color={statusColor}
          thickness={visuals.thickness}
          trigger="mount"
          data-loading={type === "loading" ? "" : undefined}
        >
          <span aria-hidden="true" />
        </Cheez>

        <div className="cheez-toast__copy">
          <Toast.Title className="cheez-toast__title" />
          <Toast.Description className="cheez-toast__description" />
        </div>

        {actionProps ? (
          <Toast.Action
            {...actionProps}
            className={`cheez-toast__action ${actionProps.className ?? ""}`.trim()}
          >
            {actionLabel}
          </Toast.Action>
        ) : null}

        <Toast.Close className="cheez-toast__close" aria-label="dismiss notification">
          <Cheez
            type="cross"
            character={character}
            color="#ff5fa2"
            thickness={visuals.thickness}
            trigger="mount"
          >
            <span aria-hidden="true" />
          </Cheez>
        </Toast.Close>
      </Toast.Content>
    </Toast.Root>
  )
}

function MarkedToastViewport() {
  const visuals = useContext(ToastVisualContext)
  const { toasts } = Toast.useToastManager<MarkedToastData>()

  if (!visuals) {
    throw new Error("MarkedToastViewport must be used inside MarkedToastProvider")
  }

  return (
    <Toast.Portal>
      <Toast.Viewport
        className="cheez-toast__viewport"
        data-position={visuals.position}
      >
        {toasts.map((toast) => (
          <MarkedToastItem key={toast.id} toast={toast} />
        ))}
      </Toast.Viewport>
    </Toast.Portal>
  )
}

export interface MarkedToastProviderProps
  extends Omit<ToastProviderProps, "children"> {
  character?: CheezCharacter
  children: ReactNode
  frameMark?: CheezType
  position?: MarkedToastPosition
  thickness?: number
}

export function MarkedToastProvider({
  character = "rushed",
  children,
  frameMark = "rounded-box",
  limit = 3,
  position = "bottom-right",
  thickness,
  timeout = 5000,
  ...props
}: MarkedToastProviderProps) {
  return (
    <Toast.Provider {...props} limit={limit} timeout={timeout}>
      <ToastVisualContext.Provider
        value={{ character, frameMark, position, thickness }}
      >
        {children}
        <MarkedToastViewport />
      </ToastVisualContext.Provider>
    </Toast.Provider>
  )
}

export function useMarkedToast(): UseToastManagerReturnValue<MarkedToastData> {
  return Toast.useToastManager<MarkedToastData>()
}

export function createMarkedToastManager() {
  return Toast.createToastManager<MarkedToastData>()
}
