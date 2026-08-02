import componentData from "../components.json"
import type { ComponentVideoDefinition } from "./types"

export const components = componentData as ComponentVideoDefinition[]

export function getComponent(componentId: string) {
  const component = components.find((item) => item.id === componentId)

  if (!component) {
    throw new Error(`Unknown Cheez component: ${componentId}`)
  }

  return component
}
