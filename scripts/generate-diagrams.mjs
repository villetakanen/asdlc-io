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
    // Match ```mermaid but NOT ```mermaid-source or other suffixes
    const mermaidRegex = /```mermaid(?![-\w])([\s\S]*?)```/g;
    let match;
    let updatedContent = content;
    let hasChanges = false;

    // Find all mermaid blocks
    while ((match = mermaidRegex.exec(content)) !== null) {
      const mermaidCode = match[1].trim();
      const diagramId = `mermaid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const mmdFile = `${diagramId}.mmd`;
      const svgFileName = `${diagramId}.svg`;
      const outputPath = path.resolve(PUBLIC_MERMAID_DIR, svgFileName);

      console.log(`Generating diagram for ${file}...`);

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
        
        const replacement = `\`\`\`mermaid-source
${mermaidCode}
\`\`\`

<figure class="mermaid-diagram">
  <img src="/mermaid/${svgFileName}" alt="${caption || 'Mermaid Diagram'}" />
  ${caption ? `<figcaption>${caption}</figcaption>` : ''}
</figure>`;

        updatedContent = updatedContent.replace(match[0], replacement);
        hasChanges = true;

      } catch (error) {
        console.error(`Failed to generate diagram for ${file}:`, error);
        if (fs.existsSync(mmdFile)) fs.unlinkSync(mmdFile);
        if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
      }
    }

    if (hasChanges) {
      fs.writeFileSync(file, updatedContent);
      console.log(`Updated ${file}`);
    }
  }
}

generateDiagrams().catch(console.error);
