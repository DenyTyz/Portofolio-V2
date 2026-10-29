import { useEffect, useId, useRef, useState } from 'react'
import { cn } from '../../lib/utils.js'

export function LiquidGlass({
  children,
  className,
  contentClassName,
  radius = 999,
  bevelDepth = 14,
  scale = 48,
  aberration = 4,
  frost = 0.4,
  tint = 0.12,
  style,
  ...rest
}) {
  const reactId = useId().replace(/:/g, '')
  const rootRef = useRef(null)
  const blobRef = useRef(null)
  const [size, setSize] = useState({ w: 0, h: 0 })
  const [filter, setFilter] = useState(null)
  const [mode, setMode] = useState('pending')

  useEffect(() => {
    if (prefersReducedTransparency()) setMode('opaque')
    else if (isSafariLike() || !supportsUrlBackdropFilter()) setMode('simple')
  }, [])

  useEffect(() => {
    const element = rootRef.current
    if (!element || mode !== 'pending') return undefined

    const observer = new ResizeObserver(([entry]) => {
      if (!entry) return
      const box = entry.borderBoxSize?.[0]
      setSize({
        w: Math.max(1, Math.round(box?.inlineSize ?? entry.contentRect.width)),
        h: Math.max(1, Math.round(box?.blockSize ?? entry.contentRect.height)),
      })
    })
    observer.observe(element)
    return () => observer.disconnect()
  }, [mode])

  useEffect(() => {
    if (mode !== 'pending' || size.w <= 1 || size.h <= 1) return undefined
    let cancelled = false
    let nextBlobUrl

    const createFilter = async () => {
      try {
        nextBlobUrl = await generateDisplacementBlobUrl({
          width: size.w,
          height: size.h,
          radius: Math.min(radius, size.w / 2, size.h / 2),
          bevelDepth: Math.min(bevelDepth, Math.min(size.w, size.h) / 2),
          dpr: Math.min(window.devicePixelRatio || 1, 2),
        })
        await decodeImage(nextBlobUrl)
        if (cancelled) {
          URL.revokeObjectURL(nextBlobUrl)
          return
        }

        if (blobRef.current) URL.revokeObjectURL(blobRef.current)
        blobRef.current = nextBlobUrl
        const id = `lg-${reactId}-${size.w}x${size.h}-${Date.now().toString(36)}`
        setFilter({
          id,
          svg: buildFilterSvg({ id, mapUrl: nextBlobUrl, width: size.w, height: size.h, scale, aberration, frost }),
        })
      } catch (error) {
        if (nextBlobUrl) URL.revokeObjectURL(nextBlobUrl)
        if (cancelled) return
        console.error('Gagal membuat filter Liquid Glass:', error)
        setMode('simple')
      }
    }

    createFilter()
    return () => {
      cancelled = true
    }
  }, [mode, size.w, size.h, radius, bevelDepth, scale, aberration, frost, reactId])

  useEffect(() => () => {
    if (blobRef.current) URL.revokeObjectURL(blobRef.current)
  }, [])

  const backdrop = mode === 'opaque'
    ? 'none'
    : mode === 'simple'
      ? 'blur(20px) saturate(1.4)'
      : filter
        ? `url(#${filter.id}) blur(0.5px) saturate(1.85) brightness(1.02)`
        : 'blur(10px) saturate(1.6) brightness(1.04)'

  return (
    <div
      ref={rootRef}
      data-refract={mode === 'pending' && filter ? 'true' : 'false'}
      className={cn(
        'relative overflow-hidden',
        mode === 'simple' && 'bg-white/70 dark:bg-neutral-900/60',
        mode === 'opaque' && 'bg-white dark:bg-neutral-900',
        className,
      )}
      style={{
        borderRadius: radius,
        backgroundColor: mode === 'pending' ? `rgb(255 255 255 / ${tint})` : undefined,
        backdropFilter: backdrop,
        WebkitBackdropFilter: backdrop,
        ...style,
      }}
      {...rest}
    >
      {filter && (
        <span
          key={filter.id}
          aria-hidden="true"
          className="pointer-events-none absolute size-0 overflow-hidden"
          dangerouslySetInnerHTML={{ __html: filter.svg }}
        />
      )}
      {contentClassName
        ? <div className={contentClassName}>{children}</div>
        : children}
    </div>
  )
}

function supportsUrlBackdropFilter() {
  if (typeof CSS === 'undefined' || !CSS.supports) return false
  return CSS.supports('backdrop-filter', 'url(#x)')
    || CSS.supports('-webkit-backdrop-filter', 'url(#x)')
}

function prefersReducedTransparency() {
  return typeof window !== 'undefined'
    && window.matchMedia?.('(prefers-reduced-transparency: reduce)').matches
}

function isSafariLike() {
  if (typeof navigator === 'undefined') return false
  return /Safari/.test(navigator.userAgent) && !/Chrome|Chromium|Edg|OPR/.test(navigator.userAgent)
}

function decodeImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = resolve
    image.onerror = () => reject(new Error('Displacement map image could not be decoded'))
    image.src = url
  })
}

function signedDistanceRoundedBox(px, py, halfWidth, halfHeight, radius) {
  const qx = Math.abs(px) - halfWidth + radius
  const qy = Math.abs(py) - halfHeight + radius
  const outside = Math.hypot(Math.max(qx, 0), Math.max(qy, 0))
  const inside = Math.min(Math.max(qx, qy), 0)
  return inside + outside - radius
}

function bendFromDepth(value) {
  const u = 1 - Math.min(1, Math.max(0, value))
  const denominator = (1 - u ** 4) ** 0.75
  if (denominator < 1e-6) return 0
  const thetaIncident = Math.atan(Math.min(u ** 3 / denominator, 8))
  const sinTransmitted = Math.sin(thetaIncident) / 1.5
  if (sinTransmitted >= 1) return Math.sin(thetaIncident)
  return Math.sin(thetaIncident - Math.asin(sinTransmitted))
}

function buildPhiTable(bevelPixels) {
  const count = Math.max(1, Math.ceil(bevelPixels))
  const phi = new Float32Array(count + 1)
  for (let depth = 1; depth <= count; depth++) {
    phi[depth] = phi[depth - 1] + bendFromDepth(depth / count)
  }
  return phi
}

function samplePhi(phi, depth) {
  const max = phi.length - 1
  if (depth <= 0) return phi[0]
  if (depth >= max) return phi[max]
  const index = Math.floor(depth)
  const fraction = depth - index
  return phi[index] * (1 - fraction) + phi[index + 1] * fraction
}

function computeDisplacementData({ width, height, radius, bevelDepth, dpr = 1, gain = 1.35, light = { x: -0.55, y: -0.85 } }) {
  const lightLength = Math.hypot(light.x, light.y) || 1
  const lightX = light.x / lightLength
  const lightY = light.y / lightLength
  const pixelWidth = Math.max(1, Math.round(width * dpr))
  const pixelHeight = Math.max(1, Math.round(height * dpr))
  const halfWidth = pixelWidth / 2
  const halfHeight = pixelHeight / 2
  const pixelRadius = Math.min(radius * dpr, halfWidth, halfHeight)
  const bevel = Math.max(1, bevelDepth * dpr)
  const phi = buildPhiTable(bevel)
  const field = new Float32Array(pixelWidth * pixelHeight)

  for (let y = 0; y < pixelHeight; y++) {
    const py = y - halfHeight + 0.5
    for (let x = 0; x < pixelWidth; x++) {
      const distance = signedDistanceRoundedBox(x - halfWidth + 0.5, py, halfWidth, halfHeight, pixelRadius)
      field[y * pixelWidth + x] = distance > 0 ? 0 : samplePhi(phi, Math.min(bevel, -distance))
    }
  }

  const data = new Uint8ClampedArray(pixelWidth * pixelHeight * 4)
  for (let y = 0; y < pixelHeight; y++) {
    const py = y - halfHeight + 0.5
    for (let x = 0; x < pixelWidth; x++) {
      const px = x - halfWidth + 0.5
      const index = (y * pixelWidth + x) << 2
      const distance = signedDistanceRoundedBox(px, py, halfWidth, halfHeight, pixelRadius)
      if (distance > 0) {
        data[index] = data[index + 1] = data[index + 2] = 128
        data[index + 3] = 0
        continue
      }

      const x0 = Math.max(0, x - 1)
      const x1 = Math.min(pixelWidth - 1, x + 1)
      const y0 = Math.max(0, y - 1)
      const y1 = Math.min(pixelHeight - 1, y + 1)
      const derivativeX = (field[y * pixelWidth + x1] - field[y * pixelWidth + x0]) / (x1 - x0 || 1)
      const derivativeY = (field[y1 * pixelWidth + x] - field[y0 * pixelWidth + x]) / (y1 - y0 || 1)
      const dx = Math.max(-1, Math.min(1, derivativeX * gain))
      const dy = Math.max(-1, Math.min(1, derivativeY * gain))
      let specular = 0

      if (distance >= -bevel) {
        const gx = signedDistanceRoundedBox(px + 1, py, halfWidth, halfHeight, pixelRadius)
          - signedDistanceRoundedBox(px - 1, py, halfWidth, halfHeight, pixelRadius)
        const gy = signedDistanceRoundedBox(px, py + 1, halfWidth, halfHeight, pixelRadius)
          - signedDistanceRoundedBox(px, py - 1, halfWidth, halfHeight, pixelRadius)
        const gradientLength = Math.hypot(gx, gy) || 1
        const dot = (gx / gradientLength) * lightX + (gy / gradientLength) * lightY
        const rim = 1 - Math.min(1, -distance / bevel)
        specular = (Math.max(0, dot) + Math.max(0, -dot) * 0.35) * rim
      }

      data[index] = 128 + dx * 127
      data[index + 1] = 128 + dy * 127
      data[index + 2] = Math.round(specular * 255)
      data[index + 3] = 255
    }
  }

  return { data, width: pixelWidth, height: pixelHeight }
}

async function generateDisplacementBlobUrl(options) {
  const { data, width, height } = computeDisplacementData(options)
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const context = canvas.getContext('2d')
  if (!context) throw new Error('2d context unavailable')
  context.putImageData(new ImageData(data, width, height), 0, 0)
  const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'))
  if (!blob) throw new Error('Failed to encode displacement map')
  return URL.createObjectURL(blob)
}

function buildFilterSvg({ id, mapUrl, width, height, scale, aberration, frost }) {
  const padding = Math.ceil(scale + aberration + 4)
  const px = (padding / Math.max(1, width)) * 100
  const py = (padding / Math.max(1, height)) * 100
  const region = `x="-${px.toFixed(3)}%" y="-${py.toFixed(3)}%" width="${(100 + 2 * px).toFixed(3)}%" height="${(100 + 2 * py).toFixed(3)}%"`
  const map = `<feImage href="${mapUrl}" xlink:href="${mapUrl}" x="0" y="0" width="${width}" height="${height}" result="map" preserveAspectRatio="none"/>`
  const displace = (amount, result) => `<feDisplacementMap in="SourceGraphic" in2="map" scale="${amount}" xChannelSelector="R" yChannelSelector="G" result="${result}"/>`
  const body = aberration <= 0
    ? displace(scale, 'rgb')
    : `${displace(scale + aberration, 'dispR')}
  <feColorMatrix in="dispR" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="red"/>
  ${displace(scale, 'dispG')}
  <feColorMatrix in="dispG" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="green"/>
  ${displace(Math.max(0, scale - aberration), 'dispB')}
  <feColorMatrix in="dispB" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="blue"/>
  <feBlend in="red" in2="green" mode="screen" result="rg"/>
  <feBlend in="rg" in2="blue" mode="screen" result="rgb"/>`

  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="0" height="0" aria-hidden="true" style="position:absolute;width:0;height:0;overflow:hidden"><filter id="${id}" color-interpolation-filters="sRGB" ${region}>
  ${map}
  ${body}
  <feGaussianBlur in="rgb" stdDeviation="${frost}"/>
</filter></svg>`
}
