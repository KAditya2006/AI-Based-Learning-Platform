import fs from 'fs';

// 1. AssessmentResult.tsx
let ar = 'apps/web/src/pages/learner/AssessmentResult.tsx';
if (fs.existsSync(ar)) {
  let content = fs.readFileSync(ar, 'utf8');
  // Remove dummy fallback
  content = content.replace(
    /const score = attempt \? Math\.round\(attempt\.percentage\) : 82;\s*const isPass = attempt \? attempt\.passed : true;\s*const levelText = score >= 80 \? 'Advanced' : \(score >= 60 \? 'Intermediate' : 'Novice'\);/,
    `if (!attempt) return <div className="p-xl text-center">No assessment result found. Please complete an assessment first.</div>;\n  const score = Math.round(attempt.percentage);\n  const isPass = attempt.passed;\n  const levelText = score >= 80 ? 'Advanced' : (score >= 60 ? 'Intermediate' : 'Novice');`
  );
  
  // Remove Competency Breakdown, Verified Strengths, Identified Gaps, Recommended Path Section
  content = content.replace(/\{\/\* Competency Breakdown Card \*\/\}[\s\S]*?\{\/\* Recommended Path Section \*\/\}[\s\S]*?<\/div>\s*<\/div>\s*<div className="md:col-span-12 flex justify-center mt-xl">/, '<div className="md:col-span-12 flex justify-center mt-xl">');
  fs.writeFileSync(ar, content, 'utf8');
  console.log('Fixed AssessmentResult.tsx');
}

// 2. ExploreLearning.tsx
let el = 'apps/web/src/pages/learner/ExploreLearning.tsx';
if (fs.existsSync(el)) {
  let content = fs.readFileSync(el, 'utf8');
  content = content.replace(
    /\/\/ Mocking priority vs regular for design matching\s*const priorityResources = filtered\.slice\(0, 2\);\s*const recommendedResources = filtered\.slice\(2\);/,
    `const priorityResources = filtered.filter(r => r.priority === 'high');\n  const recommendedResources = filtered.filter(r => r.priority !== 'high');`
  );
  fs.writeFileSync(el, content, 'utf8');
  console.log('Fixed ExploreLearning.tsx');
}

// 3. LearningHistory.tsx
let lh = 'apps/web/src/pages/learner/LearningHistory.tsx';
if (fs.existsSync(lh)) {
  let content = fs.readFileSync(lh, 'utf8');
  content = content.replace(
    /const isCert = idx % 2 === 1; \/\/ fake some logic just to show diversity/,
    ``
  );
  content = content.replace(
    /\{item\.resource\.type \|\| \(isCert \? 'Certification' : 'Course'\)\}/,
    `{item.resource.type || 'Course'}`
  );
  fs.writeFileSync(lh, content, 'utf8');
  console.log('Fixed LearningHistory.tsx');
}

// 4. LearningPath.tsx
let lpath = 'apps/web/src/pages/learner/LearningPath.tsx';
if (fs.existsSync(lpath)) {
  let content = fs.readFileSync(lpath, 'utf8');
  content = content.replace(
    /\/\/ Calculate some fake progress for design demonstration\s*const completionPercentage = 45;/,
    `const completionPercentage = path.progress || 0;`
  );
  content = content.replace(
    /\/\/ Fake status logic for demo\s*const isCompleted = idx === 0;\s*const isInProgress = idx === 1;\s*const isUpcoming = idx > 1;/,
    `const isCompleted = module.status === 'completed';\n                const isInProgress = module.status === 'in-progress';\n                const isUpcoming = module.status === 'upcoming' || (!isCompleted && !isInProgress);`
  );
  fs.writeFileSync(lpath, content, 'utf8');
  console.log('Fixed LearningPath.tsx');
}

// 5. LearningPlayer.tsx
let lplay = 'apps/web/src/pages/learner/LearningPlayer.tsx';
if (fs.existsSync(lplay)) {
  let content = fs.readFileSync(lplay, 'utf8');
  content = content.replace(
    /\/\/ Mock modules for sidebar to match design[\s\S]*?\];/,
    `const modules = resource.modules || [];`
  );
  fs.writeFileSync(lplay, content, 'utf8');
  console.log('Fixed LearningPlayer.tsx');
}
