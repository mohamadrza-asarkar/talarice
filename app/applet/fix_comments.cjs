const fs = require('fs');
const path = require('path');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  if (content.includes('/* Add pure CSS for')) {
    content = content.replace(/\/\* Add pure CSS for/g, '// Add pure CSS for');
    content = content.replace(/here \*\//g, 'here');
    fs.writeFileSync(filePath, content);
    console.log(`Fixed ${filePath}`);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.jsx')) {
      processFile(fullPath);
    }
  }
}

walkDir('src/components');
walkDir('src/pages');
console.log('Fix done!');
