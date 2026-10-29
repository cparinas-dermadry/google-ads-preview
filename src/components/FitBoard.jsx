import { useLayoutEffect, useRef, useState } from 'react'

// Lays children out at a fixed design width, then scales the whole board to fill the available width.
// With several widths (widest first), it picks the widest one that keeps the scale at or above minScale.
export default function FitBoard({ width, widths, minScale = 0.7, maxScale = 1.3, children }) {
  const options = widths || [width]
  const outer = useRef(null)
  const inner = useRef(null)
  const [fit, setFit] = useState({ width: options[0], scale: 1, height: 0, left: 0 })

  useLayoutEffect(() => {
    const measure = () => {
      const available = outer.current.clientWidth
      const designWidth = options.find((w) => available / w >= minScale) ?? options[options.length - 1]
      const scale = Math.min(available / designWidth, maxScale)
      setFit({
        width: designWidth,
        scale,
        height: inner.current.offsetHeight * scale,
        left: Math.max(0, (available - designWidth * scale) / 2),
      })
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(outer.current)
    ro.observe(inner.current)
    return () => ro.disconnect()
  }, [options.join(','), minScale, maxScale])

  return (
    <div ref={outer} className="fit-outer" style={{ height: fit.height }}>
      <div
        ref={inner}
        className="fit-inner"
        style={{ width: fit.width, transform: `translateX(${fit.left}px) scale(${fit.scale})` }}
      >
        {children}
      </div>
    </div>
  )
}
