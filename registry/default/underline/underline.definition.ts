import type { CheezDefinitionSet } from "../cheez-core/cheez-definition"

const placement = {
  top: "88%",
  left: "-3%",
  width: "106%",
  height: "0.5em",
}

export const underlineDefinitions = {
  calm: {
    name: "underline-calm",
    viewBox: "0 0 100 18",
    placement,
    layer: "front",
    layers: [
      {
        type: "stroke",
        path: "M2 9 C18 7 31 10 47 8 C63 6 80 10 98 7",
        strokeWidth: 2.2,
        timing: { duration: 460 },
      },
    ],
  },
  rushed: {
    name: "underline-rushed",
    viewBox: "0 0 100 18",
    placement,
    layer: "front",
    layers: [
      {
        type: "stroke",
        path: "M1 11 C13 4 24 13 38 8 S63 12 76 7 S91 9 100 4",
        strokeWidth: 2.4,
        timing: {
          duration: 330,
          easing: "cubic-bezier(.15,.8,.25,1)",
        },
      },
    ],
  },
  chaotic: {
    name: "underline-chaotic",
    viewBox: "0 0 100 18",
    placement,
    layer: "front",
    layers: [
      {
        type: "stroke",
        path: "M0 8 C11 13 21 3 35 9 S59 4 72 10 S89 5 101 7",
        strokeWidth: 2.3,
        timing: { duration: 280 },
      },
      {
        type: "stroke",
        path: "M4 13 C22 8 38 15 57 10 S82 14 97 9",
        strokeWidth: 1.5,
        opacity: 0.76,
        timing: { duration: 260, delay: 170 },
      },
    ],
  },
} satisfies CheezDefinitionSet
