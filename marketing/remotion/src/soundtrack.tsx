import { Audio } from "@remotion/media"
import { Sequence, interpolate, staticFile } from "remotion"

function Sketch({ from }: { from: number }) {
  return (
    <Sequence from={from} durationInFrames={25} layout="none">
      <Audio src={staticFile("audio/pencil-master.wav")} volume={0.72} />
    </Sequence>
  )
}

function Tap({ from }: { from: number }) {
  return (
    <Sequence from={from} durationInFrames={8} layout="none">
      <Audio src={staticFile("audio/tap-master.wav")} volume={0.52} />
    </Sequence>
  )
}

export function Soundtrack({ componentId }: { componentId: string }) {
  const isButton = componentId === "button"

  return (
    <>
      <Audio
        src={staticFile("audio/cheez-bed-master.wav")}
        volume={(frame) =>
          interpolate(frame, [0, 24, 220, 249], [0, 0.46, 0.46, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })
        }
      />
      <Sketch from={18} />
      <Tap from={59} />
      {isButton ? (
        <>
          <Sketch from={70} />
          <Tap from={96} />
          <Sketch from={102} />
          <Tap from={130} />
          <Sketch from={136} />
          <Tap from={163} />
        </>
      ) : (
        <>
          <Sketch from={66} />
          <Sketch from={118} />
        </>
      )}
      <Tap from={184} />
      <Sketch from={210} />
    </>
  )
}
