import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { glob } from 'glob';

const CONTENT_DIR = 'src/content';
const MERMAID_CONFIG = 'mermaid.json';

const PUBLIC_MERMAID_DIR = 'public/mermaid';

async function generateDiagrams() {
  const files = await glob(`${CONTENT_DIR}/**/*.md`);

  // Ensure public/mermaid directory exists
  if (!fs.existsSync(PUBLIC_MERMAID_DIR)) {
    fs.mkdirSync(PUBLIC_MERMAID_DIR, { recursive: true });
  }

  for (const file of files) {
    let content = fs.readFileSync(file, 'utf-8');
    // Match ```mermaid block AND optional following <figure>...</figure>
    const mermaidRegex = /```mermaid(?![-\w])([\s\S]*?)```(?:\s*<figure class="mermaid-diagram">[\s\S]*?<\/figure>)?/g;
    let match;
    let newContent = '';
    let lastIndex = 0;
    let diagramIndex = 1;
    let hasChanges = false;
    const baseName = path.basename(file, '.md').replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();

    // Find all mermaid blocks
    while ((match = mermaidRegex.exec(content)) !== null) {
      // Append content before this match
      newContent += content.slice(lastIndex, match.index);
      
      const mermaidCode = match[1].trim();
      const mmdFile = `${baseName}-fig-${diagramIndex}.mmd`;
      const svgFileName = `${baseName}-fig-${diagramIndex}.svg`;
      const outputPath = path.resolve(PUBLIC_MERMAID_DIR, svgFileName);

      console.log(`Generating diagram ${diagramIndex} for ${file}...`);

      // Extract caption if present
      let caption = '';
      const captionMatch = mermaidCode.match(/%% caption: (.*)/);
      if (captionMatch) {
        caption = captionMatch[1].trim();
      }

      // Write temp mmd file
      fs.writeFileSync(mmdFile, mermaidCode);

      try {
        // Generate SVG using mmdc
        execSync(`pnpm exec mmdc -i ${mmdFile} -o ${outputPath} -c ${MERMAID_CONFIG} -b transparent`, { stdio: 'inherit' });

        // Clean up temp files
        fs.unlinkSync(mmdFile);
        
        const replacement = `\`\`\`mermaid
${mermaidCode}
\`\`\`

<figure class="mermaid-diagram">
  <img src="/mermaid/${svgFileName}" alt="${caption || 'Mermaid Diagram'}" />
  ${caption ? `<figcaption>${caption}</figcaption>` : ''}
</figure>`;

        newContent += replacement;
        hasChanges = true;

      } catch (error) {
        console.error(`Failed to generate diagram for ${file}:`, error);
        // If failed, keep original content for this block
        newContent += match[0];
        if (fs.existsSync(mmdFile)) fs.unlinkSync(mmdFile);
      }
      
      lastIndex = mermaidRegex.lastIndex;
      diagramIndex++;
    }
    
    // Append remaining content
    newContent += content.slice(lastIndex);

    if (hasChanges) {
      fs.writeFileSync(file, newContent);
      console.log(`Updated ${file}`);
    }
  }
}

generateDiagrams().catch(console.error);
