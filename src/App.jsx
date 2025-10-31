import { Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import HomePage from "./pages/HomePage";
import JobsBoard from "./pages/Jobs/JobsBoard";
import JobDetails from "./pages/Jobs/JobDetails";
import Candidates from "./pages/Candidate/Candidates";
import CandidateProfile from "./pages/Candidate/CandidateProfile";
import AssessmentsPage from "./pages/Assessment/AssessmentsPage";
import AssessmentBuilder from "./pages/Assessment/AssessmentBuilder";
import AssessmentFormRuntime from "./pages/Assessment/AssessmentFormRuntime";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      {/* Public Auth pages */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<HomePage />} />

        <Route path="jobs">
          <Route index element={<JobsBoard />} />
          <Route path=":jobId" element={<JobDetails />} />
          <Route path=":jobId/builder" element={<AssessmentBuilder />} /> 
        </Route>

        <Route path="candidates">
          <Route index element={<Candidates />} />
          <Route path=":id" element={<CandidateProfile />} />
        </Route>

        <Route path="assessments" element={<AssessmentsPage />} />
        <Route path="assessment-form/:jobId" element={<AssessmentFormRuntime />} />

        {/* 404 */}
        <Route
          path="*"
          element={<div className="p-8 text-center text-xl">404 - Page Not Found</div>}
        />
      </Route>
    </Routes>
  );
}

export default App;



