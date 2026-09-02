import fs from 'fs';

const replacements = [
  {
    file: 'apps/web/src/pages/admin/ContentManagement.tsx',
    search: /<span className="material-symbols-outlined text-\[48px\] text-primary\/40">\s*\{r\.provider === 'internal' \? 'account_balance' : r\.provider === 'coursera' \? 'public' : 'school'\}\s*<\/span>/,
    replace: `{r.provider === 'internal' ? <Landmark className="text-[48px] text-primary/40" /> : r.provider === 'coursera' ? <Globe className="text-[48px] text-primary/40" /> : <GraduationCap className="text-[48px] text-primary/40" />}`,
    imports: ['Landmark', 'Globe', 'GraduationCap']
  },
  {
    file: 'apps/web/src/pages/auth/ForgotPassword.tsx',
    search: /<span className="material-symbols-outlined">\{isLoading \? 'hourglass_empty' : 'arrow_forward'\}<\/span>/,
    replace: `{isLoading ? <Hourglass className="animate-spin" /> : <ArrowRight />}`,
    imports: ['Hourglass', 'ArrowRight']
  },
  {
    file: 'apps/web/src/pages/auth/Login.tsx',
    search: /<span className="material-symbols-outlined mr-sm text-lg">\{isLoading \? 'hourglass_empty' : 'login'\}<\/span>/,
    replace: `{isLoading ? <Hourglass className="mr-sm text-lg animate-spin" /> : <LogIn className="mr-sm text-lg" />}`,
    imports: ['Hourglass', 'LogIn']
  },
  {
    file: 'apps/web/src/pages/auth/Register.tsx',
    search: /<span className="material-symbols-outlined text-sm">\{isLoading \? 'hourglass_empty' : 'arrow_forward'\}<\/span>/,
    replace: `{isLoading ? <Hourglass className="text-sm animate-spin" /> : <ArrowRight className="text-sm" />}`,
    imports: ['Hourglass', 'ArrowRight']
  },
  {
    file: 'apps/web/src/pages/auth/ResetPassword.tsx',
    search: /<span className="material-symbols-outlined">\{isLoading \? 'hourglass_empty' : 'check_circle'\}<\/span>/,
    replace: `{isLoading ? <Hourglass className="animate-spin" /> : <CheckCircle />}`,
    imports: ['Hourglass', 'CheckCircle']
  },
  {
    file: 'apps/web/src/pages/auth/VerifyEmail.tsx',
    search: /<span className="material-symbols-outlined text-\[20px\]">\{status === 'loading' \? 'hourglass_empty' : 'arrow_forward'\}<\/span>/,
    replace: `{status === 'loading' ? <Hourglass className="text-[20px] animate-spin" /> : <ArrowRight className="text-[20px]" />}`,
    imports: ['Hourglass', 'ArrowRight']
  },
  {
    file: 'apps/web/src/pages/learner/Competencies.tsx',
    search: /<span className={`material-symbols-outlined \$\{iconColor\}`}>\{getIcon\(gap\.competency\.name\)\}<\/span>/,
    replace: `<Target className={iconColor} />`,
    imports: ['Target']
  },
  {
    file: 'apps/web/src/pages/learner/LearningPath.tsx',
    search: /<span className={`material-symbols-outlined text-\[16px\] \$\{generating \? 'animate-spin' : ''\}`}>sync<\/span> \{generating \? 'Regenerating\.\.\.' : 'Regenerate Path'\}/,
    replace: `<RefreshCw className={\`text-[16px] \${generating ? 'animate-spin' : ''}\`} /> {generating ? 'Regenerating...' : 'Regenerate Path'}`,
    imports: ['RefreshCw']
  }
];

for (const r of replacements) {
  if (fs.existsSync(r.file)) {
    let content = fs.readFileSync(r.file, 'utf8');
    if (content.match(r.search)) {
      content = content.replace(r.search, r.replace);
      
      const importRegex = /import\s+{([^}]+)}\s+from\s+['"]lucide-react['"];?/;
      const existingImportMatch = content.match(importRegex);
      
      if (existingImportMatch) {
        const existingIcons = existingImportMatch[1].split(',').map(s => s.trim()).filter(s => s);
        const allIcons = new Set([...existingIcons, ...r.imports]);
        const newImport = `import { ${Array.from(allIcons).sort().join(', ')} } from 'lucide-react';`;
        content = content.replace(importRegex, newImport);
      } else {
        const newImport = `import { ${Array.from(r.imports).sort().join(', ')} } from 'lucide-react';\n`;
        const importLines = content.match(/^import.*$/gm);
        if (importLines && importLines.length > 0) {
          const lastImport = importLines[importLines.length - 1];
          content = content.replace(lastImport, lastImport + '\n' + newImport);
        } else {
          content = newImport + content;
        }
      }
      
      fs.writeFileSync(r.file, content, 'utf8');
      console.log(`Fixed ${r.file}`);
    }
  }
}
