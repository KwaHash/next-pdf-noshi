'use client'

import React, { useState, useRef } from 'react'
import { BsBack, BsFront } from 'react-icons/bs'
import { FaRegTrashCan, FaRotateRight , FaDownload, FaUpload, FaPrint } from 'react-icons/fa6'
import FabricCanvas from '@/components/fabric-canvas'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useElementSize } from '@/hooks/use-element-size'

export default function NoshiInterface() {
  const [selectedDesign, setSelectedDesign] = useState('紅白結び切り (5本)')
  const [nameText, setNameText] = useState('')
  const [inkColor, setInkColor] = useState('dark')
  const { ref: previewRef, size } = useElementSize<HTMLDivElement>()
  const [writingDirection, setWritingDirection] = useState('vertical')
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const designOptions = [
    '紅白結び切り (5本)',
    '紅白結び切り (7本)',
    '金銀結び切り (5本)',
    '金銀結び切り (7本)',
    '水引のみ'
  ]

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handlePlacementOperation = (operation: string) => {
    console.log(`Placement operation: ${operation}`)
  }

  const handleApply = () => {
    console.log('Applying changes...')
  }

  const handleSaveImage = () => {
    console.log('Saving image...')
  }

  const handlePrint = () => {
    console.log('Printing...')
  }

  return (
    <div className="min-h-screen bg-m-main px-5 py-20">
      <div className="max-w-[1140px] mx-auto space-y-6">
        <div className="w-full flex flex-col sm:flex-row flex-wrap gap-5 sm:gap-2 sm:justify-between sm:items-center">
        	<div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <Label htmlFor="design-select" className="text-base whitespace-nowrap">デザインを選択</Label>
            <Select value={selectedDesign} onValueChange={setSelectedDesign}>
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
              className="rounded-xs whitespace-nowrap w-60 sm:w-40"
            >
              <FaUpload className="w-4 h-4 mr-2" />
              <span>ファイルを選択</span>
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <Label className="text-base whitespace-nowrap">配置操作</Label>
            <div className="flex flex-wrap gap-2">
              <Button 
                onClick={() => handlePlacementOperation('front')}
                className='px-2 py-1 gap-2 rounded-xs bg-m-btn text-white border-m-btn transition duration-700 ease-out'
              >
                <BsFront className="w-4 h-4" />
                <span>前⾯へ</span>
              </Button>
              <Button 
                onClick={() => handlePlacementOperation('back')}
                className='px-2 py-1 gap-2 rounded-xs bg-m-btn text-white border-m-btn transition duration-700 ease-out'
              >
                <BsBack className="w-4 h-4" />
                <span>背⾯へ</span>
              </Button>
              <Button 
                onClick={() => handlePlacementOperation('delete')}
                className='px-2 py-1 gap-2 rounded-xs bg-m-btn text-white border-m-btn transition duration-700 ease-out'
              >
                <FaRegTrashCan className="w-4 h-4" />
                <span>選択削除</span>
              </Button>
              <Button 
                onClick={() => handlePlacementOperation('reset')}
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
                onClick={handleApply}
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

        {/* Bottom Preview and Action Section */}
        <div className="relative bg-white rounded-none shadow-md aspect-[1140/806]" ref={previewRef}>
          <FabricCanvas imageUrl='/darkhorse.png' width={size.width} height={size.height} />
        </div>
      </div>
    </div>
  )
}
