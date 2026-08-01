import type { CheezDefinitionSet } from "../cheez-core/cheez-definition"

const placement = {
  top: "10%",
  left: "-3%",
  width: "106%",
  height: "82%",
}

export const overwriteDefinitions = {
  calm: {
    name: "overwrite-calm",
    viewBox: "0 0 100 30",
    placement,
    layer: "front",
    layers: [
      {
        type: "stroke",
        path: "M1 8 C25 10 48 7 99 10",
        strokeWidth: 2.5,
        timing: { duration: 360 },
      },
      {
        type: "stroke",
        path: "M2 16 C26 13 58 19 98 15",
        strokeWidth: 2.6,
        timing: { duration: 350, delay: 150 },
      },
      {
        type: "stroke",
        path: "M3 23 C34 25 63 20 97 22",
        strokeWidth: 2.4,
        timing: { duration: 340, delay: 290 },
      },
    ],
  },
  rushed: {
    name: "overwrite-rushed",
    viewBox: "0 0 100 30",
    placement,
    layer: "front",
    layers: [
      {
        type: "stroke",
        path: "M0 24 L98 5",
        strokeWidth: 2.8,
        timing: { duration: 260 },
      },
      {
        type: "stroke",
        path: "M2 6 C30 10 66 18 100 24",
        strokeWidth: 2.7,
        timing: { duration: 270, delay: 110 },
      },
      {
        type: "stroke",
        path: "M1 18 C26 13 63 13 99 11",
        strokeWidth: 2.3,
        timing: { duration: 250, delay: 220 },
      },
    ],
  },
  chaotic: {
    name: "overwrite-chaotic",
    viewBox: "0 0 100 30",
    placement,
    layer: "front",
    layers: [
      {
        type: "stroke",
        path: "M-2 24 C20 2 42 28 62 6 C75 -3 88 19 102 4",
        strokeWidth: 3,
        timing: { duration: 300 },
      },
      {
        type: "stroke",
        path: "M0 4 C19 28 39 1 57 25 C72 38 88 9 101 24",
        strokeWidth: 2.7,
        timing: { duration: 300, delay: 105 },
      },
      {
        type: "stroke",
        path: "M-1 14 C28 8 51 21 101 13",
        strokeWidth: 2.9,
        timing: { duration: 270, delay: 220 },
      },
      {
        type: "stroke",
        path: "M6 28 L94 1",
        strokeWidth: 1.8,
        opacity: 0.76,
        timing: { duration: 230, delay: 340 },
      },
    ],
  },
} satisfies CheezDefinitionSet
