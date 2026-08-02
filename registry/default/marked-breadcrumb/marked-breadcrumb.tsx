"use client"

import {
  createContext,
  forwardRef,
  useContext,
  type ComponentPropsWithoutRef,
  type CSSProperties,
  type ReactNode,
} from "react"

import { Cheez } from "../cheez"
import type {
  CheezCharacter,
  CheezDefinition,
} from "../cheez-core/cheez-definition"
import { CheezMark } from "../cheez-core/cheez-mark"
import { joinCheezClassNames } from "../cheez-ui/marked-label"
import type { CheezType } from "../mark-catalog"
import "../cheez-ui/cheez-ui.css"

export type MarkedBreadcrumbSize = "small" | "medium" | "large"
export type MarkedBreadcrumbSeparator = "chevron" | "slash" | "arrow" | "dot"
export type MarkedBreadcrumbTone =
  | "neutral"
  | "orange"
  | "purple"
  | "lime"
  | "pink"
  | "cyan"

export const MARKED_BREADCRUMB_COLORS: Record<MarkedBreadcrumbTone, string> = {
  neutral: "#625f59",
  orange: "#ff4f2e",
  purple: "#8f74ff",
  lime: "#b7ff3c",
  pink: "#ff5fa2",
  cyan: "#35d9ff",
}

const SEPARATOR_PATHS: Record<MarkedBreadcrumbSeparator, readonly string[]> = {
  chevron: ["M7 4 C9 7 12 9 16 12 C13 14 10 17 7 20"],
  slash: ["M15 3 C13 8 10 15 8 21"],
  arrow: ["M3 12 C8 11 14 13 20 12", "M15 7 C17 9 19 11 21 12 C18 14 16 16 14 18"],
  dot: ["M8 12 C8 8 16 8 16 12 C16 16 8 16 8 12"],
}

const CHARACTER_STYLE: Record<
  CheezCharacter,
  { duration: number; rotation: number; width: number }
> = {
  calm: { duration: 360, rotation: 0, width: 2 },
  rushed: { duration: 270, rotation: -2, width: 2.2 },
  chaotic: { duration: 220, rotation: 3, width: 2.45 },
}

function createSeparatorDefinition(
  separator: MarkedBreadcrumbSeparator,
  character: CheezCharacter,
): CheezDefinition {
  const appearance = CHARACTER_STYLE[character]

  return {
    name: `breadcrumb-${separator}-${character}`,
    viewBox: "0 0 24 24",
    placement: { top: "0", left: "0", width: "100%", height: "100%" },
    layer: "front",
    preserveAspectRatio: "xMidYMid meet",
    layers: SEPARATOR_PATHS[separator].map((path, index) => ({
      type: "stroke" as const,
      path,
      strokeWidth: appearance.width,
      transform: appearance.rotation
        ? `rotate(${appearance.rotation * (index % 2 === 0 ? 1 : -1)} 12 12)`
        : undefined,
      timing: {
        duration: appearance.duration,
        delay: index * Math.round(appearance.duration * 0.25),
      },
    })),
  }
}

const SEPARATOR_DEFINITIONS = Object.fromEntries(
  (Object.keys(SEPARATOR_PATHS) as MarkedBreadcrumbSeparator[]).map(
    (separator) => [
      separator,
      Object.fromEntries(
        (["calm", "rushed", "chaotic"] as const).map((character) => [
          character,
          createSeparatorDefinition(separator, character),
        ]),
      ) as Record<CheezCharacter, CheezDefinition>,
    ],
  ),
) as Record<
  MarkedBreadcrumbSeparator,
  Record<CheezCharacter, CheezDefinition>
>

interface BreadcrumbVisualContextValue {
  character: CheezCharacter
  color: string
  currentMark: CheezType
  hoverMark: CheezType
  separator: MarkedBreadcrumbSeparator
  thickness?: number
}

const BreadcrumbVisualContext = createContext<BreadcrumbVisualContextValue | null>(null)

function useBreadcrumbVisuals() {
  const context = useContext(BreadcrumbVisualContext)

  if (!context) {
    throw new Error("MarkedBreadcrumb parts must be used inside MarkedBreadcrumb")
  }

  return context
}

interface BreadcrumbStyle extends CSSProperties {
  "--cheez-breadcrumb-color": string
  "--cheez-breadcrumb-stroke": string
}

export interface MarkedBreadcrumbProps
  extends Omit<ComponentPropsWithoutRef<"nav">, "color"> {
  character?: CheezCharacter
  color?: string
  currentMark?: CheezType
  hoverMark?: CheezType
  label?: string
  separator?: MarkedBreadcrumbSeparator
  size?: MarkedBreadcrumbSize
  thickness?: number
  tone?: MarkedBreadcrumbTone
  wrap?: boolean
}

export const MarkedBreadcrumb = forwardRef<HTMLElement, MarkedBreadcrumbProps>(
  function MarkedBreadcrumb(
    {
      character = "rushed",
      children,
      className,
      color,
      currentMark = "underline",
      hoverMark = "short-underline",
      label = "breadcrumb",
      separator = "chevron",
      size = "medium",
      style,
      thickness,
      tone = "orange",
      wrap = false,
      ...props
    },
    ref,
  ) {
    const resolvedColor = color ?? MARKED_BREADCRUMB_COLORS[tone]
    const breadcrumbStyle: BreadcrumbStyle = {
      ...style,
      "--cheez-breadcrumb-color": resolvedColor,
      "--cheez-breadcrumb-stroke": `${2 * (thickness ?? 1)}px`,
    }
    const visuals: BreadcrumbVisualContextValue = {
      character,
      color: resolvedColor,
      currentMark,
      hoverMark,
      separator,
      thickness,
    }

    return (
      <BreadcrumbVisualContext.Provider value={visuals}>
        <nav
          {...props}
          ref={ref}
          aria-label={label}
          className={joinCheezClassNames("cheez-ui cheez-breadcrumb", className)}
          data-size={size}
          data-tone={tone}
          data-wrap={wrap ? "" : undefined}
          style={breadcrumbStyle}
        >
          {children}
        </nav>
      </BreadcrumbVisualContext.Provider>
    )
  },
)

export const MarkedBreadcrumbList = forwardRef<
  HTMLOListElement,
  ComponentPropsWithoutRef<"ol">
>(function MarkedBreadcrumbList({ className, ...props }, ref) {
  return (
    <ol
      {...props}
      ref={ref}
      className={joinCheezClassNames("cheez-breadcrumb__list", className)}
    />
  )
})

export const MarkedBreadcrumbItem = forwardRef<
  HTMLLIElement,
  ComponentPropsWithoutRef<"li">
>(function MarkedBreadcrumbItem({ className, ...props }, ref) {
  return (
    <li
      {...props}
      ref={ref}
      className={joinCheezClassNames("cheez-breadcrumb__item", className)}
    />
  )
})

interface BreadcrumbMarkOptions {
  character?: CheezCharacter
  mark?: CheezType
  markColor?: string
  thickness?: number
}

export interface MarkedBreadcrumbLinkProps
  extends Omit<ComponentPropsWithoutRef<"a">, "color">,
    BreadcrumbMarkOptions {}

export const MarkedBreadcrumbLink = forwardRef<
  HTMLAnchorElement,
  MarkedBreadcrumbLinkProps
>(function MarkedBreadcrumbLink(
  { character, children, className, mark, markColor, thickness, ...props },
  ref,
) {
  const visuals = useBreadcrumbVisuals()

  return (
    <a
      {...props}
      ref={ref}
      className={joinCheezClassNames("cheez-breadcrumb__link", className)}
    >
      <Cheez
        className="cheez-breadcrumb__link-mark"
        type={mark ?? visuals.hoverMark}
        character={character ?? visuals.character}
        color={markColor ?? visuals.color}
        thickness={thickness ?? visuals.thickness}
        trigger="hover"
      >
        <span className="cheez-breadcrumb__copy">{children}</span>
      </Cheez>
    </a>
  )
})

export interface MarkedBreadcrumbPageProps
  extends Omit<ComponentPropsWithoutRef<"span">, "color">,
    BreadcrumbMarkOptions {}

export const MarkedBreadcrumbPage = forwardRef<
  HTMLSpanElement,
  MarkedBreadcrumbPageProps
>(function MarkedBreadcrumbPage(
  { character, children, className, mark, markColor, thickness, ...props },
  ref,
) {
  const visuals = useBreadcrumbVisuals()

  return (
    <span
      {...props}
      ref={ref}
      aria-current="page"
      className={joinCheezClassNames("cheez-breadcrumb__page", className)}
    >
      <Cheez
        className="cheez-breadcrumb__page-mark"
        type={mark ?? visuals.currentMark}
        character={character ?? visuals.character}
        color={markColor ?? visuals.color}
        thickness={thickness ?? visuals.thickness}
        trigger="mount"
      >
        <span className="cheez-breadcrumb__copy">{children}</span>
      </Cheez>
    </span>
  )
})

export interface MarkedBreadcrumbSeparatorProps
  extends Omit<ComponentPropsWithoutRef<"li">, "color" | "children"> {
  character?: CheezCharacter
  color?: string
  separator?: MarkedBreadcrumbSeparator
  thickness?: number
}

export const MarkedBreadcrumbSeparatorMark = forwardRef<
  HTMLLIElement,
  MarkedBreadcrumbSeparatorProps
>(function MarkedBreadcrumbSeparatorMark(
  { character, className, color, separator, thickness, ...props },
  ref,
) {
  const visuals = useBreadcrumbVisuals()
  const resolvedCharacter = character ?? visuals.character
  const resolvedSeparator = separator ?? visuals.separator

  return (
    <li
      {...props}
      ref={ref}
      aria-hidden="true"
      className={joinCheezClassNames("cheez-breadcrumb__separator", className)}
      role="presentation"
    >
      <CheezMark
        className="cheez-breadcrumb__separator-mark"
        definition={SEPARATOR_DEFINITIONS[resolvedSeparator][resolvedCharacter]}
        color={color ?? visuals.color}
        thickness={thickness ?? visuals.thickness}
        trigger="mount"
        aria-hidden="true"
      >
        <span />
      </CheezMark>
    </li>
  )
})

export interface MarkedBreadcrumbEllipsisProps
  extends ComponentPropsWithoutRef<"button"> {
  expanded?: boolean
  label?: string
}

export const MarkedBreadcrumbEllipsis = forwardRef<
  HTMLButtonElement,
  MarkedBreadcrumbEllipsisProps
>(function MarkedBreadcrumbEllipsis(
  {
    className,
    expanded,
    label = expanded ? "hide intermediate pages" : "show intermediate pages",
    type = "button",
    ...props
  },
  ref,
) {
  const visuals = useBreadcrumbVisuals()

  return (
    <button
      {...props}
      ref={ref}
      type={type}
      aria-expanded={expanded}
      aria-label={label}
      className={joinCheezClassNames("cheez-breadcrumb__ellipsis", className)}
    >
      <Cheez
        className="cheez-breadcrumb__ellipsis-mark"
        type="loose-circle"
        character={visuals.character}
        color={visuals.color}
        thickness={visuals.thickness}
        trigger="hover"
      >
        <span aria-hidden="true">•••</span>
      </Cheez>
    </button>
  )
})
