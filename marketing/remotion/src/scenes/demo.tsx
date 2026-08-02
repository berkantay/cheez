import { AbsoluteFill, Easing, Interactive, interpolate, useCurrentFrame } from "remotion"
import type { ReactNode } from "react"

import type { ComponentVideoDefinition, DemoKind } from "../types"
import { CREAM, InkFrame, MacWindow, Mark, progress } from "../video-kit"
import { ButtonVariantsDemo } from "../demos/button"

function SelectionDemo({ accent }: { accent: string }) {
  const frame = useCurrentFrame()
  const active = Math.min(2, Math.floor(frame / 38))

  return (
    <div style={{ display: "flex", gap: 56, fontSize: 38, color: "rgba(244,240,230,.46)" }}>
      {["calm", "rushed", "chaotic"].map((label, index) => (
        <div key={label} style={{ position: "relative", color: active === index ? CREAM : undefined }}>
          {label}{active === index ? <Mark accent={accent} draw={progress(frame % 38, [8, 28], [0, 1])} /> : null}
        </div>
      ))}
    </div>
  )
}

function FieldDemo({ accent }: { accent: string }) {
  const frame = useCurrentFrame()
  const copy = "words should feel human"
  const visible = copy.slice(0, Math.floor(progress(frame, [8, 85], [0, copy.length])))

  return (
    <div style={{ width: 620 }}>
      <div style={{ marginBottom: 14, color: "rgba(244,240,230,.42)", fontFamily: "monospace", fontSize: 16, letterSpacing: ".08em" }}>YOUR NOTE</div>
      <div style={{ position: "relative", minHeight: 82, padding: "20px 22px", color: CREAM, fontSize: 44 }}>
        {visible}<span style={{ color: accent, opacity: frame % 18 < 10 ? 1 : 0 }}>|</span>
        <Mark accent={accent} draw={progress(frame, [0, 22], [0, 1])} />
      </div>
    </div>
  )
}

function OverlayDemo({ accent }: { accent: string }) {
  const frame = useCurrentFrame()

  return (
    <div style={{ display: "grid", justifyItems: "center", gap: 28 }}>
      <div style={{ position: "relative", color: CREAM, fontSize: 38 }}>
        open details <Mark accent={accent} draw={progress(frame, [16, 42], [0, 1])} />
      </div>
      <Interactive.Div
        name="Popup"
        style={{
          width: 500,
          padding: 30,
          opacity: interpolate(frame, [16, 42], [0, 1], {
            easing: Easing.spring({ damping: 200 }),
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          translate: interpolate(frame, [16, 42], ["0px -18px", "0px 0px"], {
            easing: Easing.spring({ damping: 200 }),
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          backgroundColor: "#080808",
          color: CREAM,
        }}
      >
        <div style={{ color: accent, fontFamily: "monospace", fontSize: 14, letterSpacing: ".1em" }}>MARKED SURFACE</div>
        <div style={{ marginTop: 18, fontSize: 38, lineHeight: 1.1 }}>context, without losing place.</div>
      </Interactive.Div>
    </div>
  )
}

function FeedbackDemo({ accent }: { accent: string }) {
  const frame = useCurrentFrame()
  const value = Math.round(progress(frame, [8, 100], [8, 100]))

  return (
    <div style={{ width: 650 }}>
      <div style={{ display: "flex", justifyContent: "space-between", color: CREAM, fontSize: 38 }}>
        <span>drawing the interface</span>
        <span style={{ color: accent, fontFamily: "monospace" }}>{value}%</span>
      </div>
      <svg viewBox="0 0 650 26" style={{ width: "100%", height: 26, marginTop: 34, overflow: "visible" }}>
        <path d="M4 14 C180 4 420 23 646 10" fill="none" stroke="rgba(244,240,230,.15)" strokeWidth="7" strokeLinecap="round" />
        <path d="M4 14 C180 4 420 23 646 10" fill="none" stroke={accent} strokeWidth="7" strokeLinecap="round" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - value / 100} />
      </svg>
    </div>
  )
}

function RouteDemo({ accent }: { accent: string }) {
  const frame = useCurrentFrame()
  const items = ["cheez", "components", "today"]

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 24, color: CREAM, fontSize: 38 }}>
      {items.map((item, index) => (
        <div key={item} style={{ display: "flex", alignItems: "center", gap: 24, opacity: progress(frame, [index * 18, index * 18 + 20], [0, 1]) }}>
          {index ? <span style={{ color: accent, fontSize: 48 }}>›</span> : null}
          <span style={{ position: "relative" }}>{item}{index === items.length - 1 ? <Mark accent={accent} draw={progress(frame, [58, 92], [0, 1])} /> : null}</span>
        </div>
      ))}
    </div>
  )
}

function LayoutDemo({ accent, title }: { accent: string; title: string }) {
  const frame = useCurrentFrame()

  return (
    <div style={{ display: "grid", width: 650, gridTemplateColumns: "1fr 1.3fr", gap: 34 }}>
      <div style={{ height: 250, backgroundColor: accent, clipPath: `inset(${(1 - progress(frame, [12, 62], [0, 1])) * 100}% 0 0)` }} />
      <div style={{ paddingTop: 12, color: CREAM }}>
        <div style={{ color: accent, fontFamily: "monospace", fontSize: 14, letterSpacing: ".1em" }}>COMPOSITION</div>
        <div style={{ marginTop: 20, fontSize: 44, letterSpacing: "-.04em", lineHeight: 1.05 }}>{title}</div>
        <div style={{ marginTop: 20, color: "rgba(244,240,230,.42)", fontSize: 28, lineHeight: 1.35 }}>native structure.<br />human boundary.</div>
      </div>
    </div>
  )
}

function Artwork({ component }: { component: ComponentVideoDefinition }) {
  if (component.id === "button") {
    return <ButtonVariantsDemo />
  }

  const demos: Record<DemoKind, ReactNode> = {
    action: <SelectionDemo accent={component.accent} />,
    feedback: <FeedbackDemo accent={component.accent} />,
    field: <FieldDemo accent={component.accent} />,
    identity: <SelectionDemo accent={component.accent} />,
    layout: <LayoutDemo accent={component.accent} title={component.title} />,
    loading: <FeedbackDemo accent={component.accent} />,
    overlay: <OverlayDemo accent={component.accent} />,
    route: <RouteDemo accent={component.accent} />,
    selection: <SelectionDemo accent={component.accent} />,
  }

  return <InkFrame accent={component.accent}>{demos[component.kind]}</InkFrame>
}

export function DemoScene({ component }: { component: ComponentVideoDefinition }) {
  const frame = useCurrentFrame()
  const rotateX = interpolate(frame, [0, 34, 106, 139], [14, 4, -2, -8], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })
  const rotateY = interpolate(frame, [0, 34, 106, 139], [-18, -5, 3, 12], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })
  const scale = interpolate(frame, [0, 34, 106, 139], [0.72, 0.9, 0.98, 0.86], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    output: "perceptual-scale",
  })
  const y = interpolate(frame, [0, 34, 106, 139], [74, 4, -10, 34], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", color: CREAM }}>
      <Interactive.Div
        name="macOS window"
        style={{
          transform: `perspective(1600px) translateY(${y}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`,
          transformOrigin: "50% 68%",
          transformStyle: "preserve-3d",
        }}
      >
        <MacWindow component={component}>
          <Artwork component={component} />
        </MacWindow>
      </Interactive.Div>
      <Interactive.Div
        name="Component tagline"
        style={{
          position: "absolute",
          zIndex: 2,
          right: 96,
          bottom: 118,
          maxWidth: 700,
          color: "rgba(244,240,230,.64)",
          fontSize: 44,
          letterSpacing: "-.035em",
          opacity: interpolate(frame, [42, 72], [0, 1], {
            easing: Easing.bezier(0.16, 1, 0.3, 1),
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          textAlign: "right",
          translate: interpolate(frame, [42, 72], ["0px 18px", "0px 0px"], {
            easing: Easing.bezier(0.16, 1, 0.3, 1),
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        {component.tagline}
      </Interactive.Div>
    </AbsoluteFill>
  )
}
