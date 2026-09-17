import admin from './firebase/admin.js';

async function checkAI() {
  const db = admin.firestore();
  
  console.log('--- pending_ai_updates ---');
  const pending = await db.collection('pending_ai_updates').get();
  pending.forEach(doc => console.log(doc.id, doc.data()));
  
  console.log('--- ai_activity_log ---');
  const log = await db.collection('ai_activity_log').get();
  log.forEach(doc => console.log(doc.id, doc.data()));
  
  process.exit(0);
}
checkAI();
