const fs = require('fs');
const path = require('path');
const { randomUUID } = require('crypto');

const repoRoot = path.resolve(__dirname, '../../..');
const memoryFile = path.join(repoRoot, 'management', 'memory', 'events.jsonl');
const backendFile = path.join(__dirname, '..', 'data', 'events.jsonl');
const listeners = new Map();

function ensureFile(file) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  if (!fs.existsSync(file)) fs.writeFileSync(file, '', 'utf8');
}

function validateEvent(event) {
  if (!event.event_type || typeof event.event_type !== 'string') throw new Error('event_type is required');
  if (event.payload === undefined) throw new Error('payload is required');
  if (!event.actor) throw new Error('actor is required');
}

function on(eventType, handler) {
  if (!listeners.has(eventType)) listeners.set(eventType, new Set());
  listeners.get(eventType).add(handler);
  return () => listeners.get(eventType)?.delete(handler);
}

function emit(eventType, payload, actor = 'system', correlationId = null) {
  const event = {
    event_id: randomUUID(),
    event_type: eventType,
    payload,
    actor,
    timestamp: new Date().toISOString(),
    correlation_id: correlationId || randomUUID()
  };
  validateEvent(event);
  const line = JSON.stringify(event) + '\n';
  ensureFile(memoryFile);
  ensureFile(backendFile);
  fs.appendFileSync(memoryFile, line, 'utf8');
  if (backendFile !== memoryFile) fs.appendFileSync(backendFile, line, 'utf8');
  for (const handler of listeners.get(eventType) || []) {
    try { Promise.resolve(handler(event)).catch(() => {}); } catch (_) {}
  }
  return event;
}

module.exports = { emit, on, validateEvent, memoryFile, backendFile };
