const ANIMATED_LAYER_SELECTOR = "[data-cheez-animate]"
const DEFAULT_EASING = "cubic-bezier(.22,.72,.2,1)"

type PlayOptions = {
  durationScale?: number
  onComplete?: () => void
}

const inViewCallbacks = new WeakMap<Element, () => void>()
let inViewObserver: IntersectionObserver | undefined

function getAnimatedLayers(root: SVGSVGElement) {
  return Array.from(root.querySelectorAll<SVGElement>(ANIMATED_LAYER_SELECTOR))
}

function getLayerLength(layer: SVGElement) {
  const cachedLength = Number(layer.dataset.cheezLength)
  if (cachedLength > 0) return cachedLength

  const length = (layer as SVGGeometryElement).getTotalLength()
  layer.dataset.cheezLength = String(length)
  return length
}

function prepareLayer(layer: SVGElement, visible: boolean) {
  const length = getLayerLength(layer)
  layer.style.strokeDasharray = `${length} ${length}`
  layer.style.strokeDashoffset = visible ? "0" : String(length)
  layer.style.opacity = "1"
  return length
}

function shouldReduceMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

function ensureInViewObserver() {
  if (inViewObserver) return inViewObserver

  inViewObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        inViewCallbacks.get(entry.target)?.()
      })
    },
    { threshold: 0.2 },
  )

  return inViewObserver
}

export function observeCheezMark(
  element: Element,
  callback: () => void,
  once = true,
) {
  const observer = ensureInViewObserver()
  const handleIntersection = () => {
    callback()

    if (once) {
      observer.unobserve(element)
      inViewCallbacks.delete(element)
    }
  }

  inViewCallbacks.set(element, handleIntersection)
  observer.observe(element)

  return () => {
    observer.unobserve(element)
    inViewCallbacks.delete(element)
  }
}

export function hideCheezMark(root: SVGSVGElement) {
  getAnimatedLayers(root).forEach((layer) => {
    prepareLayer(layer, false)
  })
}

export function finishCheezMark(root: SVGSVGElement) {
  getAnimatedLayers(root).forEach((layer) => {
    layer.getAnimations().forEach((animation) => animation.cancel())
    prepareLayer(layer, true)
  })
}

export function cancelCheezMark(root: SVGSVGElement) {
  getAnimatedLayers(root).forEach((layer) => {
    layer.getAnimations().forEach((animation) => animation.cancel())
  })
}

export function playCheezMark(
  root: SVGSVGElement,
  { durationScale = 1, onComplete }: PlayOptions = {},
) {
  const layers = getAnimatedLayers(root)

  cancelCheezMark(root)

  if (shouldReduceMotion()) {
    finishCheezMark(root)
    onComplete?.()
    return []
  }

  let completedLayers = 0

  return layers.map((layer) => {
    const length = prepareLayer(layer, false)

    const duration = Number(layer.dataset.duration) * durationScale
    const delay = Number(layer.dataset.delay ?? 0) * durationScale
    const animation = layer.animate(
      [
        { strokeDashoffset: String(length) },
        { strokeDashoffset: "0" },
      ],
      {
        duration,
        delay,
        easing: layer.dataset.easing ?? DEFAULT_EASING,
        fill: "both",
      },
    )

    animation.onfinish = () => {
      layer.style.strokeDashoffset = "0"
      animation.cancel()
      completedLayers += 1

      if (completedLayers === layers.length) onComplete?.()
    }

    return animation
  })
}
