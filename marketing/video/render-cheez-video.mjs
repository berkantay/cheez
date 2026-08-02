import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import { spawnSync } from "node:child_process"

const FPS = 30
const DURATION_SECONDS = 8
const FRAME_COUNT = FPS * DURATION_SECONDS
const STROKE_LENGTHS = {
  underline: 500,
  circle: 1000,
  highlight: 500,
  "arrow-line": 500,
  "arrow-head": 120,
}

const scriptDirectory = dirname(fileURLToPath(import.meta.url))
const marketingDirectory = dirname(scriptDirectory)
const sourcePath = join(marketingDirectory, "cheez-twitter-launch.svg")
const outputPath = join(marketingDirectory, "cheez-twitter-launch.mp4")
const temporaryDirectory = mkdtempSync(join(tmpdir(), "cheez-video-"))
const source = readFileSync(sourcePath, "utf8")

function clamp(value, minimum = 0, maximum = 1) {
  return Math.min(maximum, Math.max(minimum, value))
}

function smoothstep(value) {
  const progress = clamp(value)
  return progress * progress * (3 - 2 * progress)
}

function progressBetween(time, start, end) {
  return smoothstep((time - start) / (end - start))
}

function setStrokeProgress(svg, name, progress, opacity) {
  const dashLength = STROKE_LENGTHS[name]
  const pattern = new RegExp(
    `(<path\\s+data-video-stroke="${name}"[^>]*?)(\\s*/>)`,
  )

  return svg.replace(pattern, (_, attributes) => {
    const cleanAttributes = attributes.replace(
      /\s+(?:pathLength|stroke-dasharray|stroke-dashoffset|opacity)="[^"]*"/g,
      "",
    )
    const offset = dashLength * (1 - progress)

    return `${cleanAttributes} stroke-dasharray="${dashLength} ${dashLength}" stroke-dashoffset="${offset.toFixed(3)}" opacity="${opacity.toFixed(3)}" />`
  })
}

function setFillOpacity(svg, name, opacity) {
  const pattern = new RegExp(
    `(<path\\s+data-video-fill="${name}"[^>]*?)(\\s*/>)`,
  )

  return svg.replace(pattern, (_, attributes) => {
    const cleanAttributes = attributes.replace(/\s+opacity="[^"]*"/g, "")
    return `${cleanAttributes} opacity="${opacity.toFixed(3)}" />`
  })
}

function renderFrame(index) {
  const time = index / FPS
  const inkOpacity = 1 - progressBetween(time, 6.9, 7.6)
  const underline = progressBetween(time, 0.6, 1.25)
  const circle = progressBetween(time, 1.65, 2.65)
  const highlight = progressBetween(time, 3.05, 3.8)
  const arrowLine = progressBetween(time, 4.25, 5.05)
  const arrowHead = progressBetween(time, 4.95, 5.35)

  let frame = source
  frame = setStrokeProgress(frame, "underline", underline, inkOpacity)
  frame = setStrokeProgress(frame, "circle", circle, inkOpacity)
  frame = setStrokeProgress(frame, "highlight", highlight, inkOpacity)
  frame = setFillOpacity(frame, "highlight", inkOpacity)
  frame = setStrokeProgress(frame, "arrow-line", arrowLine, inkOpacity)
  frame = setStrokeProgress(frame, "arrow-head", arrowHead, inkOpacity)

  const frameNumber = String(index).padStart(4, "0")
  const svgPath = join(temporaryDirectory, `frame-${frameNumber}.svg`)
  const pngPath = join(temporaryDirectory, `frame-${frameNumber}.png`)
  writeFileSync(svgPath, frame)

  const render = spawnSync(
    "rsvg-convert",
    ["--width", "1600", "--height", "900", "--output", pngPath, svgPath],
    { encoding: "utf8" },
  )

  if (render.status !== 0) {
    throw new Error(render.stderr || `Failed to render frame ${index}`)
  }

  if (index % FPS === 0) {
    process.stdout.write(`rendered ${index / FPS}s / ${DURATION_SECONDS}s\n`)
  }
}

try {
  for (let index = 0; index < FRAME_COUNT; index += 1) {
    renderFrame(index)
  }

  const encode = spawnSync(
    "ffmpeg",
    [
      "-hide_banner",
      "-loglevel",
      "error",
      "-framerate",
      String(FPS),
      "-i",
      join(temporaryDirectory, "frame-%04d.png"),
      "-an",
      "-c:v",
      "libx264",
      "-preset",
      "slow",
      "-crf",
      "18",
      "-pix_fmt",
      "yuv420p",
      "-movflags",
      "+faststart",
      "-r",
      String(FPS),
      "-y",
      outputPath,
    ],
    { encoding: "utf8" },
  )

  if (encode.status !== 0) {
    throw new Error(encode.stderr || "Failed to encode video")
  }

  process.stdout.write(`saved ${outputPath}\n`)
} finally {
  rmSync(temporaryDirectory, { recursive: true, force: true })
}
