import { fade } from "@remotion/transitions/fade"
import { linearTiming, springTiming, TransitionSeries } from "@remotion/transitions"
import { AbsoluteFill } from "remotion"

import { getComponent } from "./manifest"
import type { CheezDailyVideoProps } from "./schema"
import { DemoScene } from "./scenes/demo"
import { IntroScene } from "./scenes/intro"
import { OutroScene } from "./scenes/outro"
import { Soundtrack } from "./soundtrack"
import { Background, Chrome } from "./video-kit"

export { DAILY_DURATION, DAILY_FPS, DAILY_SIZE } from "./video-kit"

export function CheezDailyVideo({ componentId }: CheezDailyVideoProps) {
  const component = getComponent(componentId)

  return (
    <AbsoluteFill style={{ backgroundColor: "#000", fontFamily: "Inter, Arial, sans-serif" }}>
      <Background seed={component.number} />
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={75} name="Intro">
          <IntroScene component={component} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={springTiming({ config: { damping: 200 }, durationInFrames: 15 })}
        />
        <TransitionSeries.Sequence durationInFrames={140} name="Demo">
          <DemoScene component={component} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 15 })}
        />
        <TransitionSeries.Sequence durationInFrames={65} name="Outro">
          <OutroScene component={component} />
        </TransitionSeries.Sequence>
      </TransitionSeries>
      <Chrome component={component} />
      <Soundtrack componentId={component.id} />
    </AbsoluteFill>
  )
}
