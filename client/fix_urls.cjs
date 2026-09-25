const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    if (fs.statSync(dirPath).isDirectory()) {
      walk(dirPath, callback);
    } else {
      callback(dirPath);
    }
  });
}

walk(path.join(__dirname, 'src'), (filePath) => {
  if (!filePath.endsWith('.js') && !filePath.endsWith('.jsx')) return;
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // Fix axios.create({ baseURL: "/api/..." })
  const newContent1 = content.replace(/baseURL:\s*(["'])(\/api.*?)\1/g, (match, quote, url) => {
    changed = true;
    return `baseURL: (import.meta.env.VITE_API_BASE_URL || "") + "${url}"`;
  });

  // Fix fetch("/api/...")
  const newContent2 = newContent1.replace(/fetch\(\s*(["'])(\/api.*?)\1/g, (match, quote, url) => {
    changed = true;
    return `fetch((import.meta.env.VITE_API_BASE_URL || "") + "${url}"`;
  });

  // Fix axios.get/post/etc("/api/...")
  const newContent3 = newContent2.replace(/axios\.(get|post|put|delete)\(\s*(["'])(\/api.*?)\2/g, (match, method, quote, url) => {
    changed = true;
    return `axios.${method}((import.meta.env.VITE_API_BASE_URL || "") + "${url}"`;
  });

  if (changed) {
    fs.writeFileSync(filePath, newContent3, 'utf8');
    console.log(`Updated ${filePath}`);
  }
});
