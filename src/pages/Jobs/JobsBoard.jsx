// src/pages/JobsBoard.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  DndContext,
  closestCenter,
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import JobModal from '../../components/Modal/JobModal';

const PAGE_SIZE = 10;
const STATUS_COLORS = {
  active: 'bg-emerald-100 text-emerald-700 border border-emerald-300',
  archived: 'bg-amber-100 text-amber-700 border border-amber-300',
};

const getApiBase = () => {
  if (window.location.hostname === 'localhost') {
    return '/api';
  }
  return '/api';
};

//  Sortable Item Component
const SortableJobItem = ({ job, onArchiveToggle, onEdit }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: job.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 100 : 1,
    boxShadow: isDragging
      ? '0 12px 24px rgba(0, 0, 0, 0.15)'
      : '0 2px 6px rgba(0, 0, 0, 0.05)',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative p-5 rounded-xl border border-gray-200 bg-white/90 backdrop-blur-sm shadow-sm hover:shadow-lg transition-all duration-300 flex justify-between items-center cursor-grab ${
        isDragging ? 'opacity-80 scale-[1.02]' : ''
      }`}
      {...attributes}
    >
      <div className="grow" {...listeners}>
        <Link
          to={`/jobs/${job.id}`}
          className="text-xl font-semibold text-indigo-600 hover:text-indigo-800 hover:underline transition-all"
        >
          {job.title}
        </Link>
        <div className="text-sm text-gray-500 mt-1">
          <span className="font-medium text-gray-600">Order:</span> {job.order}{' '}
          | <span className="font-medium text-gray-600">Slug:</span> {job.slug}
        </div>
        <div
          className={`px-3 py-1 text-xs font-semibold rounded-full w-fit mt-2 ${STATUS_COLORS[job.status]}`}
        >
          {job.status.toUpperCase()}
        </div>
      </div>

      <div className="hidden sm:block mx-4 text-sm text-gray-500 w-1/3 text-right">
        {job.tags.map((tag) => (
          <span
            key={tag}
            className="inline-block bg-gray-100 text-gray-700 rounded-full px-3 py-1 text-xs font-medium mr-1 mb-1 shadow-sm"
          >
            #{tag}
          </span>
        ))}
      </div>

      <div className="flex space-x-3">
        <button
          onClick={() => onEdit(job)}
          className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition"
        >
          ✏️ Edit
        </button>
        <button
          onClick={() => onArchiveToggle(job)}
          className={`text-sm font-medium ${
            job.status === 'active'
              ? 'text-amber-600 hover:text-amber-700'
              : 'text-emerald-600 hover:text-emerald-700'
          } transition`}
        >
          {job.status === 'active' ? 'Archive' : 'Unarchive'}
        </button>
      </div>
    </div>
  );
};

function JobsBoard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [jobToEdit, setJobToEdit] = useState(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [meta, setMeta] = useState({});
  const [isReordering, setIsReordering] = useState(false);

  const jobIds = jobs.map((job) => job.id);
  const base = getApiBase();

  // --- Fetch Jobs ---
  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError(null);

    const apiUrl = `${base}/jobs?page=${page}&pageSize=${PAGE_SIZE}&search=${search}&status=${status}&sort=order`;

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const result = await response.json();
      setJobs(result.data || []);
      setMeta(result.meta || {});
    } catch (err) {
      console.error('Failed to fetch jobs:', err);
      setError('Failed to load jobs. Check backend or mock server setup.');
    } finally {
      setLoading(false);
    }
  }, [page, search, status, base]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  // Drag and Drop
  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id || isReordering) return;

    const oldIndex = jobs.findIndex((j) => j.id === active.id);
    const newIndex = jobs.findIndex((j) => j.id === over.id);
    if (oldIndex === newIndex) return;

    const jobId = active.id;
    const fromOrder = jobs[oldIndex].order;
    const toOrder = jobs[newIndex].order;

    const reorderedJobs = [...jobs];
    const [movedJob] = reorderedJobs.splice(oldIndex, 1);
    reorderedJobs.splice(newIndex, 0, movedJob);

    setJobs(reorderedJobs);
    setIsReordering(true);

    try {
      const response = await fetch(`${base}/jobs/${jobId}/reorder`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fromOrder, toOrder }),
      });
      if (!response.ok) throw new Error('Reorder failed');
      fetchJobs();
    } catch (err) {
      alert(`Reordering failed: ${err.message}`);
      fetchJobs();
    } finally {
      setIsReordering(false);
    }
  };

  // Handlers
  const handleEdit = (job) => {
    setJobToEdit(job);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setJobToEdit(null);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setJobToEdit(null);
  };

  const handleJobSubmitted = () => {
    fetchJobs();
    handleModalClose();
  };

  const handleArchiveToggle = async (job) => {
    const originalStatus = job.status;
    const newStatus = originalStatus === 'active' ? 'archived' : 'active';

    if (
      !window.confirm(
        `Are you sure you want to ${newStatus === 'archived' ? 'archive' : 'unarchive'} "${job.title}"?`
      )
    )
      return;

    setJobs((prev) =>
      prev.map((j) => (j.id === job.id ? { ...j, status: newStatus } : j))
    );

    try {
      const response = await fetch(`${base}/jobs/${job.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!response.ok) throw new Error('Server update failed');
    } catch (err) {
      alert(`Error: ${err.message}`);
      fetchJobs();
    }
  };

  // UI
  if (loading)
    return (
      <div className="text-center p-20 text-lg text-indigo-600 animate-pulse">
        Loading Jobs...
      </div>
    );
  if (error)
    return (
      <div className="text-center text-red-600 p-20 text-lg font-semibold">
        ⚠️ {error}
      </div>
    );

  return (
    <div className="w-screen min-h-[calc(100vh-64px)] bg-linear-to-br from-indigo-50 via-white to-purple-50 flex flex-col p-10 overflow-y-auto transition-all">
      <h2 className="text-4xl font-extrabold text-gray-900 mb-6 tracking-tight">
        📋 Jobs Board
      </h2>

      <div className="flex flex-wrap justify-between items-center mb-6 p-5 bg-white/90 backdrop-blur-md border border-gray-200 shadow-md rounded-xl">
        <div className="flex flex-wrap gap-3">
          <input
            type="text"
            placeholder="🔍 Search job title..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm w-64"
            disabled={isReordering}
          />
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            className="border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm bg-white"
            disabled={isReordering}
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <button
          onClick={handleCreate}
          className="bg-linear-to-r from-indigo-600 to-purple-600 text-white px-5 py-2.5 rounded-lg shadow-md hover:shadow-lg hover:scale-[1.03] active:scale-95 transition-all font-semibold"
          disabled={isReordering}
        >
          ➕ Create Job
        </button>
      </div>

      {isReordering && (
        <div className="text-center p-2 mb-4 bg-amber-100 text-amber-700 rounded-lg font-semibold animate-pulse">
          Reordering... Please wait.
        </div>
      )}

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={jobIds} strategy={verticalListSortingStrategy}>
          <div className="min-h-[300px] space-y-4">
            {jobs.length > 0 ? (
              jobs.map((job) => (
                <SortableJobItem
                  key={job.id}
                  job={job}
                  onArchiveToggle={handleArchiveToggle}
                  onEdit={handleEdit}
                />
              ))
            ) : (
              <p className="text-center text-gray-500 p-8 bg-white rounded-lg shadow-md">
                No jobs found.
              </p>
            )}
          </div>
        </SortableContext>
      </DndContext>

      {/*  Pagination  */}
      <div className="flex justify-center items-center gap-4 mt-10">
        <button
          onClick={() => setPage((p) => p - 1)}
          disabled={page <= 1 || isReordering}
          className="bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition disabled:opacity-50"
        >
          ← Previous
        </button>
        <span className="text-gray-700 text-sm font-medium">
          Page {page} of {meta?.totalPages || 1}
        </span>
        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={
            page >= (meta?.totalPages || 1) || jobs.length === 0 || isReordering
          }
          className="bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition disabled:opacity-50"
        >
          Next →
        </button>
      </div>

      <JobModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        jobData={jobToEdit}
        onJobSubmitted={handleJobSubmitted}
      />
    </div>
  );
}

export default JobsBoard;

