import { noise } from "@remotion/effects/noise"
import { AbsoluteFill, Solid, interpolate, useCurrentFrame } from "remotion"
import type { ReactNode } from "react"

import { components } from "./manifest"
import type { ComponentVideoDefinition } from "./types"

export const DAILY_FPS = 30
export const DAILY_SIZE = 1080
export const DAILY_DURATION = 250
export const CREAM = "#f4f0e6"

export function progress(frame: number, input: [number, number], output: [number, number]) {
  return interpolate(frame, input, output, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })
}

function Grid() {
  return (
    <AbsoluteFill style={{ opacity: 0.38 }}>
      <svg width="100%" height="100%" viewBox={`0 0 ${DAILY_SIZE} ${DAILY_SIZE}`}>
        <defs>
          <pattern id="cheez-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M40 0H0V40" fill="none" stroke="rgba(244,240,230,.08)" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#cheez-grid)" />
      </svg>
    </AbsoluteFill>
  )
}

export function Background({ seed }: { seed: number }) {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <Solid
        width={DAILY_SIZE}
        height={DAILY_SIZE}
        color="#030303"
        effects={[noise({ amount: 0.035, premultiply: true, seed })]}
      />
      <Grid />
    </AbsoluteFill>
  )
}

function Wordmark() {
  return (
    <svg viewBox="0 0 108 34" width="108" height="34" aria-label="Cheez">
      <path
        d="M20 11.5C17.5 8.5 10 8.8 7.5 14.5C5 20.2 8.5 25.2 14.5 25C18 24.9 20.2 22.9 21.3 20.8M25.5 5.5C24.4 11.2 24.2 18.8 24.7 25.8M24.5 17.8C27.1 11.8 33.6 9.6 36 13.2C38.6 17.1 34.5 22.4 38.2 24.8M41.2 17.2C45.5 17.1 51.2 15.3 51.1 12.1C51 9.3 46.1 9.3 43 11.5C39.2 14.2 39.6 21.2 43.8 23.9C47.3 26.2 51.9 24 54 21M56.2 17.2C60.5 17.1 66.2 15.3 66.1 12.1C66 9.3 61.1 9.3 58 11.5C54.2 14.2 54.6 21.2 58.8 23.9C62.3 26.2 66.9 24 69 21M72 11.8C77 10.2 84 10 88.2 11.3C84.8 15.1 79.7 20.7 75.4 25C80.5 22.9 86.3 23 91 24.7"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.15"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M98.2 24.3C99.3 23.2 101.1 23.3 101.8 24.5C101.5 26 99.8 26.6 98.5 25.7"
        fill="none"
        stroke="#ff4f2e"
        strokeWidth="3.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function Chrome({ component }: { component: ComponentVideoDefinition }) {
  return (
    <>
      <div style={{ position: "absolute", top: 62, left: 80, color: CREAM }}><Wordmark /></div>
      <div style={{ position: "absolute", top: 70, right: 80, color: "rgba(244,240,230,.42)", fontFamily: "monospace", fontSize: 14, letterSpacing: ".12em" }}>
        {String(component.number).padStart(2, "0")} / {String(components.length).padStart(2, "0")}
      </div>
      <div style={{ position: "absolute", bottom: 58, left: 80, color: "rgba(244,240,230,.28)", fontFamily: "monospace", fontSize: 13, letterSpacing: ".08em" }}>
        BERKANT.ME/CHEEZ
      </div>
      <div style={{ position: "absolute", right: 80, bottom: 60, display: "flex", gap: 10 }}>
        {["#ff4f2e", "#8f74ff", "#ff5fa2", "#b7ff3c", "#35d9ff"].map((color) => (
          <span key={color} style={{ width: 8, height: 8, borderRadius: 99, backgroundColor: color }} />
        ))}
      </div>
    </>
  )
}

export function MacWindow({ children, component }: { children: ReactNode; component: ComponentVideoDefinition }) {
  return (
    <div
      style={{
        width: 900,
        height: 610,
        overflow: "hidden",
        border: "1px solid rgba(244,240,230,.25)",
        borderRadius: 28,
        backgroundColor: "#050505",
        boxShadow: "0 52px 110px rgba(0,0,0,.72), 0 0 0 1px rgba(255,255,255,.035)",
      }}
    >
      <div
        style={{
          height: 58,
          display: "grid",
          gridTemplateColumns: "120px 1fr 120px",
          alignItems: "center",
          borderBottom: "1px solid rgba(244,240,230,.11)",
          backgroundColor: "#111",
        }}
      >
        <div style={{ display: "flex", gap: 10, paddingLeft: 22 }}>
          <span style={{ width: 13, height: 13, borderRadius: 99, backgroundColor: "#ff5f57" }} />
          <span style={{ width: 13, height: 13, borderRadius: 99, backgroundColor: "#febc2e" }} />
          <span style={{ width: 13, height: 13, borderRadius: 99, backgroundColor: "#28c840" }} />
        </div>
        <div
          style={{
            justifySelf: "center",
            minWidth: 390,
            padding: "9px 22px",
            borderRadius: 10,
            backgroundColor: "#1b1b1b",
            color: "rgba(244,240,230,.48)",
            fontFamily: "monospace",
            fontSize: 13,
            textAlign: "center",
          }}
        >
          berkant.me/cheez/components/{component.id}
        </div>
        <div style={{ justifySelf: "end", paddingRight: 24, color: "rgba(244,240,230,.32)", fontSize: 20 }}>···</div>
      </div>
      <div style={{ position: "relative", height: 552, display: "grid", placeItems: "center", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 22, left: 26, color: component.accent, fontFamily: "monospace", fontSize: 12, letterSpacing: ".12em" }}>
          LIVE / {component.id.toUpperCase()}
        </div>
        {children}
      </div>
    </div>
  )
}

export function InkFrame({ accent, children }: { accent: string; children: ReactNode }) {
  const frame = useCurrentFrame()

  return (
    <div style={{ position: "relative", width: 760, height: 430, display: "grid", placeItems: "center" }}>
      <svg viewBox="0 0 820 500" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible" }}>
        <path
          d="M26 18 C190 4 610 28 798 16 C816 120 804 376 792 480 C590 492 196 472 24 486 C8 350 18 128 26 18"
          fill="none"
          stroke={accent}
          strokeWidth="5"
          strokeLinecap="round"
          pathLength="1"
          strokeDasharray="1"
          strokeDashoffset={1 - progress(frame, [5, 32], [0, 1])}
        />
      </svg>
      {children}
    </div>
  )
}

export function Mark({ accent, draw, type = "underline" }: { accent: string; draw: number; type?: "circle" | "underline" }) {
  return type === "circle" ? (
    <svg viewBox="0 0 180 76" style={{ position: "absolute", inset: "-16px -28px", width: "calc(100% + 56px)", height: "calc(100% + 32px)", overflow: "visible" }}>
      <path d="M14 42 C14 8 160 0 168 36 C174 72 20 78 12 44" fill="none" stroke={accent} strokeWidth="4" strokeLinecap="round" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - draw} />
    </svg>
  ) : (
    <svg viewBox="0 0 220 30" style={{ position: "absolute", left: -8, right: -8, bottom: -18, width: "calc(100% + 16px)", height: 28, overflow: "visible" }}>
      <path d="M4 16 C60 8 152 22 216 12" fill="none" stroke={accent} strokeWidth="5" strokeLinecap="round" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - draw} />
    </svg>
  )
}
