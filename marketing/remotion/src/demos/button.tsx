import { Easing, interpolate, useCurrentFrame } from "remotion"

import { CREAM, progress } from "../video-kit"

const OUTLINE_PATH = "M14 3 C6 3 3 9 3 16 L2 34 C2 42 10 45 18 45 L84 44 C94 44 98 39 98 31 L97 14 C97 6 90 3 81 3 Z"

type ButtonVariantProps = {
  accent: string
  draw: number
  enter: number
  fill?: boolean
  label: string
  press: number
  quiet?: boolean
  text: string
}

function pressScale(frame: number, at: number) {
  return interpolate(frame, [at - 4, at, at + 5], [1, 0.94, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })
}

function ButtonVariant({ accent, draw, enter, fill = false, label, press, quiet = false, text }: ButtonVariantProps) {
  const frame = useCurrentFrame()
  const scale = pressScale(frame, press)

  return (
    <div
      style={{
        width: 220,
        opacity: enter,
        transform: `translateY(${(1 - enter) * 24}px)`,
      }}
    >
      <div style={{ color: "rgba(244,240,230,.36)", fontFamily: "monospace", fontSize: 13, letterSpacing: ".12em" }}>
        {label.toUpperCase()}
      </div>
      <div style={{ height: 190, display: "grid", placeItems: "center" }}>
        <div
          style={{
            position: "relative",
            display: "grid",
            width: 196,
            height: 72,
            placeItems: "center",
            color: fill ? "#000" : CREAM,
            fontSize: 24,
            fontWeight: 650,
            letterSpacing: "-.025em",
            transform: `scale(${scale})`,
          }}
        >
          {fill ? (
            <svg viewBox="0 0 100 48" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible" }}>
              <path
                d="M6 5 C28 1 70 5 94 3 C98 14 96 35 92 43 C66 47 30 43 5 46 C2 34 3 16 6 5 Z"
                fill={accent}
                style={{ clipPath: `inset(0 ${(1 - draw) * 100}% 0 0)` }}
              />
              <path d={OUTLINE_PATH} fill="none" stroke="#000" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - draw} />
            </svg>
          ) : quiet ? (
            <svg viewBox="0 0 100 48" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible" }}>
              <path d="M12 38 C34 34 69 43 89 36" fill="none" stroke={accent} strokeWidth="3.2" strokeLinecap="round" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - draw} />
            </svg>
          ) : (
            <svg viewBox="0 0 100 48" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible" }}>
              <path d={OUTLINE_PATH} fill="none" stroke={accent} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - draw} />
            </svg>
          )}
          <span style={{ position: "relative" }}>{text}</span>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, color: CREAM, fontSize: 18 }}>
        <span style={{ width: 8, height: 8, borderRadius: 99, backgroundColor: accent }} />
        {label}
      </div>
    </div>
  )
}

export function ButtonVariantsDemo() {
  const frame = useCurrentFrame()

  return (
    <div style={{ width: 720, height: 390, paddingTop: 26 }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
        <div style={{ color: CREAM, fontSize: 34, fontWeight: 650, letterSpacing: "-.04em" }}>one button, three voices.</div>
        <div style={{ color: "rgba(244,240,230,.36)", fontFamily: "monospace", fontSize: 13, letterSpacing: ".1em" }}>SAME API</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 28, marginTop: 34 }}>
        <ButtonVariant
          accent="#ff4f2e"
          draw={progress(frame, [10, 34], [0, 1])}
          enter={progress(frame, [2, 15], [0, 1])}
          label="outline"
          press={36}
          text="save changes"
        />
        <ButtonVariant
          accent="#8f74ff"
          draw={progress(frame, [42, 68], [0, 1])}
          enter={progress(frame, [34, 47], [0, 1])}
          fill
          label="solid"
          press={70}
          text="publish"
        />
        <ButtonVariant
          accent="#b7ff3c"
          draw={progress(frame, [76, 101], [0, 1])}
          enter={progress(frame, [68, 81], [0, 1])}
          label="quiet"
          press={103}
          quiet
          text="learn more"
        />
      </div>
      <div style={{ marginTop: 24, height: 1, backgroundColor: "rgba(244,240,230,.1)" }} />
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 18, color: "rgba(244,240,230,.36)", fontFamily: "monospace", fontSize: 13 }}>
        <span>variant=&quot;outline | solid | quiet&quot;</span>
        <span>native button props</span>
      </div>
    </div>
  )
}
