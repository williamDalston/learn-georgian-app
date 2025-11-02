import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'node:fs/promises'
import path from 'node:path'

export const runtime = 'nodejs' // We need fs
export const dynamic = 'force-dynamic' // No caching while authoring

// Next.js 16: context.params is a Promise
export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await context.params

  if (!Array.isArray(slug) || slug.length === 0) {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 })
  }

  // Example: /api/content/a1/a1-1/video-script.md
  const rel = slug.join('/')
  const full = path.join(process.cwd(), 'content', 'lessons', rel)

  try {
    const text = await readFile(full, 'utf8')
    
    // Set appropriate content type based on file extension
    const ext = path.extname(full)
    const contentType = 
      ext === '.md' ? 'text/markdown; charset=utf-8' :
      ext === '.json' ? 'application/json; charset=utf-8' :
      'text/plain; charset=utf-8'

    return new NextResponse(text, {
      headers: { 
        'content-type': contentType,
      },
    })
  } catch {
    return new NextResponse('Not found', { status: 404 })
  }
}

