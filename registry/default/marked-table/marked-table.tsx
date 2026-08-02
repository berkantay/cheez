"use client"

import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type CSSProperties,
} from "react"

import { Cheez } from "../cheez"
import type { CheezCharacter } from "../cheez-core/cheez-definition"
import { joinCheezClassNames } from "../cheez-ui/marked-label"
import type { CheezType } from "../mark-catalog"
import "../cheez-ui/cheez-ui.css"

export type MarkedTableVariant = "framed" | "ruled" | "quiet"
export type MarkedTableDensity = "compact" | "default" | "relaxed"
export type MarkedTableTone =
  | "neutral"
  | "orange"
  | "purple"
  | "lime"
  | "pink"
  | "cyan"
export type MarkedTableAlign = "start" | "center" | "end"
export type MarkedTableSortDirection = "none" | "ascending" | "descending"

export const MARKED_TABLE_COLORS: Record<MarkedTableTone, string> = {
  neutral: "#625f59",
  orange: "#ff4f2e",
  purple: "#8f74ff",
  lime: "#b7ff3c",
  pink: "#ff5fa2",
  cyan: "#35d9ff",
}

interface TableStyle extends CSSProperties {
  "--cheez-table-color": string
  "--cheez-table-stroke": string
}

interface TableRowStyle extends CSSProperties {
  "--cheez-table-row-color"?: string
}

export interface MarkedTableProps
  extends Omit<ComponentPropsWithoutRef<"table">, "color"> {
  character?: CheezCharacter
  color?: string
  containerClassName?: string
  density?: MarkedTableDensity
  frameMark?: CheezType
  stickyHeader?: boolean
  striped?: boolean
  thickness?: number
  tone?: MarkedTableTone
  variant?: MarkedTableVariant
}

export const MarkedTable = forwardRef<HTMLTableElement, MarkedTableProps>(
  function MarkedTable(
    {
      character = "rushed",
      children,
      className,
      color,
      containerClassName,
      density = "default",
      frameMark = "rounded-box",
      stickyHeader = false,
      striped = false,
      style,
      thickness,
      tone = "neutral",
      variant = "ruled",
      ...props
    },
    ref,
  ) {
    const resolvedColor = color ?? MARKED_TABLE_COLORS[tone]
    const tableStyle: TableStyle = {
      "--cheez-table-color": resolvedColor,
      "--cheez-table-stroke": `${2.2 * (thickness ?? 1)}px`,
    }

    return (
      <div
        className={joinCheezClassNames(
          "cheez-ui cheez-table-shell",
          containerClassName,
        )}
        data-density={density}
        data-sticky-header={stickyHeader ? "" : undefined}
        data-striped={striped ? "" : undefined}
        data-tone={tone}
        data-variant={variant}
        style={tableStyle}
      >
        {variant === "framed" ? (
          <Cheez
            className="cheez-table__frame"
            type={frameMark}
            character={character}
            color={resolvedColor}
            thickness={thickness}
            trigger="mount"
          >
            <span aria-hidden="true" />
          </Cheez>
        ) : null}

        <div className="cheez-table__scroll">
          <table
            {...props}
            ref={ref}
            className={joinCheezClassNames("cheez-table", className)}
            style={style}
          >
            {children}
          </table>
        </div>
      </div>
    )
  },
)

export const MarkedTableHeader = forwardRef<
  HTMLTableSectionElement,
  ComponentPropsWithoutRef<"thead">
>(function MarkedTableHeader({ className, ...props }, ref) {
  return (
    <thead
      {...props}
      ref={ref}
      className={joinCheezClassNames("cheez-table__header", className)}
    />
  )
})

export const MarkedTableBody = forwardRef<
  HTMLTableSectionElement,
  ComponentPropsWithoutRef<"tbody">
>(function MarkedTableBody({ className, ...props }, ref) {
  return (
    <tbody
      {...props}
      ref={ref}
      className={joinCheezClassNames("cheez-table__body", className)}
    />
  )
})

export const MarkedTableFooter = forwardRef<
  HTMLTableSectionElement,
  ComponentPropsWithoutRef<"tfoot">
>(function MarkedTableFooter({ className, ...props }, ref) {
  return (
    <tfoot
      {...props}
      ref={ref}
      className={joinCheezClassNames("cheez-table__footer", className)}
    />
  )
})

export interface MarkedTableRowProps
  extends Omit<ComponentPropsWithoutRef<"tr">, "color"> {
  color?: string
  interactive?: boolean
  muted?: boolean
  selected?: boolean
  tone?: MarkedTableTone
}

export const MarkedTableRow = forwardRef<
  HTMLTableRowElement,
  MarkedTableRowProps
>(function MarkedTableRow(
  {
    className,
    color,
    interactive = false,
    muted = false,
    selected = false,
    style,
    tone,
    ...props
  },
  ref,
) {
  const rowStyle: TableRowStyle = {
    ...style,
    "--cheez-table-row-color":
      color ?? (tone ? MARKED_TABLE_COLORS[tone] : undefined),
  }

  return (
    <tr
      {...props}
      ref={ref}
      className={joinCheezClassNames("cheez-table__row", className)}
      data-interactive={interactive ? "" : undefined}
      data-muted={muted ? "" : undefined}
      data-selected={selected ? "" : undefined}
      data-tone={tone}
      style={rowStyle}
    />
  )
})

export interface MarkedTableHeadProps
  extends Omit<ComponentPropsWithoutRef<"th">, "align"> {
  align?: MarkedTableAlign
  numeric?: boolean
  sort?: MarkedTableSortDirection
}

export const MarkedTableHead = forwardRef<
  HTMLTableCellElement,
  MarkedTableHeadProps
>(function MarkedTableHead(
  {
    align = "start",
    className,
    numeric = false,
    sort = "none",
    ...props
  },
  ref,
) {
  return (
    <th
      {...props}
      ref={ref}
      className={joinCheezClassNames("cheez-table__head", className)}
      aria-sort={sort === "none" ? undefined : sort}
      data-align={align}
      data-numeric={numeric ? "" : undefined}
    />
  )
})

export interface MarkedTableCellProps
  extends Omit<ComponentPropsWithoutRef<"td">, "align"> {
  align?: MarkedTableAlign
  character?: CheezCharacter
  mark?: CheezType
  markColor?: string
  marked?: boolean
  numeric?: boolean
  thickness?: number
  truncate?: boolean
}

export const MarkedTableCell = forwardRef<
  HTMLTableCellElement,
  MarkedTableCellProps
>(function MarkedTableCell(
  {
    align = "start",
    character = "rushed",
    children,
    className,
    mark = "underline",
    markColor = "var(--cheez-table-active-color)",
    marked = false,
    numeric = false,
    thickness,
    truncate = false,
    ...props
  },
  ref,
) {
  return (
    <td
      {...props}
      ref={ref}
      className={joinCheezClassNames("cheez-table__cell", className)}
      data-align={align}
      data-numeric={numeric ? "" : undefined}
      data-truncate={truncate ? "" : undefined}
    >
      {marked ? (
        <Cheez
          className="cheez-table__cell-mark"
          type={mark}
          character={character}
          color={markColor}
          fillColor={markColor}
          thickness={thickness}
          trigger="mount"
        >
          <span>{children}</span>
        </Cheez>
      ) : children}
    </td>
  )
})

export interface MarkedTableCaptionProps
  extends ComponentPropsWithoutRef<"caption"> {
  side?: "top" | "bottom"
}

export const MarkedTableCaption = forwardRef<
  HTMLTableCaptionElement,
  MarkedTableCaptionProps
>(function MarkedTableCaption(
  { className, side = "bottom", ...props },
  ref,
) {
  return (
    <caption
      {...props}
      ref={ref}
      className={joinCheezClassNames("cheez-table__caption", className)}
      data-side={side}
    />
  )
})

export interface MarkedTableSortButtonProps
  extends ComponentPropsWithoutRef<"button"> {
  character?: CheezCharacter
  color?: string
  direction?: MarkedTableSortDirection
  thickness?: number
}

export const MarkedTableSortButton = forwardRef<
  HTMLButtonElement,
  MarkedTableSortButtonProps
>(function MarkedTableSortButton(
  {
    character = "rushed",
    children,
    className,
    color = "#ff4f2e",
    direction = "none",
    thickness,
    type = "button",
    ...props
  },
  ref,
) {
  const ascending = direction === "ascending"

  return (
    <button
      {...props}
      ref={ref}
      type={type}
      className={joinCheezClassNames(
        "cheez-table__sort-button",
        className,
      )}
      data-direction={direction}
    >
      <span>{children}</span>
      <Cheez
        className="cheez-table__sort-mark"
        type={ascending ? "arrow-up" : "arrow-down"}
        character={character}
        color={direction === "none" ? "#625f59" : color}
        thickness={thickness}
        trigger="mount"
      >
        <span aria-hidden="true" />
      </Cheez>
    </button>
  )
})

export interface MarkedTableEmptyProps
  extends ComponentPropsWithoutRef<"td"> {
  colSpan: number
}

export const MarkedTableEmpty = forwardRef<
  HTMLTableCellElement,
  MarkedTableEmptyProps
>(function MarkedTableEmpty({ children, className, ...props }, ref) {
  return (
    <tr className="cheez-table__empty-row">
      <td
        {...props}
        ref={ref}
        className={joinCheezClassNames("cheez-table__empty", className)}
      >
        {children}
      </td>
    </tr>
  )
})
