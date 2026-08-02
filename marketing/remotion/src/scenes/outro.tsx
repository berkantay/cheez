import { AbsoluteFill, Easing, Interactive, interpolate, useCurrentFrame } from "remotion"

import type { ComponentVideoDefinition } from "../types"
import { CREAM, Mark, progress } from "../video-kit"

export function OutroScene({ component }: { component: ComponentVideoDefinition }) {
  const frame = useCurrentFrame()

  return (
    <AbsoluteFill style={{ justifyContent: "center", padding: 80, color: CREAM }}>
      <Interactive.Div name="Install label" style={{ color: component.accent, fontFamily: "monospace", fontSize: 16, letterSpacing: ".12em" }}>
        INSTALL TODAY&apos;S COMPONENT
      </Interactive.Div>
      <Interactive.Div
        name="Install command"
        style={{
          marginTop: 28,
          padding: "26px 30px",
          width: "fit-content",
          maxWidth: 920,
          color: CREAM,
          backgroundColor: "#090909",
          fontFamily: "monospace",
          fontSize: 22,
          opacity: interpolate(frame, [6, 28], [0, 1], {
            easing: Easing.bezier(0.16, 1, 0.3, 1),
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        npx shadcn@latest add berkantay/cheez/marked-{component.id}
      </Interactive.Div>
      <Interactive.Div name="Closing line" style={{ position: "relative", width: "fit-content", marginTop: 56, fontSize: 55, letterSpacing: "-.055em" }}>
        make words feel human.
        <Mark accent={component.accent} draw={progress(frame, [25, 55], [0, 1])} />
      </Interactive.Div>
    </AbsoluteFill>
  )
}
