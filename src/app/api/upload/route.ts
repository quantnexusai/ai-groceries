import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided.' },
        { status: 400 }
      )
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Only image files are allowed.' },
        { status: 400 }
      )
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File size exceeds the 5MB limit.' },
        { status: 400 }
      )
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    // If Supabase is configured, upload to storage
    if (
      supabaseUrl &&
      !supabaseUrl.includes('placeholder') &&
      supabaseServiceKey &&
      !supabaseServiceKey.includes('placeholder')
    ) {
      const supabase = createClient(supabaseUrl, supabaseServiceKey)

      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`
      const filePath = `uploads/${fileName}`

      const arrayBuffer = await file.arrayBuffer()
      const buffer = new Uint8Array(arrayBuffer)

      const { error: uploadError } = await supabase.storage
        .from('uploads')
        .upload(filePath, buffer, {
          contentType: file.type,
          upsert: false,
        })

      if (uploadError) {
        console.error('Supabase upload error:', uploadError)
        return NextResponse.json(
          { error: 'Failed to upload file.' },
          { status: 500 }
        )
      }

      const { data: publicUrlData } = supabase.storage
        .from('uploads')
        .getPublicUrl(filePath)

      return NextResponse.json({ url: publicUrlData.publicUrl })
    }

    // If Supabase is not configured, return a mock URL for demo mode
    return NextResponse.json({
      url: `/images/uploads/mock-${Date.now()}.${file.name.split('.').pop()}`,
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Failed to process upload.' },
      { status: 500 }
    )
  }
}
