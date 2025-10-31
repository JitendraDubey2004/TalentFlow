import { Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import HomePage from "./pages/HomePage";
import JobsBoard from "./pages/Jobs/JobsBoard";
import JobDetails from "./pages/Jobs/JobDetails";
import Candidates from "./pages/Candidate/Candidates";
import CandidateProfile from "./pages/Candidate/CandidateProfile";
import AssessmentsPage from "./pages/Assessment/AssessmentsPage";
import AssessmentBuilder from "./pages/Assessment/AssessmentBuilder";
import AssessmentFormRuntime from "./pages/Assessment/AssessmentFormRuntime";

function App() {
  return (
    <Routes>
  
  
      <Route
        path="/"
        element={
       
            <Layout />
     
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



