export type CheezCharacter = "calm" | "rushed" | "chaotic"

export type CheezTrigger =
  | "mount"
  | "in-view"
  | "hover"
  | "focus"
  | "manual"
  | "none"

export interface CheezTiming {
  duration: number
  delay?: number
  easing?: string
}

export interface CheezStrokeLayer {
  type: "stroke"
  path: string
  strokeWidth: number
  transform?: string
  opacity?: number
  timing: CheezTiming
}

export interface CheezFillLayer {
  type: "fill"
  path: string
  transform?: string
  opacity?: number
  reveal: {
    path: string
    strokeWidth: number
  }
  timing: CheezTiming
}

export type CheezLayer = CheezStrokeLayer | CheezFillLayer

export interface CheezPlacement {
  top: string
  left: string
  width: string
  height: string
}

export interface CheezDefinition {
  name: string
  viewBox: string
  placement: CheezPlacement
  layer: "behind" | "front"
  preserveAspectRatio?: "none" | "xMidYMid meet"
  layers: readonly CheezLayer[]
}

export type CheezDefinitionSet = Record<CheezCharacter, CheezDefinition>

export function validateCheezDefinition(definition: CheezDefinition) {
  if (definition.layers.length === 0) {
    return [`${definition.name} must contain at least one layer`]
  }

  const errors: string[] = []

  definition.layers.forEach((layer, index) => {
    if (!layer.path.trim()) {
      errors.push(`${definition.name} layer ${index} has an empty path`)
    }

    if (layer.timing.duration <= 0) {
      errors.push(`${definition.name} layer ${index} needs a positive duration`)
    }

    if (layer.type === "fill" && !layer.reveal.path.trim()) {
      errors.push(`${definition.name} layer ${index} has an empty reveal path`)
    }
  })

  return errors
}
