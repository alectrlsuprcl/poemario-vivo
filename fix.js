const fs = require('fs');
const file = 'node_modules/partykit/dist/bin.mjs';
let content = fs.readFileSync(file, 'utf8');

let count = 0;

// Buscar todos los patrones de fileURLToPath + path.join + inject-process.js
// Reemplazarlos todos
content = content.replace(/fileURLToPath\d+\(\s*path\d+\.join\(path\d+\.dirname\(import\.meta\.url\),\s*"\.\.\/inject-process\.js"\)\s*\)/g, (match) => {
  count++;
  return 'fileURLToPath5(new URL("../inject-process.js", import.meta.url))';
});

if (count > 0) {
  fs.writeFileSync(file, content);
  console.log(`PARCHES APLICADOS: ${count} instancias encontradas y reemplazadas`);
} else {
  console.log('No se encontraron patrones');
}