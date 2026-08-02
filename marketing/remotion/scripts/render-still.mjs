import { mkdirSync, readFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import { spawnSync } from "node:child_process"

const scriptDirectory = dirname(fileURLToPath(import.meta.url))
const projectDirectory = dirname(scriptDirectory)
const outputDirectory = join(projectDirectory, "..", "daily")
const components = JSON.parse(readFileSync(join(projectDirectory, "components.json"), "utf8"))
const componentId = process.argv[2] ?? "breadcrumb"
const frame = Number(process.argv[3] ?? 128)
const component = components.find((item) => item.id === componentId)

if (!component) throw new Error(`Unknown component '${componentId}'`)
if (!Number.isInteger(frame) || frame < 0 || frame > 249) {
  throw new Error("Frame must be an integer from 0 through 249")
}

mkdirSync(outputDirectory, { recursive: true })
const outputPath = join(outputDirectory, `${String(component.number).padStart(2, "0")}-${component.id}-${frame}.png`)
const render = spawnSync(
  "bunx",
  ["remotion", "still", "src/index.ts", "CheezDaily", outputPath, `--props=${JSON.stringify({ componentId })}`, `--frame=${frame}`],
  { cwd: projectDirectory, encoding: "utf8", stdio: "inherit" },
)

process.exit(render.status ?? 1)
