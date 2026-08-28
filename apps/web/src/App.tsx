
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PublicLayout } from './layouts/PublicLayout';
import { LearnerLayout } from './layouts/LearnerLayout';
import { AdminLayout } from './layouts/AdminLayout';

import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { ForgotPassword } from './pages/auth/ForgotPassword';
import { ResetPassword } from './pages/auth/ResetPassword';
import { VerifyEmail } from './pages/auth/VerifyEmail';
import { Onboarding } from './pages/learner/Onboarding';
import { Dashboard } from './pages/learner/Dashboard';
import { Competencies } from './pages/learner/Competencies';
import { CompetencyDetail } from './pages/learner/CompetencyDetail';
import { SkillGaps } from './pages/learner/SkillGaps';
import { SkillGapDetail } from './pages/learner/SkillGapDetail';
import { Recommendations } from './pages/learner/Recommendations';
import { LearningPath } from './pages/learner/LearningPath';
import { Progress } from './pages/learner/Progress';
import { Profile } from './pages/learner/Profile';
import { Settings } from './pages/learner/Settings';
import { Notifications } from './pages/learner/Notifications';
import { ExploreLearning } from './pages/learner/ExploreLearning';
import { ResourceDetail } from './pages/learner/ResourceDetail';
import { LearningPlayer } from './pages/learner/LearningPlayer';
import { AssessmentPlayer } from './pages/learner/AssessmentPlayer';
import { AssessmentResult } from './pages/learner/AssessmentResult';
import { CompetencyInsights } from './pages/learner/CompetencyInsights';

import { Workforce } from './pages/admin/Workforce';
import { LearnerDetail } from './pages/admin/LearnerDetail';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { CompetencyManagement } from './pages/admin/CompetencyManagement';
import { CompetencyDetailAdmin } from './pages/admin/CompetencyDetailAdmin';
import { RoleMapping } from './pages/admin/RoleMapping';
import { ContentManagement } from './pages/admin/ContentManagement';
import { QuestionBank } from './pages/admin/QuestionBank';
import { AssessmentManagement } from './pages/admin/AssessmentManagement';
import { ContentUpload } from './pages/admin/ContentUpload';
import { AIAssessmentStudio } from './pages/admin/AIAssessmentStudio';
import { AIQuestionReview } from './pages/admin/AIQuestionReview';
import { IntegrationCenter } from './pages/admin/IntegrationCenter';
import { DepartmentIntelligence } from './pages/admin/DepartmentIntelligence';
import { RoleIntelligence } from './pages/admin/RoleIntelligence';
import { CompetencyHeatmap } from './pages/admin/CompetencyHeatmap';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Root Redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
        </Route>

        {/* Learner Routes */}
        <Route element={<LearnerLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/onboarding/profile" element={<Onboarding />} />
          <Route path="/competencies" element={<Competencies />} />
          <Route path="/competencies/:id" element={<CompetencyDetail />} />
          <Route path="/skill-gaps" element={<SkillGaps />} />
          <Route path="/skill-gaps/:id" element={<SkillGapDetail />} />
          <Route path="/recommendations" element={<Recommendations />} />
          <Route path="/insights" element={<CompetencyInsights />} />
          <Route path="/learning-path" element={<LearningPath />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/explore" element={<ExploreLearning />} />
          <Route path="/learning/:id" element={<ResourceDetail />} />
          <Route path="/learning/:id/player" element={<LearningPlayer />} />
          <Route path="/assessments/:id" element={<AssessmentPlayer />} />
          <Route path="/assessments/:id/result" element={<AssessmentResult />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="departments" element={<DepartmentIntelligence />} />
          <Route path="roles" element={<RoleIntelligence />} />
          <Route path="heatmap" element={<CompetencyHeatmap />} />
          <Route path="workforce" element={<Workforce />} />
          <Route path="workforce/:id" element={<LearnerDetail />} />
          <Route path="competencies" element={<CompetencyManagement />} />
          <Route path="competencies/:id" element={<CompetencyDetailAdmin />} />
          <Route path="roles" element={<RoleMapping />} />
          <Route path="analytics" element={<div>Analytics Dashboard</div>} />
          <Route path="content" element={<ContentManagement />} />
          <Route path="ai-upload" element={<ContentUpload />} />
          <Route path="ai-studio" element={<AIAssessmentStudio />} />
          <Route path="ai-review" element={<AIQuestionReview />} />
          <Route path="questions" element={<QuestionBank />} />
          <Route path="assessments" element={<AssessmentManagement />} />
          <Route path="integrations" element={<IntegrationCenter />} />
          <Route path="settings" element={<div>Platform Settings</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
