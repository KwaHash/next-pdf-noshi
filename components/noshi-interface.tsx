'use client'

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */

import React, { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import { BsBack, BsFront } from 'react-icons/bs'
import { FaRegTrashCan, FaRotateRight , FaDownload, FaUpload, FaPrint } from 'react-icons/fa6'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useElementSize } from '@/hooks/use-element-size'

type FabricCanvasLike = {
  setWidth: (width: number) => void
  setHeight: (height: number) => void
  add: (obj: any) => void
  dispose: () => void
  getActiveObject: () => any
  remove: (obj: any) => void
  bringObjectToFront: (obj: any) => void
  sendObjectToBack: (obj: any) => void
  discardActiveObject: () => void
  backgroundImage: any
  requestRenderAll: () => void
  toDataURL: (options?: any) => string
  clear: () => void
}

export default function NoshiInterface() {
  const [selectedDesign, setSelectedDesign] = useState('sample_001')
  const [nameText, setNameText] = useState('')
  const [inkColor, setInkColor] = useState('dark')
  const { ref: previewRef, size } = useElementSize<HTMLDivElement>()
  const [writingDirection, setWritingDirection] = useState('vertical')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const canvasElRef = useRef<HTMLCanvasElement | null>(null)
  const fabricRef = useRef<any>(null)
  const fabricCanvasRef = useRef<FabricCanvasLike | null>(null)

  const designOptions = [
    'sample_001',
    'sample_002',
    'sample_003'
  ]

  useEffect(() => {
    let disposed = false

    async function init() {
      const mod = await import('fabric')
      const fabric = (mod as any).fabric || (mod as any).default?.fabric || (mod as any).default || (mod as any)
      fabricRef.current = fabric
      if (!canvasElRef.current || disposed) return
      const img = await fabric.Image.fromURL(`/designs/${selectedDesign}.png`, { crossOrigin: 'anonymous' })
      img.set({
        originX: 'left',
        originY: 'top',
        selectable: false,
        evented: false,
        left: 0,
        top: 0,
        scaleX: size.width / img.width,
        scaleY: size.height / img.height
      })
      fabricCanvasRef.current = new fabric.Canvas(canvasElRef.current, {
        preserveObjectStacking: true,
        selection: true,
        backgroundImage: img,
      })
      if (!fabricCanvasRef.current) return
      fabricCanvasRef.current.setWidth(size.width)
      fabricCanvasRef.current.setHeight(size.height)
    }
    void init()
    return () => {
      disposed = true
      if (fabricCanvasRef.current) {
        fabricCanvasRef.current.dispose()
        fabricCanvasRef.current = null
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size])

  const onSelectedDesignChange = async (value: string) => {
    setSelectedDesign(value)
    const canvas = fabricCanvasRef.current
    const fabric = fabricRef.current
    if (!canvas || !fabric) return

    const img = await fabric.Image.fromURL(`/designs/${value}.png`, { crossOrigin: 'anonymous' })
    img.set({
      originX: 'left',
      originY: 'top',
      selectable: false,
      evented: false,
      left: 0,
      top: 0,
      scaleX: size.width / img.width,
      scaleY: size.height / img.height
    })
    canvas.backgroundImage = img
    canvas.requestRenderAll()
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      const formData = new FormData()
      formData.append('image', file)

      const { data: { fileName } } = await axios.post<{ fileName: string }>('/api/upload-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      const canvas = fabricCanvasRef.current
      const fabric = fabricRef.current
      if (!canvas || !fabric) return
      const img = await fabric.Image.fromURL(`/images/${fileName}`, { crossOrigin: 'anonymous' })
      img.set({
        left: 60 * size.width / 1140,
        top: 80 * size.height / 806,
        scaleX: size.width / (3 * 1140),
        scaleY: size.height / (3 * 806),
        angle: 0,
        cornerSize: 10,
        lockScalingFlip: true,
        selectable: true
      })
      canvas.add(img)
    }
  }

  const handleObjectToFront = () => {
    const canvas = fabricCanvasRef.current
    if (!canvas) return
    const activeObject = canvas.getActiveObject()
    if (activeObject) {
      canvas.bringObjectToFront(activeObject)
      canvas.requestRenderAll()
    }
  }

  const handleObjectToBack = () => {
    const canvas = fabricCanvasRef.current
    if (!canvas) return
    const activeObject = canvas.getActiveObject()
    if (activeObject) {
      canvas.sendObjectToBack(activeObject)
      canvas.requestRenderAll()
    }
  }

  const handleObjectDelete = () => {
    const canvas = fabricCanvasRef.current
    if (!canvas) return
    const activeObject = canvas.getActiveObject()
    if (activeObject) {
      canvas.remove(activeObject)
      canvas.discardActiveObject()
      canvas.requestRenderAll()
    }
  }

  const handleObjectReset = () => {
    const canvas = fabricCanvasRef.current
    if (!canvas) return
    canvas.clear()
  }

  const handleTextApply = () => {
    const canvas = fabricCanvasRef.current
    const fabric = fabricRef.current
    if (!canvas || !fabric) return
    if (writingDirection === 'horizontal') {
      const horizontalText = new fabric.IText(nameText, {
        left: size.width / 2,
        top: size.height / 2,
        fontSize: 50 * size.width / 1140,
        editable: false,
        lockScalingFlip: true,
        fill: inkColor === 'dark' ? '#000' : '#C0C0C0',
        cornerSize: 10,
      })
      canvas.add(horizontalText)
    } else {
      const characters = nameText.split('')
      const fontSize = 50 * size.width / 1140
      const lineHeight = fontSize
      const textObjects: any[] = []
      
      characters.forEach((char, index) => {
        const textbox = new fabric.IText(char, {
          left: size.width / 2,
          top: size.height / 2 + index * lineHeight,
          fontSize: fontSize,
          editable: false,
          lockScalingFlip: true,
          fill: inkColor === 'dark' ? '#000' : '#C0C0C0',
          cornerSize: 10,
          originX: 'center',
        })
        textObjects.push(textbox)
      })
      
      const group = new fabric.Group(textObjects, {
        left: size.width / 2,
        top: size.height / 2,
        hasRotatingPoint: true,
        lockRotation: false,
        cornerSize: 10,
      })
      canvas.add(group)
    }
  }

  const handleSaveImage = () => {
    const canvas = fabricCanvasRef.current
    if (!canvas) return

    const dataURL = canvas.toDataURL({
      format: 'png',
      enableRetinaScaling: true,
      multiplier: 2,
      quality: 1,
    })

    const link = document.createElement('a')
    link.href = dataURL
    link.download = Date.now().toString()
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handlePrint = () => {
    const canvas = fabricCanvasRef.current
    if (!canvas) return

    const dataURL = canvas.toDataURL({
      format: 'png',
      quality: 3,
    })

    void import('jspdf').then((jsPDFModule) => {
      const jsPDF = jsPDFModule.default || jsPDFModule.jsPDF
      const pdf = new jsPDF({
        orientation: size.width > size.height ? 'l' : 'p',
        unit: 'mm',
        format: 'a4',
      })

      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()

      let imgWidth = pageWidth
      let imgHeight = (size.height / size.width) * pageWidth

      if (imgHeight > pageHeight) {
        imgHeight = pageHeight
        imgWidth = (size.width / size.height) * pageHeight
      }

      const x = (pageWidth - imgWidth) / 2
      const y = (pageHeight - imgHeight) / 2

      pdf.addImage(dataURL, 'PNG', x, y, imgWidth, imgHeight)
      pdf.save(`${Date.now()}.pdf`)
    })
  }

  return (
    <div className="min-h-screen bg-m-main px-5 py-20">
      <div className="max-w-[1140px] mx-auto space-y-6">
        <div className="w-full flex flex-col sm:flex-row flex-wrap gap-5 sm:gap-2 sm:justify-between sm:items-center">
        	<div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <Label htmlFor="design-select" className="text-base whitespace-nowrap">デザインを選択</Label>
            <Select value={selectedDesign} onValueChange={value => onSelectedDesignChange(value)}>
							<SelectTrigger id="design-select" className="w-60">
								<SelectValue placeholder="デザインを選択" />
							</SelectTrigger>
							<SelectContent>
								{designOptions.map((option) => (
									<SelectItem key={option} value={option}>
										{option}
									</SelectItem>
								))}
							</SelectContent>
            </Select>
        	</div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <Label className="text-base whitespace-nowrap">画像挿入</Label>
            <Input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />
            <Button 
              variant="outline" 
              onClick={() => fileInputRef.current?.click()}
              className="rounded-xs whitespace-nowrap w-60 sm:w-40 bg-white"
            >
              <FaUpload className="w-4 h-4 mr-2" />
              <span>ファイルを選択</span>
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <Label className="text-base whitespace-nowrap">配置操作</Label>
            <div className="flex flex-wrap gap-2">
              <Button 
                onClick={handleObjectToFront}
                className='px-2 py-1 gap-2 rounded-xs bg-m-btn text-white border-m-btn transition duration-700 ease-out'
              >
                <BsFront className="w-4 h-4" />
                <span>前⾯へ</span>
              </Button>
              <Button 
                onClick={handleObjectToBack}
                className='px-2 py-1 gap-2 rounded-xs bg-m-btn text-white border-m-btn transition duration-700 ease-out'
              >
                <BsBack className="w-4 h-4" />
                <span>背⾯へ</span>
              </Button>
              <Button 
                onClick={handleObjectDelete}
                className='px-2 py-1 gap-2 rounded-xs bg-m-btn text-white border-m-btn transition duration-700 ease-out'
              >
                <FaRegTrashCan className="w-4 h-4" />
                <span>選択削除</span>
              </Button>
              <Button 
                onClick={handleObjectReset}
                className='px-2 py-1 gap-2 rounded-xs bg-m-btn text-white border-m-btn transition duration-700 ease-out'
              >
                <FaRotateRight className="w-4 h-4" />
                <span>初期状態に戻す</span>
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-md p-4 sm:p-6 space-y-3">
          <div className="w-full flex flex-wrap justify-between items-center gap-6">
            <div className="w-full lg:w-auto flex flex-col sm:flex-row gap-3 sm:items-center">
              <Label htmlFor="name-input" className="shrink-0 text-base">名入れ</Label>
              <Input
                id="name-input"
                type="text"
                className='grow-1 md:min-w-[550px] h-auto p-4 rounded-none bg-[#f3f3f3] border-[2px]'
                placeholder="こちらに⼊⼒してください"
                value={nameText}
                onChange={(e) => setNameText(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap items-center gap-8">
              {/* Ink Color Options */}
              <div className="space-y-3">
                <Label className="text-base">墨色</Label>
                <RadioGroup value={inkColor} onValueChange={setInkColor} className="flex flex-col gap-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="dark" id="dark-ink" />
                    <Label htmlFor="dark-ink" className="text-[15px]">濃墨(通常)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="light" id="light-ink" />
                    <Label htmlFor="light-ink" className="text-[15px]">淡墨(弔事用)</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Writing Direction Options */}
              <div className="space-y-3">
                <Label className="text-base">文字方向</Label>
                <RadioGroup value={writingDirection} onValueChange={setWritingDirection} className="flex flex-col gap-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="vertical" id="vertical-writing" />
                    <Label htmlFor="vertical-writing" className="text-[15px]">縦書き</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="horizontal" id="horizontal-writing" />
                    <Label htmlFor="horizontal-writing" className="text-[15px]">横書き</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Apply Button */}
              <Button 
                onClick={handleTextApply}
                className="bg-[#b4a37d] hover:bg-[#b4a37d]/80 text-white text-md px-14 py-7 rounded-none transition duration-700 ease-out ml-auto"
              >
                反映
              </Button>
            </div>
          </div>
        </div>

        {/* Usage Information */}
        <div className="flex flex-wrap justify-between items-center gap-3">
          <p className="text-base">
            のしの利用場面は下記に記載しております
            <br className='block sm:hidden' />
            〔<span className='text-[#b4a37d] underline p-0 h-auto'>利用場面を見る▼</span>〕
          </p>
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 justify-center">
            <Button
              onClick={handleSaveImage}
              className="w-40 py-6 rounded-xs bg-m-btn text-white border-m-btn transition duration-700 ease-out"
            >
              <FaDownload className="w-5 h-5 mr-3" />
              <span className='text-lg'>画像保存</span>
            </Button>
            <Button 
              onClick={handlePrint}
              className="w-40 py-6 rounded-xs bg-m-btn text-white border-m-btn transition duration-700 ease-out"
            >
              <FaPrint className="w-5 h-5 mr-5" />
              <span className='text-lg'>印刷</span>
            </Button>
          </div>
        </div>

        <div className='bg-gray-300 w-full h-[1px]'></div>

        <div className="relative bg-white rounded-none shadow-md aspect-[1140/806]" ref={previewRef}>
          <canvas ref={canvasElRef} />
        </div>
      </div>
    </div>
  )
}
