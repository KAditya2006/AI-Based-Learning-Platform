import fs from 'fs';

// 1. LearningPlayer.tsx
let lp = 'apps/web/src/pages/learner/LearningPlayer.tsx';
if (fs.existsSync(lp)) {
  let content = fs.readFileSync(lp, 'utf8');
  content = content.replace(
    /<span className=\{`material-symbols-outlined fill text-\[32px\]`\}>\{isPlaying \? 'pause' : 'play_arrow'\}<\/span>/,
    `{isPlaying ? <Pause className="fill-current text-[32px]" /> : <Play className="fill-current text-[32px]" />}`
  );
  content = content.replace(
    /<span className="material-symbols-outlined fill">\{isPlaying \? 'pause' : 'play_arrow'\}<\/span>/,
    `{isPlaying ? <Pause className="fill-current" /> : <Play className="fill-current" />}`
  );
  if (!content.includes('import { Play, Pause }')) {
    content = "import { Play, Pause } from 'lucide-react';\n" + content;
  }
  fs.writeFileSync(lp, content, 'utf8');
  console.log('Fixed LearningPlayer.tsx');
}

// 2. Notifications.tsx
let no = 'apps/web/src/pages/learner/Notifications.tsx';
if (fs.existsSync(no)) {
  let content = fs.readFileSync(no, 'utf8');
  content = content.replace(
    /const getNotifIcon = \(type: string\) => \{[\s\S]*?return 'description';\s*\};/,
    `const getNotifIcon = (type: string) => {
    if (type?.toLowerCase().includes('recommendation') || type?.toLowerCase().includes('award')) return <Award />;
    if (type?.toLowerCase().includes('learn') || type?.toLowerCase().includes('course')) return <GraduationCap />;
    if (type?.toLowerCase().includes('assessment') || type?.toLowerCase().includes('review')) return <ClipboardCheck />;
    if (type?.toLowerCase().includes('system') || type?.toLowerCase().includes('update')) return <RefreshCcw />;
    if (type?.toLowerCase().includes('endorse')) return <Star />;
    return <FileText />;
  };`
  );
  content = content.replace(
    /<span className="material-symbols-outlined".*?>\{iconName\}<\/span>/,
    `{iconName}` // it's already a React component now
  );
  if (!content.includes('import { Award')) {
    content = "import { Award, GraduationCap, ClipboardCheck, RefreshCcw, Star, FileText } from 'lucide-react';\n" + content;
  }
  fs.writeFileSync(no, content, 'utf8');
  console.log('Fixed Notifications.tsx');
}

// 3. SkillGaps.tsx
let sg = 'apps/web/src/pages/learner/SkillGaps.tsx';
if (fs.existsSync(sg)) {
  let content = fs.readFileSync(sg, 'utf8');
  content = content.replace(
    /let iconName = 'visibility';\s*if \(gap\.priority === 'high'\) \{\s*iconName = 'warning';\s*\} else if \(gap\.priority === 'medium'\) \{\s*iconName = 'trending_up';\s*\}/,
    `let IconComponent = Eye;
            if (gap.priority === 'high') {
              IconComponent = AlertTriangle;
            } else if (gap.priority === 'medium') {
              IconComponent = TrendingUp;
            }`
  );
  content = content.replace(
    /<span className=\{`material-symbols-outlined \$\{iconColor\}`\}.*?>\{iconName\}<\/span>/,
    `<IconComponent className={iconColor} />`
  );
  if (!content.includes('import { Eye')) {
    content = "import { Eye, AlertTriangle, TrendingUp } from 'lucide-react';\n" + content;
  }
  fs.writeFileSync(sg, content, 'utf8');
  console.log('Fixed SkillGaps.tsx');
}
