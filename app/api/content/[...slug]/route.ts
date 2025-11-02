import { NextResponse } from 'next/server'
import { readFile } from 'node:fs/promises'
import path from 'node:path'

export async function GET(
  _req: Request,
  { params }: { params: { slug: string[] } }
) {
  // slug looks like: ["a1", "a1-1", "video-script.md"] or ["a1", "a1-1", "worksheet.md"]
  const rel = params.slug.join('/')
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
        'cache-control': 'public, max-age=3600', // Cache for 1 hour
      },
    })
  } catch (error) {
    // File not found - return 404
    return new NextResponse('Not found', { status: 404 })
  }
}

