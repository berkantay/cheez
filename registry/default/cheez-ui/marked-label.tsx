"use client"

import type { ReactNode } from "react"

import { Cheez } from "../cheez"
import type { CheezCharacter } from "../cheez-core/cheez-definition"
import type { CheezType } from "../mark-catalog"

export interface MarkedLabelProps {
  active: boolean
  animationKey?: number | string
  children: ReactNode
  character?: CheezCharacter
  className?: string
  color?: string
  mark?: CheezType
  thickness?: number
}

export function MarkedLabel({
  active,
  animationKey = 0,
  character = "rushed",
  children,
  className,
  color = "var(--cheez-accent, #ff4f2e)",
  mark = "underline",
  thickness = 1,
}: MarkedLabelProps) {
  return (
    <Cheez
      key={`${active ? "active" : "idle"}-${animationKey}`}
      className={className}
      type={mark}
      character={character}
      color={color}
      thickness={thickness}
      trigger={active ? "mount" : "manual"}
    >
      {children}
    </Cheez>
  )
}

export function joinCheezClassNames(
  ...classNames: Array<string | undefined>
) {
  return classNames.filter(Boolean).join(" ")
}
