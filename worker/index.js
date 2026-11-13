// Serves the static site in site/. Adds what static hosting cannot do alone:
// Markdown for `Accept: text/markdown`, a Markdown 404, and the www redirect.

const CANONICAL_HOST = 'canimcp.io';

/** True when the Accept header ranks text/markdown at or above text/html. */
function prefersMarkdown(accept) {
  if (!accept) return false;
  let markdown = 0;
  let html = 0;
  for (const part of accept.split(',')) {
    const [type, ...params] = part.trim().toLowerCase().split(';');
    const qParam = params.map((p) => p.trim()).find((p) => p.startsWith('q='));
    const q = qParam ? Number(qParam.slice(2)) : 1;
    if (type.trim() === 'text/markdown') markdown = Math.max(markdown, q);
    if (type.trim() === 'text/html') html = Math.max(html, q);
  }
  return markdown > 0 && markdown >= html;
}

const markdownPath = (pathname) => (pathname.endsWith('/') ? `${pathname}index.md` : `${pathname}.md`);

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.hostname === `www.${CANONICAL_HOST}`) {
      url.hostname = CANONICAL_HOST;
      return Response.redirect(url.toString(), 301);
    }

    // A page is any path without a file extension.
    const isPage = !/\.[a-z0-9]+$/i.test(url.pathname);
    const readable = request.method === 'GET' || request.method === 'HEAD';

    if (isPage && readable && prefersMarkdown(request.headers.get('accept'))) {
      const twin = await env.ASSETS.fetch(new Request(new URL(markdownPath(url.pathname), url), request));
      const found = twin.status === 200;
      const source = found ? twin : await env.ASSETS.fetch(new Request(new URL('/404.md', url), request));
      const headers = new Headers(source.headers);
      headers.set('Content-Type', 'text/markdown; charset=utf-8');
      headers.set('Vary', 'Accept');
      return new Response(source.body, { status: found ? 200 : 404, headers });
    }

    const response = await env.ASSETS.fetch(request);
    if (!isPage) return response;

    const headers = new Headers(response.headers);
    headers.set('Vary', 'Accept');
    if (response.status === 200) {
      headers.append('Link', `<${markdownPath(url.pathname)}>; rel="alternate"; type="text/markdown"`);
    }
    return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
  },
};
