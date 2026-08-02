import { z } from "zod"

import { components } from "./manifest"

const componentIds = components.map((component) => component.id) as [string, ...string[]]

export const cheezDailyVideoSchema = z.object({
  componentId: z.enum(componentIds),
})

export type CheezDailyVideoProps = z.infer<typeof cheezDailyVideoSchema>
