const assert = require('assert');
const fs = require('fs');
const eventBus = require('./eventBus');

const event = eventBus.emit('lead.created', { lead: { id: 'test-lead', phone: '9876543210' } }, 'test', 'test-correlation');
assert.ok(event.event_id);
assert.strictEqual(event.event_type, 'lead.created');
assert.strictEqual(event.correlation_id, 'test-correlation');
assert.ok(fs.existsSync(eventBus.memoryFile));
assert.ok(fs.readFileSync(eventBus.memoryFile, 'utf8').includes('test-lead'));
console.log('SolarHub event bus tests passed');
