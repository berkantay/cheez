"use client"

import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
  type ComponentPropsWithoutRef,
  type CSSProperties,
  type FocusEvent,
  type PointerEvent,
  type ReactNode,
} from "react"

import type {
  CheezDefinition,
  CheezFillLayer,
  CheezTrigger,
} from "./cheez-definition"
import {
  cancelCheezMark,
  finishCheezMark,
  hideCheezMark,
  observeCheezMark,
  playCheezMark,
} from "./cheez-motion"

export interface CheezMarkHandle {
  play: () => void
  replay: () => void
  cancel: () => void
  finish: () => void
}

export interface CheezMarkProps
  extends Omit<ComponentPropsWithoutRef<"span">, "children" | "color"> {
  children: ReactNode
  definition: CheezDefinition
  color?: string
  durationScale?: number
  fillColor?: string
  once?: boolean
  thickness?: number
  trigger?: CheezTrigger
  onAnimationComplete?: () => void
}

interface AnimatedPathProps {
  duration: number
  delay?: number
  easing?: string
  initiallyVisible: boolean
}

const BASE_PATH_STYLE: CSSProperties = {
  transformOrigin: "center",
}

function getAnimatedPathProps({
  duration,
  delay = 0,
  easing,
  initiallyVisible,
}: AnimatedPathProps) {
  return {
    "data-cheez-animate": "",
    "data-duration": duration,
    "data-delay": delay,
    "data-easing": easing,
    style: {
      ...BASE_PATH_STYLE,
      opacity: initiallyVisible ? 1 : 0,
    },
  }
}

function FillLayer({
  color,
  layer,
  maskId,
  initiallyVisible,
}: {
  color?: string
  layer: CheezFillLayer
  maskId: string
  initiallyVisible: boolean
}) {
  const animatedPathProps = getAnimatedPathProps({
    ...layer.timing,
    initiallyVisible,
  })

  return (
    <>
      <defs>
        <mask
          id={maskId}
          maskUnits="userSpaceOnUse"
          x="-20%"
          y="-20%"
          width="140%"
          height="140%"
        >
          <path
            {...animatedPathProps}
            d={layer.reveal.path}
            transform={layer.transform}
            fill="none"
            stroke="white"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={layer.reveal.strokeWidth}
          />
        </mask>
      </defs>
      <path
        d={layer.path}
        fill={color ?? "currentColor"}
        mask={`url(#${maskId})`}
        opacity={layer.opacity ?? 1}
        transform={layer.transform}
      />
    </>
  )
}

export const CheezMark = forwardRef<CheezMarkHandle, CheezMarkProps>(
  function CheezMark(
    {
      children,
      className,
      color = "currentColor",
      definition,
      durationScale = 1,
      fillColor,
      once = true,
      onAnimationComplete,
      onFocus,
      onPointerEnter,
      style,
      thickness = 1,
      trigger = "mount",
      ...props
    },
    forwardedRef,
  ) {
    const rootRef = useRef<HTMLSpanElement>(null)
    const svgRef = useRef<SVGSVGElement>(null)
    const reactId = useId().replaceAll(":", "")
    const initiallyVisible = trigger === "none"

    const play = useCallback(() => {
      if (!svgRef.current) return
      playCheezMark(svgRef.current, {
        durationScale,
        onComplete: onAnimationComplete,
      })
    }, [durationScale, onAnimationComplete])

    const replay = useCallback(() => {
      if (!svgRef.current) return
      hideCheezMark(svgRef.current)
      play()
    }, [play])

    const cancel = useCallback(() => {
      if (svgRef.current) cancelCheezMark(svgRef.current)
    }, [])

    const finish = useCallback(() => {
      if (svgRef.current) finishCheezMark(svgRef.current)
    }, [])

    useImperativeHandle(
      forwardedRef,
      () => ({ play, replay, cancel, finish }),
      [cancel, finish, play, replay],
    )

    useEffect(() => {
      const root = rootRef.current
      const svg = svgRef.current
      if (!root || !svg) return

      if (trigger === "none") {
        finishCheezMark(svg)
        return
      }

      if (trigger === "mount") {
        play()
        return () => cancelCheezMark(svg)
      }

      if (trigger === "in-view") {
        const stopObserving = observeCheezMark(root, replay, once)
        return () => {
          stopObserving()
          cancelCheezMark(svg)
        }
      }

      hideCheezMark(svg)
      return () => cancelCheezMark(svg)
    }, [definition.name, once, play, replay, trigger])

    const handlePointerEnter = (event: PointerEvent<HTMLSpanElement>) => {
      onPointerEnter?.(event)
      if (trigger === "hover") replay()
    }

    const handleFocus = (event: FocusEvent<HTMLSpanElement>) => {
      onFocus?.(event)
      if (trigger === "focus") replay()
    }

    const contentZIndex = definition.layer === "behind" ? 1 : 0
    const svgZIndex = definition.layer === "behind" ? 0 : 1

    return (
      <span
        {...props}
        ref={rootRef}
        className={className}
        onFocus={handleFocus}
        onPointerEnter={handlePointerEnter}
        style={{
          position: "relative",
          display: "inline-block",
          isolation: "isolate",
          ...style,
        }}
      >
        <span style={{ position: "relative", zIndex: contentZIndex }}>
          {children}
        </span>
        <svg
          ref={svgRef}
          aria-hidden="true"
          focusable="false"
          preserveAspectRatio={definition.preserveAspectRatio ?? "none"}
          viewBox={definition.viewBox}
          style={{
            position: "absolute",
            pointerEvents: "none",
            overflow: "visible",
            color,
            zIndex: svgZIndex,
            ...definition.placement,
          }}
        >
          {definition.layers.map((layer, index) => {
            if (layer.type === "fill") {
              return (
                <FillLayer
                  key={`${definition.name}-${index}`}
                  color={fillColor}
                  layer={layer}
                  maskId={`cheez-${reactId}-${index}`}
                  initiallyVisible={initiallyVisible}
                />
              )
            }

            return (
              <path
                {...getAnimatedPathProps({
                  ...layer.timing,
                  initiallyVisible,
                })}
                key={`${definition.name}-${index}`}
                d={layer.path}
                fill="none"
                opacity={layer.opacity ?? 1}
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={layer.strokeWidth * thickness}
                transform={layer.transform}
              />
            )
          })}
        </svg>
      </span>
    )
  },
)
