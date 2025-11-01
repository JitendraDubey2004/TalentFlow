// src/pages/CandidateProfile.jsx

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Timeline from "../../components/CandidateModule/Timeline";
import NotesSection from "../../components/CandidateModule/NotesSection";
import db from "../../api/db/dexie";

function CandidateProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const candidateId = Number(id);

  const [candidate, setCandidate] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const StageStyles = {
    applied: "bg-blue-100 text-blue-800",
    screen: "bg-purple-100 text-purple-800",
    tech: "bg-orange-100 text-orange-800",
    offer: "bg-yellow-100 text-yellow-800",
    hired: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
  };

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const candidateData = await db.candidates.get(candidateId);
      if (!candidateData) throw new Error("Candidate not found in local database.");

      const timelineData = await db.candidateTimelines
        .where("candidateId")
        .equals(candidateId)
        .toArray();

      setCandidate(candidateData);
      setTimeline(timelineData || []);
    } catch (err) {
      console.error("Profile fetch error:", err);
      setError("Failed to load candidate or timeline data.");
    } finally {
      setLoading(false);
    }
  }, [candidateId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  //  Loading UI
  if (loading)
    return (
      <div className="w-screen min-h-[calc(100vh-64px)] bg-gray-50 flex items-center justify-center">
        <div className="text-indigo-600 text-lg font-semibold animate-pulse">
          Loading Candidate Profile...
        </div>
      </div>
    );

  //  Error UI
  if (error)
    return (
      <div className="w-screen min-h-[calc(100vh-64px)] bg-gray-50 flex items-center justify-center">
        <div className="text-red-600 bg-red-50 border border-red-200 px-6 py-4 rounded-lg shadow">
          Error: {error}
        </div>
      </div>
    );

  //  No Candidate
  if (!candidate)
    return (
      <div className="w-screen min-h-[calc(100vh-64px)] bg-gray-50 flex flex-col items-center justify-center text-gray-600">
        <p className="text-lg mb-4">Candidate not found.</p>
        <button
          onClick={() => navigate("/candidates")}
          className="px-6 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-all"
        >
          Go to Pipeline
        </button>
      </div>
    );

  const currentStageStyle = StageStyles[candidate.stage] || StageStyles.applied;

  return (
    <div className="w-screen min-h-[calc(100vh-64px)] bg-gray-50 flex flex-col p-8 overflow-y-auto">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* 🧑‍💼 Candidate Info Card */}
        <div className="bg-white shadow-xl rounded-2xl p-8 border-t-4 border-indigo-600 hover:shadow-indigo-100 transition-all duration-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900">
                {candidate.name}
              </h1>
              <p className="text-gray-600 text-lg mt-1">{candidate.email}</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-lg">
                ID: {candidate.id}
              </span>
              <span
                className={`text-sm font-bold px-3 py-1 rounded-full shadow-sm ${currentStageStyle}`}
              >
                {candidate.stage?.toUpperCase() || "UNKNOWN"}
              </span>
            </div>
          </div>
        </div>

        {/*  Quick Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-100">
            <h3 className="text-sm text-gray-500 mb-2">Email</h3>
            <p className="text-gray-900 font-semibold">{candidate.email}</p>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-100">
            <h3 className="text-sm text-gray-500 mb-2">Current Stage</h3>
            <p className="text-gray-900 font-semibold capitalize">
              {candidate.stage}
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-100">
            <h3 className="text-sm text-gray-500 mb-2">Candidate ID</h3>
            <p className="text-gray-900 font-semibold">#{candidate.id}</p>
          </div>
        </div>

        {/*  Timeline & Notes */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-md border border-gray-100 p-6 hover:shadow-indigo-100 transition-all">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
              Activity Timeline
            </h2>
            <Timeline timeline={timeline} />
          </div>

          <div className="lg:col-span-1 bg-white rounded-2xl shadow-md border border-gray-100 p-6 hover:shadow-indigo-100 transition-all">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
              Notes
            </h2>
            <NotesSection candidateId={candidateId} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CandidateProfile;


