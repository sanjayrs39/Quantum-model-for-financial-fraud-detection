import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const componentsDir = path.join(__dirname, 'components', 'ui');

// Read all .tsx files in the components/ui directory
const files = fs.readdirSync(componentsDir).filter(file => file.endsWith('.tsx') || file.endsWith('.ts'));

let totalFixed = 0;

files.forEach(file => {
  const filePath = path.join(componentsDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  const originalContent = content;
  
  // Remove version numbers from all imports - multiple patterns
  // Pattern 1: @scope/package@version -> @scope/package
  content = content.replace(/@([\w-]+\/[\w-]+)@[\d.]+/g, '@$1');
  
  // Pattern 2: package@version (for non-scoped packages in import statements)
  content = content.replace(/from ["']([\w-]+)@[\d.]+["']/g, 'from "$1"');
  
  // Pattern 3: @scope/package@version in 'from' statements
  content = content.replace(/from ["']@([\w-]+\/[\w-]+)@[\d.]+["']/g, 'from "@$1"');
  
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Fixed: ${file}`);
    totalFixed++;
  } else {
    console.log(`⏭️  Skipped: ${file} (no changes needed)`);
  }
});

console.log(`\n🎉 Done! Fixed ${totalFixed} files.`);
