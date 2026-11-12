// Wire shapes for the four provider APIs, streaming and not.
import type { Decision } from './script.js';

export interface Reply {
  headers: Record<string, string>;
  text: string;
  /** What goes in model.jsonl: the JSON body, or the list of SSE events. */
  logged: unknown;
}

const JSON_HEADERS = { 'content-type': 'application/json' };
const SSE_HEADERS = { 'content-type': 'text/event-stream', 'cache-control': 'no-cache' };
const usage = { prompt_tokens: 10, completion_tokens: 5, total_tokens: 15 };

function sse(events: Array<{ event?: string; data: unknown }>, done: boolean): Reply {
  const text = events.map((e) => (e.event ? `event: ${e.event}\n` : '') + `data: ${typeof e.data === 'string' ? e.data : JSON.stringify(e.data)}\n\n`).join('') + (done ? 'data: [DONE]\n\n' : '');
  return { headers: SSE_HEADERS, text, logged: events.map((e) => e.data) };
}

// ------------------------------------------------------------ Chat Completions

export function chatResponse(d: Decision, model: string, stream: boolean): Reply {
  const id = 'chatcmpl-probe';
  const created = Math.floor(Date.now() / 1000);
  if (!stream) {
    const message =
      d.type === 'call'
        ? { role: 'assistant', content: null, tool_calls: [{ id: d.callId, type: 'function', function: { name: d.tool, arguments: JSON.stringify(d.args) } }] }
        : { role: 'assistant', content: d.text };
    const body = { id, object: 'chat.completion', created, model, choices: [{ index: 0, message, finish_reason: d.type === 'call' ? 'tool_calls' : 'stop', logprobs: null }], usage };
    return { headers: JSON_HEADERS, text: JSON.stringify(body), logged: body };
  }
  const chunk = (delta: Record<string, unknown>, finish: string | null = null) => ({
    id,
    object: 'chat.completion.chunk',
    created,
    model,
    choices: [{ index: 0, delta, finish_reason: finish, logprobs: null }],
  });
  const events: Array<{ data: unknown }> = [];
  if (d.type === 'call') {
    events.push({ data: chunk({ role: 'assistant', content: null, tool_calls: [{ index: 0, id: d.callId, type: 'function', function: { name: d.tool, arguments: '' } }] }) });
    events.push({ data: chunk({ tool_calls: [{ index: 0, function: { arguments: JSON.stringify(d.args) } }] }) });
    events.push({ data: chunk({}, 'tool_calls') });
  } else {
    events.push({ data: chunk({ role: 'assistant', content: '' }) });
    events.push({ data: chunk({ content: d.text }) });
    events.push({ data: chunk({}, 'stop') });
  }
  events.push({ data: { ...chunk({}), choices: [], usage } });
  return sse(events, true);
}

// --------------------------------------------------------------- Responses API

export function responsesResponse(d: Decision, model: string, stream: boolean, request: Record<string, unknown>): Reply {
  const id = 'resp_probe';
  const item =
    d.type === 'call'
      ? { id: 'fc_probe', type: 'function_call', status: 'completed', call_id: d.callId, name: d.tool, ...(d.namespace ? { namespace: d.namespace } : {}), arguments: JSON.stringify(d.args) }
      : { id: 'msg_probe', type: 'message', status: 'completed', role: 'assistant', content: [{ type: 'output_text', text: d.text, annotations: [] }] };
  const response = {
    id,
    object: 'response',
    created_at: Math.floor(Date.now() / 1000),
    status: 'completed',
    model,
    output: [item],
    usage: { input_tokens: 10, output_tokens: 5, total_tokens: 15, input_tokens_details: { cached_tokens: 0 }, output_tokens_details: { reasoning_tokens: 0 } },
    previous_response_id: request.previous_response_id ?? null,
  };
  if (!stream) return { headers: JSON_HEADERS, text: JSON.stringify(response), logged: response };
  const events: Array<{ event: string; data: unknown }> = [
    { event: 'response.created', data: { type: 'response.created', sequence_number: 0, response: { ...response, status: 'in_progress', output: [] } } },
    { event: 'response.output_item.added', data: { type: 'response.output_item.added', sequence_number: 1, output_index: 0, item: { ...item, status: 'in_progress', ...(d.type === 'call' ? { arguments: '' } : { content: [] }) } } },
  ];
  if (d.type === 'call') {
    events.push({ event: 'response.function_call_arguments.delta', data: { type: 'response.function_call_arguments.delta', sequence_number: 2, output_index: 0, item_id: 'fc_probe', delta: JSON.stringify(d.args) } });
    events.push({ event: 'response.function_call_arguments.done', data: { type: 'response.function_call_arguments.done', sequence_number: 3, output_index: 0, item_id: 'fc_probe', arguments: JSON.stringify(d.args) } });
  } else {
    events.push({ event: 'response.output_text.delta', data: { type: 'response.output_text.delta', sequence_number: 2, output_index: 0, content_index: 0, item_id: 'msg_probe', delta: d.text } });
    events.push({ event: 'response.output_text.done', data: { type: 'response.output_text.done', sequence_number: 3, output_index: 0, content_index: 0, item_id: 'msg_probe', text: d.text } });
  }
  events.push({ event: 'response.output_item.done', data: { type: 'response.output_item.done', sequence_number: 4, output_index: 0, item } });
  events.push({ event: 'response.completed', data: { type: 'response.completed', sequence_number: 5, response } });
  return sse(events, false);
}

// ---------------------------------------------------------- Anthropic Messages

export function anthropicResponse(d: Decision, model: string, stream: boolean): Reply {
  const id = 'msg_probe';
  const block = d.type === 'call' ? { type: 'tool_use', id: d.callId, name: d.tool, input: d.args } : { type: 'text', text: d.text };
  const message = {
    id,
    type: 'message',
    role: 'assistant',
    model,
    content: [block],
    stop_reason: d.type === 'call' ? 'tool_use' : 'end_turn',
    stop_sequence: null,
    usage: { input_tokens: 10, output_tokens: 5 },
  };
  if (!stream) return { headers: JSON_HEADERS, text: JSON.stringify(message), logged: message };
  const events: Array<{ event: string; data: unknown }> = [
    { event: 'message_start', data: { type: 'message_start', message: { ...message, content: [], stop_reason: null, usage: { input_tokens: 10, output_tokens: 1 } } } },
  ];
  if (d.type === 'call') {
    events.push({ event: 'content_block_start', data: { type: 'content_block_start', index: 0, content_block: { type: 'tool_use', id: d.callId, name: d.tool, input: {} } } });
    events.push({ event: 'content_block_delta', data: { type: 'content_block_delta', index: 0, delta: { type: 'input_json_delta', partial_json: JSON.stringify(d.args) } } });
  } else {
    events.push({ event: 'content_block_start', data: { type: 'content_block_start', index: 0, content_block: { type: 'text', text: '' } } });
    events.push({ event: 'content_block_delta', data: { type: 'content_block_delta', index: 0, delta: { type: 'text_delta', text: d.text } } });
  }
  events.push({ event: 'content_block_stop', data: { type: 'content_block_stop', index: 0 } });
  events.push({ event: 'message_delta', data: { type: 'message_delta', delta: { stop_reason: message.stop_reason, stop_sequence: null }, usage: { output_tokens: 5 } } });
  events.push({ event: 'message_stop', data: { type: 'message_stop' } });
  return sse(events, false);
}

// ---------------------------------------------------------- Gemini generateContent

export function geminiResponse(d: Decision, model: string, stream: boolean): Reply {
  // The Gemini API echoes a functionCall id back in functionResponse.id, so the call id survives the round trip.
  const part = d.type === 'call' ? { functionCall: { id: d.callId, name: d.tool, args: d.args } } : { text: d.text };
  const body = {
    candidates: [{ content: { role: 'model', parts: [part] }, finishReason: 'STOP', index: 0 }],
    usageMetadata: { promptTokenCount: 10, candidatesTokenCount: 5, totalTokenCount: 15 },
    modelVersion: model,
    responseId: 'resp_probe',
  };
  if (!stream) return { headers: JSON_HEADERS, text: JSON.stringify(body), logged: body };
  // streamGenerateContent?alt=sse: each chunk is a whole GenerateContentResponse; the last one carries finishReason and usage.
  return sse([{ data: body }], false);
}
