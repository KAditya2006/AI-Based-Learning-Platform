
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PublicLayout } from './layouts/PublicLayout';
import { LearnerLayout } from './layouts/LearnerLayout';
import { AdminLayout } from './layouts/AdminLayout';

// Auth
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { About } from './pages/public/About';
import { ForgotPassword } from './pages/auth/ForgotPassword';
import { ResetPassword } from './pages/auth/ResetPassword';
import { VerifyEmail } from './pages/auth/VerifyEmail';
import { Landing } from './pages/public/Landing';
import { Features } from './pages/public/Features';

// Learner
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
import { ProfileEdit } from './pages/learner/ProfileEdit';
import { Support } from './pages/learner/Support';
import { Settings } from './pages/learner/Settings';
import { Notifications } from './pages/learner/Notifications';
import { ExploreLearning } from './pages/learner/ExploreLearning';
import { ResourceDetail } from './pages/learner/ResourceDetail';
import { LearningPlayer } from './pages/learner/LearningPlayer';
import { AssessmentPlayer } from './pages/learner/AssessmentPlayer';
import { AssessmentResult } from './pages/learner/AssessmentResult';
import { CompetencyInsights } from './pages/learner/CompetencyInsights';
import { LearningAssistant } from './pages/learner/LearningAssistant';
import { LearningHistory } from './pages/learner/LearningHistory';
import { AssessmentPreparation } from './pages/learner/AssessmentPreparation';

// Admin
import { Workforce } from './pages/admin/Workforce';
import { LearnerDetail } from './pages/admin/LearnerDetail';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { CompetencyManagement } from './pages/admin/CompetencyManagement';
import { CompetencyDetailAdmin } from './pages/admin/CompetencyDetailAdmin';
import { RoleMapping } from './pages/admin/RoleMapping';
import { ContentManagement } from './pages/admin/ContentManagement';
import { QuestionBank } from './pages/admin/QuestionBank';
import { AssessmentManagement } from './pages/admin/AssessmentManagement';
import { AdminSettings } from './pages/admin/AdminSettings';
import { ContentUpload } from './pages/admin/ContentUpload';
import { AIAssessmentStudio } from './pages/admin/AIAssessmentStudio';
import { AIQuestionReview } from './pages/admin/AIQuestionReview';
import { IntegrationCenter } from './pages/admin/IntegrationCenter';
import { DepartmentIntelligence } from './pages/admin/DepartmentIntelligence';
import { RoleIntelligence } from './pages/admin/RoleIntelligence';
import { CompetencyHeatmap } from './pages/admin/CompetencyHeatmap';
import { AuditLogs } from './pages/admin/AuditLogs';
import { Reports } from './pages/admin/Reports';

import { AdminAnalytics } from './pages/admin/AdminAnalytics';



// AI Assistant standalone page
const AIAssistantPage = () => {
  return (
    <div style={{ height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column' }}>
      <LearningAssistant onClose={() => {}} standalone />
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Root Route */}
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />

        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/features" element={<Features />} />
          <Route path="/about" element={<About />} />
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
          <Route path="/profile/edit" element={<ProfileEdit />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/support" element={<Support />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/explore" element={<ExploreLearning />} />
          <Route path="/learning/:id" element={<ResourceDetail />} />
          <Route path="/learning/:id/player" element={<LearningPlayer />} />
          <Route path="/assessments/:id/preparation" element={<AssessmentPreparation />} />
          <Route path="/assessments/:id" element={<AssessmentPlayer />} />
          <Route path="/assessments/:id/result" element={<AssessmentResult />} />
          <Route path="/learning-history" element={<LearningHistory />} />
          {/* AI Assistant standalone route */}
          <Route path="/assistant" element={<AIAssistantPage />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="departments" element={<DepartmentIntelligence />} />
          <Route path="roles" element={<RoleIntelligence />} />
          <Route path="heatmap" element={<CompetencyHeatmap />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="audit-logs" element={<AuditLogs />} />
          <Route path="reports" element={<Reports />} />
          <Route path="workforce" element={<Workforce />} />
          <Route path="workforce/:id" element={<LearnerDetail />} />
          <Route path="competencies" element={<CompetencyManagement />} />
          <Route path="competencies/:id" element={<CompetencyDetailAdmin />} />
          <Route path="role-mapping" element={<RoleMapping />} />
          <Route path="content" element={<ContentManagement />} />
          <Route path="ai-upload" element={<ContentUpload />} />
          <Route path="ai-studio" element={<AIAssessmentStudio />} />
          <Route path="ai-review" element={<AIQuestionReview />} />
          <Route path="questions" element={<QuestionBank />} />
          <Route path="assessments" element={<AssessmentManagement />} />
          <Route path="integrations" element={<IntegrationCenter />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
