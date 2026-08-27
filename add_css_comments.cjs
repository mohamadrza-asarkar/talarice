const fs = require('fs');
const path = require('path');

function processFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  if (content.includes('PURE CSS EQUIVALENT')) {
    console.log(`Skipping ${filePath}, already processed.`);
    return;
  }

  // Extract all className="..."
  const classNames = [];
  const regex = /className=["']([^"']+)["']/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const classes = match[1].split(' ').map(c => c.trim()).filter(c => c && !c.includes('{') && !c.includes('$'));
    classNames.push(...classes);
  }

  if (classNames.length === 0) return;

  const uniqueClasses = [...new Set(classNames)].sort();

  let cssBlock = `\n\n/* \n* ==========================================\n* PURE CSS EQUIVALENT (AUTO-GENERATED SKELETON)\n* ==========================================\n* \n`;
  
  uniqueClasses.forEach(cls => {
    // Escape special characters for CSS class names
    const safeCls = cls.replace(/([:\[\]\/\\\.])/g, '\\$1');
    cssBlock += `* .${safeCls} {\n*   /* Add pure CSS for ${cls} here */\n* }\n* \n`;
  });

  cssBlock += `*/\n`;

  fs.writeFileSync(filePath, content + cssBlock);
  console.log(`Processed ${filePath}`);
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
console.log('Done!');
