"use client"

import { forwardRef } from "react"

import type {
  CheezCharacter,
  CheezDefinitionSet,
} from "./cheez-definition"
import {
  CheezMark,
  type CheezMarkHandle,
  type CheezMarkProps,
} from "./cheez-mark"

export interface CheezComponentProps
  extends Omit<CheezMarkProps, "definition"> {
  character?: CheezCharacter
}

export function createCheezMark(
  name: string,
  definitions: CheezDefinitionSet,
  defaultColor?: string,
) {
  const Component = forwardRef<CheezMarkHandle, CheezComponentProps>(
    function CheezComponent(
      { character = "calm", color = defaultColor, ...props },
      ref,
    ) {
      return (
        <CheezMark
          {...props}
          ref={ref}
          color={color}
          definition={definitions[character]}
        />
      )
    },
  )

  Component.displayName = name
  return Component
}
