"use client"

import { Menubar as BaseMenubar } from "@base-ui/react/menubar"
import { Menu } from "@base-ui/react/menu"
import {
  createContext,
  forwardRef,
  useContext,
  useState,
  type ComponentPropsWithoutRef,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from "react"
import type {
  MenuCheckboxItemProps,
  MenuGroupLabelProps,
  MenuGroupProps,
  MenuItemProps,
  MenuLinkItemProps,
  MenuPopupProps,
  MenuPositionerProps,
  MenuRadioItemProps,
  MenuSubmenuTriggerProps,
  MenuTriggerProps,
} from "@base-ui/react/menu"

import type { CheezCharacter } from "../cheez-core/cheez-definition"
import type { CheezType } from "../mark-catalog"
import {
  joinCheezClassNames,
  MarkedLabel,
} from "../cheez-ui/marked-label"
import "./marked-menubar.css"

export type MarkedMenubarSize = "small" | "medium" | "large"
export type MarkedMenubarTone =
  | "orange"
  | "purple"
  | "lime"
  | "pink"
  | "cyan"

const MENUBAR_COLORS: Record<MarkedMenubarTone, string> = {
  orange: "#ff4f2e",
  purple: "#8f74ff",
  lime: "#b7ff3c",
  pink: "#ff5fa2",
  cyan: "#35d9ff",
}

interface MenubarVisualContextValue {
  character: CheezCharacter
  color: string
  interactionColor: string
  size: MarkedMenubarSize
  thickness?: number
  tone: MarkedMenubarTone
}

const MenubarVisualContext = createContext<MenubarVisualContextValue>({
  character: "calm",
  color: MENUBAR_COLORS.orange,
  interactionColor: MENUBAR_COLORS.cyan,
  size: "medium",
  tone: "orange",
})

function useMenubarVisuals() {
  return useContext(MenubarVisualContext)
}

function getMenubarStyle(
  color: string,
  interactionColor: string,
  style?: CSSProperties,
) {
  return {
    "--cheez-menubar-color": color,
    "--cheez-menubar-interaction": interactionColor,
    ...style,
  } as CSSProperties
}

export interface MarkedMenubarProps
  extends Omit<
    ComponentPropsWithoutRef<typeof BaseMenubar>,
    "className" | "style"
  > {
  character?: CheezCharacter
  className?: string
  color?: string
  interactionColor?: string
  size?: MarkedMenubarSize
  style?: CSSProperties
  thickness?: number
  tone?: MarkedMenubarTone
}

export const MarkedMenubar = forwardRef<HTMLDivElement, MarkedMenubarProps>(
  function MarkedMenubar(
    {
      character = "calm",
      className,
      color,
      interactionColor = MENUBAR_COLORS.cyan,
      size = "medium",
      style,
      thickness,
      tone = "orange",
      ...props
    },
    ref,
  ) {
    const resolvedColor = color ?? MENUBAR_COLORS[tone]
    const visuals = {
      character,
      color: resolvedColor,
      interactionColor,
      size,
      thickness,
      tone,
    }

    return (
      <MenubarVisualContext.Provider value={visuals}>
        <BaseMenubar
          {...props}
          ref={ref}
          className={joinCheezClassNames(
            "cheez-menubar",
            className,
          )}
          data-size={size}
          data-tone={tone}
          style={getMenubarStyle(resolvedColor, interactionColor, style)}
        />
      </MenubarVisualContext.Provider>
    )
  },
)

export const MarkedMenubarMenu = Menu.Root

interface MenubarMarkProps {
  character?: CheezCharacter
  interactionColor?: string
  interactionMark?: CheezType
  mark?: CheezType
  markColor?: string
  marked?: boolean
  thickness?: number
}

export interface MarkedMenubarTriggerProps
  extends Omit<MenuTriggerProps, "children" | "className" | "render">,
    MenubarMarkProps {
  children: ReactNode
  className?: string
}

export const MarkedMenubarTrigger = forwardRef<
  HTMLButtonElement,
  MarkedMenubarTriggerProps
>(function MarkedMenubarTrigger(
  {
    character,
    children,
    className,
    disabled,
    interactionColor,
    interactionMark = "short-underline",
    mark = "loose-circle",
    markColor,
    marked,
    onBlur,
    onFocus,
    onPointerDown,
    onPointerEnter,
    onPointerLeave,
    thickness,
    ...props
  },
  ref,
) {
  const visuals = useMenubarVisuals()
  const [focused, setFocused] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [replayKey, setReplayKey] = useState(0)

  const replayMark = () => {
    if (!disabled) setReplayKey((key) => key + 1)
  }

  return (
    <Menu.Trigger
      {...props}
      ref={ref}
      className={joinCheezClassNames(
        "cheez-menubar__trigger",
        className,
      )}
      disabled={disabled}
      onBlur={(event) => {
        setFocused(false)
        onBlur?.(event)
      }}
      onFocus={(event) => {
        setFocused(true)
        replayMark()
        onFocus?.(event)
      }}
      onPointerDown={(event) => {
        replayMark()
        onPointerDown?.(event)
      }}
      onPointerEnter={(event) => {
        setHovered(true)
        replayMark()
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
              !state.disabled &&
              (marked ?? (state.open || focused || hovered))
            }
            animationKey={replayKey}
            character={character ?? visuals.character}
            color={
              state.open
                ? (markColor ?? visuals.color)
                : (interactionColor ?? visuals.interactionColor)
            }
            mark={state.open ? mark : interactionMark}
            thickness={thickness ?? visuals.thickness}
          >
            {children}
          </MarkedLabel>
        </button>
      )}
    />
  )
})

export interface MarkedMenubarContentProps
  extends Omit<MenuPopupProps, "className" | "style">,
    Pick<MenuPositionerProps, "align" | "side" | "sideOffset"> {
  className?: string
  positionerClassName?: string
  style?: CSSProperties
}

export const MarkedMenubarContent = forwardRef<
  HTMLDivElement,
  MarkedMenubarContentProps
>(function MarkedMenubarContent(
  {
    align = "start",
    className,
    positionerClassName,
    side = "bottom",
    sideOffset = 7,
    style,
    ...props
  },
  ref,
) {
  const visuals = useMenubarVisuals()

  return (
    <Menu.Portal>
      <Menu.Positioner
        align={align}
        side={side}
        sideOffset={sideOffset}
        className={joinCheezClassNames(
          "cheez-menubar__positioner",
          positionerClassName,
        )}
      >
        <Menu.Popup
          {...props}
          ref={ref}
          className={joinCheezClassNames(
            "cheez-menubar__popup",
            className,
          )}
          data-size={visuals.size}
          data-tone={visuals.tone}
          style={getMenubarStyle(
            visuals.color,
            visuals.interactionColor,
            style,
          )}
        />
      </Menu.Positioner>
    </Menu.Portal>
  )
})

interface MenuItemVisualProps extends MenubarMarkProps {
  children: ReactNode
  highlighted: boolean
  disabled: boolean
}

function MenuItemVisual({
  character,
  children,
  disabled,
  highlighted,
  interactionColor,
  interactionMark = "short-underline",
  mark = "circle",
  markColor,
  marked,
  thickness,
}: MenuItemVisualProps) {
  const visuals = useMenubarVisuals()

  return (
    <MarkedLabel
      active={!disabled && (marked ?? highlighted)}
      character={character ?? visuals.character}
      color={interactionColor ?? markColor ?? visuals.interactionColor}
      mark={interactionMark ?? mark}
      thickness={thickness ?? visuals.thickness}
    >
      {children}
    </MarkedLabel>
  )
}

interface MenubarItemMarkProps extends MenubarMarkProps {
  children: ReactNode
  className?: string
  tone?: "default" | "danger"
}

export interface MarkedMenubarItemProps
  extends Omit<MenuItemProps, "children" | "className" | "render">,
    MenubarItemMarkProps {}

export const MarkedMenubarItem = forwardRef<
  HTMLElement,
  MarkedMenubarItemProps
>(function MarkedMenubarItem(
  { children, className, tone = "default", ...props },
  ref,
) {
  return (
    <Menu.Item
      {...props}
      ref={ref}
      className={joinCheezClassNames("cheez-menubar__item", className)}
      data-tone={tone}
      render={(itemProps, state) => (
        <div {...itemProps}>
          <MenuItemVisual
            {...props}
            disabled={state.disabled}
            highlighted={state.highlighted}
          >
            {children}
          </MenuItemVisual>
        </div>
      )}
    />
  )
})

export interface MarkedMenubarLinkItemProps
  extends Omit<MenuLinkItemProps, "children" | "className" | "render">,
    MenubarItemMarkProps {}

export const MarkedMenubarLinkItem = forwardRef<
  Element,
  MarkedMenubarLinkItemProps
>(function MarkedMenubarLinkItem(
  { children, className, tone = "default", ...props },
  ref,
) {
  return (
    <Menu.LinkItem
      {...props}
      ref={ref}
      className={joinCheezClassNames("cheez-menubar__item", className)}
      data-tone={tone}
      render={(itemProps, state) => (
        <a {...itemProps}>
          <MenuItemVisual
            {...props}
            disabled={false}
            highlighted={state.highlighted}
          >
            {children}
          </MenuItemVisual>
        </a>
      )}
    />
  )
})

export interface MarkedMenubarCheckboxItemProps
  extends Omit<MenuCheckboxItemProps, "children" | "className" | "render">,
    MenubarItemMarkProps {}

export const MarkedMenubarCheckboxItem = forwardRef<
  HTMLElement,
  MarkedMenubarCheckboxItemProps
>(function MarkedMenubarCheckboxItem(
  {
    character,
    children,
    className,
    interactionColor,
    interactionMark = "short-underline",
    mark = "circle",
    markColor,
    marked,
    thickness,
    tone = "default",
    ...props
  },
  ref,
) {
  const visuals = useMenubarVisuals()

  return (
    <Menu.CheckboxItem
      {...props}
      ref={ref}
      className={joinCheezClassNames("cheez-menubar__item", className)}
      data-tone={tone}
      render={(itemProps, state) => (
        <div {...itemProps}>
          <MarkedLabel
            active={
              !state.disabled &&
              (marked ?? (state.checked || state.highlighted))
            }
            character={character ?? visuals.character}
            color={
              state.checked
                ? (markColor ?? visuals.color)
                : (interactionColor ?? visuals.interactionColor)
            }
            mark={state.checked ? mark : interactionMark}
            thickness={thickness ?? visuals.thickness}
          >
            {children}
          </MarkedLabel>
          <span className="cheez-menubar__check" aria-hidden="true">
            {state.checked ? "✓" : ""}
          </span>
        </div>
      )}
    />
  )
})

export const MarkedMenubarRadioGroup = Menu.RadioGroup

export interface MarkedMenubarRadioItemProps
  extends Omit<MenuRadioItemProps, "children" | "className" | "render">,
    MenubarItemMarkProps {}

export const MarkedMenubarRadioItem = forwardRef<
  HTMLElement,
  MarkedMenubarRadioItemProps
>(function MarkedMenubarRadioItem(
  {
    character,
    children,
    className,
    interactionColor,
    interactionMark = "short-underline",
    mark = "loose-circle",
    markColor,
    marked,
    thickness,
    tone = "default",
    ...props
  },
  ref,
) {
  const visuals = useMenubarVisuals()

  return (
    <Menu.RadioItem
      {...props}
      ref={ref}
      className={joinCheezClassNames("cheez-menubar__item", className)}
      data-tone={tone}
      render={(itemProps, state) => (
        <div {...itemProps}>
          <MarkedLabel
            active={
              !state.disabled &&
              (marked ?? (state.checked || state.highlighted))
            }
            character={character ?? visuals.character}
            color={
              state.checked
                ? (markColor ?? visuals.color)
                : (interactionColor ?? visuals.interactionColor)
            }
            mark={state.checked ? mark : interactionMark}
            thickness={thickness ?? visuals.thickness}
          >
            {children}
          </MarkedLabel>
          <span className="cheez-menubar__check" aria-hidden="true">
            {state.checked ? "●" : ""}
          </span>
        </div>
      )}
    />
  )
})

export const MarkedMenubarSubmenu = Menu.SubmenuRoot

export interface MarkedMenubarSubmenuTriggerProps
  extends Omit<
      MenuSubmenuTriggerProps,
      "children" | "className" | "render"
    >,
    MenubarItemMarkProps {}

export const MarkedMenubarSubmenuTrigger = forwardRef<
  HTMLElement,
  MarkedMenubarSubmenuTriggerProps
>(function MarkedMenubarSubmenuTrigger(
  {
    character,
    children,
    className,
    interactionColor,
    interactionMark = "short-underline",
    mark = "circle",
    markColor,
    marked,
    thickness,
    tone = "default",
    ...props
  },
  ref,
) {
  const visuals = useMenubarVisuals()

  return (
    <Menu.SubmenuTrigger
      {...props}
      ref={ref}
      className={joinCheezClassNames("cheez-menubar__item", className)}
      data-tone={tone}
      render={(itemProps, state) => (
        <div {...itemProps}>
          <MarkedLabel
            active={
              !state.disabled &&
              (marked ?? (state.open || state.highlighted))
            }
            character={character ?? visuals.character}
            color={
              state.open
                ? (markColor ?? visuals.color)
                : (interactionColor ?? visuals.interactionColor)
            }
            mark={state.open ? mark : interactionMark}
            thickness={thickness ?? visuals.thickness}
          >
            {children}
          </MarkedLabel>
          <span className="cheez-menubar__submenu-arrow" aria-hidden="true">
            <svg viewBox="0 0 10 12" focusable="false">
              <path d="m2 1.5 5 4.5-5 4.5" />
            </svg>
          </span>
        </div>
      )}
    />
  )
})

export const MarkedMenubarSubmenuContent = forwardRef<
  HTMLDivElement,
  MarkedMenubarContentProps
>(function MarkedMenubarSubmenuContent(props, ref) {
  return (
    <MarkedMenubarContent
      {...props}
      ref={ref}
      align={props.align ?? "start"}
      side={props.side ?? "right"}
      sideOffset={props.sideOffset ?? -3}
    />
  )
})

export interface MarkedMenubarGroupProps
  extends Omit<MenuGroupProps, "className"> {
  className?: string
}

export const MarkedMenubarGroup = forwardRef<
  HTMLDivElement,
  MarkedMenubarGroupProps
>(function MarkedMenubarGroup({ className, ...props }, ref) {
  return (
    <Menu.Group
      {...props}
      ref={ref}
      className={joinCheezClassNames("cheez-menubar__group", className)}
    />
  )
})

export interface MarkedMenubarLabelProps
  extends Omit<MenuGroupLabelProps, "className"> {
  className?: string
}

export const MarkedMenubarLabel = forwardRef<
  HTMLDivElement,
  MarkedMenubarLabelProps
>(function MarkedMenubarLabel({ className, ...props }, ref) {
  return (
    <Menu.GroupLabel
      {...props}
      ref={ref}
      className={joinCheezClassNames("cheez-menubar__label", className)}
    />
  )
})

type MarkedMenubarSeparatorProps = Omit<
  ComponentPropsWithoutRef<typeof Menu.Separator>,
  "className"
> & {
  className?: string
}

export function MarkedMenubarSeparator({
  className,
  ...props
}: MarkedMenubarSeparatorProps) {
  return (
    <Menu.Separator
      {...props}
      className={joinCheezClassNames(
        "cheez-menubar__separator",
        className,
      )}
    />
  )
}

export interface MarkedMenubarShortcutProps
  extends HTMLAttributes<HTMLSpanElement> {}

export function MarkedMenubarShortcut({
  className,
  ...props
}: MarkedMenubarShortcutProps) {
  return (
    <span
      {...props}
      className={joinCheezClassNames(
        "cheez-menubar__shortcut",
        className,
      )}
    />
  )
}
