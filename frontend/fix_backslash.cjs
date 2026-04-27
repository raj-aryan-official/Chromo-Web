const fs = require('fs');
const path = require('path');

const srcDir = path.join('c:\\Users\\rajar\\OneDrive\\Desktop\\CHROMOO\\Chromo-Web\\frontend\\src');
function processFile(file) {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  
  // replace \${import.meta.env
  content = content.replace(/\\\$\{import\.meta\.env/g, "${import.meta.env");

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Fixed: ' + file);
  }
}

function walk(dir) {
    const files = fs.readdirSync(dir);
    for (const f of files) {
        const full = path.join(dir, f);
        if (fs.statSync(full).isDirectory()) {
            walk(full);
        } else if (full.endsWith('.jsx') || full.endsWith('.js')) {
            processFile(full);
        }
    }
}

walk(srcDir);
