import { mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import { spawnSync } from "node:child_process"

const scriptDirectory = dirname(fileURLToPath(import.meta.url))
const projectDirectory = dirname(scriptDirectory)
const outputDirectory = join(projectDirectory, "..", "daily")
const components = JSON.parse(readFileSync(join(projectDirectory, "components.json"), "utf8"))
const componentId = process.argv[2] ?? "breadcrumb"
const component = components.find((item) => item.id === componentId)

if (!component) {
  const ids = components.map((item) => item.id).join(", ")
  throw new Error(`Unknown component '${componentId}'. Choose one of: ${ids}`)
}

mkdirSync(outputDirectory, { recursive: true })

const videoPath = join(outputDirectory, `${String(component.number).padStart(2, "0")}-${component.id}.mp4`)
const copyPath = join(outputDirectory, `${String(component.number).padStart(2, "0")}-${component.id}.txt`)
const props = JSON.stringify({ componentId })
const render = spawnSync(
  "bunx",
  [
    "remotion",
    "render",
    "src/index.ts",
    "CheezDaily",
    videoPath,
    `--props=${props}`,
    "--codec=h264",
    "--crf=18",
    "--pixel-format=yuv420p",
  ],
  { cwd: projectDirectory, encoding: "utf8", stdio: "inherit" },
)

if (render.status !== 0) {
  process.exit(render.status ?? 1)
}

const description = component.id === "button"
  ? "outline, solid, quiet. each boundary is drawn by hand."
  : component.tagline
const post = `day ${component.number} of cheez.\n\n${component.title}.\n\n${description}\n\nreact + svg + native motion. no framer.\n\nhttps://berkant.me/cheez/components/${component.id}\nhttps://github.com/berkantay/cheez`
writeFileSync(copyPath, `${post}\n`)

process.stdout.write(`saved ${videoPath}\nsaved ${copyPath}\n`)
