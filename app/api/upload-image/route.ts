import { writeFile } from 'fs/promises'
import path from 'path'
import { type NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('image') as File

    const fileName = Date.now() + '_' + file.name.replace(/\s+/g, '_')
    const filePath = path.join(process.cwd(), 'public/images', fileName)

    // Convert file to buffer and save
    const buffer = Buffer.from(await file.arrayBuffer())
    await writeFile(filePath, buffer)

    return NextResponse.json({ fileName })
  } catch (error) {
    console.error('Error uploading image:', error)
    return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 })
  }
}
