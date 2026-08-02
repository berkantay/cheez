import { Composition } from "remotion"

import { CheezDailyVideo, DAILY_DURATION, DAILY_FPS, DAILY_SIZE } from "./daily-video"
import { getComponent } from "./manifest"
import { cheezDailyVideoSchema } from "./schema"

export function RemotionRoot() {
  return (
    <Composition
      id="CheezDaily"
      component={CheezDailyVideo}
      durationInFrames={DAILY_DURATION}
      fps={DAILY_FPS}
      width={DAILY_SIZE}
      height={DAILY_SIZE}
      defaultProps={{ componentId: "breadcrumb" }}
      schema={cheezDailyVideoSchema}
      calculateMetadata={({ props }) => {
        const component = getComponent(props.componentId)

        return {
          props,
          defaultOutName: `cheez-${component.id}.mp4`,
        }
      }}
    />
  )
}
