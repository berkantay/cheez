import type {
  CheezCharacter,
  CheezDefinition,
  CheezDefinitionSet,
  CheezFillLayer,
  CheezLayer,
  CheezStrokeLayer,
} from "./cheez-core/cheez-definition"
import { circleDefinitions } from "./circle/circle.definition"
import { highlightDefinitions } from "./highlight/highlight.definition"
import { overwriteDefinitions } from "./overwrite/overwrite.definition"
import { underlineDefinitions } from "./underline/underline.definition"

export type CheezFamily =
  | "emphasis"
  | "encircle"
  | "cross-out"
  | "highlight"
  | "arrow"
  | "symbol"

type ProfileName =
  | "underline"
  | "encircle"
  | "overwrite"
  | "highlight"
  | "highlight-low"
  | "callout"
  | "vertical-callout"
  | "symbol"

type Blueprint = Omit<CheezDefinition, "name" | "layers"> & {
  layers: readonly CheezLayer[]
}

const PROFILES: Record<ProfileName, Omit<Blueprint, "layers">> = {
  underline: {
    viewBox: "0 0 100 20",
    placement: { top: "88%", left: "-3%", width: "106%", height: "0.55em" },
    layer: "front",
    preserveAspectRatio: "none",
  },
  encircle: {
    viewBox: "0 0 100 48",
    placement: { top: "-8%", left: "-8%", width: "116%", height: "122%" },
    layer: "front",
    preserveAspectRatio: "none",
  },
  overwrite: {
    viewBox: "0 0 100 30",
    placement: { top: "10%", left: "-3%", width: "106%", height: "82%" },
    layer: "front",
    preserveAspectRatio: "none",
  },
  highlight: {
    viewBox: "0 0 100 30",
    placement: { top: "3%", left: "-4%", width: "108%", height: "96%" },
    layer: "behind",
    preserveAspectRatio: "none",
  },
  "highlight-low": {
    viewBox: "0 0 100 18",
    placement: { top: "48%", left: "-4%", width: "108%", height: "54%" },
    layer: "behind",
    preserveAspectRatio: "none",
  },
  callout: {
    viewBox: "0 0 100 42",
    placement: { top: "78%", left: "-8%", width: "116%", height: "76%" },
    layer: "front",
    preserveAspectRatio: "none",
  },
  "vertical-callout": {
    viewBox: "0 0 30 60",
    placement: { top: "-28%", left: "96%", width: "28%", height: "156%" },
    layer: "front",
    preserveAspectRatio: "xMidYMid meet",
  },
  symbol: {
    viewBox: "0 0 100 100",
    placement: { top: "-10%", left: "-30%", width: "27%", height: "110%" },
    layer: "front",
    preserveAspectRatio: "xMidYMid meet",
  },
}

function strokeBlueprint(
  paths: readonly string[],
  profile: ProfileName = "underline",
  strokeWidth = 2.3,
  opacity = 1,
): Blueprint {
  return {
    ...PROFILES[profile],
    layers: paths.map((path, index) => ({
      type: "stroke",
      path,
      strokeWidth,
      opacity,
      timing: { duration: 360, delay: index * 105 },
    })),
  }
}

function fillBlueprint(
  path: string,
  revealPath: string,
  profile: ProfileName = "highlight",
  revealWidth = 27,
  opacity = 0.42,
): Blueprint {
  return {
    ...PROFILES[profile],
    layers: [
      {
        type: "fill",
        path,
        opacity,
        reveal: { path: revealPath, strokeWidth: revealWidth },
        timing: { duration: 420 },
      },
    ],
  }
}

function multiFillBlueprint(
  fills: readonly { path: string; reveal: string }[],
): Blueprint {
  return {
    ...PROFILES.highlight,
    layers: fills.map(({ path, reveal }, index) => ({
      type: "fill",
      path,
      opacity: 0.34,
      reveal: { path: reveal, strokeWidth: 15 },
      timing: { duration: 350, delay: index * 150 },
    })),
  }
}

function transformLayer(
  layer: CheezLayer,
  character: CheezCharacter,
  index: number,
): CheezLayer {
  if (character === "calm") return layer

  const rushed = character === "rushed"
  const durationFactor = rushed ? 0.76 : 0.64
  const rotation = rushed ? (index % 2 === 0 ? -0.8 : 0.7) : index % 2 === 0 ? -1.8 : 1.5
  const transform = `${layer.transform ?? ""} rotate(${rotation} 50 20)`.trim()
  const timing = {
    ...layer.timing,
    duration: Math.round(layer.timing.duration * durationFactor),
    delay: Math.round((layer.timing.delay ?? 0) * durationFactor),
  }

  if (layer.type === "stroke") {
    return {
      ...layer,
      transform,
      strokeWidth: layer.strokeWidth * (rushed ? 1.06 : 1.13),
      timing,
    }
  }

  return { ...layer, transform, timing }
}

function createEcho(layer: CheezLayer): CheezLayer {
  const timing = {
    ...layer.timing,
    duration: Math.round(layer.timing.duration * 0.72),
    delay: (layer.timing.delay ?? 0) + Math.round(layer.timing.duration * 0.48),
  }

  if (layer.type === "stroke") {
    return {
      ...layer,
      transform: `${layer.transform ?? ""} translate(0 2) rotate(1.2 50 20)`.trim(),
      strokeWidth: layer.strokeWidth * 0.58,
      opacity: Math.min(layer.opacity ?? 1, 0.5),
      timing,
    } satisfies CheezStrokeLayer
  }

  return {
    ...layer,
    transform: `${layer.transform ?? ""} translate(0 1)`.trim(),
    opacity: Math.min(layer.opacity ?? 1, 0.18),
    timing,
  } satisfies CheezFillLayer
}

function characterize(name: string, blueprint: Blueprint): CheezDefinitionSet {
  const makeDefinition = (character: CheezCharacter): CheezDefinition => {
    const layers = blueprint.layers.map((layer, index) =>
      transformLayer(layer, character, index),
    )

    if (character === "chaotic" && layers.length < 6 && layers[0]) {
      layers.push(createEcho(layers[0]))
    }

    return {
      ...blueprint,
      name: `${name}-${character}`,
      layers,
    }
  }

  return {
    calm: makeDefinition("calm"),
    rushed: makeDefinition("rushed"),
    chaotic: makeDefinition("chaotic"),
  }
}

export const MARK_CATALOG = {
  underline: underlineDefinitions,
  "double-underline": characterize(
    "double-underline",
    strokeBlueprint(["M1 7 C24 5 50 9 99 6", "M3 14 C30 11 68 16 97 12"]),
  ),
  "triple-underline": characterize(
    "triple-underline",
    strokeBlueprint(["M2 4 C30 2 67 6 98 3", "M1 10 C35 8 63 12 99 9", "M4 16 C27 13 73 18 96 14"], "underline", 1.8),
  ),
  "wavy-underline": characterize(
    "wavy-underline",
    strokeBlueprint(["M0 10 Q8 3 16 10 T32 10 T48 10 T64 10 T80 10 T96 10 T104 10"]),
  ),
  "zigzag-underline": characterize(
    "zigzag-underline",
    strokeBlueprint(["M0 13 L10 5 L20 13 L30 5 L40 13 L50 5 L60 13 L70 5 L80 13 L90 5 L100 13"]),
  ),
  "swoop-underline": characterize(
    "swoop-underline",
    strokeBlueprint(["M0 11 C20 18 58 1 100 8"]),
  ),
  "short-underline": characterize(
    "short-underline",
    strokeBlueprint(["M21 10 C39 7 60 12 80 8"]),
  ),
  "long-underline": characterize(
    "long-underline",
    strokeBlueprint(["M-9 10 C24 6 71 13 109 7"]),
  ),
  "underline-tail": characterize(
    "underline-tail",
    strokeBlueprint(["M0 8 C31 5 68 11 96 7 C105 6 108 14 99 18"]),
  ),
  "underline-arrow": characterize(
    "underline-arrow",
    strokeBlueprint(["M0 9 C30 6 69 11 96 8", "M88 3 L98 8 L89 15"], "underline", 2.1),
  ),

  circle: circleDefinitions,
  "double-circle": characterize(
    "double-circle",
    strokeBlueprint([
      "M51 3 C78 2 98 10 97 24 C96 40 72 46 45 44 C18 43 2 36 4 21 C6 7 28 4 51 3",
      "M56 6 C82 7 96 15 93 29 C89 43 62 45 37 41 C12 37 3 27 9 15 C16 4 35 4 56 6",
    ], "encircle", 1.8),
  ),
  "loose-circle": characterize(
    "loose-circle",
    strokeBlueprint(["M45 2 C78 -1 102 11 96 28 C91 45 63 48 34 42 C7 37 -3 23 8 12 C18 2 34 3 45 2 C70 0 90 4 101 14"], "encircle"),
  ),
  oval: characterize(
    "oval",
    strokeBlueprint(["M50 8 C82 8 98 14 98 24 C98 35 76 40 49 40 C22 40 2 34 2 24 C2 14 22 8 50 8 Z"], "encircle"),
  ),
  box: characterize(
    "box",
    strokeBlueprint(["M3 4 L97 3 L98 44 L2 45 Z"], "encircle"),
  ),
  "rounded-box": characterize(
    "rounded-box",
    strokeBlueprint(["M14 3 C6 3 3 9 3 16 L2 34 C2 42 10 45 18 45 L84 44 C94 44 98 39 98 31 L97 14 C97 6 90 3 81 3 Z"], "encircle"),
  ),
  "corner-box": characterize(
    "corner-box",
    strokeBlueprint(["M3 16 L3 4 L18 4", "M82 3 L97 3 L97 16", "M98 32 L98 44 L82 44", "M18 45 L3 45 L3 32"], "encircle"),
  ),
  parentheses: characterize(
    "parentheses",
    strokeBlueprint(["M10 2 C1 13 1 35 11 46", "M90 2 C99 14 99 35 89 46"], "encircle"),
  ),
  "square-brackets": characterize(
    "square-brackets",
    strokeBlueprint(["M15 3 L5 3 L5 45 L15 45", "M85 3 L95 3 L95 45 L85 45"], "encircle"),
  ),
  bubble: characterize(
    "bubble",
    strokeBlueprint(["M16 3 C7 3 3 9 3 18 L3 31 C3 41 12 45 22 45 L43 44 L36 51 L55 44 L82 44 C93 44 98 38 98 29 L97 16 C97 7 88 3 78 3 Z"], "encircle"),
  ),

  overwrite: overwriteDefinitions,
  "strike-through": characterize(
    "strike-through",
    strokeBlueprint(["M0 16 C23 12 61 19 100 14"], "overwrite", 2.7),
  ),
  "double-strike": characterize(
    "double-strike",
    strokeBlueprint(["M0 11 C30 8 68 14 100 10", "M1 20 C25 17 71 23 99 18"], "overwrite", 2.4),
  ),
  "diagonal-strike": characterize(
    "diagonal-strike",
    strokeBlueprint(["M-2 27 C32 20 66 10 102 3"], "overwrite", 2.8),
  ),
  "cross-out": characterize(
    "cross-out",
    strokeBlueprint(["M0 3 L100 27", "M0 28 L100 2"], "overwrite", 2.8),
  ),
  "scribble-out": characterize(
    "scribble-out",
    strokeBlueprint(["M-2 23 C12 2 25 29 39 6 C51 -3 61 30 74 7 C86 -4 92 21 102 5", "M0 8 C16 28 30 2 45 24 C61 36 75 3 101 22"], "overwrite", 2.7),
  ),
  "zigzag-out": characterize(
    "zigzag-out",
    strokeBlueprint(["M0 26 L14 4 L28 26 L42 4 L56 26 L70 4 L84 26 L100 4"], "overwrite", 2.8),
  ),
  "hatch-out": characterize(
    "hatch-out",
    strokeBlueprint(["M5 28 L20 2", "M21 29 L36 1", "M38 29 L53 1", "M55 29 L70 1", "M72 29 L87 1", "M88 28 L99 8"], "overwrite", 2),
  ),
  blackout: characterize(
    "blackout",
    strokeBlueprint(["M0 6 C28 3 68 9 100 5", "M0 11 C29 8 70 14 100 10", "M0 16 C31 13 68 20 100 15", "M0 21 C24 18 73 25 100 20", "M0 26 C31 23 69 29 100 24"], "overwrite", 3.8),
  ),
  "erase-swipe": characterize(
    "erase-swipe",
    strokeBlueprint(["M-2 17 C24 9 69 23 102 12"], "overwrite", 9, 0.84),
  ),

  highlight: highlightDefinitions,
  "marker-swipe": characterize(
    "marker-swipe",
    fillBlueprint("M0 7 C20 3 39 7 59 4 C74 2 91 6 101 8 L98 25 C76 28 55 24 34 27 C19 28 7 25 1 23 Z", "M-2 16 C22 12 48 18 72 14 C84 12 94 15 102 16"),
  ),
  "double-highlight": characterize(
    "double-highlight",
    multiFillBlueprint([
      { path: "M0 3 C25 1 71 4 100 2 L99 14 C66 16 35 12 1 15 Z", reveal: "M0 8 C31 5 65 10 101 7" },
      { path: "M1 16 C28 13 68 18 100 15 L98 28 C65 30 34 25 0 29 Z", reveal: "M0 22 C28 19 72 24 101 21" },
    ]),
  ),
  "half-highlight": characterize(
    "half-highlight",
    fillBlueprint("M0 3 C25 1 72 5 100 2 L98 17 C70 19 31 14 1 18 Z", "M0 10 C34 7 66 12 101 9", "highlight-low", 18),
  ),
  "bottom-highlight": characterize(
    "bottom-highlight",
    fillBlueprint("M0 7 C28 4 68 10 100 5 L99 18 C66 20 31 15 0 19 Z", "M0 12 C34 8 65 15 101 10", "highlight-low", 15, 0.5),
  ),
  "brush-highlight": characterize(
    "brush-highlight",
    fillBlueprint("M-2 10 C12 0 22 10 35 5 C50 -1 62 11 76 5 C86 1 94 8 103 4 L95 25 C82 20 68 30 53 24 C38 18 25 30 10 24 L0 28 Z", "M-3 17 C14 7 25 21 41 12 C57 4 70 22 85 13 C93 9 99 12 104 15", "highlight", 30, 0.4),
  ),
  "highlight-band": characterize(
    "highlight-band",
    fillBlueprint("M-2 9 L102 5 L101 23 L-1 27 Z", "M-3 17 L103 14", "highlight", 22, 0.38),
  ),
  spotlight: characterize(
    "spotlight",
    fillBlueprint("M50 2 C82 1 100 9 99 16 C98 25 75 29 48 29 C21 29 0 24 1 15 C2 7 24 3 50 2 Z", "M2 16 C29 7 72 25 99 14", "highlight", 29, 0.32),
  ),
  "highlight-slash": characterize(
    "highlight-slash",
    fillBlueprint("M-5 27 L8 1 L105 5 L93 30 Z", "M0 16 L101 15", "highlight", 27, 0.36),
  ),
  "highlight-blob": characterize(
    "highlight-blob",
    fillBlueprint("M2 8 C12 -1 26 5 37 3 C50 0 59 8 71 4 C85 0 96 6 99 13 C103 22 87 28 72 25 C57 22 48 30 34 26 C22 23 8 30 2 22 C-2 17 -1 12 2 8 Z", "M0 16 C20 7 36 22 52 13 C69 4 83 22 101 13", "highlight", 30, 0.38),
  ),
  "arrow-right": characterize(
    "arrow-right",
    strokeBlueprint(["M0 12 C25 17 58 8 96 13", "M84 4 L98 13 L84 22"], "callout", 2.2),
  ),
  "arrow-left": characterize(
    "arrow-left",
    strokeBlueprint(["M100 13 C73 7 39 18 4 12", "M16 3 L2 12 L16 22"], "callout", 2.2),
  ),
  "arrow-up": characterize(
    "arrow-up",
    strokeBlueprint(["M15 57 C10 42 17 24 15 5", "M7 16 L15 3 L24 16"], "vertical-callout", 2.2),
  ),
  "arrow-down": characterize(
    "arrow-down",
    strokeBlueprint(["M15 2 C20 20 11 38 16 56", "M7 45 L16 58 L24 45"], "vertical-callout", 2.2),
  ),
  "curved-arrow-right": characterize(
    "curved-arrow-right",
    strokeBlueprint(["M2 25 C25 3 66 4 96 20", "M82 10 L98 20 L83 29"], "callout", 2.2),
  ),
  "curved-arrow-left": characterize(
    "curved-arrow-left",
    strokeBlueprint(["M98 25 C75 3 34 4 4 20", "M18 10 L2 20 L17 29"], "callout", 2.2),
  ),
  "loop-arrow": characterize(
    "loop-arrow",
    strokeBlueprint(["M5 22 C12 2 47 2 49 18 C51 34 20 36 17 20 C14 5 57 3 95 17", "M82 8 L98 17 L83 26"], "callout", 2),
  ),
  "double-arrow": characterize(
    "double-arrow",
    strokeBlueprint(["M4 13 C30 8 69 17 96 12", "M15 3 L2 13 L16 22", "M84 3 L98 12 L84 22"], "callout", 2.1),
  ),
  pointer: characterize(
    "pointer",
    strokeBlueprint(["M1 27 C25 27 45 17 63 9 C76 3 88 6 98 11", "M86 2 L99 11 L86 20"], "callout", 2.3),
  ),
  "callout-tail": characterize(
    "callout-tail",
    strokeBlueprint(["M50 0 C52 17 37 20 26 29 C17 33 10 36 3 41", "M6 30 L2 42 L15 39"], "callout", 2.2),
  ),

  check: characterize(
    "check",
    strokeBlueprint(["M12 52 L38 78 L88 20"], "symbol", 6),
  ),
  cross: characterize(
    "cross",
    strokeBlueprint(["M18 18 L82 82", "M82 18 L18 82"], "symbol", 5),
  ),
  star: characterize(
    "star",
    strokeBlueprint(["M50 5 L61 37 L95 38 L68 58 L78 92 L50 72 L21 92 L32 58 L5 38 L39 37 Z"], "symbol", 4),
  ),
  heart: characterize(
    "heart",
    strokeBlueprint(["M50 88 C37 76 9 56 12 31 C15 10 40 11 50 29 C61 10 86 11 89 31 C92 54 66 76 50 88 Z"], "symbol", 4.5),
  ),
  sparkle: characterize(
    "sparkle",
    strokeBlueprint(["M50 5 C51 35 64 48 94 50 C64 52 52 65 50 95 C48 65 35 52 5 50 C35 48 48 35 50 5 Z"], "symbol", 4),
  ),
  asterisk: characterize(
    "asterisk",
    strokeBlueprint(["M50 8 L50 92", "M14 29 L86 71", "M86 29 L14 71"], "symbol", 4.5),
  ),
  exclamation: characterize(
    "exclamation",
    strokeBlueprint(["M52 10 C48 29 51 48 48 67", "M48 88 L49 87"], "symbol", 7),
  ),
  question: characterize(
    "question",
    strokeBlueprint(["M22 30 C24 7 78 4 80 31 C82 51 55 49 49 67", "M48 89 L49 88"], "symbol", 6),
  ),
  quote: characterize(
    "quote",
    strokeBlueprint(["M18 20 C10 35 12 56 30 62 C31 76 24 84 15 90", "M57 20 C49 35 51 56 69 62 C70 76 63 84 54 90"], "symbol", 5),
  ),
  spiral: characterize(
    "spiral",
    strokeBlueprint(["M52 50 C52 39 67 38 70 49 C74 64 54 75 37 67 C14 56 23 24 51 18 C80 12 99 38 90 67"], "symbol", 4),
  ),
} as const satisfies Record<string, CheezDefinitionSet>

export type CheezType = keyof typeof MARK_CATALOG

export const MARK_FAMILIES = {
  emphasis: ["underline", "double-underline", "triple-underline", "wavy-underline", "zigzag-underline", "swoop-underline", "short-underline", "long-underline", "underline-tail", "underline-arrow"],
  encircle: ["circle", "double-circle", "loose-circle", "oval", "box", "rounded-box", "corner-box", "parentheses", "square-brackets", "bubble"],
  "cross-out": ["overwrite", "strike-through", "double-strike", "diagonal-strike", "cross-out", "scribble-out", "zigzag-out", "hatch-out", "blackout", "erase-swipe"],
  highlight: ["highlight", "marker-swipe", "double-highlight", "half-highlight", "bottom-highlight", "brush-highlight", "highlight-band", "spotlight", "highlight-slash", "highlight-blob"],
  arrow: ["arrow-right", "arrow-left", "arrow-up", "arrow-down", "curved-arrow-right", "curved-arrow-left", "loop-arrow", "double-arrow", "pointer", "callout-tail"],
  symbol: ["check", "cross", "star", "heart", "sparkle", "asterisk", "exclamation", "question", "quote", "spiral"],
} as const satisfies Record<CheezFamily, readonly CheezType[]>

export const MARK_TYPES = Object.keys(MARK_CATALOG) as CheezType[]

export function getMarkFamily(type: CheezType): CheezFamily {
  const entry = Object.entries(MARK_FAMILIES).find(([, types]) =>
    (types as readonly CheezType[]).includes(type),
  )

  if (!entry) throw new Error(`Missing family for Cheez mark: ${type}`)
  return entry[0] as CheezFamily
}
