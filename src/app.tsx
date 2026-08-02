import { useEffect, useRef, useState } from "react"

import { CHEEZ_COLORS } from "./brand"
import { CheezWordmark } from "./cheez-wordmark"
import type { CheezCharacter } from "@/registry/default/cheez-core/cheez-definition"
import { Cheez } from "@/registry/default/cheez"
import { MarkedButton } from "@/registry/default/marked-button/marked-button"
import {
  MarkedDropdown,
  MarkedDropdownContent,
  MarkedDropdownItem,
  MarkedDropdownSeparator,
  MarkedDropdownTrigger,
} from "@/registry/default/marked-dropdown/marked-dropdown"
import {
  MarkedTabs,
  MarkedTabsList,
  MarkedTabsPanel,
  MarkedTabsTrigger,
} from "@/registry/default/marked-tabs/marked-tabs"
import {
  MARK_FAMILIES,
  MARK_TYPES,
  getMarkFamily,
  type CheezFamily,
  type CheezType,
} from "@/registry/default/mark-catalog"

const CHARACTERS: CheezCharacter[] = ["calm", "rushed", "chaotic"]
const FAMILIES = Object.keys(MARK_FAMILIES) as CheezFamily[]

const LLM_CONTEXT = `Use Cheez for human-feeling animated pen marks in this React project.

Install the source component:
npx shadcn@latest add berkantay/cheez/cheez

Then use:
import { Cheez } from "@/components/cheez/cheez"

<Cheez type="wavy-underline" character="rushed" color="#b7ff3c">
  important detail
</Cheez>

Cheez has 60 mark types, calm/rushed/chaotic characters, and uses SVG with the native Web Animations API. Do not add Framer Motion.`

const FAMILY_COLORS: Record<CheezFamily, string> = {
  emphasis: CHEEZ_COLORS.ink,
  encircle: CHEEZ_COLORS.purple,
  "cross-out": CHEEZ_COLORS.pink,
  highlight: CHEEZ_COLORS.lime,
  arrow: CHEEZ_COLORS.cyan,
  symbol: CHEEZ_COLORS.paper,
}

const FAMILY_COPY: Record<CheezFamily, string> = {
  emphasis: "important",
  encircle: "approved",
  "cross-out": "old copy",
  highlight: "remember",
  arrow: "look here",
  symbol: "note",
}

interface CatalogCardProps {
  character: CheezCharacter
  index: number
  type: CheezType
}

function CatalogCard({ character, index, type }: CatalogCardProps) {
  const family = getMarkFamily(type)

  return (
    <article className="mark-tile">
      <header>
        <span>{String(index + 1).padStart(2, "0")}</span>
        <small>{family}</small>
      </header>
      <div className="mark-tile__preview">
        <Cheez
          type={type}
          character={character}
          color={FAMILY_COLORS[family]}
          trigger="in-view"
        >
          {FAMILY_COPY[family]}
        </Cheez>
      </div>
      <code>{type}</code>
    </article>
  )
}

export function App() {
  const [character, setCharacter] = useState<CheezCharacter>("calm")
  const [family, setFamily] = useState<CheezFamily | "all">("all")
  const [filtersFloating, setFiltersFloating] = useState(false)
  const [galleryKey, setGalleryKey] = useState(0)
  const [llmContextCopied, setLlmContextCopied] = useState(false)
  const catalogRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const updateFloatingFilters = () => {
      const catalog = catalogRef.current

      if (!catalog) return

      const bounds = catalog.getBoundingClientRect()
      setFiltersFloating(
        bounds.top <= 0 && bounds.bottom > window.innerHeight,
      )
    }

    updateFloatingFilters()
    window.addEventListener("scroll", updateFloatingFilters, { passive: true })
    window.addEventListener("resize", updateFloatingFilters)

    return () => {
      window.removeEventListener("scroll", updateFloatingFilters)
      window.removeEventListener("resize", updateFloatingFilters)
    }
  }, [])

  const visibleTypes = MARK_TYPES.filter(
    (type) => family === "all" || getMarkFamily(type) === family,
  )

  const copyForLlm = async () => {
    try {
      await navigator.clipboard.writeText(LLM_CONTEXT)
      setLlmContextCopied(true)
    } catch {
      setLlmContextCopied(false)
    }
  }

  return (
    <main className="site-shell">
      <aside className="sidebar">
        <a className="wordmark" href="#top" aria-label="Cheez home">
          <CheezWordmark />
        </a>

        <nav aria-label="Primary navigation">
          <a className="active" href="#top">Overview</a>
          <a href="#components">Components</a>
          <a href="#catalog">Marks</a>
          <a href="#install">Install</a>

          <span>Library</span>
          <a href="#catalog">Characters</a>
          <a href="/r/cheez.json">Registry</a>
        </nav>

        <span className="version">v0.1 · React</span>
      </aside>

      <div className="site-content">
        <section id="top" className="hero">
          <div className="hero-panel">
            <h1>
              Make words feel
              <br />
              <span>human.</span>
            </h1>
          </div>
          <p className="hero-note">
            i made cheez because digital words feel too perfect. marks should
            feel human.
          </p>
        </section>

        <section id="components" className="component-system">
          <div className="section-heading">
            <div>
              <span>cheez ui</span>
              <h2>marks with a job.</h2>
            </div>
            <p>familiar controls. human feedback.</p>
          </div>

          <div className="component-grid">
            <article className="component-demo component-demo--buttons">
              <header>
                <span>01</span>
                <code>marked-button</code>
              </header>
              <div className="component-demo__stage">
                <MarkedButton markColor={CHEEZ_COLORS.ink}>
                  save changes
                </MarkedButton>
                <MarkedButton
                  mark="loose-circle"
                  markColor={CHEEZ_COLORS.purple}
                  variant="quiet"
                >
                  preview
                </MarkedButton>
              </div>
            </article>

            <article className="component-demo">
              <header>
                <span>02</span>
                <code>marked-tabs</code>
              </header>
              <div className="component-demo__stage">
                <MarkedTabs defaultValue="notes">
                  <MarkedTabsList>
                    <MarkedTabsTrigger value="notes" markColor={CHEEZ_COLORS.lime}>
                      notes
                    </MarkedTabsTrigger>
                    <MarkedTabsTrigger value="marks" markColor={CHEEZ_COLORS.pink}>
                      marks
                    </MarkedTabsTrigger>
                    <MarkedTabsTrigger value="motion" markColor={CHEEZ_COLORS.cyan}>
                      motion
                    </MarkedTabsTrigger>
                  </MarkedTabsList>
                  <MarkedTabsPanel value="notes">
                    small details should still feel made by someone.
                  </MarkedTabsPanel>
                  <MarkedTabsPanel value="marks">
                    sixty marks, each with three drawing characters.
                  </MarkedTabsPanel>
                  <MarkedTabsPanel value="motion">
                    svg paths animated with the native web animations api.
                  </MarkedTabsPanel>
                </MarkedTabs>
              </div>
            </article>

            <article className="component-demo">
              <header>
                <span>03</span>
                <code>marked-dropdown</code>
              </header>
              <div className="component-demo__stage">
                <MarkedDropdown>
                  <MarkedDropdownTrigger markColor={CHEEZ_COLORS.purple}>
                    choose a character
                  </MarkedDropdownTrigger>
                  <MarkedDropdownContent>
                    <MarkedDropdownItem markColor={CHEEZ_COLORS.ink}>
                      calm
                    </MarkedDropdownItem>
                    <MarkedDropdownItem markColor={CHEEZ_COLORS.lime}>
                      rushed
                    </MarkedDropdownItem>
                    <MarkedDropdownSeparator />
                    <MarkedDropdownItem markColor={CHEEZ_COLORS.pink}>
                      chaotic
                    </MarkedDropdownItem>
                  </MarkedDropdownContent>
                </MarkedDropdown>
              </div>
            </article>
          </div>
        </section>

        <section id="install" className="install">
          <div className="install-intro">
            <h2>install</h2>
            <p>install the source with your package runner.</p>
          </div>
          <div className="install-options">
            <div className="install-row">
              <span>shadcn</span>
              <code>npx shadcn@latest add berkantay/cheez/cheez</code>
            </div>
            <div className="install-row">
              <span>bun</span>
              <code>bunx shadcn@latest add berkantay/cheez/cheez</code>
            </div>
            <div className="install-row">
              <span>llm</span>
              <button className="copy-for-llm" type="button" onClick={copyForLlm}>
                {llmContextCopied ? "copied" : "copy for llm"}
              </button>
            </div>
          </div>
        </section>

        <section id="catalog" className="catalog" ref={catalogRef}>
          <div className="catalog-title">
            <h2>All marks</h2>
            <span>{visibleTypes.length} / 60</span>
          </div>

          <div className="controls-slot">
            <div
              className={`controls${filtersFloating ? " controls--floating" : ""}`}
              role="toolbar"
              aria-label="Catalog controls"
            >
              <div className="control-group" aria-label="Drawing character">
                <span>Character</span>
                {CHARACTERS.map((option) => (
                  <button
                    key={option}
                    type="button"
                    aria-pressed={character === option}
                    onClick={() => setCharacter(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>

              <div className="control-group family-control" aria-label="Mark family">
                <span>Family</span>
                <button
                  type="button"
                  aria-pressed={family === "all"}
                  onClick={() => setFamily("all")}
                >
                  all
                </button>
                {FAMILIES.map((option) => (
                  <button
                    key={option}
                    type="button"
                    aria-pressed={family === option}
                    onClick={() => setFamily(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>

              <button
                className="replay"
                type="button"
                onClick={() => setGalleryKey((key) => key + 1)}
              >
                Replay <span aria-hidden="true">↻</span>
              </button>
            </div>
          </div>

          <div className="grid-surface" key={`${character}-${galleryKey}`}>
            <div className="mark-grid">
              {visibleTypes.map((type) => (
                <CatalogCard
                  key={type}
                  type={type}
                  character={character}
                  index={MARK_TYPES.indexOf(type)}
                />
              ))}
            </div>
          </div>
        </section>

        <footer className="footer">
          <span>Cheez © 2026</span>
          <span>React · SVG · WAAPI</span>
        </footer>
      </div>
    </main>
  )
}
