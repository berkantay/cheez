import { AbsoluteFill, Easing, Interactive, interpolate, useCurrentFrame } from "remotion"

import type { ComponentVideoDefinition } from "../types"
import { CREAM, progress } from "../video-kit"

export function IntroScene({ component }: { component: ComponentVideoDefinition }) {
  const frame = useCurrentFrame()

  return (
    <AbsoluteFill style={{ justifyContent: "center", padding: 80, color: CREAM }}>
      <Interactive.Div name="Component number" style={{ color: component.accent, fontFamily: "monospace", fontSize: 17, letterSpacing: ".14em" }}>
        COMPONENT / {String(component.number).padStart(2, "0")}
      </Interactive.Div>
      <Interactive.Div
        name="Component title"
        style={{
          width: 820,
          marginTop: 24,
          fontSize: 112,
          fontWeight: 520,
          letterSpacing: "-0.075em",
          lineHeight: 0.88,
          opacity: interpolate(frame, [0, 28], [0, 1], {
            easing: Easing.spring({ damping: 200 }),
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          translate: interpolate(frame, [0, 28], ["0px 28px", "0px 0px"], {
            easing: Easing.spring({ damping: 200 }),
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        {component.title}
      </Interactive.Div>
      <svg width="820" height="44" viewBox="0 0 820 44" style={{ marginTop: 26, overflow: "visible" }}>
        <path d="M4 22 C180 8 390 30 816 16" fill="none" stroke={component.accent} strokeWidth="7" strokeLinecap="round" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - progress(frame, [18, 48], [0, 1])} />
      </svg>
    </AbsoluteFill>
  )
}
