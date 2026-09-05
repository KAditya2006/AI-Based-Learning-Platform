const fs = require('fs');
const path = require('path');

const directory = './src';
const indexFile = './index.html';

const replaceInFile = (filePath) => {
  let content = fs.readFileSync(filePath, 'utf-8');
  let changed = false;

  const replacements = [
    { regex: /Skill\s*Intelligence/g, replacement: 'Learning Mate' },
    { regex: /Skill\s*Intel(?!lig)/g, replacement: 'Learning Mate' },
    { regex: /SkillIntel/g, replacement: 'Learning Mate' },
    { regex: /skillintel\.gov/g, replacement: 'learningmate.gov' }
  ];

  replacements.forEach(({ regex, replacement }) => {
    if (regex.test(content)) {
      content = content.replace(regex, replacement);
      changed = true;
    }
  });

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Updated ${filePath}`);
  }
};

const walkSync = (dir, filelist = []) => {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const dirFile = path.join(dir, file);
    const dirent = fs.statSync(dirFile);
    if (dirent.isDirectory()) {
      filelist = walkSync(dirFile, filelist);
    } else {
      if (dirFile.endsWith('.tsx') || dirFile.endsWith('.ts') || dirFile.endsWith('.html')) {
        filelist.push(dirFile);
      }
    }
  }
  return filelist;
};

const files = walkSync(directory);
files.push(indexFile);

files.forEach(replaceInFile);

// Also replace in index.html specifically if it says <title>web</title>
let indexContent = fs.readFileSync(indexFile, 'utf-8');
if (indexContent.includes('<title>web</title>')) {
  indexContent = indexContent.replace('<title>web</title>', '<title>Learning Mate</title>');
  fs.writeFileSync(indexFile, indexContent, 'utf-8');
  console.log(`Updated title in ${indexFile}`);
}
