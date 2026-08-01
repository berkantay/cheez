"use client"

import { createCheezMark } from "../cheez-core/create-cheez-mark"
import { highlightDefinitions } from "./highlight.definition"

export const Highlight = createCheezMark(
  "Highlight",
  highlightDefinitions,
  "#f5c842",
)
