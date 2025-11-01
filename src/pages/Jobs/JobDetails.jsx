// src/pages/JobDetails.jsx

import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Edit3, Archive, RefreshCcw } from "lucide-react";
import JobModal from "../../components/Modal/JobModal";

function JobDetails() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      setLoading(true);
      setError(null);

      // ✅ Use local API in dev, fallback JSON in production
      const apiUrl = import.meta.env.DEV
        ? `/api/jobs/${jobId}`
        : `${window.location.origin}/mock/jobs.json`;

      try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error(`Job not found. Status: ${response.status}`);
        const data = await response.json();

        // ✅ In production, extract job from JSON list
        const foundJob = import.meta.env.DEV
          ? data
          : (data.find((j) => String(j.id) === String(jobId)) || null);

        if (!foundJob) throw new Error("Job not found in data file.");
        setJob(foundJob);
      } catch (err) {
        console.error("Fetch job failed:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [jobId]);

  const handleArchive = async () => {
    if (
      !job ||
      !window.confirm(
        `Are you sure you want to ${
          job.status === "active" ? "archive" : "unarchive"
        } this job?`
      )
    )
      return;

    try {
      const newStatus = job.status === "active" ? "archived" : "active";

      // ✅ Only send PATCH in dev; in prod, just simulate change
      if (import.meta.env.DEV) {
        const response = await fetch(`/api/jobs/${jobId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        });
        if (!response.ok) throw new Error("Failed to update job status.");
        const updatedJob = await response.json();
        setJob(updatedJob);
      } else {
        setJob({ ...job, status: newStatus }); // Simulate update in prod
      }
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const handleEdit = () => setIsModalOpen(true);
  const handleModalClose = () => setIsModalOpen(false);

  const handleJobSubmitted = async () => {
    try {
      if (import.meta.env.DEV) {
        const res = await fetch(`/api/jobs/${jobId}`);
        if (res.ok) {
          const updated = await res.json();
          setJob(updated);
        }
      }
    } catch (e) {
      console.error("Error refreshing job:", e);
    }
    handleModalClose();
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen text-indigo-600 text-lg font-semibold animate-pulse">
        Loading Job Details...
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center">
        <p className="text-red-600 text-lg font-medium mb-4">Error: {error}</p>
        <button
          onClick={() => navigate("/jobs")}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg shadow-md transition-all"
        >
          ← Back to Jobs Board
        </button>
      </div>
    );

  if (!job)
    return (
      <div className="flex items-center justify-center h-screen text-gray-600">
        Job not found.
      </div>
    );

  return (
    <div className="w-screen min-h-[calc(100vh-64px)] bg-gray-50 flex flex-col overflow-y-auto">
      {/* HEADER SECTION */}
      <div className="bg-linear-to-r from-indigo-600 to-purple-600 text-white p-8 rounded-b-3xl shadow-lg flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">{job.title}</h1>
          <p className="mt-2 text-indigo-100 text-sm">Job ID: {jobId}</p>
        </div>
        <div
          className={`px-4 py-1.5 text-sm font-semibold rounded-full shadow-md ${
            job.status === "active"
              ? "bg-green-100 text-green-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {job.status.toUpperCase()}
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex flex-col bg-white mx-8 mt-8 rounded-2xl shadow-xl p-8 transition-all duration-300 hover:shadow-2xl">
        <p className="text-gray-700 text-lg leading-relaxed mb-8">
          {job.description || "No description provided for this job yet."}
        </p>

        <div className="grid sm:grid-cols-2 gap-6 text-gray-700 mb-10">
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 hover:border-indigo-300 transition">
            <p className="text-sm text-gray-500">Slug</p>
            <h4 className="text-lg font-semibold mt-1">{job.slug}</h4>
          </div>
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 hover:border-indigo-300 transition">
            <p className="text-sm text-gray-500">Order</p>
            <h4 className="text-lg font-semibold mt-1">{job.order}</h4>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex flex-wrap gap-4 mb-10">
          <button
            onClick={handleEdit}
            className="flex items-center gap-2 px-6 py-2.5 bg-linear-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg hover:from-indigo-500 hover:to-purple-500 transform hover:scale-105 transition-all"
          >
            <Edit3 size={18} />
            Edit Job
          </button>

          <button
            onClick={handleArchive}
            className={`flex items-center gap-2 px-6 py-2.5 font-semibold rounded-xl shadow-md transform hover:scale-105 transition-all ${
              job.status === "active"
                ? "bg-linear-to-r from-yellow-500 to-orange-500 text-white hover:from-yellow-400 hover:to-orange-400"
                : "bg-linear-to-r from-green-500 to-emerald-500 text-white hover:from-green-400 hover:to-emerald-400"
            }`}
          >
            {job.status === "active" ? (
              <>
                <Archive size={18} />
                Archive Job
              </>
            ) : (
              <>
                <RefreshCcw size={18} />
                Unarchive Job
              </>
            )}
          </button>
        </div>

        {/* ASSESSMENT SECTION */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border-t-4 border-indigo-500">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            🧠 Assessment Management
          </h2>
          <p className="text-gray-600 mb-6">
            Manage or build assessments for this job position below.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              to={`/jobs/${jobId}/builder`}
              className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-lg font-medium shadow-md transition transform hover:scale-105"
            >
              🛠️ Go to Assessment Builder
            </Link>
            <Link
              to={`/assessment-form/${jobId}`}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-medium shadow-md transition transform hover:scale-105"
            >
              📝 Open Candidate Form
            </Link>
          </div>
        </div>
      </div>

      {/* Job Edit Modal */}
      <JobModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        jobData={job}
        onJobSubmitted={handleJobSubmitted}
      />
    </div>
  );
}

export default JobDetails;



