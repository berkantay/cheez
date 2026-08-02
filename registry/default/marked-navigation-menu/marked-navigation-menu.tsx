"use client"

import { NavigationMenu } from "@base-ui/react/navigation-menu"
import {
  createContext,
  forwardRef,
  useContext,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react"
import type {
  NavigationMenuContentProps,
  NavigationMenuItemProps,
  NavigationMenuLinkProps,
  NavigationMenuListProps,
  NavigationMenuPositionerProps,
  NavigationMenuRootProps,
  NavigationMenuTriggerProps,
} from "@base-ui/react/navigation-menu"

import { Cheez } from "../cheez"
import type {
  CheezCharacter,
  CheezDefinition,
} from "../cheez-core/cheez-definition"
import { CheezMark } from "../cheez-core/cheez-mark"
import {
  joinCheezClassNames,
  MarkedLabel,
} from "../cheez-ui/marked-label"
import type { CheezType } from "../mark-catalog"
import "./marked-navigation-menu.css"

export type MarkedNavigationMenuSize = "small" | "medium" | "large"
export type MarkedNavigationMenuTone =
  | "neutral"
  | "orange"
  | "purple"
  | "lime"
  | "pink"
  | "cyan"
export type MarkedNavigationMenuLayout = "list" | "grid" | "featured"
export type MarkedNavigationMenuWidth = "small" | "medium" | "large"

export const MARKED_NAVIGATION_MENU_COLORS: Record<
  MarkedNavigationMenuTone,
  string
> = {
  neutral: "#625f59",
  orange: "#ff4f2e",
  purple: "#8f74ff",
  lime: "#b7ff3c",
  pink: "#ff5fa2",
  cyan: "#35d9ff",
}

interface NavigationMenuVisualContextValue {
  character: CheezCharacter
  color: string
  frameColor: string
  frameMark: CheezType
  hoverMark: CheezType
  size: MarkedNavigationMenuSize
  thickness?: number
  triggerMark: CheezType
}

const NavigationMenuVisualContext =
  createContext<NavigationMenuVisualContextValue | null>(null)

function useNavigationMenuVisuals() {
  const context = useContext(NavigationMenuVisualContext)

  if (!context) {
    throw new Error(
      "MarkedNavigationMenu parts must be used inside MarkedNavigationMenu",
    )
  }

  return context
}

interface NavigationMenuStyle extends CSSProperties {
  "--cheez-navigation-color": string
  "--cheez-navigation-frame": string
  "--cheez-navigation-stroke": string
}

export interface MarkedNavigationMenuProps<Value = unknown>
  extends Omit<NavigationMenuRootProps<Value>, "className"> {
  character?: CheezCharacter
  className?: string
  color?: string
  compact?: boolean
  frameColor?: string
  frameMark?: CheezType
  hoverMark?: CheezType
  size?: MarkedNavigationMenuSize
  thickness?: number
  tone?: MarkedNavigationMenuTone
  triggerMark?: CheezType
}

export const MarkedNavigationMenu = forwardRef<
  HTMLElement,
  MarkedNavigationMenuProps
>(function MarkedNavigationMenu(
  {
    character = "rushed",
    children,
    className,
    color,
    compact = false,
    frameColor,
    frameMark = "rounded-box",
    hoverMark = "short-underline",
    size = "medium",
    style,
    thickness,
    tone = "orange",
    triggerMark = "underline",
    ...props
  },
  ref,
) {
  const resolvedColor = color ?? MARKED_NAVIGATION_MENU_COLORS[tone]
  const resolvedFrameColor = frameColor ?? resolvedColor
  const rootStyle: NavigationMenuStyle = {
    ...style,
    "--cheez-navigation-color": resolvedColor,
    "--cheez-navigation-frame": resolvedFrameColor,
    "--cheez-navigation-stroke": `${2 * (thickness ?? 1)}px`,
  }
  const visuals: NavigationMenuVisualContextValue = {
    character,
    color: resolvedColor,
    frameColor: resolvedFrameColor,
    frameMark,
    hoverMark,
    size,
    thickness,
    triggerMark,
  }

  return (
    <NavigationMenuVisualContext.Provider value={visuals}>
      <NavigationMenu.Root
        {...props}
        ref={ref}
        className={joinCheezClassNames(
          "cheez-navigation-menu",
          className,
        )}
        data-compact={compact ? "" : undefined}
        data-size={size}
        data-tone={tone}
        style={rootStyle}
      >
        {children}
      </NavigationMenu.Root>
    </NavigationMenuVisualContext.Provider>
  )
})

export const MarkedNavigationMenuList = forwardRef<
  HTMLUListElement,
  Omit<NavigationMenuListProps, "className"> & { className?: string }
>(function MarkedNavigationMenuList({ className, ...props }, ref) {
  return (
    <NavigationMenu.List
      {...props}
      ref={ref}
      className={joinCheezClassNames(
        "cheez-navigation-menu__list",
        className,
      )}
    />
  )
})

export const MarkedNavigationMenuItem = forwardRef<
  HTMLLIElement,
  Omit<NavigationMenuItemProps, "className"> & { className?: string }
>(function MarkedNavigationMenuItem({ className, ...props }, ref) {
  return (
    <NavigationMenu.Item
      {...props}
      ref={ref}
      className={joinCheezClassNames(
        "cheez-navigation-menu__item",
        className,
      )}
    />
  )
})

const CARET_PATHS = {
  closed: "M3 5.5 C5 7 7 9 9 10.5 C11 8.5 13 7 15 5.5",
  open: "M3 10.5 C5 8.5 7 7 9 5.5 C11 7 13 9 15 10.5",
} as const

function createCaretDefinition(
  open: boolean,
  character: CheezCharacter,
): CheezDefinition {
  const duration = character === "calm" ? 320 : character === "rushed" ? 240 : 190
  const rotation = character === "chaotic" ? (open ? 4 : -4) : 0

  return {
    name: `navigation-caret-${open ? "open" : "closed"}-${character}`,
    viewBox: "0 0 18 16",
    placement: { top: "0", left: "0", width: "100%", height: "100%" },
    layer: "front",
    preserveAspectRatio: "xMidYMid meet",
    layers: [
      {
        type: "stroke",
        path: CARET_PATHS[open ? "open" : "closed"],
        strokeWidth: character === "chaotic" ? 2.4 : 2,
        transform: rotation ? `rotate(${rotation} 9 8)` : undefined,
        timing: { duration },
      },
    ],
  }
}

export interface MarkedNavigationMenuTriggerProps
  extends Omit<
    NavigationMenuTriggerProps,
    "children" | "className" | "render"
  > {
  children: ReactNode
  className?: string
  color?: string
  mark?: CheezType
  marked?: boolean
}

export const MarkedNavigationMenuTrigger = forwardRef<
  HTMLButtonElement,
  MarkedNavigationMenuTriggerProps
>(function MarkedNavigationMenuTrigger(
  {
    children,
    className,
    color,
    disabled,
    mark,
    marked,
    onBlur,
    onFocus,
    onPointerEnter,
    onPointerLeave,
    ...props
  },
  ref,
) {
  const visuals = useNavigationMenuVisuals()
  const [focused, setFocused] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [animationKey, setAnimationKey] = useState(0)

  const enter = () => {
    if (!disabled) setAnimationKey((key) => key + 1)
  }

  return (
    <NavigationMenu.Trigger
      {...props}
      ref={ref}
      className={joinCheezClassNames(
        "cheez-navigation-menu__trigger",
        className,
      )}
      disabled={disabled}
      onBlur={(event) => {
        setFocused(false)
        onBlur?.(event)
      }}
      onFocus={(event) => {
        setFocused(true)
        enter()
        onFocus?.(event)
      }}
      onPointerEnter={(event) => {
        setHovered(true)
        enter()
        onPointerEnter?.(event)
      }}
      onPointerLeave={(event) => {
        setHovered(false)
        onPointerLeave?.(event)
      }}
      render={(triggerProps, state) => (
        <button {...triggerProps}>
          <MarkedLabel
            active={
              !disabled &&
              (marked ?? (state.open || focused || hovered))
            }
            animationKey={animationKey}
            character={visuals.character}
            color={color ?? visuals.color}
            mark={mark ?? (state.open ? visuals.triggerMark : visuals.hoverMark)}
            thickness={visuals.thickness}
          >
            {children}
          </MarkedLabel>
          <NavigationMenu.Icon className="cheez-navigation-menu__icon">
            <CheezMark
              key={`${state.open}-${animationKey}`}
              definition={createCaretDefinition(
                state.open,
                visuals.character,
              )}
              color={color ?? visuals.color}
              thickness={visuals.thickness}
              trigger={state.open ? "mount" : "none"}
            >
              <span aria-hidden="true" />
            </CheezMark>
          </NavigationMenu.Icon>
        </button>
      )}
    />
  )
})

export interface MarkedNavigationMenuContentProps
  extends Omit<NavigationMenuContentProps, "className"> {
  className?: string
  layout?: MarkedNavigationMenuLayout
  width?: MarkedNavigationMenuWidth
}

export const MarkedNavigationMenuContent = forwardRef<
  HTMLDivElement,
  MarkedNavigationMenuContentProps
>(function MarkedNavigationMenuContent(
  { className, layout = "grid", width = "medium", ...props },
  ref,
) {
  return (
    <NavigationMenu.Content
      {...props}
      ref={ref}
      className={joinCheezClassNames(
        "cheez-navigation-menu__content",
        className,
      )}
      data-layout={layout}
      data-width={width}
    />
  )
})

export type MarkedNavigationMenuLinkVariant = "link" | "card" | "featured"

export interface MarkedNavigationMenuLinkProps
  extends Omit<
    NavigationMenuLinkProps,
    "children" | "className" | "render"
  > {
  children: ReactNode
  className?: string
  color?: string
  description?: ReactNode
  mark?: CheezType
  variant?: MarkedNavigationMenuLinkVariant
}

export const MarkedNavigationMenuLink = forwardRef<
  HTMLAnchorElement,
  MarkedNavigationMenuLinkProps
>(function MarkedNavigationMenuLink(
  {
    active = false,
    children,
    className,
    color,
    description,
    mark,
    variant = description ? "card" : "link",
    ...props
  },
  ref,
) {
  const visuals = useNavigationMenuVisuals()
  const [focused, setFocused] = useState(false)
  const [hovered, setHovered] = useState(false)

  return (
    <NavigationMenu.Link
      {...props}
      ref={ref}
      active={active}
      aria-current={active ? "page" : undefined}
      className={joinCheezClassNames(
        "cheez-navigation-menu__link",
        className,
      )}
      data-variant={variant}
      onBlur={(event) => {
        setFocused(false)
        props.onBlur?.(event)
      }}
      onFocus={(event) => {
        setFocused(true)
        props.onFocus?.(event)
      }}
      onPointerEnter={(event) => {
        setHovered(true)
        props.onPointerEnter?.(event)
      }}
      onPointerLeave={(event) => {
        setHovered(false)
        props.onPointerLeave?.(event)
      }}
      render={(linkProps, state) => (
        <a {...linkProps}>
          <MarkedLabel
            active={state.active || focused || hovered}
            character={visuals.character}
            color={color ?? visuals.color}
            mark={mark ?? (state.active ? visuals.triggerMark : visuals.hoverMark)}
            thickness={visuals.thickness}
          >
            {children}
          </MarkedLabel>
          {description ? (
            <span className="cheez-navigation-menu__description">
              {description}
            </span>
          ) : null}
        </a>
      )}
    />
  )
})

export interface MarkedNavigationMenuViewportProps
  extends Omit<NavigationMenuPositionerProps, "children" | "className"> {
  className?: string
  keepMounted?: boolean
  label?: string
  positionerClassName?: string
  showArrow?: boolean
}

export const MarkedNavigationMenuViewport = forwardRef<
  HTMLElement,
  MarkedNavigationMenuViewportProps
>(function MarkedNavigationMenuViewport(
  {
    align = "center",
    className,
    collisionAvoidance = { side: "none" },
    collisionPadding = 16,
    keepMounted,
    label = "navigation menu",
    positionerClassName,
    showArrow = true,
    side = "bottom",
    sideOffset = 12,
    ...props
  },
  ref,
) {
  const visuals = useNavigationMenuVisuals()

  return (
    <NavigationMenu.Portal keepMounted={keepMounted}>
      <NavigationMenu.Positioner
        {...props}
        align={align}
        className={joinCheezClassNames(
          "cheez-navigation-menu__positioner",
          positionerClassName,
        )}
        collisionAvoidance={collisionAvoidance}
        collisionPadding={collisionPadding}
        side={side}
        sideOffset={sideOffset}
      >
        <NavigationMenu.Popup
          ref={ref}
          aria-label={label}
          className={joinCheezClassNames(
            "cheez-navigation-menu__popup",
            className,
          )}
          data-size={visuals.size}
        >
          <Cheez
            className="cheez-navigation-menu__frame"
            type={visuals.frameMark}
            character={visuals.character}
            color={visuals.frameColor}
            thickness={visuals.thickness}
            trigger="mount"
          >
            <span aria-hidden="true" />
          </Cheez>
          {showArrow ? (
            <NavigationMenu.Arrow className="cheez-navigation-menu__arrow">
              <CheezMark
                className="cheez-navigation-menu__arrow-mark"
                definition={createCaretDefinition(false, visuals.character)}
                color={visuals.frameColor}
                thickness={visuals.thickness}
                trigger="mount"
              >
                <span aria-hidden="true" />
              </CheezMark>
            </NavigationMenu.Arrow>
          ) : null}
          <NavigationMenu.Viewport className="cheez-navigation-menu__viewport" />
        </NavigationMenu.Popup>
      </NavigationMenu.Positioner>
    </NavigationMenu.Portal>
  )
})
