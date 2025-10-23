'use client'

import { useEffect, useRef, useState } from 'react'

type Size = { width: number; height: number }

export function useElementSize<T extends HTMLElement>() {
  const ref = useRef<T | null>(null)
  const [size, setSize] = useState<Size>({ width: 0, height: 0 })

  useEffect(() => {
    if (!ref.current) return

    const element = ref.current
    const update = () => {
      const rect = element.getBoundingClientRect()
      setSize({ width: rect.width, height: rect.height })
    }

    update() // measure once immediately

    const ro = new ResizeObserver(() => update())
    ro.observe(element)

    return () => {
      ro.disconnect()
    }
  }, [])

  return { ref, size }
}