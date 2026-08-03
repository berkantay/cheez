import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"

import { Highlight } from "@/registry/default/highlight/highlight"
import { MarkedButton } from "@/registry/default/marked-button/marked-button"
import { MarkedCheckbox } from "@/registry/default/marked-checkbox/marked-checkbox"
import { MarkedInput } from "@/registry/default/marked-input/marked-input"
import {
  MarkedRadio,
  MarkedRadioGroup,
} from "@/registry/default/marked-radio/marked-radio"
import { MarkedSwitch } from "@/registry/default/marked-switch/marked-switch"
import {
  MarkedSelect,
  MarkedSelectContent,
  MarkedSelectItem,
  MarkedSelectTrigger,
} from "@/registry/default/marked-select/marked-select"
import { MarkedSlider } from "@/registry/default/marked-slider/marked-slider"
import {
  MarkedDialog,
  MarkedDialogClose,
  MarkedDialogContent,
  MarkedDialogDescription,
  MarkedDialogTitle,
  MarkedDialogTrigger,
} from "@/registry/default/marked-dialog/marked-dialog"
import {
  MarkedTooltip,
  MarkedTooltipContent,
  MarkedTooltipProvider,
  MarkedTooltipTrigger,
} from "@/registry/default/marked-tooltip/marked-tooltip"
import {
  MarkedPopover,
  MarkedPopoverClose,
  MarkedPopoverContent,
  MarkedPopoverDescription,
  MarkedPopoverTitle,
  MarkedPopoverTrigger,
} from "@/registry/default/marked-popover/marked-popover"
import {
  MarkedAccordion,
  MarkedAccordionHeader,
  MarkedAccordionItem,
  MarkedAccordionPanel,
  MarkedAccordionTrigger,
} from "@/registry/default/marked-accordion/marked-accordion"
import {
  MARKED_TOAST_APPEARANCES,
  MarkedToastProvider,
  createMarkedToastManager,
  useMarkedToast,
} from "@/registry/default/marked-toast/marked-toast"
import {
  MarkedAlert,
  MarkedAlertActions,
  MarkedAlertClose,
  MarkedAlertDescription,
  MarkedAlertTitle,
} from "@/registry/default/marked-alert/marked-alert"
import { MarkedProgress } from "@/registry/default/marked-progress/marked-progress"
import { MarkedBadge } from "@/registry/default/marked-badge/marked-badge"
import {
  MarkedAvatar,
  MarkedAvatarGroup,
  getAvatarInitials,
} from "@/registry/default/marked-avatar/marked-avatar"
import {
  MarkedSkeleton,
  MarkedSkeletonGroup,
  MarkedSkeletonText,
} from "@/registry/default/marked-skeleton/marked-skeleton"
import { MarkedSeparator } from "@/registry/default/marked-separator/marked-separator"
import {
  MarkedCard,
  MarkedCardActions,
  MarkedCardContent,
  MarkedCardDescription,
  MarkedCardEyebrow,
  MarkedCardFooter,
  MarkedCardHeader,
  MarkedCardMedia,
  MarkedCardTitle,
} from "@/registry/default/marked-card/marked-card"
import {
  MarkedTable,
  MarkedTableBody,
  MarkedTableCaption,
  MarkedTableCell,
  MarkedTableEmpty,
  MarkedTableHead,
  MarkedTableHeader,
  MarkedTableRow,
  MarkedTableSortButton,
} from "@/registry/default/marked-table/marked-table"
import {
  getMarkedPaginationRange,
  MarkedPagination,
  MarkedPaginationButton,
  MarkedPaginationItem,
  MarkedPaginationLink,
  MarkedPaginationList,
  MarkedPaginationPrevious,
} from "@/registry/default/marked-pagination/marked-pagination"
import {
  MarkedBreadcrumb,
  MarkedBreadcrumbEllipsis,
  MarkedBreadcrumbItem,
  MarkedBreadcrumbLink,
  MarkedBreadcrumbList,
  MarkedBreadcrumbPage,
  MarkedBreadcrumbSeparatorMark,
} from "@/registry/default/marked-breadcrumb/marked-breadcrumb"
import {
  MarkedNavigationMenu,
  MarkedNavigationMenuItem,
  MarkedNavigationMenuLink,
  MarkedNavigationMenuList,
} from "@/registry/default/marked-navigation-menu/marked-navigation-menu"
import {
  MarkedMenubar,
  MarkedMenubarMenu,
  MarkedMenubarTrigger,
} from "@/registry/default/marked-menubar/marked-menubar"
import {
  MarkedContextMenu,
  MarkedContextMenuGroup,
  MarkedContextMenuItem,
  MarkedContextMenuLabel,
  MarkedContextMenuSeparator,
  MarkedContextMenuTrigger,
} from "@/registry/default/marked-context-menu/marked-context-menu"
import {
  MarkedHoverCard,
  MarkedHoverCardTrigger,
} from "@/registry/default/marked-hover-card/marked-hover-card"
import {
  MarkedToolbar,
  MarkedToolbarButton,
  MarkedToolbarGroup,
  MarkedToolbarLink,
  MarkedToolbarSeparator,
} from "@/registry/default/marked-toolbar/marked-toolbar"
import {
  MarkedCombobox,
  MarkedComboboxInput,
  MarkedComboboxInputGroup,
  MarkedComboboxTrigger,
} from "@/registry/default/marked-combobox/marked-combobox"
import {
  MarkedCommand,
  MarkedCommandInput,
  MarkedCommandSeparator,
} from "@/registry/default/marked-command/marked-command"
import { MarkedTextarea } from "@/registry/default/marked-textarea/marked-textarea"
import {
  MarkedDropdown,
  MarkedDropdownCheckboxItem,
  MarkedDropdownRadioGroup,
  MarkedDropdownRadioItem,
  MarkedDropdownTrigger,
} from "@/registry/default/marked-dropdown/marked-dropdown"
import {
  MarkedTabs,
  MarkedTabsList,
  MarkedTabsPanel,
  MarkedTabsTrigger,
} from "@/registry/default/marked-tabs/marked-tabs"
import { Underline } from "@/registry/default/underline/underline"

describe("Cheez rendering", () => {
  it("renders an accessible decorative SVG without changing its text", () => {
    const markup = renderToStaticMarkup(
      <Underline trigger="none">important detail</Underline>,
    )

    expect(markup).toContain("important detail")
    expect(markup).toContain('aria-hidden="true"')
    expect(markup).toContain('focusable="false"')
    expect(markup).toContain("data-cheez-animate")
    expect(markup).toContain("opacity:1")
  })

  it("creates a unique mask for filled marks", () => {
    const markup = renderToStaticMarkup(
      <>
        <Highlight trigger="none">one</Highlight>
        <Highlight trigger="none">two</Highlight>
      </>,
    )
    const maskIds = Array.from(markup.matchAll(/<mask id="([^"]+)"/g)).map(
      (match) => match[1],
    )

    expect(maskIds).toHaveLength(2)
    expect(new Set(maskIds).size).toBe(2)
  })

  it("keeps the marked button native and keyboard accessible", () => {
    const markup = renderToStaticMarkup(
      <MarkedButton type="submit">save changes</MarkedButton>,
    )

    expect(markup).toContain('<button type="submit"')
    expect(markup).toContain("save changes")
    expect(markup).toContain('aria-hidden="true"')
    expect(markup).toContain('data-active="true"')
    expect(markup).toContain("cheez-button__mark")
  })

  it("exposes loading through native button semantics", () => {
    const markup = renderToStaticMarkup(
      <MarkedButton loading loadingLabel="saving">
        save changes
      </MarkedButton>,
    )

    expect(markup).toContain('aria-busy="true"')
    expect(markup).toContain("disabled")
    expect(markup).toContain("saving")
    expect(markup).not.toContain(">save changes<")
  })

  it("draws the solid button fill as part of its SVG frame", () => {
    const markup = renderToStaticMarkup(
      <MarkedButton variant="solid" fillColor="#f4f0e6">
        save changes
      </MarkedButton>,
    )

    expect(markup).toContain('fill="#f4f0e6"')
    expect(markup.match(/data-cheez-animate/g)).toHaveLength(2)
  })

  it("keeps the quiet variant unmarked until interaction", () => {
    const markup = renderToStaticMarkup(
      <MarkedButton variant="quiet">save changes</MarkedButton>,
    )

    expect(markup).toContain('data-variant="quiet"')
    expect(markup).not.toContain('data-active="true"')
    expect(markup).toContain("opacity:0")
  })

  it("renders tab and dropdown semantics through Base UI", () => {
    const tabsMarkup = renderToStaticMarkup(
      <MarkedTabs defaultValue="one">
        <MarkedTabsList>
          <MarkedTabsTrigger value="one">one</MarkedTabsTrigger>
          <MarkedTabsTrigger value="two">two</MarkedTabsTrigger>
        </MarkedTabsList>
        <MarkedTabsPanel value="one">first panel</MarkedTabsPanel>
        <MarkedTabsPanel value="two">second panel</MarkedTabsPanel>
      </MarkedTabs>,
    )
    const dropdownMarkup = renderToStaticMarkup(
      <MarkedDropdown>
        <MarkedDropdownTrigger>actions</MarkedDropdownTrigger>
      </MarkedDropdown>,
    )

    expect(tabsMarkup).toContain('role="tablist"')
    expect(tabsMarkup).toContain('role="tab"')
    expect(tabsMarkup).toContain('role="tabpanel"')
    expect(dropdownMarkup).toContain('aria-haspopup="menu"')
  })

  it("keeps the context-menu trigger native and its structure explicit", () => {
    const markup = renderToStaticMarkup(
      <MarkedContextMenu>
        <MarkedContextMenuTrigger>right click this area</MarkedContextMenuTrigger>
        <MarkedContextMenuGroup>
          <MarkedContextMenuLabel>actions</MarkedContextMenuLabel>
          <MarkedContextMenuItem>duplicate</MarkedContextMenuItem>
          <MarkedContextMenuSeparator color="#35d9ff" />
        </MarkedContextMenuGroup>
      </MarkedContextMenu>,
    )

    expect(markup).toContain("right click this area")
    expect(markup).toContain("cheez-context-menu__trigger")
    expect(markup).toContain("cheez-context-menu__group")
    expect(markup).toContain("cheez-context-menu__label")
    expect(markup).toContain("cheez-context-menu__separator")
  })

  it("keeps hover-card previews attached to native links", () => {
    const markup = renderToStaticMarkup(
      <MarkedHoverCard>
        <MarkedHoverCardTrigger href="/people/ada">ada</MarkedHoverCardTrigger>
      </MarkedHoverCard>,
    )

    expect(markup).toContain('href="/people/ada"')
    expect(markup).toContain("cheez-hover-card__trigger")
    expect(markup).toContain("ada")
  })

  it("renders toolbar controls with native semantics and pressed state", () => {
    const markup = renderToStaticMarkup(
      <MarkedToolbar aria-label="formatting">
        <MarkedToolbarGroup>
          <MarkedToolbarButton pressed>bold</MarkedToolbarButton>
          <MarkedToolbarButton disabled>crop</MarkedToolbarButton>
        </MarkedToolbarGroup>
        <MarkedToolbarSeparator />
        <MarkedToolbarLink href="/help">help</MarkedToolbarLink>
      </MarkedToolbar>,
    )

    expect(markup).toContain('role="toolbar"')
    expect(markup).toContain('aria-label="formatting"')
    expect(markup).toContain('aria-pressed="true"')
    expect(markup).toContain('href="/help"')
    expect(markup).toContain("cheez-toolbar__separator")
  })

  it("separates active, inactive, and disabled tab states", () => {
    const activeMarkup = renderToStaticMarkup(
      <MarkedTabs defaultValue="active">
        <MarkedTabsList>
          <MarkedTabsTrigger value="active">active</MarkedTabsTrigger>
          <MarkedTabsTrigger value="inactive">inactive</MarkedTabsTrigger>
          <MarkedTabsTrigger value="disabled" disabled>
            disabled
          </MarkedTabsTrigger>
        </MarkedTabsList>
      </MarkedTabs>,
    )

    expect(activeMarkup).toContain("data-active")
    expect(activeMarkup).toContain("data-disabled")
    expect(activeMarkup).toContain('aria-selected="true"')
    expect(activeMarkup).toContain('aria-selected="false"')
  })

  it("keeps dropdown triggers native and supports disabled state", () => {
    const closedMarkup = renderToStaticMarkup(
      <MarkedDropdown open={false}>
        <MarkedDropdownTrigger>options</MarkedDropdownTrigger>
      </MarkedDropdown>,
    )
    const disabledMarkup = renderToStaticMarkup(
      <MarkedDropdown disabled>
        <MarkedDropdownTrigger disabled>options</MarkedDropdownTrigger>
      </MarkedDropdown>,
    )

    expect(closedMarkup).not.toContain('aria-expanded="true"')
    expect(closedMarkup).toContain("opacity:0")
    expect(closedMarkup).toContain('aria-haspopup="menu"')
    expect(disabledMarkup).toContain("disabled")
    expect(disabledMarkup).not.toContain('data-active="true"')
  })

  it("exports checkbox and radio dropdown selection primitives", () => {
    expect(MarkedDropdownCheckboxItem).toBeDefined()
    expect(MarkedDropdownRadioGroup).toBeDefined()
    expect(MarkedDropdownRadioItem).toBeDefined()
  })

  it("keeps marked input native and connects its accessible text", () => {
    const markup = renderToStaticMarkup(
      <MarkedInput
        id="email"
        label="email"
        description="used for replies"
        name="email"
        type="email"
      />,
    )

    expect(markup).toContain('<label class="cheez-input__label" for="email"')
    expect(markup).toContain("<input")
    expect(markup).toContain('type="email"')
    expect(markup).toContain('name="email"')
    expect(markup).toContain('aria-describedby="email-description"')
    expect(markup).toContain('id="email-description"')
  })

  it("exposes invalid input state without marking disabled fields", () => {
    const invalidMarkup = renderToStaticMarkup(
      <MarkedInput id="email" label="email" error="enter a valid email" />,
    )
    const disabledMarkup = renderToStaticMarkup(
      <MarkedInput label="email" error="enter a valid email" disabled />,
    )

    expect(invalidMarkup).toContain('aria-invalid="true"')
    expect(invalidMarkup).toContain('aria-describedby="email-error"')
    expect(invalidMarkup).toContain('role="alert"')
    expect(invalidMarkup).toContain('data-invalid=""')
    expect(disabledMarkup).toContain("disabled")
    expect(disabledMarkup).toContain("opacity:0")
  })

  it("adds an accessible reveal control only to revealable passwords", () => {
    const passwordMarkup = renderToStaticMarkup(
      <MarkedInput
        label="password"
        type="password"
        revealable
        autoComplete="current-password"
      />,
    )
    const emailMarkup = renderToStaticMarkup(
      <MarkedInput label="email" type="email" revealable />,
    )

    expect(passwordMarkup).toContain('type="password"')
    expect(passwordMarkup).toContain('aria-label="show password"')
    expect(passwordMarkup).toContain('aria-pressed="false"')
    expect(passwordMarkup).toContain('autoComplete="current-password"')
    expect(emailMarkup).not.toContain("cheez-input__password-toggle")
  })

  it("keeps marked textarea native and connects its accessible text", () => {
    const markup = renderToStaticMarkup(
      <MarkedTextarea
        id="message"
        label="message"
        description="up to 280 characters"
        maxLength={280}
        name="message"
      />,
    )

    expect(markup).toContain('<label class="cheez-textarea__label" for="message"')
    expect(markup).toContain("<textarea")
    expect(markup).toContain('name="message"')
    expect(markup).toContain('maxLength="280"')
    expect(markup).toContain('aria-describedby="message-description"')
    expect(markup).toContain("0 / 280")
  })

  it("exposes invalid and disabled textarea states", () => {
    const invalidMarkup = renderToStaticMarkup(
      <MarkedTextarea id="message" label="message" error="write more" />,
    )
    const disabledMarkup = renderToStaticMarkup(
      <MarkedTextarea label="message" error="write more" disabled />,
    )

    expect(invalidMarkup).toContain('aria-invalid="true"')
    expect(invalidMarkup).toContain('role="alert"')
    expect(disabledMarkup).toContain("disabled")
    expect(disabledMarkup).toContain("opacity:0")
  })

  it("renders checked, unchecked, and mixed checkbox semantics", () => {
    const uncheckedMarkup = renderToStaticMarkup(
      <MarkedCheckbox name="choice" value="yes">choose this</MarkedCheckbox>,
    )
    const checkedMarkup = renderToStaticMarkup(
      <MarkedCheckbox defaultChecked>choose this</MarkedCheckbox>,
    )
    const mixedMarkup = renderToStaticMarkup(
      <MarkedCheckbox indeterminate>choose some</MarkedCheckbox>,
    )

    expect(uncheckedMarkup).toContain('role="checkbox"')
    expect(uncheckedMarkup).toContain('aria-checked="false"')
    expect(uncheckedMarkup).toContain('type="checkbox"')
    expect(uncheckedMarkup).toContain('name="choice"')
    expect(checkedMarkup).toContain('aria-checked="true"')
    expect(checkedMarkup).toContain('data-cheez-state="checked"')
    expect(mixedMarkup).toContain('aria-checked="mixed"')
    expect(mixedMarkup).toContain('data-cheez-state="indeterminate"')
  })

  it("connects checkbox descriptions and invalid feedback", () => {
    const describedMarkup = renderToStaticMarkup(
      <MarkedCheckbox id="terms" description="read carefully">terms</MarkedCheckbox>,
    )
    const invalidMarkup = renderToStaticMarkup(
      <MarkedCheckbox id="terms" error="required">terms</MarkedCheckbox>,
    )

    expect(describedMarkup).toContain('aria-describedby="terms-description"')
    expect(describedMarkup).toContain('id="terms-description"')
    expect(invalidMarkup).toContain('aria-invalid="true"')
    expect(invalidMarkup).toContain('role="alert"')
  })

  it("renders native radio-group selection semantics", () => {
    const markup = renderToStaticMarkup(
      <MarkedRadioGroup label="drawing rhythm" name="rhythm" defaultValue="rushed">
        <MarkedRadio value="calm">calm</MarkedRadio>
        <MarkedRadio value="rushed">rushed</MarkedRadio>
      </MarkedRadioGroup>,
    )

    expect(markup).toContain('role="radiogroup"')
    expect(markup).toContain('aria-checked="false"')
    expect(markup).toContain('aria-checked="true"')
    expect(markup).toContain('name="rhythm"')
    expect(markup).toContain('data-cheez-state="selected"')
  })

  it("connects radio group descriptions and invalid feedback", () => {
    const describedMarkup = renderToStaticMarkup(
      <MarkedRadioGroup label="choice" description="pick one">
        <MarkedRadio value="one">one</MarkedRadio>
      </MarkedRadioGroup>,
    )
    const invalidMarkup = renderToStaticMarkup(
      <MarkedRadioGroup label="choice" error="pick one">
        <MarkedRadio value="one">one</MarkedRadio>
      </MarkedRadioGroup>,
    )

    expect(describedMarkup).toContain("-description")
    expect(invalidMarkup).toContain('aria-invalid="true"')
    expect(invalidMarkup).toContain('role="alert"')
  })

  it("renders switch states with native form semantics", () => {
    const offMarkup = renderToStaticMarkup(
      <MarkedSwitch name="motion" value="enabled">motion</MarkedSwitch>,
    )
    const onMarkup = renderToStaticMarkup(
      <MarkedSwitch defaultChecked>motion</MarkedSwitch>,
    )

    expect(offMarkup).toContain('role="switch"')
    expect(offMarkup).toContain('aria-checked="false"')
    expect(offMarkup).toContain('name="motion"')
    expect(onMarkup).toContain('aria-checked="true"')
    expect(onMarkup).toContain('data-cheez-state="on"')
  })

  it("connects switch descriptions and invalid feedback", () => {
    const describedMarkup = renderToStaticMarkup(
      <MarkedSwitch id="motion" description="draw it">motion</MarkedSwitch>,
    )
    const invalidMarkup = renderToStaticMarkup(
      <MarkedSwitch id="motion" error="turn it on">motion</MarkedSwitch>,
    )

    expect(describedMarkup).toContain('aria-describedby="motion-description"')
    expect(invalidMarkup).toContain('aria-invalid="true"')
    expect(invalidMarkup).toContain('role="alert"')
  })

  it("renders an accessible select trigger and form field", () => {
    const items = [
      { value: "calm", label: "Calm" },
      { value: "rushed", label: "Rushed" },
    ]
    const markup = renderToStaticMarkup(
      <MarkedSelect label="character" items={items} name="character" defaultValue="rushed">
        <MarkedSelectTrigger placeholder="choose" />
        <MarkedSelectContent>
          <MarkedSelectItem value="calm">Calm</MarkedSelectItem>
          <MarkedSelectItem value="rushed">Rushed</MarkedSelectItem>
        </MarkedSelectContent>
      </MarkedSelect>,
    )

    expect(markup).toContain('role="combobox"')
    expect(markup).toContain('aria-expanded="false"')
    expect(markup).toContain('name="character"')
    expect(markup).toContain("Rushed")
  })

  it("connects select descriptions and invalid feedback", () => {
    const describedMarkup = renderToStaticMarkup(
      <MarkedSelect label="theme" description="pick one">
        <MarkedSelectTrigger />
      </MarkedSelect>,
    )
    const invalidMarkup = renderToStaticMarkup(
      <MarkedSelect label="theme" error="pick one">
        <MarkedSelectTrigger />
      </MarkedSelect>,
    )

    expect(describedMarkup).toContain('aria-describedby="cheez-select-')
    expect(invalidMarkup).toContain('aria-invalid="true"')
    expect(invalidMarkup).toContain('role="alert"')
  })

  it("renders single and range slider semantics", () => {
    const singleMarkup = renderToStaticMarkup(
      <MarkedSlider label="weight" name="weight" defaultValue={35} />,
    )
    const rangeMarkup = renderToStaticMarkup(
      <MarkedSlider
        label="window"
        defaultValue={[20, 80]}
        thumbLabels={["minimum", "maximum"]}
      />,
    )

    expect(singleMarkup).toContain('type="range"')
    expect(singleMarkup).toContain('name="weight"')
    expect(singleMarkup).toContain('aria-label="slider"')
    expect(rangeMarkup.match(/type="range"/g)).toHaveLength(2)
    expect(rangeMarkup).toContain('aria-label="minimum"')
    expect(rangeMarkup).toContain('aria-label="maximum"')
  })

  it("connects slider descriptions and invalid feedback", () => {
    const describedMarkup = renderToStaticMarkup(
      <MarkedSlider label="weight" description="pick a value" />,
    )
    const invalidMarkup = renderToStaticMarkup(
      <MarkedSlider label="weight" error="too low" />,
    )

    expect(describedMarkup).toContain('aria-describedby="cheez-slider-')
    expect(invalidMarkup).toContain('aria-invalid="true"')
    expect(invalidMarkup).toContain('role="alert"')
  })

  it("renders a native accessible dialog trigger while closed", () => {
    const markup = renderToStaticMarkup(
      <MarkedDialog>
        <MarkedDialogTrigger>open note</MarkedDialogTrigger>
        <MarkedDialogContent>
          <MarkedDialogTitle>one more thing</MarkedDialogTitle>
          <MarkedDialogDescription>read this first</MarkedDialogDescription>
          <MarkedDialogClose>done</MarkedDialogClose>
        </MarkedDialogContent>
      </MarkedDialog>,
    )

    expect(markup).toContain('<button')
    expect(markup).toContain('aria-haspopup="dialog"')
    expect(markup).toContain('aria-expanded="false"')
    expect(markup).toContain("open note")
    expect(markup).not.toContain("one more thing")
  })

  it("supports disabled dialog triggers and exports compound parts", () => {
    const markup = renderToStaticMarkup(
      <MarkedDialog>
        <MarkedDialogTrigger disabled>open note</MarkedDialogTrigger>
      </MarkedDialog>,
    )

    expect(markup).toContain("disabled")
    expect(MarkedDialogContent).toBeDefined()
    expect(MarkedDialogTitle).toBeDefined()
    expect(MarkedDialogDescription).toBeDefined()
    expect(MarkedDialogClose).toBeDefined()
  })

  it("renders a native tooltip trigger without mounting closed content", () => {
    const markup = renderToStaticMarkup(
      <MarkedTooltip>
        <MarkedTooltipTrigger aria-label="explain this">
          help
        </MarkedTooltipTrigger>
        <MarkedTooltipContent>a short explanation</MarkedTooltipContent>
      </MarkedTooltip>,
    )

    expect(markup).toContain("<button")
    expect(markup).toContain('aria-label="explain this"')
    expect(markup).toContain("help")
    expect(markup).not.toContain("a short explanation")
  })

  it("supports native disabled tooltip triggers and grouped timing", () => {
    const markup = renderToStaticMarkup(
      <MarkedTooltipProvider delay={200}>
        <MarkedTooltip disabled>
          <MarkedTooltipTrigger nativeDisabled>
            unavailable
          </MarkedTooltipTrigger>
        </MarkedTooltip>
      </MarkedTooltipProvider>,
    )

    expect(markup).toContain("disabled")
    expect(markup).toContain("data-trigger-disabled")
    expect(MarkedTooltipContent).toBeDefined()
    expect(MarkedTooltipProvider).toBeDefined()
  })

  it("renders a native popover trigger while keeping closed content unmounted", () => {
    const markup = renderToStaticMarkup(
      <MarkedPopover>
        <MarkedPopoverTrigger>add note</MarkedPopoverTrigger>
        <MarkedPopoverContent>
          <MarkedPopoverTitle>leave a note</MarkedPopoverTitle>
          <MarkedPopoverDescription>write context</MarkedPopoverDescription>
          <MarkedPopoverClose>done</MarkedPopoverClose>
        </MarkedPopoverContent>
      </MarkedPopover>,
    )

    expect(markup).toContain("<button")
    expect(markup).toContain('aria-haspopup="dialog"')
    expect(markup).toContain('aria-expanded="false"')
    expect(markup).toContain("add note")
    expect(markup).not.toContain("leave a note")
  })

  it("supports disabled popover triggers and exports interactive parts", () => {
    const markup = renderToStaticMarkup(
      <MarkedPopover>
        <MarkedPopoverTrigger disabled>unavailable</MarkedPopoverTrigger>
      </MarkedPopover>,
    )

    expect(markup).toContain("disabled")
    expect(MarkedPopoverContent).toBeDefined()
    expect(MarkedPopoverTitle).toBeDefined()
    expect(MarkedPopoverDescription).toBeDefined()
    expect(MarkedPopoverClose).toBeDefined()
  })

  it("connects accordion triggers to expanded panels", () => {
    const markup = renderToStaticMarkup(
      <MarkedAccordion defaultValue={["motion"]}>
        <MarkedAccordionItem value="motion">
          <MarkedAccordionHeader>
            <MarkedAccordionTrigger>does this need motion?</MarkedAccordionTrigger>
          </MarkedAccordionHeader>
          <MarkedAccordionPanel>no external motion library</MarkedAccordionPanel>
        </MarkedAccordionItem>
      </MarkedAccordion>,
    )

    expect(markup).toContain("<h3")
    expect(markup).toContain('aria-expanded="true"')
    expect(markup).toContain('role="region"')
    expect(markup).toContain("no external motion library")
    expect(markup).toContain("cheez-accordion__frame")
  })

  it("supports multiple open and disabled accordion items", () => {
    const markup = renderToStaticMarkup(
      <MarkedAccordion multiple defaultValue={["one", "two"]}>
        <MarkedAccordionItem value="one">
          <MarkedAccordionHeader><MarkedAccordionTrigger>one</MarkedAccordionTrigger></MarkedAccordionHeader>
          <MarkedAccordionPanel>first panel</MarkedAccordionPanel>
        </MarkedAccordionItem>
        <MarkedAccordionItem value="two" disabled>
          <MarkedAccordionHeader><MarkedAccordionTrigger>two</MarkedAccordionTrigger></MarkedAccordionHeader>
          <MarkedAccordionPanel>second panel</MarkedAccordionPanel>
        </MarkedAccordionItem>
      </MarkedAccordion>,
    )

    expect(markup.match(/aria-expanded="true"/g)).toHaveLength(2)
    expect(markup).toContain("disabled")
    expect(markup).toContain("first panel")
    expect(markup).toContain("second panel")
  })

  it("keeps toast producers inside an accessible Base UI provider", () => {
    const markup = renderToStaticMarkup(
      <MarkedToastProvider position="top-left" limit={4}>
        <button type="button">publish</button>
      </MarkedToastProvider>,
    )

    expect(markup).toContain('<button type="button">publish</button>')
    expect(useMarkedToast).toBeDefined()
    expect(createMarkedToastManager()).toBeDefined()
  })

  it("gives every toast state a distinct Cheez status drawing", () => {
    expect(MARKED_TOAST_APPEARANCES.success.mark).toBe("check")
    expect(MARKED_TOAST_APPEARANCES.error.mark).toBe("cross")
    expect(MARKED_TOAST_APPEARANCES.warning.mark).toBe("exclamation")
    expect(MARKED_TOAST_APPEARANCES.info.mark).toBe("spiral")
    expect(MARKED_TOAST_APPEARANCES.loading.mark).toBe("loop-arrow")
  })

  it("announces urgent and polite alerts with native live-region semantics", () => {
    const errorMarkup = renderToStaticMarkup(
      <MarkedAlert tone="error">
        <MarkedAlertTitle>payment failed</MarkedAlertTitle>
        <MarkedAlertDescription>update the card</MarkedAlertDescription>
      </MarkedAlert>,
    )
    const infoMarkup = renderToStaticMarkup(
      <MarkedAlert tone="info">
        <MarkedAlertTitle>new comment</MarkedAlertTitle>
      </MarkedAlert>,
    )

    expect(errorMarkup).toContain('role="alert"')
    expect(errorMarkup).toContain('aria-live="assertive"')
    expect(infoMarkup).toContain('role="status"')
    expect(infoMarkup).toContain('aria-live="polite"')
  })

  it("draws filled alert surfaces and exposes composition parts", () => {
    const markup = renderToStaticMarkup(
      <MarkedAlert tone="warning" variant="filled" dismissible>
        <MarkedAlertTitle>storage nearly full</MarkedAlertTitle>
        <MarkedAlertActions>upgrade</MarkedAlertActions>
      </MarkedAlert>,
    )

    expect(markup).toContain('data-variant="filled"')
    expect(markup).toContain("cheez-alert__fill")
    expect(markup).toContain("cheez-alert__close")
    expect(markup).toContain("dismiss")
    expect(MarkedAlertClose).toBeDefined()
  })

  it("does not render a controlled closed alert", () => {
    const markup = renderToStaticMarkup(
      <MarkedAlert open={false}>
        <MarkedAlertTitle>hidden</MarkedAlertTitle>
      </MarkedAlert>,
    )

    expect(markup).toBe("")
  })

  it("connects progress labels and values through Base UI semantics", () => {
    const markup = renderToStaticMarkup(
      <MarkedProgress
        label="rendering preview"
        description="drawing sixty marks"
        value={64}
      />,
    )

    expect(markup).toContain('role="progressbar"')
    expect(markup).toContain('aria-valuenow="64"')
    expect(markup).toContain('aria-valuemin="0"')
    expect(markup).toContain('aria-valuemax="100"')
    expect(markup).toContain("64%")
    expect(markup).toContain("drawing sixty marks")
  })

  it("renders indeterminate progress without a false numeric value", () => {
    const markup = renderToStaticMarkup(
      <MarkedProgress label="preparing export" value={null} variant="marker" />,
    )

    expect(markup).toContain("data-indeterminate")
    expect(markup).toContain('aria-valuetext="indeterminate progress"')
    expect(markup).not.toContain("aria-valuenow")
    expect(markup).toContain("cheez-progress__ink")
  })

  it("clamps progress and draws completion with segments", () => {
    const markup = renderToStaticMarkup(
      <MarkedProgress label="published" value={120} segments={4} />,
    )

    expect(markup).toContain('aria-valuenow="100"')
    expect(markup).toContain("data-complete")
    expect(markup).toContain("cheez-progress__complete")
    expect(markup).toContain("left:25%")
    expect(markup).toContain("left:50%")
    expect(markup).toContain("left:75%")
  })

  it("keeps badges semantic and announces non-default tones", () => {
    const markup = renderToStaticMarkup(
      <MarkedBadge tone="success">live</MarkedBadge>,
    )

    expect(markup.startsWith("<span")).toBe(true)
    expect(markup).toContain("success: ")
    expect(markup).toContain("live")
    expect(markup).not.toContain("<button")
  })

  it("uses compact ink marks for loading badges", () => {
    const markup = renderToStaticMarkup(
      <MarkedBadge tone="loading">syncing</MarkedBadge>,
    )

    expect(markup).toContain("cheez-badge__loading")
    expect(markup.match(/<span><\/span>/g)).toHaveLength(3)
    expect(markup).not.toContain("loop-arrow")
  })

  it("preserves explicit loading status mark overrides", () => {
    const markup = renderToStaticMarkup(
      <MarkedBadge tone="loading" statusMark="spiral">
        syncing
      </MarkedBadge>,
    )

    expect(markup).toContain("cheez-badge__status")
    expect(markup).not.toContain("cheez-badge__loading")
  })

  it("caps visible badge counts without losing the actual accessible value", () => {
    const markup = renderToStaticMarkup(
      <MarkedBadge
        count={120}
        maxCount={99}
        getCountLabel={(count) => `${count} unread notifications`}
      />,
    )

    expect(markup).toContain("99+")
    expect(markup).toContain("120 unread notifications")
    expect(markup).toContain('aria-hidden="true"')
  })

  it("adds a native close control only to removable badges", () => {
    const markup = renderToStaticMarkup(
      <MarkedBadge removable removeLabel="remove react tag">
        react
      </MarkedBadge>,
    )

    expect(markup).toContain('<button type="button"')
    expect(markup).toContain('aria-label="remove react tag"')
    expect(markup).toContain("cheez-badge__remove")
  })

  it("does not render a controlled hidden badge", () => {
    const markup = renderToStaticMarkup(
      <MarkedBadge visible={false}>hidden</MarkedBadge>,
    )

    expect(markup).toBe("")
  })

  it("generates full-name avatar initials and defers fallback rendering", () => {
    const markup = renderToStaticMarkup(
      <MarkedAvatar name="Maya Chen" fallbackColor="#ff5fa2" />,
    )

    expect(markup).toContain("cheez-avatar__frame")
    expect(markup).not.toContain("cheez-avatar__fallback-fill")
    expect(getAvatarInitials("Maya Chen")).toBe("MC")
    expect(getAvatarInitials("Ada Lovelace Byron", 2)).toBe("AL")
  })

  it("keeps presence meaning accessible while the image loads", () => {
    const markup = renderToStaticMarkup(
      <MarkedAvatar
        name="Berkant Ay"
        src="/berkant.jpg"
        status="online"
      />,
    )

    expect(markup).not.toContain("<img")
    expect(markup).toContain("online")
    expect(markup).toContain("cheez-avatar__status")
  })

  it("supports shape-aware avatar frames", () => {
    const markup = renderToStaticMarkup(
      <MarkedAvatar name="Noah Williams" shape="square" />,
    )

    expect(markup).toContain('data-shape="square"')
    expect(markup).toContain("cheez-avatar__frame")
  })

  it("labels avatar groups and their overflow counts", () => {
    const markup = renderToStaticMarkup(
      <MarkedAvatarGroup
        label="Cheez maintainers"
        overflow={8}
        overflowLabel="8 additional maintainers"
      >
        <MarkedAvatar name="Berkant Ay" />
        <MarkedAvatar name="Maya Chen" />
      </MarkedAvatarGroup>,
    )

    expect(markup).toContain('role="group"')
    expect(markup).toContain('aria-label="Cheez maintainers"')
    expect(markup).toContain('aria-label="8 additional maintainers"')
    expect(markup).toContain("+8")
  })

  it("renders decorative skeleton geometry with a Cheez ink layer", () => {
    const markup = renderToStaticMarkup(
      <MarkedSkeleton
        shape="rounded"
        motion="breathe"
        tone="purple"
        width={240}
        height={80}
      />,
    )

    expect(markup).toContain('aria-hidden="true"')
    expect(markup).toContain('data-shape="rounded"')
    expect(markup).toContain('data-motion="breathe"')
    expect(markup).toContain('data-tone="purple"')
    expect(markup).toContain("cheez-skeleton__ink")
    expect(markup).toContain("width:240px")
    expect(markup).toContain("height:80px")
  })

  it("builds staggered text skeletons with an intentional final width", () => {
    const markup = renderToStaticMarkup(
      <MarkedSkeletonText lines={4} lastLineWidth="46%" delay={100} />,
    )

    expect(markup.match(/data-shape="line"/g)).toHaveLength(4)
    expect(markup).toContain("width:46%")
    expect(markup).toContain("--cheez-skeleton-delay:430ms")
  })

  it("announces one loading message for a busy skeleton group", () => {
    const markup = renderToStaticMarkup(
      <MarkedSkeletonGroup label="loading account activity">
        <MarkedSkeleton />
        <MarkedSkeletonText />
      </MarkedSkeletonGroup>,
    )

    expect(markup).toContain('role="status"')
    expect(markup).toContain('aria-busy="true"')
    expect(markup).toContain('aria-live="polite"')
    expect(markup).toContain("loading account activity")
  })

  it("keeps plain separators decorative by default", () => {
    const markup = renderToStaticMarkup(<MarkedSeparator variant="wavy" />)

    expect(markup).toContain('role="presentation"')
    expect(markup).toContain('aria-hidden="true"')
    expect(markup).toContain('data-orientation="horizontal"')
    expect(markup).toContain('data-variant="wavy"')
  })

  it("turns visible separator labels into named structure", () => {
    const markup = renderToStaticMarkup(
      <MarkedSeparator label="chapter two" labelPosition="start" />,
    )

    expect(markup).toContain('role="separator"')
    expect(markup).toContain('aria-label="chapter two"')
    expect(markup).toContain('data-label-position="start"')
    expect(markup).toContain("chapter two")
    expect(markup).toContain("cheez-separator__label-mark")
  })

  it("draws vertical directional labels with one arrow segment", () => {
    const markup = renderToStaticMarkup(
      <MarkedSeparator
        orientation="vertical"
        variant="directional"
        label="then"
      />,
    )

    expect(markup).toContain('aria-orientation="vertical"')
    expect(markup).toContain('data-orientation="vertical"')
    expect(markup.match(/M3 88 L9 102 L17 88/g)).toHaveLength(1)
  })

  it("composes a card from semantic content slots", () => {
    const markup = renderToStaticMarkup(
      <MarkedCard tone="orange">
        <MarkedCardHeader>
          <MarkedCardEyebrow>release</MarkedCardEyebrow>
          <MarkedCardTitle level={2}>Cheez cards</MarkedCardTitle>
          <MarkedCardDescription>human boundaries</MarkedCardDescription>
        </MarkedCardHeader>
        <MarkedCardContent>composable content</MarkedCardContent>
        <MarkedCardFooter>
          <MarkedCardActions>
            <button type="button">open</button>
          </MarkedCardActions>
        </MarkedCardFooter>
      </MarkedCard>,
    )

    expect(markup).toContain("<article")
    expect(markup).toContain('data-variant="outline"')
    expect(markup).toContain("<h2")
    expect(markup).toContain("cheez-card__header")
    expect(markup).toContain("cheez-card__content")
    expect(markup).toContain("cheez-card__footer")
    expect(markup).toContain("cheez-card__actions")
  })

  it("draws selection without inventing selection semantics", () => {
    const markup = renderToStaticMarkup(
      <MarkedCard selected selectedColor="#b7ff3c">
        selected card
      </MarkedCard>,
    )

    expect(markup).toContain('data-selected=""')
    expect(markup).toContain("cheez-card__selection-frame")
    expect(markup).toContain("cheez-card__selection-check")
    expect(markup).not.toContain("aria-selected")
  })

  it("keeps media geometry explicit for horizontal cards", () => {
    const markup = renderToStaticMarkup(
      <MarkedCard orientation="horizontal">
        <MarkedCardMedia aspect="square" bleed="inline" />
      </MarkedCard>,
    )

    expect(markup).toContain('data-orientation="horizontal"')
    expect(markup).toContain('data-aspect="square"')
    expect(markup).toContain('data-bleed="inline"')
  })

  it("resolves a filled card tone and foreground color", () => {
    const markup = renderToStaticMarkup(
      <MarkedCard variant="filled" tone="lime" foregroundColor="#111111">
        filled card
      </MarkedCard>,
    )

    expect(markup).toContain('data-variant="filled"')
    expect(markup).toContain("--cheez-card-color:#b7ff3c")
    expect(markup).toContain("--cheez-card-foreground:#111111")
    expect(markup).toContain("--cheez-card-stroke:2.4px")
    expect(markup).toContain("cheez-card__fill")
  })

  it("composes a table from native semantic slots", () => {
    const markup = renderToStaticMarkup(
      <MarkedTable tone="orange">
        <MarkedTableCaption>registry marks</MarkedTableCaption>
        <MarkedTableHeader>
          <MarkedTableRow>
            <MarkedTableHead sort="ascending">mark</MarkedTableHead>
          </MarkedTableRow>
        </MarkedTableHeader>
        <MarkedTableBody>
          <MarkedTableRow>
            <MarkedTableCell>underline</MarkedTableCell>
          </MarkedTableRow>
        </MarkedTableBody>
      </MarkedTable>,
    )

    expect(markup).toContain("<table")
    expect(markup).toContain("<caption")
    expect(markup).toContain("<thead")
    expect(markup).toContain("<tbody")
    expect(markup).toContain('aria-sort="ascending"')
    expect(markup).toContain('data-variant="ruled"')
  })

  it("keeps table row selection visual by default", () => {
    const markup = renderToStaticMarkup(
      <MarkedTable>
        <MarkedTableBody>
          <MarkedTableRow selected tone="lime">
            <MarkedTableCell>selected mark</MarkedTableCell>
          </MarkedTableRow>
        </MarkedTableBody>
      </MarkedTable>,
    )

    expect(markup).toContain('data-selected=""')
    expect(markup).toContain('data-tone="lime"')
    expect(markup).not.toContain("aria-selected")
  })

  it("renders a native sort button with a Cheez direction mark", () => {
    const markup = renderToStaticMarkup(
      <MarkedTableSortButton direction="ascending">
        installs
      </MarkedTableSortButton>,
    )

    expect(markup).toContain('<button type="button"')
    expect(markup).toContain('data-direction="ascending"')
    expect(markup).toContain("cheez-table__sort-mark")
    expect(markup).toContain("<svg")
  })

  it("renders an empty table state with the requested span", () => {
    const markup = renderToStaticMarkup(
      <MarkedTable>
        <MarkedTableBody>
          <MarkedTableEmpty colSpan={4}>no rows</MarkedTableEmpty>
        </MarkedTableBody>
      </MarkedTable>,
    )

    expect(markup).toContain("cheez-table__empty-row")
    expect(markup).toContain('colSpan="4"')
    expect(markup).toContain("no rows")
  })

  it("adds opt-in Cheez emphasis without replacing a native cell", () => {
    const markup = renderToStaticMarkup(
      <MarkedTable>
        <MarkedTableBody>
          <MarkedTableRow>
            <MarkedTableCell marked mark="marker-swipe" markColor="#b7ff3c">
              selected value
            </MarkedTableCell>
          </MarkedTableRow>
        </MarkedTableBody>
      </MarkedTable>,
    )

    expect(markup).toContain("<td")
    expect(markup).toContain("cheez-table__cell-mark")
    expect(markup).toContain("selected value")
    expect(markup).toContain("<svg")
  })

  it("returns every page when pagination does not need a gap", () => {
    expect(
      getMarkedPaginationRange({ currentPage: 3, pageCount: 5 }),
    ).toEqual([1, 2, 3, 4, 5])
  })

  it("keeps boundaries and siblings around a middle page", () => {
    expect(
      getMarkedPaginationRange({ currentPage: 10, pageCount: 20 }),
    ).toEqual([1, "ellipsis-start", 9, 10, 11, "ellipsis-end", 20])
  })

  it("clamps invalid pagination values without duplicate pages", () => {
    expect(
      getMarkedPaginationRange({
        currentPage: 99,
        pageCount: 20,
      }),
    ).toEqual([1, "ellipsis-start", 16, 17, 18, 19, 20])
  })

  it("composes pagination from native nav, list, and links", () => {
    const markup = renderToStaticMarkup(
      <MarkedPagination label="result pages" tone="purple">
        <MarkedPaginationList>
          <MarkedPaginationItem>
            <MarkedPaginationLink href="?page=4" current>
              4
            </MarkedPaginationLink>
          </MarkedPaginationItem>
        </MarkedPaginationList>
      </MarkedPagination>,
    )

    expect(markup).toContain('<nav aria-label="result pages"')
    expect(markup).toContain("<ul")
    expect(markup).toContain('<a href="?page=4" aria-current="page"')
    expect(markup).toContain("cheez-pagination__page-mark")
    expect(markup).toContain("<svg")
  })

  it("removes a disabled pagination link from the tab order", () => {
    const markup = renderToStaticMarkup(
      <MarkedPaginationPrevious href="?page=1" disabled />,
    )

    expect(markup).toContain('aria-disabled="true"')
    expect(markup).toContain('rel="prev"')
    expect(markup).toContain('tabindex="-1"')
    expect(markup).toContain("cheez-pagination__arrow")
  })

  it("uses a native button for client-side pagination", () => {
    const markup = renderToStaticMarkup(
      <MarkedPaginationButton current>8</MarkedPaginationButton>,
    )

    expect(markup).toContain('<button type="button" aria-current="page"')
    expect(markup).toContain('data-current=""')
  })

  it("composes a breadcrumb from native navigation semantics", () => {
    const markup = renderToStaticMarkup(
      <MarkedBreadcrumb label="project location">
        <MarkedBreadcrumbList>
          <MarkedBreadcrumbItem>
            <MarkedBreadcrumbLink href="/cheez">cheez</MarkedBreadcrumbLink>
          </MarkedBreadcrumbItem>
          <MarkedBreadcrumbSeparatorMark />
          <MarkedBreadcrumbItem>
            <MarkedBreadcrumbPage>breadcrumb</MarkedBreadcrumbPage>
          </MarkedBreadcrumbItem>
        </MarkedBreadcrumbList>
      </MarkedBreadcrumb>,
    )

    expect(markup).toContain('<nav aria-label="project location"')
    expect(markup).toContain("<ol")
    expect(markup).toContain('<a href="/cheez"')
    expect(markup).toContain('aria-current="page"')
  })

  it("draws breadcrumb links only when they are interacted with", () => {
    const markup = renderToStaticMarkup(
      <MarkedBreadcrumb hoverMark="wavy-underline">
        <MarkedBreadcrumbList>
          <MarkedBreadcrumbItem>
            <MarkedBreadcrumbLink href="/library">library</MarkedBreadcrumbLink>
          </MarkedBreadcrumbItem>
        </MarkedBreadcrumbList>
      </MarkedBreadcrumb>,
    )

    expect(markup).toContain("cheez-breadcrumb__link-mark")
    expect(markup).toContain("M0 10 Q8 3 16 10")
    expect(markup).toContain("opacity:0")
    expect(markup).toContain("<svg")
  })

  it("keeps breadcrumb separators presentational", () => {
    const markup = renderToStaticMarkup(
      <MarkedBreadcrumb separator="arrow" character="chaotic">
        <MarkedBreadcrumbList>
          <MarkedBreadcrumbSeparatorMark />
        </MarkedBreadcrumbList>
      </MarkedBreadcrumb>,
    )

    expect(markup).toContain('role="presentation"')
    expect(markup).toContain('aria-hidden="true"')
    expect(markup).toContain("M3 12 C8 11 14 13 20 12")
    expect(markup).toContain("rotate(3 12 12)")
    expect(markup.match(/data-cheez-animate/g)).toHaveLength(2)
  })

  it("exposes collapsed breadcrumb routes as a real disclosure button", () => {
    const markup = renderToStaticMarkup(
      <MarkedBreadcrumb>
        <MarkedBreadcrumbList>
          <MarkedBreadcrumbItem>
            <MarkedBreadcrumbEllipsis expanded={false} />
          </MarkedBreadcrumbItem>
        </MarkedBreadcrumbList>
      </MarkedBreadcrumb>,
    )

    expect(markup).toContain('<button type="button" aria-expanded="false"')
    expect(markup).toContain('aria-label="show intermediate pages"')
    expect(markup).toContain("•••")
  })

  it("allows a persistent filled mark on the current breadcrumb page", () => {
    const markup = renderToStaticMarkup(
      <MarkedBreadcrumb currentMark="marker-swipe" tone="lime">
        <MarkedBreadcrumbList>
          <MarkedBreadcrumbItem>
            <MarkedBreadcrumbPage>current route</MarkedBreadcrumbPage>
          </MarkedBreadcrumbItem>
        </MarkedBreadcrumbList>
      </MarkedBreadcrumb>,
    )

    expect(markup).toContain("cheez-breadcrumb__page-mark")
    expect(markup).toContain('aria-current="page"')
    expect(markup).toContain("<mask")
    expect(markup).toContain("#b7ff3c")
  })

  it("opts long breadcrumb routes into wrapping explicitly", () => {
    const markup = renderToStaticMarkup(
      <MarkedBreadcrumb wrap size="large">
        <MarkedBreadcrumbList />
      </MarkedBreadcrumb>,
    )

    expect(markup).toContain('data-wrap=""')
    expect(markup).toContain('data-size="large"')
  })

  it("composes the navigation menu from native navigation and list semantics", () => {
    const markup = renderToStaticMarkup(
      <MarkedNavigationMenu compact size="large" tone="cyan">
        <MarkedNavigationMenuList>
          <MarkedNavigationMenuItem>
            <MarkedNavigationMenuLink href="/docs" active>
              docs
            </MarkedNavigationMenuLink>
          </MarkedNavigationMenuItem>
        </MarkedNavigationMenuList>
      </MarkedNavigationMenu>,
    )

    expect(markup).toContain("<nav")
    expect(markup).toContain("<ul")
    expect(markup).toContain('href="/docs"')
    expect(markup).toContain('aria-current="page"')
    expect(markup).toContain('data-compact=""')
    expect(markup).toContain('data-size="large"')
  })

  it("keeps menubar triggers keyboard-ready and visually configured", () => {
    const markup = renderToStaticMarkup(
      <MarkedMenubar size="small" tone="pink">
        <MarkedMenubarMenu>
          <MarkedMenubarTrigger>file</MarkedMenubarTrigger>
        </MarkedMenubarMenu>
      </MarkedMenubar>,
    )

    expect(markup).toContain('role="menubar"')
    expect(markup).toContain("<button")
    expect(markup).toContain('data-size="small"')
    expect(markup).toContain('data-tone="pink"')
    expect(markup).toContain("file")
  })

  it("connects the combobox label, input, description, and invalid state", () => {
    const markup = renderToStaticMarkup(
      <MarkedCombobox
        items={["underline", "circle"]}
        label="choose a mark"
        description="type to filter"
        error="choose one"
        tone="lime"
      >
        <MarkedComboboxInputGroup>
          <MarkedComboboxInput placeholder="search marks" />
          <MarkedComboboxTrigger />
        </MarkedComboboxInputGroup>
      </MarkedCombobox>,
    )

    expect(markup).toContain("choose a mark")
    expect(markup).toContain('placeholder="search marks"')
    expect(markup).toContain('aria-invalid="true"')
    expect(markup).toContain('role="alert"')
    expect(markup).toContain('data-invalid=""')
  })

  it("keeps command search labelled and composes its drawn separator", () => {
    const markup = renderToStaticMarkup(
      <MarkedCommand items={["open", "save"]} label="project commands">
        <MarkedCommandInput placeholder="find a command" />
        <MarkedCommandSeparator color="#b7ff3c" />
      </MarkedCommand>,
    )

    expect(markup).toContain("project commands")
    expect(markup).toContain('placeholder="find a command"')
    expect(markup).toContain('aria-label="clear command search"')
    expect(markup).toContain('role="separator"')
    expect(markup).toContain("--cheez-command-separator:#b7ff3c")
  })
})
