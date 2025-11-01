// src/pages/Assessment/AssessmentsPage.jsx

import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import { PlusCircle, Edit3, FileText } from "lucide-react";

function AssessmentsPage() {
  const navigate = useNavigate();
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleCreateNew = () => {
    alert(
      "Please navigate to a Job's details page to begin building a job-specific assessment."
    );
    navigate("/jobs");
  };

  const fetchAllAssessments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // ✅ Always prefix with relative URL (works in production too)
      const jobsResponse = await fetch("/api/jobs?pageSize=1000&status=active");

      if (!jobsResponse.ok) throw new Error("Failed to fetch jobs.");

      const jobData = await jobsResponse.json();
      const jobIds = jobData.data.map((job) => job.id);

      // ✅ Fetch assessments in parallel for each job
      const assessmentPromises = jobIds.map(async (jobId) => {
        const res = await fetch(`/api/assessments/${jobId}`);
        if (!res.ok) return null;

        const assessment = await res.json();

        if (assessment?.sections?.length > 0) {
          const job = jobData.data.find((j) => j.id === jobId);
          return {
            ...assessment,
            title: job?.title || `Assessment for Job #${jobId}`,
            jobId,
          };
        }
        return null;
      });

      const results = await Promise.all(assessmentPromises);
      setAssessments(results.filter(Boolean));
    } catch (err) {
      console.error("Error fetching assessments:", err);
      setError(err.message || "Failed to fetch assessment data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllAssessments();
  }, [fetchAllAssessments]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen text-indigo-600 text-lg">
        Loading Assessments...
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen text-red-600 text-lg">
        Error: {error}
      </div>
    );

  return (
    <div className="w-screen min-h-[calc(100vh-64px)] bg-gradient-to-br from-gray-50 via-white to-indigo-50 p-8 overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-gray-200 pb-5">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4 md:mb-0">
          Assessment Overview
          <span className="text-indigo-600"> ({assessments.length} Found)</span>
        </h1>

        <Motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleCreateNew}
          className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all"
        >
          <PlusCircle size={20} />
          Create New Assessment
        </Motion.button>
      </div>

      <p className="text-gray-600 mb-10 text-sm md:text-base">
        This page lists currently saved assessments. Click{" "}
        <span className="font-semibold text-indigo-600">‘Edit’</span> to open
        the Builder.
      </p>

      {/* Grid */}
      <Motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { staggerChildren: 0.1 },
          },
        }}
      >
        {assessments.length > 0 ? (
          assessments.map((assessment) => (
            <Motion.div
              key={assessment.jobId}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="bg-white/80 backdrop-blur-lg border border-gray-200 rounded-2xl shadow-sm hover:shadow-lg p-6 transition-all"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {assessment.title}
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                {assessment.sections.length} Sections | Last Saved:{" "}
                {assessment.updatedAt
                  ? new Date(assessment.updatedAt).toLocaleDateString()
                  : "N/A"}
              </p>

              <div className="flex gap-3">
                <Link
                  to={`/jobs/${assessment.jobId}/builder`}
                  className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700 transition"
                >
                  <Edit3 size={16} /> Edit
                </Link>

                <Link
                  to={`/assessment-form/${assessment.jobId}`}
                  className="flex items-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition hover:bg-gray-300"
                >
                  <FileText size={16} /> Open Form
                </Link>
              </div>
            </Motion.div>
          ))
        ) : (
          <div className="text-center p-10 text-gray-500 col-span-full bg-white/60 backdrop-blur rounded-xl shadow-inner">
            No saved assessments found. Create one via a Job Details page.
          </div>
        )}
      </Motion.div>
    </div>
  );
}

export default AssessmentsPage;



