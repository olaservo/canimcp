// Serves the static site in site/. Adds what static hosting cannot do alone:
// Markdown for `Accept: text/markdown`, a Markdown 404, JSON errors for the
// data paths, the www redirect, and the MCP server at /mcp.

import { handleMcp } from './mcp.js';
import { SERVER } from './mcp-tools.js';

const CANONICAL_HOST = 'canimcp.io';
const JSON_PREFIXES = ['/data/', '/schemas/', '/.well-known/', '/api/'];
const READ_METHODS = ['GET', 'HEAD', 'OPTIONS'];
// Pages that moved. Tasks became one capability page when its extension row merged into it.
const MOVED = {
  '/capabilities/extensions-io-modelcontextprotocol-tasks': '/capabilities/tasks',
  '/capabilities/extensions-io-modelcontextprotocol-tasks.md': '/capabilities/tasks.md',
  '/data/capabilities/extensions-io-modelcontextprotocol-tasks.json': '/data/capabilities/tasks.json',
};

/** The highest q-value the Accept header gives a media type matching `pattern`, or 0. */
function quality(accept, pattern) {
  let best = 0;
  for (const part of (accept || '').split(',')) {
    const [type, ...params] = part.trim().toLowerCase().split(';');
    if (!pattern.test(type.trim())) continue;
    const qParam = params.map((p) => p.trim()).find((p) => p.startsWith('q='));
    best = Math.max(best, qParam ? Number(qParam.slice(2)) : 1);
  }
  return best;
}

const JSON_TYPE = /^application\/([a-z0-9.-]+\+)?json$/;

/** True when the Accept header ranks text/markdown at or above text/html. */
function prefersMarkdown(accept) {
  const markdown = quality(accept, /^text\/markdown$/);
  return markdown > 0 && markdown >= quality(accept, /^text\/html$/);
}

/** True when a missing path should get a JSON error and not the HTML 404 page. */
function wantsJson(pathname, accept) {
  if (pathname.endsWith('.json') || JSON_PREFIXES.some((p) => pathname.startsWith(p))) return true;
  const json = quality(accept, JSON_TYPE);
  return json > 0 && json >= quality(accept, /^text\/html$/);
}

/** An RFC 9457 problem document, as described in /openapi.json. */
function problem(request, status, title, code, detail, extraHeaders = {}) {
  const body = { type: 'about:blank', title, status, code, detail, instance: new URL(request.url).pathname };
  return new Response(request.method === 'HEAD' ? null : `${JSON.stringify(body, null, 2)}\n`, {
    status,
    headers: {
      'Content-Type': 'application/problem+json',
      'Access-Control-Allow-Origin': '*',
      'X-Content-Type-Options': 'nosniff',
      Link: '</openapi.json>; rel="service-desc"',
      ...extraHeaders,
    },
  });
}

const markdownPath = (pathname) => (pathname.endsWith('/') ? `${pathname}index.md` : `${pathname}.md`);

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.hostname === `www.${CANONICAL_HOST}`) {
      url.hostname = CANONICAL_HOST;
      return Response.redirect(url.toString(), 301);
    }

    if (MOVED[url.pathname]) {
      url.pathname = MOVED[url.pathname];
      return Response.redirect(url.toString(), 301);
    }

    if (url.pathname === SERVER.path || url.pathname === SERVER.cardPath) return handleMcp(request, env, url);

    // Everything else is a static file, so only reads make sense.
    if (!READ_METHODS.includes(request.method)) {
      return problem(request, 405, 'Method Not Allowed', 'method_not_allowed',
        `${request.method} is not supported at ${url.pathname}. The site is read-only: use GET. The MCP server at https://${CANONICAL_HOST}${SERVER.path} takes POST.`,
        { Allow: READ_METHODS.join(', ') });
    }

    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          Allow: READ_METHODS.join(', '),
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': READ_METHODS.join(', '),
          'Access-Control-Allow-Headers': '*',
        },
      });
    }

    // A page is any path without a file extension, outside /.well-known.
    const isPage = !/\.[a-z0-9]+$/i.test(url.pathname) && !url.pathname.startsWith('/.well-known/');
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
    if (response.status === 404 && wantsJson(url.pathname, request.headers.get('accept'))) {
      return problem(request, 404, 'Not Found', 'not_found',
        `No file at ${url.pathname}. https://${CANONICAL_HOST}/openapi.json lists the paths that exist.`);
    }
    if (!isPage) return response;

    const headers = new Headers(response.headers);
    headers.set('Vary', 'Accept');
    if (response.status === 200) {
      headers.append('Link', `<${markdownPath(url.pathname)}>; rel="alternate"; type="text/markdown"`);
    }
    return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
  },
};
