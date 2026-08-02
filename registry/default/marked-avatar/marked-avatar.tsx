"use client"

import { Avatar } from "@base-ui/react/avatar"
import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from "react"
import type {
  AvatarImageProps,
  AvatarRootProps,
  ImageLoadingStatus,
} from "@base-ui/react/avatar"

import { Cheez } from "../cheez"
import type { CheezCharacter } from "../cheez-core/cheez-definition"
import { joinCheezClassNames } from "../cheez-ui/marked-label"
import type { CheezType } from "../mark-catalog"
import "../cheez-ui/cheez-ui.css"

export type MarkedAvatarShape = "circle" | "rounded" | "square"
export type MarkedAvatarSize = "small" | "medium" | "large" | "xlarge"
export type MarkedAvatarStatus = "online" | "away" | "busy" | "offline"
export type MarkedAvatarStatusPosition =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right"

interface AvatarStatusAppearance {
  color: string
  label: string
  mark: CheezType
}

export const MARKED_AVATAR_STATUSES: Record<
  MarkedAvatarStatus,
  AvatarStatusAppearance
> = {
  online: { color: "#b7ff3c", label: "online", mark: "check" },
  away: { color: "#ff4f2e", label: "away", mark: "exclamation" },
  busy: { color: "#ff5fa2", label: "busy", mark: "cross" },
  offline: { color: "#8f74ff", label: "offline", mark: "spiral" },
}

const DEFAULT_FRAME_MARKS: Record<MarkedAvatarShape, CheezType> = {
  circle: "loose-circle",
  rounded: "rounded-box",
  square: "box",
}

export function getAvatarInitials(name: string, maxCharacters = 2) {
  const words = name.trim().split(/\s+/).filter(Boolean)
  if (words.length === 0 || maxCharacters <= 0) return "?"

  return words
    .slice(0, Math.max(1, maxCharacters))
    .map((word) => word[0])
    .join("")
    .toLocaleUpperCase()
}

export interface MarkedAvatarProps
  extends Omit<AvatarRootProps, "children" | "className"> {
  alt?: string
  announceStatus?: boolean
  character?: CheezCharacter
  className?: string
  fallback?: ReactNode
  fallbackColor?: string
  fallbackDelay?: number
  fallbackMark?: CheezType
  frameColor?: string
  frameMark?: CheezType
  imageClassName?: string
  imageProps?: Omit<AvatarImageProps, "alt" | "className" | "src">
  initialsLength?: number
  name: string
  onLoadingStatusChange?: (status: ImageLoadingStatus) => void
  shape?: MarkedAvatarShape
  size?: MarkedAvatarSize
  src?: string
  status?: MarkedAvatarStatus
  statusColor?: string
  statusLabel?: string
  statusMark?: CheezType
  statusPosition?: MarkedAvatarStatusPosition
  thickness?: number
}

export const MarkedAvatar = forwardRef<HTMLSpanElement, MarkedAvatarProps>(
  function MarkedAvatar(
    {
      alt,
      announceStatus = true,
      character = "rushed",
      className,
      fallback,
      fallbackColor = "#8f74ff",
      fallbackDelay = 0,
      fallbackMark = "spotlight",
      frameColor = "#f4f0e6",
      frameMark,
      imageClassName,
      imageProps,
      initialsLength = 2,
      name,
      onLoadingStatusChange,
      shape = "circle",
      size = "medium",
      src,
      status,
      statusColor,
      statusLabel,
      statusMark,
      statusPosition = "bottom-right",
      thickness,
      ...props
    },
    ref,
  ) {
    const statusAppearance = status ? MARKED_AVATAR_STATUSES[status] : null
    const resolvedStatusLabel = statusLabel ?? statusAppearance?.label

    return (
      <Avatar.Root
        {...props}
        ref={ref}
        className={joinCheezClassNames("cheez-ui cheez-avatar", className)}
        data-shape={shape}
        data-size={size}
      >
        <span className="cheez-avatar__media">
          <Cheez
            className="cheez-avatar__frame"
            type={frameMark ?? DEFAULT_FRAME_MARKS[shape]}
            character={character}
            color={frameColor}
            thickness={thickness}
            trigger="mount"
          >
            <span aria-hidden="true" />
          </Cheez>

          {src ? (
            <Avatar.Image
              {...imageProps}
              className={joinCheezClassNames(
                "cheez-avatar__image",
                imageClassName,
              )}
              src={src}
              alt={alt ?? name}
              onLoadingStatusChange={onLoadingStatusChange}
            />
          ) : null}

          <Avatar.Fallback className="cheez-avatar__fallback" delay={fallbackDelay}>
            <Cheez
              className="cheez-avatar__fallback-fill"
              type={fallbackMark}
              character={character}
              color={fallbackColor}
              fillColor={fallbackColor}
              trigger="mount"
            >
              <span aria-hidden="true" />
            </Cheez>
            <span aria-hidden="true">
              {fallback ?? getAvatarInitials(name, initialsLength)}
            </span>
            <span className="cheez-avatar__sr-only">{name}</span>
          </Avatar.Fallback>
        </span>

        {status && statusAppearance ? (
          <span
            className="cheez-avatar__status"
            data-position={statusPosition}
          >
            <Cheez
              type={statusMark ?? statusAppearance.mark}
              character={character}
              color={statusColor ?? statusAppearance.color}
              thickness={thickness}
              trigger="mount"
            >
              <span aria-hidden="true" />
            </Cheez>
            {announceStatus && resolvedStatusLabel ? (
              <span className="cheez-avatar__sr-only">
                {resolvedStatusLabel}
              </span>
            ) : null}
          </span>
        ) : null}
      </Avatar.Root>
    )
  },
)

export interface MarkedAvatarGroupProps
  extends Omit<ComponentPropsWithoutRef<"div">, "children"> {
  character?: CheezCharacter
  children: ReactNode
  countColor?: string
  countMark?: CheezType
  label?: string
  overflow?: number
  overflowLabel?: string
  size?: MarkedAvatarSize
  thickness?: number
}

export const MarkedAvatarGroup = forwardRef<
  HTMLDivElement,
  MarkedAvatarGroupProps
>(function MarkedAvatarGroup(
  {
    character = "rushed",
    children,
    className,
    countColor = "#35d9ff",
    countMark = "loose-circle",
    label = "people",
    overflow = 0,
    overflowLabel,
    size = "medium",
    thickness,
    ...props
  },
  ref,
) {
  const normalizedOverflow = Math.max(0, Math.floor(overflow))

  return (
    <div
      {...props}
      ref={ref}
      className={joinCheezClassNames("cheez-ui cheez-avatar-group", className)}
      role="group"
      aria-label={label}
      data-size={size}
    >
      {children}
      {normalizedOverflow > 0 ? (
        <span
          className="cheez-avatar-group__count"
          aria-label={overflowLabel ?? `${normalizedOverflow} more people`}
        >
          <Cheez
            type={countMark}
            character={character}
            color={countColor}
            thickness={thickness}
            trigger="mount"
          >
            <span aria-hidden="true">+{normalizedOverflow}</span>
          </Cheez>
        </span>
      ) : null}
    </div>
  )
})
