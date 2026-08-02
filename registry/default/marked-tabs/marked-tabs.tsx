"use client"

import { Tabs } from "@base-ui/react/tabs"
import {
  forwardRef,
  useState,
  type ReactNode,
} from "react"
import type {
  TabsListProps,
  TabsPanelProps,
  TabsRootProps,
  TabsTabProps,
} from "@base-ui/react/tabs"

import type { CheezCharacter } from "../cheez-core/cheez-definition"
import type { CheezType } from "../mark-catalog"
import {
  joinCheezClassNames,
  MarkedLabel,
} from "../cheez-ui/marked-label"
import "../cheez-ui/cheez-ui.css"

export interface MarkedTabsProps extends Omit<TabsRootProps, "className"> {
  className?: string
}

export const MarkedTabs = forwardRef<HTMLDivElement, MarkedTabsProps>(
  function MarkedTabs({ className, ...props }, ref) {
    return (
      <Tabs.Root
        {...props}
        ref={ref}
        className={joinCheezClassNames("cheez-ui cheez-tabs", className)}
      />
    )
  },
)

export interface MarkedTabsListProps
  extends Omit<TabsListProps, "className"> {
  className?: string
}

export const MarkedTabsList = forwardRef<HTMLDivElement, MarkedTabsListProps>(
  function MarkedTabsList({ className, ...props }, ref) {
    return (
      <Tabs.List
        {...props}
        ref={ref}
        className={joinCheezClassNames("cheez-tabs__list", className)}
      />
    )
  },
)

export interface MarkedTabsTriggerProps
  extends Omit<TabsTabProps, "children" | "className" | "render"> {
  character?: CheezCharacter
  children: ReactNode
  className?: string
  interactionColor?: string
  interactionMark?: CheezType
  mark?: CheezType
  markColor?: string
  marked?: boolean
  thickness?: number
}

export const MarkedTabsTrigger = forwardRef<
  HTMLElement,
  MarkedTabsTriggerProps
>(function MarkedTabsTrigger(
  {
    character,
    children,
    className,
    disabled,
    interactionColor,
    interactionMark = "short-underline",
    mark = "underline",
    markColor,
    marked,
    onBlur,
    onFocus,
    onPointerDown,
    onPointerEnter,
    onPointerLeave,
    thickness,
    ...props
  },
  ref,
) {
  const [focused, setFocused] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [replayKey, setReplayKey] = useState(0)

  const replayMark = () => {
    if (!disabled) setReplayKey((key) => key + 1)
  }

  return (
    <Tabs.Tab
      {...props}
      ref={ref}
      className={joinCheezClassNames("cheez-tabs__tab", className)}
      disabled={disabled}
      onBlur={(event) => {
        setFocused(false)
        onBlur?.(event)
      }}
      onFocus={(event) => {
        setFocused(true)
        replayMark()
        onFocus?.(event)
      }}
      onPointerDown={(event) => {
        replayMark()
        onPointerDown?.(event)
      }}
      onPointerEnter={(event) => {
        setHovered(true)
        replayMark()
        onPointerEnter?.(event)
      }}
      onPointerLeave={(event) => {
        setHovered(false)
        onPointerLeave?.(event)
      }}
      render={(tabProps, state) => (
        <button {...tabProps}>
          <MarkedLabel
            active={
              !state.disabled &&
              (marked ?? (state.active || focused || hovered))
            }
            animationKey={replayKey}
            character={character}
            color={state.active ? markColor : (interactionColor ?? markColor)}
            mark={state.active ? mark : interactionMark}
            thickness={thickness}
          >
            {children}
          </MarkedLabel>
        </button>
      )}
    />
  )
})

export interface MarkedTabsPanelProps
  extends Omit<TabsPanelProps, "className"> {
  className?: string
}

export const MarkedTabsPanel = forwardRef<
  HTMLDivElement,
  MarkedTabsPanelProps
>(function MarkedTabsPanel({ className, ...props }, ref) {
  return (
    <Tabs.Panel
      {...props}
      ref={ref}
      className={joinCheezClassNames("cheez-tabs__panel", className)}
    />
  )
})
