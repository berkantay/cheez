"use client"

import { Toggle } from "@base-ui/react/toggle"
import { ToggleGroup } from "@base-ui/react/toggle-group"
import {
  createContext,
  forwardRef,
  useContext,
  useState,
  type ReactNode,
} from "react"
import type { ToggleProps } from "@base-ui/react/toggle"
import type { ToggleGroupProps } from "@base-ui/react/toggle-group"

import { Cheez } from "../cheez"
import type { CheezCharacter } from "../cheez-core/cheez-definition"
import { joinCheezClassNames, MarkedLabel } from "../cheez-ui/marked-label"
import type { CheezType } from "../mark-catalog"
import "../cheez-ui/cheez-ui.css"
import "./marked-toggle-group.css"

export type MarkedToggleGroupTone = "orange" | "purple" | "lime" | "pink" | "cyan" | "neutral"
export type MarkedToggleGroupSize = "small" | "medium" | "large"

const TONE_COLORS: Record<MarkedToggleGroupTone, string> = {
  orange: "#ff4f2e",
  purple: "#8f74ff",
  lime: "#b7ff3c",
  pink: "#ff5fa2",
  cyan: "#35d9ff",
  neutral: "#f4f0e6",
}

interface ToggleGroupVisuals {
  character: CheezCharacter
  color: string
  focusColor: string
  focusMark: CheezType
  frameColor: string
  frameMark: CheezType
  selectedMark: CheezType
  size: MarkedToggleGroupSize
  thickness?: number
}

const VisualContext = createContext<ToggleGroupVisuals | null>(null)

function useVisuals() {
  const context = useContext(VisualContext)
  if (!context) throw new Error("MarkedToggleGroupItem must be used inside MarkedToggleGroup")
  return context
}

export interface MarkedToggleGroupProps extends Omit<ToggleGroupProps<string>, "className" | "defaultValue" | "onValueChange" | "value"> {
  character?: CheezCharacter
  children: ReactNode
  className?: string
  color?: string
  defaultValue?: readonly string[]
  focusColor?: string
  focusMark?: CheezType
  frameColor?: string
  frameMark?: CheezType
  onValueChange?: ToggleGroupProps<string>["onValueChange"]
  required?: boolean
  selectedMark?: CheezType
  size?: MarkedToggleGroupSize
  thickness?: number
  tone?: MarkedToggleGroupTone
  value?: readonly string[]
}

export const MarkedToggleGroup = forwardRef<HTMLDivElement, MarkedToggleGroupProps>(function MarkedToggleGroup({
  character = "rushed",
  children,
  className,
  color,
  defaultValue = [],
  focusColor = "#35d9ff",
  focusMark = "short-underline",
  frameColor = "#f4f0e6",
  frameMark = "rounded-box",
  onValueChange,
  required = false,
  selectedMark = "loose-circle",
  size = "medium",
  thickness,
  tone = "purple",
  value,
  ...props
}, ref) {
  const [uncontrolledValue, setUncontrolledValue] = useState<string[]>([...defaultValue])
  const selected = value ?? uncontrolledValue
  const visuals: ToggleGroupVisuals = { character, color: color ?? TONE_COLORS[tone], focusColor, focusMark, frameColor, frameMark, selectedMark, size, thickness }

  const handleValueChange: NonNullable<ToggleGroupProps<string>["onValueChange"]> = (nextValue, details) => {
    if (required && nextValue.length === 0) return
    if (value === undefined) setUncontrolledValue(nextValue)
    onValueChange?.(nextValue, details)
  }

  return (
    <VisualContext.Provider value={visuals}>
      <Cheez className="cheez-toggle-group__frame" type={frameMark} character={character} color={frameColor} thickness={thickness} trigger="mount">
        <ToggleGroup {...props} ref={ref} className={joinCheezClassNames("cheez-toggle-group", className)} data-size={size} value={selected} onValueChange={handleValueChange}>{children}</ToggleGroup>
      </Cheez>
    </VisualContext.Provider>
  )
})

export interface MarkedToggleGroupItemProps extends Omit<ToggleProps<string>, "children" | "className" | "render"> {
  children: ReactNode
  className?: string
  color?: string
  icon?: ReactNode
  mark?: CheezType
  tone?: "default" | "danger"
}

export const MarkedToggleGroupItem = forwardRef<HTMLButtonElement, MarkedToggleGroupItemProps>(function MarkedToggleGroupItem({
  children,
  className,
  color,
  icon,
  mark,
  onBlur,
  onFocus,
  onPointerEnter,
  onPointerLeave,
  tone = "default",
  ...props
}, ref) {
  const visuals = useVisuals()
  const [focused, setFocused] = useState(false)
  const [hovered, setHovered] = useState(false)

  return (
    <Toggle
      {...props}
      ref={ref}
      className={joinCheezClassNames("cheez-toggle-group__item", className)}
      data-tone={tone}
      onBlur={(event) => { setFocused(false); onBlur?.(event) }}
      onFocus={(event) => { setFocused(true); onFocus?.(event) }}
      onPointerEnter={(event) => { setHovered(true); onPointerEnter?.(event) }}
      onPointerLeave={(event) => { setHovered(false); onPointerLeave?.(event) }}
      render={(itemProps, state) => {
        const interacting = !state.disabled && (focused || hovered)
        const active = state.pressed || interacting
        const markColor = color ?? (tone === "danger" ? "#ff5fa2" : state.pressed ? visuals.color : visuals.focusColor)
        return (
          <button {...itemProps}>
            <MarkedLabel active={active} character={visuals.character} color={markColor} mark={mark ?? (state.pressed ? visuals.selectedMark : visuals.focusMark)} thickness={visuals.thickness}>
              <span className="cheez-toggle-group__copy">{icon ? <span className="cheez-toggle-group__icon" aria-hidden="true">{icon}</span> : null}<span>{children}</span></span>
            </MarkedLabel>
          </button>
        )
      }}
    />
  )
})
