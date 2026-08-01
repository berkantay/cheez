import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"

import { Highlight } from "@/registry/default/highlight/highlight"
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
})
