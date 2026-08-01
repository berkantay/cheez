import { describe, expect, it } from "vitest"

import {
  validateCheezDefinition,
  type CheezDefinitionSet,
} from "@/registry/default/cheez-core/cheez-definition"
import {
  MARK_CATALOG,
  MARK_FAMILIES,
  MARK_TYPES,
} from "@/registry/default/mark-catalog"
import { circleDefinitions } from "@/registry/default/circle/circle.definition"
import { highlightDefinitions } from "@/registry/default/highlight/highlight.definition"
import { overwriteDefinitions } from "@/registry/default/overwrite/overwrite.definition"
import { underlineDefinitions } from "@/registry/default/underline/underline.definition"

const definitionSets: CheezDefinitionSet[] = [
  underlineDefinitions,
  circleDefinitions,
  highlightDefinitions,
  overwriteDefinitions,
]

describe("Cheez definitions", () => {
  it("ships exactly 60 types in six balanced families", () => {
    expect(MARK_TYPES).toHaveLength(60)
    expect(Object.keys(MARK_FAMILIES)).toHaveLength(6)

    Object.values(MARK_FAMILIES).forEach((types) => {
      expect(types).toHaveLength(10)
    })
  })

  it("provides every character for every mark", () => {
    Object.values(MARK_CATALOG).forEach((definitions) => {
      expect(Object.keys(definitions)).toEqual(["calm", "rushed", "chaotic"])
    })
  })

  it("contains valid paths and timings", () => {
    Object.values(MARK_CATALOG).forEach((definitions) => {
      Object.values(definitions).forEach((definition) => {
        expect(validateCheezDefinition(definition)).toEqual([])
      })
    })
  })

  it("covers the stroke, filled, and staggered motion primitives", () => {
    const allDefinitions = definitionSets.flatMap((definitions) =>
      Object.values(definitions),
    )
    const allLayers = allDefinitions.flatMap((definition) => definition.layers)

    expect(allLayers.some((layer) => layer.type === "stroke")).toBe(true)
    expect(allLayers.some((layer) => layer.type === "fill")).toBe(true)
    expect(
      allDefinitions.some((definition) => definition.layers.length > 1),
    ).toBe(true)
  })
})
