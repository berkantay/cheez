import type { CheezDefinitionSet } from "../cheez-core/cheez-definition"

const placement = {
  top: "-8%",
  left: "-8%",
  width: "116%",
  height: "122%",
}

export const circleDefinitions = {
  calm: {
    name: "circle-calm",
    viewBox: "0 0 100 48",
    placement,
    layer: "front",
    layers: [
      {
        type: "stroke",
        path:
          "M53 3 C77 2 96 10 97 23 C99 38 75 45 49 45 C23 46 3 38 3 25 C2 11 26 4 53 3",
        strokeWidth: 2.1,
        timing: { duration: 620 },
      },
    ],
  },
  rushed: {
    name: "circle-rushed",
    viewBox: "0 0 100 48",
    placement,
    layer: "front",
    layers: [
      {
        type: "stroke",
        path:
          "M45 4 C72 0 97 8 98 21 C100 34 80 43 52 45 C24 47 3 39 2 25 C1 12 20 6 45 4 C68 2 90 5 99 15",
        strokeWidth: 2.3,
        timing: {
          duration: 430,
          easing: "cubic-bezier(.12,.76,.2,1)",
        },
      },
    ],
  },
  chaotic: {
    name: "circle-chaotic",
    viewBox: "0 0 100 48",
    placement,
    layer: "front",
    layers: [
      {
        type: "stroke",
        path:
          "M52 2 C80 1 99 11 96 26 C94 42 70 47 43 44 C16 42 0 34 4 20 C8 6 29 3 52 2",
        strokeWidth: 2.4,
        timing: { duration: 390 },
      },
      {
        type: "stroke",
        path:
          "M58 5 C83 5 101 16 95 30 C89 43 63 46 35 42 C10 39 -1 27 7 15 C16 3 36 3 58 5",
        strokeWidth: 1.4,
        opacity: 0.68,
        timing: { duration: 360, delay: 220 },
      },
    ],
  },
} satisfies CheezDefinitionSet
