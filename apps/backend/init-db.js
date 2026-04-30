const fs = require('fs');
const path = require('path');
const db = require('./db');

async function initDB() {
  try {
    const schemaPath = path.join(__dirname, '../../db/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('Initializing database...');
    // We split by semicolon to execute one by one if needed, 
    // but pg can handle multiple statements if they are not inside a transaction block that conflicts.
    // However, it's safer to run it as one query if it's just CREATE TABLEs.
    await db.query(schema);
    
    console.log('Database initialized successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Failed to initialize database:', err);
    process.exit(1);
  }
}

initDB();
