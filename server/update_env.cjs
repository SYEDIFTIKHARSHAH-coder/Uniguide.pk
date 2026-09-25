const fs = require('fs');
const envPath = '.env';
const saPath = 'firebase-service-account.json';

let env = fs.readFileSync(envPath, 'utf8');
const sa = JSON.parse(fs.readFileSync(saPath, 'utf8'));

// Convert the object to a single line JSON string
const saString = JSON.stringify(sa);

// Replace the empty var with the actual JSON
env = env.replace(/^FIREBASE_SERVICE_ACCOUNT_JSON=.*$/m, 'FIREBASE_SERVICE_ACCOUNT_JSON=' + JSON.stringify(saString));

fs.writeFileSync(envPath, env);
console.log('Updated .env successfully');
