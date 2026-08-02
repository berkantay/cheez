"use client"

import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type CSSProperties,
  type ReactNode,
} from "react"

import { Cheez } from "../cheez"
import type { CheezCharacter } from "../cheez-core/cheez-definition"
import { joinCheezClassNames } from "../cheez-ui/marked-label"
import type { CheezType } from "../mark-catalog"
import "../cheez-ui/cheez-ui.css"

export type MarkedPaginationSize = "small" | "medium" | "large"
export type MarkedPaginationTone =
  | "neutral"
  | "orange"
  | "purple"
  | "lime"
  | "pink"
  | "cyan"
export type MarkedPaginationRangeItem =
  | number
  | "ellipsis-start"
  | "ellipsis-end"

export const MARKED_PAGINATION_COLORS: Record<MarkedPaginationTone, string> = {
  neutral: "#625f59",
  orange: "#ff4f2e",
  purple: "#8f74ff",
  lime: "#b7ff3c",
  pink: "#ff5fa2",
  cyan: "#35d9ff",
}

export interface MarkedPaginationRangeOptions {
  boundaryCount?: number
  currentPage: number
  pageCount: number
  siblingCount?: number
}

function integerAtLeast(value: number, minimum: number) {
  return Math.max(minimum, Math.floor(value))
}

function numberRange(start: number, end: number) {
  if (end < start) return []
  return Array.from({ length: end - start + 1 }, (_, index) => start + index)
}

export function getMarkedPaginationRange({
  boundaryCount = 1,
  currentPage,
  pageCount,
  siblingCount = 1,
}: MarkedPaginationRangeOptions): MarkedPaginationRangeItem[] {
  const count = integerAtLeast(pageCount, 1)
  const boundary = integerAtLeast(boundaryCount, 0)
  const siblings = integerAtLeast(siblingCount, 0)
  const page = Math.min(Math.max(integerAtLeast(currentPage, 1), 1), count)
  const visibleWithoutEllipsis = boundary * 2 + siblings * 2 + 3

  if (count <= visibleWithoutEllipsis) {
    return numberRange(1, count)
  }

  const startPages = numberRange(1, Math.min(boundary, count))
  const endPages = numberRange(
    Math.max(count - boundary + 1, boundary + 1),
    count,
  )
  const siblingsStart = Math.max(
    Math.min(page - siblings, count - boundary - siblings * 2 - 1),
    boundary + 2,
  )
  const siblingsEnd = Math.min(
    Math.max(page + siblings, boundary + siblings * 2 + 2),
    count - boundary - 1,
  )
  const startGap: MarkedPaginationRangeItem[] =
    siblingsStart > boundary + 2
      ? ["ellipsis-start"]
      : boundary + 1 < count - boundary
        ? [boundary + 1]
        : []
  const endGap: MarkedPaginationRangeItem[] =
    siblingsEnd < count - boundary - 1
      ? ["ellipsis-end"]
      : count - boundary > boundary
        ? [count - boundary]
        : []

  return [
    ...startPages,
    ...startGap,
    ...numberRange(siblingsStart, siblingsEnd),
    ...endGap,
    ...endPages,
  ]
}

interface PaginationStyle extends CSSProperties {
  "--cheez-pagination-color": string
  "--cheez-pagination-stroke": string
}

export interface MarkedPaginationProps
  extends Omit<ComponentPropsWithoutRef<"nav">, "color"> {
  color?: string
  compact?: boolean
  label?: string
  size?: MarkedPaginationSize
  spread?: boolean
  thickness?: number
  tone?: MarkedPaginationTone
}

export const MarkedPagination = forwardRef<HTMLElement, MarkedPaginationProps>(
  function MarkedPagination(
    {
      className,
      color,
      compact = false,
      label = "pagination",
      size = "medium",
      spread = false,
      style,
      thickness,
      tone = "orange",
      ...props
    },
    ref,
  ) {
    const resolvedColor = color ?? MARKED_PAGINATION_COLORS[tone]
    const paginationStyle: PaginationStyle = {
      ...style,
      "--cheez-pagination-color": resolvedColor,
      "--cheez-pagination-stroke": String(2 * (thickness ?? 1)) + "px",
    }

    return (
      <nav
        {...props}
        ref={ref}
        aria-label={label}
        className={joinCheezClassNames(
          "cheez-ui cheez-pagination",
          className,
        )}
        data-compact={compact ? "" : undefined}
        data-size={size}
        data-spread={spread ? "" : undefined}
        data-tone={tone}
        style={paginationStyle}
      />
    )
  },
)

export const MarkedPaginationList = forwardRef<
  HTMLUListElement,
  ComponentPropsWithoutRef<"ul">
>(function MarkedPaginationList({ className, ...props }, ref) {
  return (
    <ul
      {...props}
      ref={ref}
      className={joinCheezClassNames(
        "cheez-pagination__list",
        className,
      )}
    />
  )
})

export const MarkedPaginationItem = forwardRef<
  HTMLLIElement,
  ComponentPropsWithoutRef<"li">
>(function MarkedPaginationItem({ className, ...props }, ref) {
  return (
    <li
      {...props}
      ref={ref}
      className={joinCheezClassNames(
        "cheez-pagination__item",
        className,
      )}
    />
  )
})

interface PaginationPageVisualProps {
  activeMark: CheezType
  character: CheezCharacter
  children: ReactNode
  current: boolean
  hoverMark: CheezType
  markColor: string
  thickness?: number
}

function PaginationPageVisual({
  activeMark,
  character,
  children,
  current,
  hoverMark,
  markColor,
  thickness,
}: PaginationPageVisualProps) {
  return (
    <Cheez
      className="cheez-pagination__page-mark"
      type={current ? activeMark : hoverMark}
      character={character}
      color={markColor}
      thickness={thickness}
      trigger={current ? "mount" : "hover"}
    >
      <span className="cheez-pagination__page-content">{children}</span>
    </Cheez>
  )
}

interface PaginationPageVisualOptions {
  activeMark?: CheezType
  character?: CheezCharacter
  current?: boolean
  hoverMark?: CheezType
  markColor?: string
  thickness?: number
}

export interface MarkedPaginationLinkProps
  extends Omit<ComponentPropsWithoutRef<"a">, "color">,
    PaginationPageVisualOptions {
  disabled?: boolean
}

export const MarkedPaginationLink = forwardRef<
  HTMLAnchorElement,
  MarkedPaginationLinkProps
>(function MarkedPaginationLink(
  {
    activeMark = "circle",
    character = "rushed",
    children,
    className,
    current = false,
    disabled = false,
    hoverMark = "underline",
    markColor = "var(--cheez-pagination-color)",
    tabIndex,
    thickness,
    ...props
  },
  ref,
) {
  return (
    <a
      {...props}
      ref={ref}
      aria-current={current ? "page" : undefined}
      aria-disabled={disabled ? true : undefined}
      className={joinCheezClassNames(
        "cheez-pagination__page",
        className,
      )}
      data-current={current ? "" : undefined}
      data-disabled={disabled ? "" : undefined}
      tabIndex={disabled ? -1 : tabIndex}
    >
      <PaginationPageVisual
        activeMark={activeMark}
        character={character}
        current={current}
        hoverMark={hoverMark}
        markColor={markColor}
        thickness={thickness}
      >
        {children}
      </PaginationPageVisual>
    </a>
  )
})

export interface MarkedPaginationButtonProps
  extends Omit<ComponentPropsWithoutRef<"button">, "color">,
    PaginationPageVisualOptions {}

export const MarkedPaginationButton = forwardRef<
  HTMLButtonElement,
  MarkedPaginationButtonProps
>(function MarkedPaginationButton(
  {
    activeMark = "circle",
    character = "rushed",
    children,
    className,
    current = false,
    hoverMark = "underline",
    markColor = "var(--cheez-pagination-color)",
    thickness,
    type = "button",
    ...props
  },
  ref,
) {
  return (
    <button
      {...props}
      ref={ref}
      type={type}
      aria-current={current ? "page" : undefined}
      className={joinCheezClassNames(
        "cheez-pagination__page",
        className,
      )}
      data-current={current ? "" : undefined}
    >
      <PaginationPageVisual
        activeMark={activeMark}
        character={character}
        current={current}
        hoverMark={hoverMark}
        markColor={markColor}
        thickness={thickness}
      >
        {children}
      </PaginationPageVisual>
    </button>
  )
})

interface PaginationArrowVisualProps {
  character: CheezCharacter
  children: ReactNode
  direction: "previous" | "next"
  markColor: string
  thickness?: number
}

function PaginationArrowVisual({
  character,
  children,
  direction,
  markColor,
  thickness,
}: PaginationArrowVisualProps) {
  return (
    <>
      {direction === "previous" ? (
        <Cheez
          className="cheez-pagination__arrow"
          type="arrow-left"
          character={character}
          color={markColor}
          thickness={thickness}
          trigger="mount"
        >
          <span aria-hidden="true" />
        </Cheez>
      ) : null}
      <span className="cheez-pagination__arrow-label">{children}</span>
      {direction === "next" ? (
        <Cheez
          className="cheez-pagination__arrow"
          type="arrow-right"
          character={character}
          color={markColor}
          thickness={thickness}
          trigger="mount"
        >
          <span aria-hidden="true" />
        </Cheez>
      ) : null}
    </>
  )
}

interface PaginationArrowOptions {
  character?: CheezCharacter
  disabled?: boolean
  markColor?: string
  thickness?: number
}

export interface MarkedPaginationPreviousProps
  extends Omit<ComponentPropsWithoutRef<"a">, "color">,
    PaginationArrowOptions {}

export const MarkedPaginationPrevious = forwardRef<
  HTMLAnchorElement,
  MarkedPaginationPreviousProps
>(function MarkedPaginationPrevious(
  {
    character = "rushed",
    children = "previous",
    className,
    disabled = false,
    markColor = "var(--cheez-pagination-color)",
    tabIndex,
    thickness,
    ...props
  },
  ref,
) {
  return (
    <a
      {...props}
      ref={ref}
      aria-disabled={disabled ? true : undefined}
      aria-label={typeof children === "string" ? children : "previous page"}
      className={joinCheezClassNames(
        "cheez-pagination__direction",
        className,
      )}
      data-disabled={disabled ? "" : undefined}
      data-direction="previous"
      rel="prev"
      tabIndex={disabled ? -1 : tabIndex}
    >
      <PaginationArrowVisual
        character={character}
        direction="previous"
        markColor={markColor}
        thickness={thickness}
      >
        {children}
      </PaginationArrowVisual>
    </a>
  )
})

export interface MarkedPaginationNextProps
  extends Omit<ComponentPropsWithoutRef<"a">, "color">,
    PaginationArrowOptions {}

export const MarkedPaginationNext = forwardRef<
  HTMLAnchorElement,
  MarkedPaginationNextProps
>(function MarkedPaginationNext(
  {
    character = "rushed",
    children = "next",
    className,
    disabled = false,
    markColor = "var(--cheez-pagination-color)",
    tabIndex,
    thickness,
    ...props
  },
  ref,
) {
  return (
    <a
      {...props}
      ref={ref}
      aria-disabled={disabled ? true : undefined}
      aria-label={typeof children === "string" ? children : "next page"}
      className={joinCheezClassNames(
        "cheez-pagination__direction",
        className,
      )}
      data-disabled={disabled ? "" : undefined}
      data-direction="next"
      rel="next"
      tabIndex={disabled ? -1 : tabIndex}
    >
      <PaginationArrowVisual
        character={character}
        direction="next"
        markColor={markColor}
        thickness={thickness}
      >
        {children}
      </PaginationArrowVisual>
    </a>
  )
})

export interface MarkedPaginationEllipsisProps
  extends ComponentPropsWithoutRef<"span"> {
  label?: string
}

export const MarkedPaginationEllipsis = forwardRef<
  HTMLSpanElement,
  MarkedPaginationEllipsisProps
>(function MarkedPaginationEllipsis(
  { className, label = "more pages", ...props },
  ref,
) {
  return (
    <span
      {...props}
      ref={ref}
      className={joinCheezClassNames(
        "cheez-pagination__ellipsis",
        className,
      )}
    >
      <span aria-hidden="true">•••</span>
      <span className="cheez-pagination__sr-only">{label}</span>
    </span>
  )
})

export interface MarkedPaginationStatusProps
  extends ComponentPropsWithoutRef<"span"> {
  live?: boolean
}

export const MarkedPaginationStatus = forwardRef<
  HTMLSpanElement,
  MarkedPaginationStatusProps
>(function MarkedPaginationStatus(
  { className, live = false, ...props },
  ref,
) {
  return (
    <span
      {...props}
      ref={ref}
      aria-live={live ? "polite" : undefined}
      className={joinCheezClassNames(
        "cheez-pagination__status",
        className,
      )}
    />
  )
})
