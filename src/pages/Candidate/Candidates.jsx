// src/pages/Candidates.jsx

import React, { useState, useEffect, useCallback } from 'react';
import CandidateList from '../../components/CandidateModule/CandidateList';
import CandidateModal from '../../components/Modal/CandidateModal';
import KanbanBoard from '../../components/CandidateModule/KanbanBoard';

const CANDIDATE_STAGES = ['applied', 'screen', 'tech', 'offer', 'hired', 'rejected'];

function Candidates() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState('kanban');
  const [stageFilter, setStageFilter] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Fetch Candidates 
  const fetchCandidates = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/candidates?stage=${stageFilter}`);
      if (!response.ok) throw new Error(`Failed to fetch candidates: ${response.status}`);
      const result = await response.json();
      setCandidates(result.data);
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Failed to load candidates.');
    } finally {
      setLoading(false);
    }
  }, [stageFilter]);

  useEffect(() => {
    fetchCandidates();
  }, [fetchCandidates]);

  // Handle Stage Change 
  const handleStageChange = async (candidateId, newStage) => {
    const candidateToUpdate = candidates.find((c) => c.id === candidateId);
    if (!candidateToUpdate) return;

    // Optimistic UI update
    setCandidates((prev) =>
      prev.map((c) => (c.id === candidateId ? { ...c, stage: newStage } : c))
    );

    try {
      const response = await fetch(`/api/candidates/${candidateId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage: newStage }),
      });

      if (!response.ok) throw new Error('Stage transition failed.');
    } catch (err) {
      alert(`Error: ${err.message}`);
      fetchCandidates(); 
    }
  };

  // Add Candidate Handler 
  const handleCandidateAdded = () => {
    fetchCandidates();
    setIsAddModalOpen(false);
  };

  // Loading and Error States
  if (loading)
    return (
      <div className="flex items-center justify-center h-[80vh] bg-gray-50">
        <div className="text-lg font-semibold text-indigo-600 animate-pulse">
          Loading Candidate Pipeline...
        </div>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center h-[80vh] bg-gray-50">
        <div className="text-lg font-semibold text-red-600">{error}</div>
      </div>
    );

  return (
    <div className="w-screen min-h-[calc(100vh-64px)] bg-linear-to-b from-gray-50 via-white to-gray-100 flex flex-col px-8 py-10">

      {/* Header */}
      <div className="bg-linear-to-r from-indigo-50 via-white to-indigo-50 py-8 px-10 rounded-3xl shadow-md mb-10 border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight">
              Candidate <span className="text-indigo-600">Pipeline</span>
            </h1>
            <p className="text-gray-500 mt-2 text-base">
              Manage your recruitment process visually or through an optimized list view.
            </p>
          </div>

          {/* Add Candidate Button */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-linear-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white px-6 py-3 rounded-xl text-sm font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.03] transition-all duration-200"
          >
            + Add Candidate
          </button>
        </div>
      </div>

      {/* Control bar */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-8 p-5 bg-white rounded-2xl shadow-lg border border-gray-200">

        {/* View Toggle Buttons */}
        <div className="flex bg-gray-100 rounded-xl p-1 shadow-inner">
          <button
            onClick={() => setView('kanban')}
            className={`px-5 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
              view === 'kanban'
                ? 'bg-linear-to-r from-indigo-600 to-indigo-500 text-white shadow-md scale-105'
                : 'text-gray-700 hover:bg-gray-200'
            }`}
          >
            Kanban Board
          </button>
          <button
            onClick={() => setView('list')}
            className={`px-5 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
              view === 'list'
                ? 'bg-linear-to-r from-indigo-600 to-indigo-500 text-white shadow-md scale-105'
                : 'text-gray-700 hover:bg-gray-200'
            }`}
          >
            List View
          </button>
        </div>

        {/* Stage Filter */}
        <select
          value={stageFilter}
          onChange={(e) => setStageFilter(e.target.value)}
          className="border border-gray-300 p-2.5 rounded-xl bg-white text-sm font-medium shadow-sm hover:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
          disabled={view === 'kanban'}
        >
          <option value="">All Stages (Server Filter)</option>
          {CANDIDATE_STAGES.map((stage) => (
            <option key={stage} value={stage}>
              {stage.toUpperCase()}
            </option>
          ))}
        </select>
      </div>

      {/*Content*/}
      <div className="flex-1 rounded-xl shadow-sm">
        {view === 'kanban' ? (
          <KanbanBoard allCandidates={candidates} onStageChange={handleStageChange} />
        ) : (
          <CandidateList candidates={candidates} stageFilter={stageFilter} />
        )}
      </div>

      {/*Add Candidate*/}
      <CandidateModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onCandidateAdded={handleCandidateAdded}
      />
    </div>
  );
}

export default Candidates;

