"use client"

import { Slider } from "@base-ui/react/slider"
import { forwardRef, useId, type ReactNode } from "react"
import type { SliderRootProps } from "@base-ui/react/slider"

import { Cheez } from "../cheez"
import type { CheezCharacter } from "../cheez-core/cheez-definition"
import { joinCheezClassNames } from "../cheez-ui/marked-label"
import type { CheezType } from "../mark-catalog"
import "../cheez-ui/cheez-ui.css"

type SliderValue = number | readonly number[]

export interface MarkedSliderProps
  extends Omit<SliderRootProps<SliderValue>, "children" | "className"> {
  ariaLabel?: string
  character?: CheezCharacter
  className?: string
  description?: ReactNode
  error?: ReactNode
  indicatorColor?: string
  indicatorMark?: CheezType
  label: ReactNode
  showValue?: boolean
  size?: "small" | "medium" | "large"
  thickness?: number
  thumbColor?: string
  thumbLabels?: readonly string[]
  thumbMark?: CheezType
  valueSuffix?: string
  verticalIndicatorMark?: CheezType
}

export const MarkedSlider = forwardRef<HTMLDivElement, MarkedSliderProps>(
  function MarkedSlider(
    {
      ariaLabel = "slider",
      character = "rushed",
      className,
      defaultValue,
      description,
      disabled = false,
      error,
      indicatorColor = "#35d9ff",
      indicatorMark = "long-underline",
      label,
      orientation = "horizontal",
      showValue = true,
      size = "medium",
      thickness,
      thumbColor = "#ff5fa2",
      thumbLabels,
      thumbMark = "sparkle",
      value,
      valueSuffix = "",
      verticalIndicatorMark = "arrow-down",
      ...props
    },
    ref,
  ) {
    const generatedId = useId().replaceAll(":", "")
    const descriptionId = `cheez-slider-${generatedId}-description`
    const errorId = `cheez-slider-${generatedId}-error`
    const currentValue = value ?? defaultValue ?? 0
    const thumbCount = Array.isArray(currentValue)
      ? Math.max(currentValue.length, 1)
      : 1
    const range = thumbCount > 1
    const activeIndicatorMark =
      orientation === "vertical" ? verticalIndicatorMark : indicatorMark
    const activeIndicatorColor = error ? "#ff5fa2" : indicatorColor

    return (
      <Slider.Root
        {...props}
        ref={ref}
        className={joinCheezClassNames(
          "cheez-ui cheez-slider",
          className,
        )}
        aria-describedby={error ? errorId : description ? descriptionId : undefined}
        aria-invalid={error ? true : undefined}
        data-size={size}
        defaultValue={defaultValue}
        disabled={disabled}
        orientation={orientation}
        value={value}
      >
        <div className="cheez-slider__heading">
          <Slider.Label className="cheez-slider__label">{label}</Slider.Label>
          {showValue ? (
            <Slider.Value className="cheez-slider__value">
              {(formattedValues) => `${formattedValues.join(" – ")}${valueSuffix}`}
            </Slider.Value>
          ) : null}
        </div>

        <Slider.Control className="cheez-slider__control">
          <Slider.Track className="cheez-slider__track">
            <Slider.Indicator className="cheez-slider__indicator">
              <Cheez
                className="cheez-slider__indicator-mark"
                type={activeIndicatorMark}
                character={character}
                color={activeIndicatorColor}
                thickness={thickness}
                trigger="mount"
              >
                <span aria-hidden="true" />
              </Cheez>
            </Slider.Indicator>

            {Array.from({ length: thumbCount }, (_, index) => (
              <Slider.Thumb
                key={index}
                className="cheez-slider__thumb"
                index={range ? index : undefined}
                getAriaLabel={() =>
                  thumbLabels?.[index] ??
                  (range
                    ? `${ariaLabel} ${index === 0 ? "minimum" : "maximum"}`
                    : ariaLabel)
                }
              >
                <Cheez
                  className="cheez-slider__thumb-mark"
                  type={thumbMark}
                  character={character}
                  color={error ? "#ff5fa2" : thumbColor}
                  thickness={thickness}
                  trigger="mount"
                >
                  <span className="cheez-slider__thumb-center" aria-hidden="true" />
                </Cheez>
              </Slider.Thumb>
            ))}
          </Slider.Track>
        </Slider.Control>

        {error ? (
          <span className="cheez-slider__message" id={errorId} role="alert">
            {error}
          </span>
        ) : description ? (
          <span className="cheez-slider__description" id={descriptionId}>
            {description}
          </span>
        ) : null}
      </Slider.Root>
    )
  },
)
