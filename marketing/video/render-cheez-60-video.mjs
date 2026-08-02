import { mkdtempSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import { spawnSync } from "node:child_process"

import {
  MARK_CATALOG,
  MARK_FAMILIES,
} from "../../registry/default/mark-catalog.ts"

const WIDTH = 1600
const HEIGHT = 900
const FPS = 30
const DURATION_SECONDS = 10
const FRAME_COUNT = FPS * DURATION_SECONDS
const MARK_INTERVAL = 0.09
const MARK_DURATION = 0.17
const DRAW_START = 0.7
const FADE_START = 8.9
const FADE_END = 9.65

const COLORS = {
  orange: "#ff4f2e",
  purple: "#8f74ff",
  pink: "#ff5fa2",
  lime: "#b7ff3c",
  cyan: "#35d9ff",
  white: "#f4f0e6",
}

const ROWS = [
  { family: "emphasis", word: "important", color: COLORS.orange },
  { family: "encircle", word: "approved", color: COLORS.purple },
  { family: "cross-out", word: "old copy", color: COLORS.pink },
  { family: "highlight", word: "remember", color: COLORS.lime },
  { family: "arrow", word: "look here", color: COLORS.cyan },
  { family: "symbol", word: "yes", color: COLORS.white },
]

const GRID_X = 188
const GRID_Y = 151
const CELL_WIDTH = 134
const CELL_HEIGHT = 111
const scriptDirectory = dirname(fileURLToPath(import.meta.url))
const marketingDirectory = dirname(scriptDirectory)
const outputPath = join(marketingDirectory, "cheez-twitter-60.mp4")
const posterPath = join(marketingDirectory, "cheez-twitter-60.png")
const temporaryDirectory = mkdtempSync(join(tmpdir(), "cheez-60-video-"))

function escapeXml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
}

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

function renderLogo() {
  return `
    <g transform="translate(60 43) scale(1.48)" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <path d="M20 11.5C17.5 8.5 10 8.8 7.5 14.5C5 20.2 8.5 25.2 14.5 25C18 24.9 20.2 22.9 21.3 20.8M25.5 5.5C24.4 11.2 24.2 18.8 24.7 25.8M24.5 17.8C27.1 11.8 33.6 9.6 36 13.2C38.6 17.1 34.5 22.4 38.2 24.8M41.2 17.2C45.5 17.1 51.2 15.3 51.1 12.1C51 9.3 46.1 9.3 43 11.5C39.2 14.2 39.6 21.2 43.8 23.9C47.3 26.2 51.9 24 54 21M56.2 17.2C60.5 17.1 66.2 15.3 66.1 12.1C66 9.3 61.1 9.3 58 11.5C54.2 14.2 54.6 21.2 58.8 23.9C62.3 26.2 66.9 24 69 21M72 11.8C77 10.2 84 10 88.2 11.3C84.8 15.1 79.7 20.7 75.4 25C80.5 22.9 86.3 23 91 24.7" stroke="${COLORS.white}" stroke-width="3.15" />
      <path d="M98.2 24.3C99.3 23.2 101.1 23.3 101.8 24.5C101.5 26 99.8 26.6 98.5 25.7" stroke="${COLORS.orange}" stroke-width="3.6" />
    </g>`
}

function renderLayer(layer, color) {
  const transform = layer.transform ? ` transform="${escapeXml(layer.transform)}"` : ""
  const opacity = layer.opacity ?? 1

  if (layer.type === "fill") {
    return `<path d="${escapeXml(layer.path)}" fill="${color}" opacity="${Math.max(opacity, 0.62)}"${transform} />`
  }

  return `<path d="${escapeXml(layer.path)}" fill="none" stroke="${color}" stroke-width="${layer.strokeWidth}" stroke-linecap="round" stroke-linejoin="round" opacity="${opacity}"${transform} />`
}

function markBox(family, definition, cellX, rowY) {
  if (family === "emphasis") {
    return { x: cellX + 10, y: rowY + 63, width: 114, height: 22 }
  }

  if (family === "encircle") {
    return { x: cellX + 8, y: rowY + 32, width: 118, height: 55 }
  }

  if (family === "cross-out") {
    return { x: cellX + 9, y: rowY + 39, width: 116, height: 37 }
  }

  if (family === "highlight") {
    return { x: cellX + 8, y: rowY + 37, width: 118, height: 40 }
  }

  if (family === "arrow") {
    if (definition.viewBox === "0 0 30 60") {
      return { x: cellX + 91, y: rowY + 14, width: 30, height: 77 }
    }
    return { x: cellX + 8, y: rowY + 56, width: 118, height: 50 }
  }

  return { x: cellX + 18, y: rowY + 23, width: 56, height: 65 }
}

function wordMarkup(family, word, cellX, rowY) {
  const fill = COLORS.white
  const opacity = family === "symbol" ? 0.82 : 0.9
  const x = family === "symbol" ? cellX + 84 : cellX + CELL_WIDTH / 2
  const anchor = family === "symbol" ? "middle" : "middle"
  const y = family === "arrow" ? rowY + 54 : rowY + 63
  const size = family === "symbol" ? 16 : 15

  return `<text x="${x}" y="${y}" text-anchor="${anchor}" fill="${fill}" opacity="${opacity}" font-family="Inter, Helvetica, Arial, sans-serif" font-size="${size}" font-weight="500" letter-spacing="-0.45">${word}</text>`
}

function renderMark({ definition, family, color, cellX, rowY, progress, index }) {
  const box = markBox(family, definition, cellX, rowY)
  const clipWidth = box.width * progress
  const layers = definition.layers.map((layer) => renderLayer(layer, color)).join("")

  return {
    clip: `<clipPath id="mark-clip-${index}">
      <rect x="${box.x - 3}" y="${box.y - 4}" width="${clipWidth + 6}" height="${box.height + 8}" />
    </clipPath>`,
    mark: `<g clip-path="url(#mark-clip-${index})" opacity="${progress.toFixed(3)}">
      <svg x="${box.x}" y="${box.y}" width="${box.width}" height="${box.height}" viewBox="${definition.viewBox}" preserveAspectRatio="${definition.preserveAspectRatio ?? "none"}" overflow="visible">
        ${layers}
      </svg>
    </g>`,
  }
}

function renderFrame(index, forceComplete = false) {
  const time = index / FPS
  const collectionOpacity = forceComplete
    ? 1
    : 1 - progressBetween(time, FADE_START, FADE_END)
  const definitions = []
  const clips = []
  const clipsAndMarks = []
  let markIndex = 0

  ROWS.forEach((row, rowIndex) => {
    const rowY = GRID_Y + rowIndex * CELL_HEIGHT
    const types = MARK_FAMILIES[row.family]

    definitions.push(`
      <text x="60" y="${rowY + 58}" fill="${row.color}" opacity="0.48" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="12" letter-spacing="1.3">${row.family.toUpperCase()}</text>`)

    types.forEach((type, columnIndex) => {
      const cellX = GRID_X + columnIndex * CELL_WIDTH
      const character = ["calm", "rushed", "chaotic"][columnIndex % 3]
      const definition = MARK_CATALOG[type][character]
      const start = DRAW_START + markIndex * MARK_INTERVAL
      const progress = forceComplete ? 1 : progressBetween(time, start, start + MARK_DURATION)
      const color = row.family === "symbol"
        ? [COLORS.orange, COLORS.purple, COLORS.pink, COLORS.lime, COLORS.cyan][columnIndex % 5]
        : row.color

      definitions.push(`
        <text x="${cellX + 4}" y="${rowY + 16}" fill="${COLORS.white}" opacity="0.23" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="9">${String(markIndex + 1).padStart(2, "0")}</text>
        ${wordMarkup(row.family, row.word, cellX, rowY)}`)
      const mark = renderMark({
        definition,
        family: row.family,
        color,
        cellX,
        rowY,
        progress,
        index: markIndex,
      })
      clips.push(mark.clip)
      clipsAndMarks.push(mark.mark)
      markIndex += 1
    })
  })

  return `<svg viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="title description">
    <title id="title">Sixty Cheez marks drawing one by one</title>
    <desc id="description">All sixty hand-drawn React marks appear sequentially in a six by ten composition.</desc>
    <defs>
      <pattern id="micro-grid" width="22" height="22" patternUnits="userSpaceOnUse">
        <path d="M22 0H0V22" fill="none" stroke="${COLORS.white}" stroke-opacity="0.035" />
      </pattern>
      ${clips.join("")}
    </defs>
    <rect width="${WIDTH}" height="${HEIGHT}" fill="#000" />
    <rect x="42" y="131" width="1516" height="691" fill="url(#micro-grid)" />
    ${renderLogo()}
    <text x="1538" y="63" text-anchor="end" fill="${COLORS.white}" opacity="0.56" font-family="Inter, Helvetica, Arial, sans-serif" font-size="18">sixty marks. one human rhythm.</text>
    <text x="1538" y="91" text-anchor="end" fill="${COLORS.white}" opacity="0.28" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="11" letter-spacing="1">BERKANT.ME/CHEEZ</text>
    <g opacity="${collectionOpacity.toFixed(3)}">
      ${definitions.join("")}
      ${clipsAndMarks.join("")}
    </g>
    <g transform="translate(1393 850)" opacity="0.84">
      <circle cx="0" cy="0" r="4" fill="${COLORS.orange}" />
      <circle cx="20" cy="0" r="4" fill="${COLORS.purple}" />
      <circle cx="40" cy="0" r="4" fill="${COLORS.pink}" />
      <circle cx="60" cy="0" r="4" fill="${COLORS.lime}" />
      <circle cx="80" cy="0" r="4" fill="${COLORS.cyan}" />
    </g>
    <text x="1538" y="855" text-anchor="end" fill="${COLORS.white}" opacity="0.33" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="11" letter-spacing="1.2">60 / 60</text>
  </svg>`
}

function renderSvgToPng(svg, pngPath, frameIndex) {
  const svgPath = join(temporaryDirectory, `frame-${String(frameIndex).padStart(4, "0")}.svg`)
  writeFileSync(svgPath, svg)
  const render = spawnSync(
    "rsvg-convert",
    ["--width", String(WIDTH), "--height", String(HEIGHT), "--output", pngPath, svgPath],
    { encoding: "utf8" },
  )

  if (render.status !== 0) {
    throw new Error(render.stderr || `Failed to render frame ${frameIndex}`)
  }
}

try {
  for (let index = 0; index < FRAME_COUNT; index += 1) {
    const pngPath = join(temporaryDirectory, `frame-${String(index).padStart(4, "0")}.png`)
    renderSvgToPng(renderFrame(index), pngPath, index)

    if (index % FPS === 0) {
      process.stdout.write(`rendered ${index / FPS}s / ${DURATION_SECONDS}s\n`)
    }
  }

  const posterSvgPath = join(temporaryDirectory, "poster.svg")
  writeFileSync(posterSvgPath, renderFrame(0, true))
  const poster = spawnSync(
    "rsvg-convert",
    ["--width", String(WIDTH), "--height", String(HEIGHT), "--output", posterPath, posterSvgPath],
    { encoding: "utf8" },
  )

  if (poster.status !== 0) {
    throw new Error(poster.stderr || "Failed to render poster")
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
  process.stdout.write(`saved ${posterPath}\n`)
} finally {
  rmSync(temporaryDirectory, { recursive: true, force: true })
}
