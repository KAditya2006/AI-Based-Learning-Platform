import fs from 'fs';

const files = [
  'apps/web/src/pages/admin/ContentManagement.tsx',
  'apps/web/src/pages/auth/ForgotPassword.tsx',
  'apps/web/src/pages/auth/Login.tsx',
  'apps/web/src/pages/auth/Register.tsx',
  'apps/web/src/pages/auth/ResetPassword.tsx',
  'apps/web/src/pages/auth/VerifyEmail.tsx',
  'apps/web/src/pages/learner/Competencies.tsx',
  'apps/web/src/pages/learner/LearningPath.tsx',
  'apps/web/src/pages/learner\LearningPlayer.tsx',
  'apps/web/src/pages/learner\Notifications.tsx',
  'apps/web/src/pages/learner\SkillGaps.tsx'
];

for (const f of files) {
  let p = f.replace(/\\/g, '/');
  if (fs.existsSync(p)) {
    const lines = fs.readFileSync(p, 'utf8').split('\n');
    lines.forEach((line, idx) => {
      if (line.includes('material-symbols-outlined')) {
        console.log(`[${p}:${idx+1}] ${line.trim()}`);
      }
    });
  }
}
