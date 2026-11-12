// Tool result fixtures. Each fixture is one tool whose CallToolResult is
// fixed, byte for byte. Every payload carries a marker string so the
// classifier can tell which field reached the model and in what form.

export const MARK = {
  content: 'MARK_CONTENT_7f3a',
  sc: 'MARK_SC_91be',
  user: 'MARK_USER_5a1d',
  image: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
  largeStart: 'MARK_LARGE_START_e2c4',
  largeEnd: 'MARK_LARGE_END_e2c4',
  meta: 'MARK_META_4d2e',
} as const;

export interface Fixture {
  id: string;
  /** The tool name the fixture server registers. Clients prefix it. */
  tool: string;
  description: string;
  /** Tool definition fields beyond name and description. */
  outputSchema?: Record<string, unknown>;
  toolMeta?: Record<string, unknown>;
  /** The exact JSON-RPC result value for tools/call. */
  result: Record<string, unknown>;
  /** Serve the MCP Apps resource the tool points at. */
  appResource?: boolean;
  /** Why the SDK path is expected not to send this result unchanged. Checked by scripts/sdk-compat.ts. */
  expectRaw?: string;
}

const issues = [
  { id: 101, title: `Login button unresponsive ${MARK.sc}`, state: 'open' },
  { id: 102, title: 'Dark mode flickers on load', state: 'open' },
  { id: 103, title: 'Export CSV drops header row', state: 'open' },
];

const sc = { issues };
const summary = `Found 3 open issues ${MARK.content}`;
const issuesSchema = {
  type: 'object',
  properties: {
    issues: {
      type: 'array',
      items: {
        type: 'object',
        properties: { id: { type: 'integer' }, title: { type: 'string' }, state: { type: 'string' } },
        required: ['id', 'title', 'state'],
      },
    },
  },
  required: ['issues'],
};

function largeText(): string {
  const line = 'Issue line with filler text to push the result past the inline cap. ';
  let body = `${MARK.largeStart} ${MARK.content} `;
  while (body.length < 40 * 1024) body += line;
  return body + ` ${MARK.largeEnd}`;
}

function largeStructured(): Record<string, unknown> {
  const items: Array<Record<string, unknown>> = [{ id: 0, title: `${MARK.largeStart} ${MARK.sc}` }];
  for (let i = 1; items.length * 60 < 40 * 1024; i++) {
    items.push({ id: i, title: `Generated issue number ${i} with some padding text`, state: 'open' });
  }
  items.push({ id: items.length, title: MARK.largeEnd });
  return { issues: items };
}

export const FIXTURES: Fixture[] = [
  {
    id: 'summary_and_data',
    tool: 'probe_summary_and_data',
    description: 'Lists open issues. Returns a short summary and the full data.',
    result: { content: [{ type: 'text', text: summary }], structuredContent: sc },
  },
  {
    id: 'mirror',
    tool: 'probe_mirror',
    description: 'Lists open issues. The text block is an exact JSON copy of structuredContent.',
    result: { content: [{ type: 'text', text: JSON.stringify(sc) }], structuredContent: sc },
  },
  {
    id: 'structured_only',
    tool: 'probe_structured_only',
    description: 'Lists open issues. Returns structuredContent and an empty content array.',
    result: { content: [], structuredContent: sc },
  },
  {
    id: 'sc_empty',
    tool: 'probe_sc_empty',
    description: 'Lists open issues. structuredContent is an empty object.',
    result: { content: [{ type: 'text', text: summary }], structuredContent: {} },
  },
  {
    id: 'with_image',
    tool: 'probe_with_image',
    description: 'Lists open issues with a chart image.',
    result: {
      content: [
        { type: 'text', text: summary },
        { type: 'image', data: MARK.image, mimeType: 'image/png' },
      ],
      structuredContent: sc,
    },
  },
  {
    id: 'audience_user',
    tool: 'probe_audience_user',
    description: 'Lists open issues. One text block is addressed to the user only.',
    result: {
      content: [
        { type: 'text', text: `Shown to the user only ${MARK.user}`, annotations: { audience: ['user'] } },
        { type: 'text', text: summary },
      ],
      structuredContent: sc,
    },
  },
  {
    id: 'with_meta',
    tool: 'probe_with_meta',
    description: 'Lists open issues. The result carries application keys in _meta.',
    result: {
      content: [{ type: 'text', text: summary }],
      structuredContent: sc,
      _meta: { 'probe/trace': `trace ${MARK.meta}`, 'probe/source': 'fixture' },
    },
  },
  {
    id: 'meta_only',
    tool: 'probe_meta_only',
    description: 'Lists open issues. The result carries _meta and content, no structuredContent.',
    result: {
      content: [{ type: 'text', text: summary }],
      _meta: { 'probe/trace': `trace ${MARK.meta}`, 'probe/source': 'fixture' },
    },
  },
  {
    id: 'is_error',
    tool: 'probe_is_error',
    description: 'Lists open issues. Always fails.',
    result: {
      content: [{ type: 'text', text: `Lookup failed ${MARK.content}` }],
      structuredContent: { error: `rate limited ${MARK.sc}` },
      isError: true,
    },
  },
  {
    id: 'schema_match',
    tool: 'probe_schema_match',
    description: 'Lists open issues. Declares an outputSchema the result matches.',
    outputSchema: issuesSchema,
    result: { content: [{ type: 'text', text: summary }], structuredContent: sc },
  },
  {
    id: 'schema_mismatch',
    tool: 'probe_schema_mismatch',
    description: 'Lists open issues. Declares an outputSchema the result does not match.',
    outputSchema: issuesSchema,
    result: { content: [{ type: 'text', text: summary }], structuredContent: { wrong: `not issues ${MARK.sc}` } },
    expectRaw: 'McpServer validates structuredContent against outputSchema before sending',
  },
  {
    id: 'app_only',
    tool: 'probe_app_only',
    description: 'Shows the issue dashboard. Visible to the app only.',
    toolMeta: { ui: { resourceUri: 'ui://probe/dashboard', visibility: ['app'] } },
    appResource: true,
    result: { content: [{ type: 'text', text: summary }], structuredContent: sc },
  },
  {
    id: 'large',
    tool: 'probe_large',
    description: 'Lists every issue. The result is over 64 KiB.',
    result: { content: [{ type: 'text', text: largeText() }], structuredContent: largeStructured() },
  },
  {
    id: 'no_content_key',
    tool: 'probe_no_content_key',
    description: 'Lists open issues. The result has no content key.',
    result: { structuredContent: sc },
    expectRaw: 'Server normalizes a content-less result to content: [] before validation',
  },
  {
    id: 'empty_object',
    tool: 'probe_empty_object',
    description: 'Lists open issues. The result is an empty object.',
    result: {},
    expectRaw: 'Server normalizes a content-less result to content: [] before validation',
  },
  {
    id: 'sc_string',
    tool: 'probe_sc_string',
    description: 'Lists open issues. structuredContent is a string.',
    result: { content: [{ type: 'text', text: summary }], structuredContent: `three issues ${MARK.sc}` },
    expectRaw: 'McpServer wraps a non-object structuredContent as {result: ...} on the 2025 era',
  },
  {
    id: 'sc_null',
    tool: 'probe_sc_null',
    description: 'Lists open issues. structuredContent is null.',
    result: { content: [{ type: 'text', text: summary }], structuredContent: null },
    expectRaw: 'McpServer wraps a non-object structuredContent as {result: ...} on the 2025 era',
  },
];

export function fixtureById(id: string): Fixture {
  const f = FIXTURES.find((x) => x.id === id);
  if (!f) throw new Error(`unknown fixture ${id}; known: ${FIXTURES.map((x) => x.id).join(', ')}`);
  return f;
}

export const APP_RESOURCE = {
  uri: 'ui://probe/dashboard',
  mimeType: 'text/html;profile=mcp-app',
  text: '<!doctype html><title>probe dashboard</title><p>probe app</p>',
};
