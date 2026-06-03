export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const htmlUrl = new URL('/routex1/index.html', request.url)
  const htmlResponse = await fetch(htmlUrl, { cache: 'force-cache' })

  if (!htmlResponse.ok) {
    return new Response('Routex page not found', { status: 404 })
  }

  const html = await htmlResponse.text()

  return new Response(html, {
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'public, max-age=0, s-maxage=86400',
    },
  })
}
