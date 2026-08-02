import type {
  CheezCharacter,
  CheezDefinition,
  CheezFillLayer,
} from "../cheez-core/cheez-definition"
import { MARK_CATALOG, type CheezType } from "../mark-catalog"

const DEFAULT_FRAME_PATH =
  "M14 3 C6 3 3 9 3 16 L2 34 C2 42 10 45 18 45 L84 44 C94 44 98 39 98 31 L97 14 C97 6 90 3 81 3 Z"

const FRAME_PATHS: Partial<Record<CheezType, string>> = {
  box: "M3 4 L97 3 L98 44 L2 45 Z",
  "corner-box": "M3 4 L97 3 L98 44 L2 45 Z",
  "loose-circle": "M45 2 C78 -1 102 11 96 28 C91 45 63 48 34 42 C7 37 -3 23 8 12 C18 2 34 3 45 2 Z",
  "rounded-box": DEFAULT_FRAME_PATH,
}

const REVEAL_PATH =
  "M5 8 C30 5 68 10 95 7 M4 19 C28 16 70 21 96 17 M4 30 C30 27 68 33 96 28 M5 40 C33 37 70 43 95 39"

function getFillLayer(character: CheezCharacter, path: string): CheezFillLayer {
  const duration = character === "calm" ? 520 : character === "rushed" ? 390 : 320
  const transform =
    character === "calm"
      ? undefined
      : character === "rushed"
        ? "rotate(-0.7 50 24)"
        : "rotate(-1.4 50 24)"

  return {
    type: "fill",
    path,
    transform,
    reveal: {
      path: REVEAL_PATH,
      strokeWidth: character === "chaotic" ? 16 : 15,
    },
    timing: { duration },
  }
}

export function getButtonFrameDefinition(
  mark: CheezType,
  character: CheezCharacter,
): CheezDefinition {
  const outline = MARK_CATALOG[mark][character]
  const fillPath = FRAME_PATHS[mark] ?? DEFAULT_FRAME_PATH

  return {
    ...outline,
    name: `button-frame-${mark}-${character}`,
    layer: "behind",
    layers: [getFillLayer(character, fillPath), ...outline.layers],
  }
}
