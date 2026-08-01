# Cheez

Human-feeling animated pen marks for React. Use Cheez as owned source through
the shadcn registry or as the `@berkantay/cheez` package.

## Install

### shadcn registry

```bash
# bun
bunx shadcn@latest add berkantay/cheez/cheez

# npm
npx shadcn@latest add berkantay/cheez/cheez

# pnpm
pnpm dlx shadcn@latest add berkantay/cheez/cheez
```

```tsx
import { Cheez } from "@/components/cheez/cheez"
```

### package

```bash
bun add @berkantay/cheez
npm install @berkantay/cheez
pnpm add @berkantay/cheez
```

```tsx
import { Cheez } from "@berkantay/cheez"

export function Example() {
  return (
    <Cheez type="wavy-underline" character="rushed" color="#ff4f2e">
      important detail
    </Cheez>
  )
}
```

This repository contains a 60-type motion catalog. Four hand-tuned foundation
marks exercise the three rendering primitives used by the full collection.

- `Underline`: open stroke
- `Circle`: closed stroke
- `Highlight`: filled mark revealed by a mask
- `Overwrite`: staggered multi-stroke

Each mark supports `calm`, `rushed`, and `chaotic` characters. React mounts and
configures the SVG; the browser's Web Animations API runs the motion without
per-frame React state updates.

## Development

```bash
bun install
bun run dev
```

Then open `http://localhost:5173`.

## Checks

```bash
bun run typecheck
bun run test
bun run check
```

## Registry structure

The installable source lives in `registry/default`. The full `cheez` item is
self-contained, so one command always installs a working collection. Focused
items reuse the version-pinned `cheez-core` item, which owns the shared renderer
and motion engine.

## License

MIT
