"use client"

import { Toolbar } from "@base-ui/react/toolbar"
import {
  createContext,
  forwardRef,
  useContext,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react"
import type {
  ToolbarButtonProps,
  ToolbarGroupProps,
  ToolbarInputProps,
  ToolbarLinkProps,
  ToolbarRootProps,
  ToolbarSeparatorProps,
} from "@base-ui/react/toolbar"

import { Cheez } from "../cheez"
import type { CheezCharacter } from "../cheez-core/cheez-definition"
import { joinCheezClassNames, MarkedLabel } from "../cheez-ui/marked-label"
import type { CheezType } from "../mark-catalog"
import "../cheez-ui/cheez-ui.css"
import "./marked-toolbar.css"

export type MarkedToolbarTone = "orange" | "purple" | "lime" | "pink" | "cyan" | "neutral"
export type MarkedToolbarSize = "small" | "medium" | "large"

const TONE_COLORS: Record<MarkedToolbarTone, string> = {
  orange: "#ff4f2e",
  purple: "#8f74ff",
  lime: "#b7ff3c",
  pink: "#ff5fa2",
  cyan: "#35d9ff",
  neutral: "#f4f0e6",
}

interface ToolbarVisuals {
  activeColor: string
  activeMark: CheezType
  character: CheezCharacter
  color: string
  focusColor: string
  focusMark: CheezType
  frameMark: CheezType
  size: MarkedToolbarSize
  thickness?: number
}

const VisualContext = createContext<ToolbarVisuals | null>(null)

function useVisuals() {
  const context = useContext(VisualContext)
  if (!context) throw new Error("MarkedToolbar parts must be used inside MarkedToolbar")
  return context
}

export interface MarkedToolbarProps extends Omit<ToolbarRootProps, "children" | "className"> {
  activeColor?: string
  activeMark?: CheezType
  character?: CheezCharacter
  children: ReactNode
  className?: string
  color?: string
  focusColor?: string
  focusMark?: CheezType
  frameMark?: CheezType
  size?: MarkedToolbarSize
  thickness?: number
  tone?: MarkedToolbarTone
}

export const MarkedToolbar = forwardRef<HTMLDivElement, MarkedToolbarProps>(function MarkedToolbar({
  activeColor = "#b7ff3c",
  activeMark = "circle",
  character = "calm",
  children,
  className,
  color,
  focusColor = "#35d9ff",
  focusMark = "short-underline",
  frameMark = "rounded-box",
  size = "medium",
  thickness,
  tone = "orange",
  ...props
}, ref) {
  const visuals: ToolbarVisuals = { activeColor, activeMark, character, color: color ?? TONE_COLORS[tone], focusColor, focusMark, frameMark, size, thickness }

  return (
    <VisualContext.Provider value={visuals}>
      <Cheez className="cheez-toolbar__frame" type={frameMark} character={character} color={visuals.color} thickness={thickness} trigger="mount">
        <Toolbar.Root {...props} ref={ref} className={joinCheezClassNames("cheez-toolbar", className)} data-size={size}>{children}</Toolbar.Root>
      </Cheez>
    </VisualContext.Provider>
  )
})

export interface MarkedToolbarGroupProps extends Omit<ToolbarGroupProps, "className"> { className?: string }
export const MarkedToolbarGroup = forwardRef<HTMLDivElement, MarkedToolbarGroupProps>(function MarkedToolbarGroup({ className, ...props }, ref) {
  return <Toolbar.Group {...props} ref={ref} className={joinCheezClassNames("cheez-toolbar__group", className)} />
})

interface ControlVisualProps {
  children: ReactNode
  className?: string
  color?: string
  icon?: ReactNode
  mark?: CheezType
}

export interface MarkedToolbarButtonProps extends Omit<ToolbarButtonProps, "children" | "className" | "render">, ControlVisualProps {
  onPressedChange?: (pressed: boolean) => void
  pressed?: boolean
  tone?: "default" | "danger"
}

export const MarkedToolbarButton = forwardRef<HTMLButtonElement, MarkedToolbarButtonProps>(function MarkedToolbarButton({
  children,
  className,
  color,
  disabled,
  icon,
  mark,
  onBlur,
  onClick,
  onFocus,
  onPointerEnter,
  onPointerLeave,
  onPressedChange,
  pressed,
  tone = "default",
  ...props
}, ref) {
  const visuals = useVisuals()
  const [focused, setFocused] = useState(false)
  const [hovered, setHovered] = useState(false)
  const active = pressed || focused || hovered
  const markColor = color ?? (tone === "danger" ? "#ff5fa2" : pressed ? visuals.activeColor : visuals.focusColor)

  return (
    <Toolbar.Button
      {...props}
      ref={ref}
      aria-pressed={pressed}
      className={joinCheezClassNames("cheez-toolbar__button", className)}
      data-tone={tone}
      disabled={disabled}
      onBlur={(event) => { setFocused(false); onBlur?.(event) }}
      onClick={(event) => { if (pressed !== undefined) onPressedChange?.(!pressed); onClick?.(event) }}
      onFocus={(event) => { setFocused(true); onFocus?.(event) }}
      onPointerEnter={(event) => { setHovered(true); onPointerEnter?.(event) }}
      onPointerLeave={(event) => { setHovered(false); onPointerLeave?.(event) }}
      render={(buttonProps) => (
        <button {...buttonProps}>
          <MarkedLabel active={active} character={visuals.character} color={markColor} mark={mark ?? (pressed ? visuals.activeMark : visuals.focusMark)} thickness={visuals.thickness}>
            <span className="cheez-toolbar__control-copy">{icon ? <span className="cheez-toolbar__icon" aria-hidden="true">{icon}</span> : null}<span>{children}</span></span>
          </MarkedLabel>
        </button>
      )}
    />
  )
})

export interface MarkedToolbarLinkProps extends Omit<ToolbarLinkProps, "children" | "className" | "render">, ControlVisualProps {}
export const MarkedToolbarLink = forwardRef<HTMLAnchorElement, MarkedToolbarLinkProps>(function MarkedToolbarLink({ children, className, color, icon, mark, onBlur, onFocus, onPointerEnter, onPointerLeave, ...props }, ref) {
  const visuals = useVisuals()
  const [active, setActive] = useState(false)
  return (
    <Toolbar.Link {...props} ref={ref} className={joinCheezClassNames("cheez-toolbar__button cheez-toolbar__link", className)} onBlur={(event) => { setActive(false); onBlur?.(event) }} onFocus={(event) => { setActive(true); onFocus?.(event) }} onPointerEnter={(event) => { setActive(true); onPointerEnter?.(event) }} onPointerLeave={(event) => { setActive(false); onPointerLeave?.(event) }} render={(linkProps) => (
      <a {...linkProps}><MarkedLabel active={active} character={visuals.character} color={color ?? visuals.focusColor} mark={mark ?? visuals.focusMark} thickness={visuals.thickness}><span className="cheez-toolbar__control-copy">{icon ? <span className="cheez-toolbar__icon" aria-hidden="true">{icon}</span> : null}<span>{children}</span></span></MarkedLabel></a>
    )} />
  )
})

export interface MarkedToolbarInputProps extends Omit<ToolbarInputProps, "className"> { className?: string }
export const MarkedToolbarInput = forwardRef<HTMLInputElement, MarkedToolbarInputProps>(function MarkedToolbarInput({ className, ...props }, ref) {
  const visuals = useVisuals()
  return <Cheez className="cheez-toolbar__input-frame" type="rounded-box" character={visuals.character} color={visuals.focusColor} thickness={visuals.thickness} trigger="focus"><Toolbar.Input {...props} ref={ref} className={joinCheezClassNames("cheez-toolbar__input", className)} /></Cheez>
})

export interface MarkedToolbarSeparatorProps extends Omit<ToolbarSeparatorProps, "className"> { className?: string; color?: string }
export const MarkedToolbarSeparator = forwardRef<HTMLDivElement, MarkedToolbarSeparatorProps>(function MarkedToolbarSeparator({ className, color, style, ...props }, ref) {
  const visuals = useVisuals()
  return <Toolbar.Separator {...props} ref={ref} className={joinCheezClassNames("cheez-toolbar__separator", className)} style={{ ...style, "--cheez-toolbar-separator": color ?? visuals.color } as CSSProperties} />
})
