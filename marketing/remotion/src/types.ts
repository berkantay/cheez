export type DemoKind =
  | "action"
  | "feedback"
  | "field"
  | "identity"
  | "layout"
  | "loading"
  | "overlay"
  | "route"
  | "selection"

export interface ComponentVideoDefinition {
  accent: string
  id: string
  kind: DemoKind
  number: number
  tagline: string
  title: string
}
