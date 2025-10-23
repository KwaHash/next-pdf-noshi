'use client'

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */

import { useEffect, useRef } from 'react'

type FabricCanvasProps = {
  imageUrl?: string
  text?: string
  width?: number
  height?: number
}

type FabricCanvasLike = {
  setWidth: (width: number) => void
  setHeight: (height: number) => void
  add: (obj: any) => void
  renderAll: () => void
  dispose: () => void
}

export default function FabricCanvas({
  imageUrl,
  text = 'Hello',
  width = 800,
  height = 600,
}: FabricCanvasProps) {
  const canvasElRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    let disposed = false
    let canvas: FabricCanvasLike | null = null

    async function init() {
      // Dynamically import to avoid SSR issues and handle ESM/CJS shapes
      const mod = await import('fabric')
      const fabric = (mod as any).fabric || (mod as any).default?.fabric || (mod as any).default || (mod as any)

      if (!canvasElRef.current || disposed) return

      canvas = new fabric.Canvas(canvasElRef.current, {
        preserveObjectStacking: true,
        selection: true,
      })
      if (!canvas) return
      canvas.setWidth(width)
      canvas.setHeight(height)

      if (imageUrl) {
        const img = await fabric.Image.fromURL(imageUrl, { crossOrigin: 'anonymous' })
        img.set({ 
          left: 60 * width / 1140, 
          top: 80 * height / 806, 
          cornerSize: 10,
          lockScalingFlip: true,
          selectable: true
        }).scale(width / (3 * 1140))
        canvas.add(img)
      }

      const horizontalText = new fabric.IText(text, {
        left: width / 2,
        top: height / 2,
        fontSize: 50 * width / 1140,
        editable: false,
        lockScalingFlip: true,
        cornerSize: 10,
      })
      canvas.add(horizontalText)

      // Create vertical text by splitting into individual characters
      const characters = text.split('')
      const fontSize = 50 * width / 1140
      const lineHeight = fontSize
      const textObjects: any[] = []
      
      characters.forEach((char, index) => {
        const textbox = new fabric.IText(char, {
          left: width / 2,
          top: height / 2 + index * lineHeight,
          fontSize: fontSize,
          editable: false,
          lockScalingFlip: true,
          cornerSize: 10,
          originX: 'center',
        })
        textObjects.push(textbox)
      })
      
      // Group all text objects together
      const group = new fabric.Group(textObjects, {
        left: width / 2,
        top: height / 2,
        hasRotatingPoint: true,
        lockRotation: false,
        cornerSize: 10,
      })
      
      canvas.add(group)

      if (!disposed && canvas) {
        canvas.renderAll()
      }
    }

    void init()

    return () => {
      disposed = true
      if (canvas) {
        // dispose releases events and DOM refs
        canvas.dispose()
      }
    }
  }, [imageUrl, text, width, height])

  return (
    <div style={{ width, height }}>
      <canvas ref={canvasElRef} />
    </div>
  )
}