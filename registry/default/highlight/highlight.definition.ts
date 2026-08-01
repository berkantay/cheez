import type { CheezDefinitionSet } from "../cheez-core/cheez-definition"

const placement = {
  top: "3%",
  left: "-4%",
  width: "108%",
  height: "96%",
}

export const highlightDefinitions = {
  calm: {
    name: "highlight-calm",
    viewBox: "0 0 100 30",
    placement,
    layer: "behind",
    layers: [
      {
        type: "fill",
        path:
          "M1 6 C18 3 38 5 55 4 C72 3 89 5 99 7 L97 25 C78 27 61 25 43 27 C26 28 11 26 2 24 Z",
        opacity: 0.46,
        reveal: {
          path: "M1 16 C24 13 48 16 72 14 C84 13 93 15 100 16",
          strokeWidth: 27,
        },
        timing: { duration: 480 },
      },
    ],
  },
  rushed: {
    name: "highlight-rushed",
    viewBox: "0 0 100 30",
    placement,
    layer: "behind",
    layers: [
      {
        type: "fill",
        path:
          "M0 8 C16 5 31 7 47 4 C63 2 84 7 100 5 L96 23 C78 27 61 22 43 26 C25 29 10 23 1 25 Z",
        opacity: 0.43,
        reveal: {
          path: "M0 17 C19 12 37 18 57 13 C75 9 88 16 101 14",
          strokeWidth: 29,
        },
        timing: {
          duration: 350,
          easing: "cubic-bezier(.12,.75,.22,1)",
        },
      },
    ],
  },
  chaotic: {
    name: "highlight-chaotic",
    viewBox: "0 0 100 30",
    placement,
    layer: "behind",
    layers: [
      {
        type: "fill",
        path:
          "M-1 9 C13 1 25 9 41 4 C56 -1 70 10 86 4 L101 8 L96 24 C80 29 69 20 52 27 C36 33 19 21 1 27 Z",
        opacity: 0.4,
        reveal: {
          path: "M-2 17 C13 7 26 20 43 11 C60 4 70 20 86 12 C92 9 97 12 102 14",
          strokeWidth: 30,
        },
        timing: { duration: 310 },
      },
      {
        type: "stroke",
        path: "M3 25 C24 20 43 28 61 22 S84 25 97 20",
        strokeWidth: 1.2,
        opacity: 0.4,
        timing: { duration: 230, delay: 190 },
      },
    ],
  },
} satisfies CheezDefinitionSet
