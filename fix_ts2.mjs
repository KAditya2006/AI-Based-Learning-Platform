import fs from 'fs';

// Fix LearningHistory.tsx
let lh = 'apps/web/src/pages/learner/LearningHistory.tsx';
if (fs.existsSync(lh)) {
  let content = fs.readFileSync(lh, 'utf8');
  content = content.replace(/\(item, idx\)/g, "(item)");
  fs.writeFileSync(lh, content, 'utf8');
}

// Fix LearningPlayer.tsx
let lplay = 'apps/web/src/pages/learner/LearningPlayer.tsx';
if (fs.existsSync(lplay)) {
  let content = fs.readFileSync(lplay, 'utf8');
  // It might be mod => ...
  content = content.replace(/mod =>/g, "(mod: any) =>");
  content = content.replace(/mod = >/g, "(mod: any) =>");
  content = content.replace(/\(mod\)/g, "(mod: any)");
  fs.writeFileSync(lplay, content, 'utf8');
}

console.log("Fixes applied");
