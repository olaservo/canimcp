/**
 * The `kind` of a registry entry, and what a capability row means for each.
 * Shared by the cards and the site so both say the same thing.
 */

export const KINDS = ['host', 'framework', 'adapter', 'sdk'];

export const KIND_LABEL = { host: 'Hosts', framework: 'Frameworks', adapter: 'Adapters', sdk: 'SDKs' };

export const KIND_MEANING = {
  host: 'A shipped application. A capability row is what it declares and implements.',
  framework: 'A library an application embeds. A capability row is what a default install declares, and the embedding application can change it.',
  adapter: 'A package that speaks MCP on a framework\'s behalf. A capability row describes the adapter, whichever framework sits on top.',
  sdk: 'An MCP SDK. A capability row is the default every client on it inherits unless it overrides.',
};

export const kindOf = (entry) => entry.kind ?? 'host';
