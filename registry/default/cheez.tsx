"use client"

import { forwardRef } from "react"

import type { CheezCharacter } from "./cheez-core/cheez-definition"
import {
  CheezMark,
  type CheezMarkHandle,
  type CheezMarkProps,
} from "./cheez-core/cheez-mark"
import { MARK_CATALOG, type CheezType } from "./mark-catalog"

export interface CheezProps extends Omit<CheezMarkProps, "definition"> {
  type: CheezType
  character?: CheezCharacter
}

export const Cheez = forwardRef<CheezMarkHandle, CheezProps>(function Cheez(
  { character = "calm", type, ...props },
  ref,
) {
  return (
    <CheezMark
      {...props}
      ref={ref}
      definition={MARK_CATALOG[type][character]}
    />
  )
})
