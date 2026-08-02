# Cheez daily video

One reusable Remotion composition for the daily Cheez component series on X.

## Studio

```bash
bun run studio
```

Select `CheezDaily`, then change `componentId` in the input props.

## Render a daily post

```bash
bun run render breadcrumb
```

This creates both files in `marketing/daily/`:

- `25-breadcrumb.mp4`
- `25-breadcrumb.txt`

Render the poster frame separately:

```bash
bun run still breadcrumb 128
```

## Add tomorrow's component

Add one entry to `components.json`. Prefer an existing demo `kind`; add a focused artwork renderer only when the interaction needs a new visual grammar.

The video is 1080 × 1080, 30fps, and 250 frames. It uses parameterized rendering, `TransitionSeries`, spring timing, and a subtle canvas noise effect. Component animation remains the focal point.
