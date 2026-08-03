"use client"

import { ContextMenu } from "@base-ui/react/context-menu"
import {
  createContext,
  forwardRef,
  useContext,
  type ComponentPropsWithoutRef,
  type CSSProperties,
  type ReactNode,
} from "react"
import type {
  ContextMenuCheckboxItemProps,
  ContextMenuGroupLabelProps,
  ContextMenuGroupProps,
  ContextMenuItemProps,
  ContextMenuPopupProps,
  ContextMenuPositionerProps,
  ContextMenuRadioItemProps,
  ContextMenuRootProps,
  ContextMenuSubmenuRootProps,
  ContextMenuSubmenuTriggerProps,
  ContextMenuTriggerProps,
} from "@base-ui/react/context-menu"

import { Cheez } from "../cheez"
import type { CheezCharacter } from "../cheez-core/cheez-definition"
import { joinCheezClassNames, MarkedLabel } from "../cheez-ui/marked-label"
import type { CheezType } from "../mark-catalog"
import "../cheez-ui/cheez-ui.css"
import "./marked-context-menu.css"

export type MarkedContextMenuTone = "orange" | "purple" | "lime" | "pink" | "cyan" | "neutral"

const TONE_COLORS: Record<MarkedContextMenuTone, string> = {
  orange: "#ff4f2e",
  purple: "#8f74ff",
  lime: "#b7ff3c",
  pink: "#ff5fa2",
  cyan: "#35d9ff",
  neutral: "#f4f0e6",
}

interface ContextMenuVisuals {
  character: CheezCharacter
  color: string
  dangerColor: string
  frameMark: CheezType
  highlightColor: string
  itemMark: CheezType
  selectedColor: string
  selectedMark: CheezType
  thickness?: number
}

const VisualContext = createContext<ContextMenuVisuals | null>(null)

function useVisuals() {
  const context = useContext(VisualContext)
  if (!context) throw new Error("MarkedContextMenu parts must be used inside MarkedContextMenu")
  return context
}

export interface MarkedContextMenuProps extends Omit<ContextMenuRootProps, "children"> {
  character?: CheezCharacter
  children: ReactNode
  color?: string
  dangerColor?: string
  frameMark?: CheezType
  highlightColor?: string
  itemMark?: CheezType
  selectedColor?: string
  selectedMark?: CheezType
  thickness?: number
  tone?: MarkedContextMenuTone
}

export function MarkedContextMenu({
  character = "rushed",
  children,
  color,
  dangerColor = "#ff5fa2",
  frameMark = "rounded-box",
  highlightColor = "#b7ff3c",
  itemMark = "short-underline",
  selectedColor = "#8f74ff",
  selectedMark = "check",
  thickness,
  tone = "orange",
  ...props
}: MarkedContextMenuProps) {
  const visuals: ContextMenuVisuals = {
    character,
    color: color ?? TONE_COLORS[tone],
    dangerColor,
    frameMark,
    highlightColor,
    itemMark,
    selectedColor,
    selectedMark,
    thickness,
  }

  return (
    <VisualContext.Provider value={visuals}>
      <ContextMenu.Root {...props}>{children}</ContextMenu.Root>
    </VisualContext.Provider>
  )
}

export interface MarkedContextMenuTriggerProps
  extends Omit<ContextMenuTriggerProps, "className"> {
  className?: string
}

export const MarkedContextMenuTrigger = forwardRef<HTMLDivElement, MarkedContextMenuTriggerProps>(
  function MarkedContextMenuTrigger({ className, ...props }, ref) {
    return (
      <ContextMenu.Trigger
        {...props}
        ref={ref}
        className={joinCheezClassNames("cheez-context-menu__trigger", className)}
      />
    )
  },
)

export interface MarkedContextMenuContentProps
  extends Omit<ContextMenuPopupProps, "className">,
    Pick<ContextMenuPositionerProps, "align" | "side" | "sideOffset"> {
  className?: string
  positionerClassName?: string
}

export const MarkedContextMenuContent = forwardRef<HTMLDivElement, MarkedContextMenuContentProps>(
  function MarkedContextMenuContent(
    { align = "start", className, positionerClassName, side = "right", sideOffset = 6, ...props },
    ref,
  ) {
    const visuals = useVisuals()

    return (
      <ContextMenu.Portal>
        <ContextMenu.Positioner
          align={align}
          side={side}
          sideOffset={sideOffset}
          className={joinCheezClassNames("cheez-context-menu__positioner", positionerClassName)}
        >
          <Cheez
            className="cheez-context-menu__frame"
            type={visuals.frameMark}
            character={visuals.character}
            color={visuals.color}
            thickness={visuals.thickness}
            trigger="mount"
          >
            <ContextMenu.Popup
              {...props}
              ref={ref}
              className={joinCheezClassNames("cheez-context-menu__popup", className)}
            />
          </Cheez>
        </ContextMenu.Positioner>
      </ContextMenu.Portal>
    )
  },
)

interface ItemVisualProps {
  children: ReactNode
  className?: string
  description?: ReactNode
  shortcut?: ReactNode
  tone?: "default" | "danger"
}

function ItemContent({ children, description, shortcut }: Pick<ItemVisualProps, "children" | "description" | "shortcut">) {
  return (
    <span className="cheez-context-menu__item-layout">
      <span className="cheez-context-menu__copy">
        <span>{children}</span>
        {description ? <small>{description}</small> : null}
      </span>
      {shortcut ? <kbd>{shortcut}</kbd> : null}
    </span>
  )
}

export interface MarkedContextMenuItemProps
  extends Omit<ContextMenuItemProps, "children" | "className" | "render">,
    ItemVisualProps {}

export const MarkedContextMenuItem = forwardRef<HTMLElement, MarkedContextMenuItemProps>(
  function MarkedContextMenuItem(
    { children, className, description, shortcut, tone = "default", ...props },
    ref,
  ) {
    const visuals = useVisuals()
    const color = tone === "danger" ? visuals.dangerColor : visuals.highlightColor

    return (
      <ContextMenu.Item
        {...props}
        ref={ref}
        className={joinCheezClassNames("cheez-context-menu__item", className)}
        data-tone={tone}
        render={(itemProps, state) => (
          <div {...itemProps}>
            <MarkedLabel
              active={!state.disabled && state.highlighted}
              character={visuals.character}
              color={color}
              mark={tone === "danger" ? "strike-through" : visuals.itemMark}
              thickness={visuals.thickness}
            >
              <ItemContent children={children} description={description} shortcut={shortcut} />
            </MarkedLabel>
          </div>
        )}
      />
    )
  },
)

export interface MarkedContextMenuCheckboxItemProps
  extends Omit<ContextMenuCheckboxItemProps, "children" | "className" | "render">,
    Omit<ItemVisualProps, "tone"> {}

export const MarkedContextMenuCheckboxItem = forwardRef<HTMLElement, MarkedContextMenuCheckboxItemProps>(
  function MarkedContextMenuCheckboxItem({ children, className, description, shortcut, ...props }, ref) {
    const visuals = useVisuals()

    return (
      <ContextMenu.CheckboxItem
        {...props}
        ref={ref}
        className={joinCheezClassNames("cheez-context-menu__item", className)}
        render={(itemProps, state) => (
          <div {...itemProps}>
            <Cheez
              className="cheez-context-menu__indicator"
              type={visuals.selectedMark}
              character={visuals.character}
              color={visuals.selectedColor}
              trigger={state.checked ? "mount" : "manual"}
            ><span aria-hidden="true" /></Cheez>
            <MarkedLabel
              active={!state.disabled && state.highlighted}
              character={visuals.character}
              color={visuals.highlightColor}
              mark={visuals.itemMark}
            >
              <ItemContent children={children} description={description} shortcut={shortcut} />
            </MarkedLabel>
          </div>
        )}
      />
    )
  },
)

export const MarkedContextMenuRadioGroup = ContextMenu.RadioGroup

export interface MarkedContextMenuRadioItemProps
  extends Omit<ContextMenuRadioItemProps, "children" | "className" | "render">,
    Omit<ItemVisualProps, "tone"> {}

export const MarkedContextMenuRadioItem = forwardRef<HTMLElement, MarkedContextMenuRadioItemProps>(
  function MarkedContextMenuRadioItem({ children, className, description, shortcut, ...props }, ref) {
    const visuals = useVisuals()

    return (
      <ContextMenu.RadioItem
        {...props}
        ref={ref}
        className={joinCheezClassNames("cheez-context-menu__item", className)}
        render={(itemProps, state) => (
          <div {...itemProps}>
            <Cheez
              className="cheez-context-menu__indicator"
              type={state.checked ? "circle" : "short-underline"}
              character={visuals.character}
              color={visuals.selectedColor}
              trigger={state.checked ? "mount" : "manual"}
            ><span aria-hidden="true" /></Cheez>
            <MarkedLabel
              active={!state.disabled && state.highlighted}
              character={visuals.character}
              color={visuals.highlightColor}
              mark={visuals.itemMark}
            >
              <ItemContent children={children} description={description} shortcut={shortcut} />
            </MarkedLabel>
          </div>
        )}
      />
    )
  },
)

export const MarkedContextMenuSub = (props: ContextMenuSubmenuRootProps) => <ContextMenu.SubmenuRoot {...props} />

export interface MarkedContextMenuSubTriggerProps
  extends Omit<ContextMenuSubmenuTriggerProps, "children" | "className" | "render"> {
  children: ReactNode
  className?: string
}

export const MarkedContextMenuSubTrigger = forwardRef<HTMLElement, MarkedContextMenuSubTriggerProps>(
  function MarkedContextMenuSubTrigger({ children, className, ...props }, ref) {
    const visuals = useVisuals()
    return (
      <ContextMenu.SubmenuTrigger
        {...props}
        ref={ref}
        className={joinCheezClassNames("cheez-context-menu__item cheez-context-menu__sub-trigger", className)}
        render={(triggerProps, state) => (
          <div {...triggerProps}>
            <MarkedLabel active={state.highlighted || state.open} character={visuals.character} color={visuals.highlightColor} mark={visuals.itemMark}>
              <span className="cheez-context-menu__item-layout"><span>{children}</span><span className="cheez-context-menu__arrow" aria-hidden="true">›</span></span>
            </MarkedLabel>
          </div>
        )}
      />
    )
  },
)

export interface MarkedContextMenuGroupProps extends Omit<ContextMenuGroupProps, "className"> { className?: string }
export interface MarkedContextMenuLabelProps extends Omit<ContextMenuGroupLabelProps, "className"> { className?: string }

export const MarkedContextMenuGroup = forwardRef<HTMLDivElement, MarkedContextMenuGroupProps>(
  function MarkedContextMenuGroup({ className, ...props }, ref) {
    return <ContextMenu.Group {...props} ref={ref} className={joinCheezClassNames("cheez-context-menu__group", className)} />
  },
)

export const MarkedContextMenuLabel = forwardRef<HTMLDivElement, MarkedContextMenuLabelProps>(
  function MarkedContextMenuLabel({ className, ...props }, ref) {
    return <ContextMenu.GroupLabel {...props} ref={ref} className={joinCheezClassNames("cheez-context-menu__label", className)} />
  },
)

export type MarkedContextMenuSeparatorProps = Omit<ComponentPropsWithoutRef<typeof ContextMenu.Separator>, "className"> & {
  className?: string
  color?: string
}

export function MarkedContextMenuSeparator({ className, color = "#ff4f2e", style, ...props }: MarkedContextMenuSeparatorProps) {
  return (
    <ContextMenu.Separator
      {...props}
      className={joinCheezClassNames("cheez-context-menu__separator", className)}
      style={{ ...style, "--cheez-context-menu-separator": color } as CSSProperties}
    />
  )
}
