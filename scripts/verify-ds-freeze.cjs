const fs = require('fs');
const { execSync } = require('child_process');

// Configuration
const DS_PATH = 'src/styles/ds/';
const BYPASS_TAG = '[EM]';

try {
  // 1. Get the commit message
  // The commit message file path is passed as the first argument to the script
  const commitMsgFile = process.argv[2];
  if (!commitMsgFile) {
    console.error('Error: No commit message file provided.');
    process.exit(1);
  }

  const commitMsg = fs.readFileSync(commitMsgFile, 'utf8');

  // 2. Check if the bypass tag is present
  if (commitMsg.includes(BYPASS_TAG)) {
    console.log(`[Experience Model] Bypass tag "${BYPASS_TAG}" detected. Allowing changes.`);
    process.exit(0);
  }

  // 3. Check for changes in the Design System directory
  // We look for staged files that match the DS path
  const stagedFiles = execSync('git diff --cached --name-only', { encoding: 'utf8' })
    .split('\n')
    .filter(file => file.trim() !== '');

  const dsChanges = stagedFiles.filter(file => file.startsWith(DS_PATH));

  if (dsChanges.length > 0) {
    console.error('\n[Experience Model] ❌ PROTECTION VIOLATION');
    console.error('You are attempting to modify the Design System (Experience Model) without authorization.');
    console.error(`The following files are protected:\n`);
    dsChanges.forEach(file => console.error(` - ${file}`));
    console.error(`\nTo authorize this change, you must include the tag "${BYPASS_TAG}" in your commit message.`);
    console.error('Example: "feat: [EM] Update typography tokens"');
    process.exit(1);
  }

  // No DS changes, proceed
  process.exit(0);

} catch (error) {
  console.error('[Experience Model] Error verifying changes:', error.message);
  process.exit(1);
}
