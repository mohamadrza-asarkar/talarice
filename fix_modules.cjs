const fs = require('fs');
const path = require('path');

function processComponent(dir) {
  const jsxPath = path.join(dir, 'index.jsx');
  const cssPath = path.join(dir, 'style.module.css');
  
  if (!fs.existsSync(jsxPath)) return;
  
  let jsxContent = fs.readFileSync(jsxPath, 'utf-8');
  const match = jsxContent.match(/\/\* \n\* ==========================================\n\* CSS CODE FOR THIS COMPONENT.*?\*\//s);
  
  if (match) {
    let cssContent = match[0];
    // Remove the comment wrappers
    cssContent = cssContent.replace(/\/\* \n\* ==========================================\n\* CSS CODE FOR THIS COMPONENT\n\* ==========================================\n\* \n/, '');
    cssContent = cssContent.replace(/\*\//, '');
    cssContent = cssContent.replace(/\* /g, '');
    
    // Write to module.css
    fs.writeFileSync(cssPath, cssContent.trim());
    
    // Remove the block from jsx
    jsxContent = jsxContent.replace(/\/\* \n\* ==========================================\n\* CSS CODE FOR THIS COMPONENT.*?\*\//s, '');
    fs.writeFileSync(jsxPath, jsxContent.trim() + '\n');
    console.log(`Processed ${dir}`);
  }
}

['src/components/logo', 'src/components/header', 'src/components/footer'].forEach(processComponent);
