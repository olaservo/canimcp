# Privacy

canimcp is a static site, a set of JSON files and a read-only MCP server. It has no accounts, no forms and no advertising.

## What the site does

- It sets no cookies.
- Its pages load no analytics scripts, no fonts and no other files from other sites.
- The MCP server at `/mcp` and the JSON under `/data` need no credentials. The server keeps no session, and the site's own code does not store the requests it answers or the arguments of a tool call.

## What the host does

The site runs on Cloudflare. Cloudflare receives every request, including the IP address and the user agent, in order to serve it, and shows the site's owner aggregate traffic figures. Its responses carry Cloudflare's network error reporting headers, which let a browser send Cloudflare a report when a request to the site fails. [Cloudflare's privacy policy](https://www.cloudflare.com/privacypolicy/) covers what it does with that data.

## What the data is about

The registry describes software. The telemetry under `/data/observed` holds counts by client name and protocol revision, derived from a public Hugging Face dataset at the revision recorded in the file. It has no data about individual people.

## Changes and questions

This page changes through the public repository, <https://github.com/olaservo/canimcp>, where its history is visible. [Contact](/contact) says how to ask a question.
