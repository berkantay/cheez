"use client"

import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type CSSProperties,
  type ReactNode,
} from "react"

import type { CheezCharacter } from "../cheez-core/cheez-definition"
import { joinCheezClassNames } from "../cheez-ui/marked-label"
import {
  MarkedCombobox,
  MarkedComboboxClear,
  MarkedComboboxContent,
  MarkedComboboxEmpty,
  MarkedComboboxGroup,
  MarkedComboboxGroupLabel,
  MarkedComboboxInput,
  MarkedComboboxInputGroup,
  MarkedComboboxItem,
  MarkedComboboxList,
  type MarkedComboboxProps,
  type MarkedComboboxTone,
} from "../marked-combobox/marked-combobox"
import {
  MarkedDialog,
  MarkedDialogClose,
  MarkedDialogContent,
  MarkedDialogDescription,
  MarkedDialogTitle,
  MarkedDialogTrigger,
} from "../marked-dialog/marked-dialog"
import type { CheezType } from "../mark-catalog"
import "./marked-command.css"

export interface MarkedCommandProps<Value>
  extends Omit<MarkedComboboxProps<Value>, "label"> {
  label?: ReactNode
}

export function MarkedCommand<Value>({
  autoHighlight = true,
  character = "rushed",
  children,
  className,
  interactionMark = "rounded-box",
  label = "command menu",
  selectedMark = "check",
  tone = "purple",
  ...props
}: MarkedCommandProps<Value>) {
  return (
    <MarkedCombobox<Value>
      {...props}
      autoHighlight={autoHighlight}
      character={character}
      className={joinCheezClassNames("cheez-command", className)}
      interactionMark={interactionMark}
      label={label}
      selectedMark={selectedMark}
      tone={tone}
    >
      {children}
    </MarkedCombobox>
  )
}

export interface MarkedCommandInputProps
  extends Omit<ComponentPropsWithoutRef<typeof MarkedComboboxInput>, "children"> {
  clearLabel?: string
}

export const MarkedCommandInput = forwardRef<HTMLInputElement, MarkedCommandInputProps>(
  function MarkedCommandInput(
    { className, clearLabel = "clear command search", placeholder = "type a command…", ...props },
    ref,
  ) {
    return (
      <MarkedComboboxInputGroup className="cheez-command__input-group">
        <span className="cheez-command__search" aria-hidden="true">
          <svg viewBox="0 0 20 20">
            <circle cx="8.2" cy="8.2" r="5.2" />
            <path d="m12.2 12.2 4.4 4.4" />
          </svg>
        </span>
        <MarkedComboboxInput
          {...props}
          ref={ref}
          className={joinCheezClassNames("cheez-command__input", className)}
          placeholder={placeholder}
        />
        <MarkedComboboxClear className="cheez-command__clear" label={clearLabel} />
      </MarkedComboboxInputGroup>
    )
  },
)

export type MarkedCommandContentProps = ComponentPropsWithoutRef<
  typeof MarkedComboboxContent
>

export function MarkedCommandContent({ className, ...props }: MarkedCommandContentProps) {
  return (
    <MarkedComboboxContent
      {...props}
      className={joinCheezClassNames("cheez-command__content", className)}
    />
  )
}

export type MarkedCommandListProps = ComponentPropsWithoutRef<typeof MarkedComboboxList>

export const MarkedCommandList = forwardRef<HTMLDivElement, MarkedCommandListProps>(
  function MarkedCommandList({ className, ...props }, ref) {
    return (
      <MarkedComboboxList
        {...props}
        ref={ref}
        className={joinCheezClassNames(
          "cheez-command__list",
          typeof className === "string" ? className : undefined,
        )}
      />
    )
  },
)

export interface MarkedCommandItemProps
  extends Omit<ComponentPropsWithoutRef<typeof MarkedComboboxItem>, "children"> {
  children: ReactNode
  description?: ReactNode
  icon?: ReactNode
  shortcut?: ReactNode
}

export const MarkedCommandItem = forwardRef<HTMLDivElement, MarkedCommandItemProps>(
  function MarkedCommandItem(
    { children, className, description, icon, shortcut, ...props },
    ref,
  ) {
    return (
      <MarkedComboboxItem
        {...props}
        ref={ref}
        className={joinCheezClassNames("cheez-command__item", className)}
      >
        <span className="cheez-command__item-layout">
          {icon ? <span className="cheez-command__icon" aria-hidden="true">{icon}</span> : null}
          <span className="cheez-command__copy">
            <span>{children}</span>
            {description ? <small>{description}</small> : null}
          </span>
          {shortcut ? <kbd className="cheez-command__shortcut">{shortcut}</kbd> : null}
        </span>
      </MarkedComboboxItem>
    )
  },
)

export type MarkedCommandGroupProps = ComponentPropsWithoutRef<typeof MarkedComboboxGroup>
export type MarkedCommandGroupLabelProps = ComponentPropsWithoutRef<typeof MarkedComboboxGroupLabel>
export type MarkedCommandEmptyProps = ComponentPropsWithoutRef<typeof MarkedComboboxEmpty>

export const MarkedCommandGroup = MarkedComboboxGroup
export const MarkedCommandGroupLabel = MarkedComboboxGroupLabel
export const MarkedCommandEmpty = MarkedComboboxEmpty

export interface MarkedCommandSeparatorProps
  extends ComponentPropsWithoutRef<"div"> {
  color?: string
}

export const MarkedCommandSeparator = forwardRef<HTMLDivElement, MarkedCommandSeparatorProps>(
  function MarkedCommandSeparator({ className, color = "#ff4f2e", style, ...props }, ref) {
    return (
      <div
        {...props}
        ref={ref}
        className={joinCheezClassNames("cheez-command__separator", className)}
        role="separator"
        style={{ ...style, "--cheez-command-separator": color } as CSSProperties}
      />
    )
  },
)

export {
  MarkedDialog as MarkedCommandDialog,
  MarkedDialogClose as MarkedCommandDialogClose,
  MarkedDialogContent as MarkedCommandDialogContent,
  MarkedDialogDescription as MarkedCommandDialogDescription,
  MarkedDialogTitle as MarkedCommandDialogTitle,
  MarkedDialogTrigger as MarkedCommandDialogTrigger,
}

export type MarkedCommandCharacter = CheezCharacter
export type MarkedCommandMark = CheezType
export type MarkedCommandTone = MarkedComboboxTone
