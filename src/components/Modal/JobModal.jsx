// src/components/Modal/JobModal.jsx

import React, { useState } from "react";
import JobForm from "../Forms/JobForm";
import { X } from "lucide-react";
import db from "../../api/db/dexie";

function JobModal({ isOpen, onClose, jobData, onJobSubmitted }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmission = async (formData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      if (jobData?.id) {
        //  Edit job in Dexie
        await db.jobs.update(jobData.id, formData);
      } else {
        //  Add new job
        await db.jobs.add({
          ...formData,
          createdAt: new Date().toISOString(),
        });
      }

      if (onJobSubmitted) onJobSubmitted();
      onClose();
    } catch (err) {
      console.error("Dexie Job Error:", err);
      setError("Failed to save job: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const title = jobData ? "✏️ Edit Job" : "🚀 Create New Job";

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl w-[90%] sm:w-[500px] transform transition-all animate-slideUp relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-t-2xl flex justify-between items-center text-white shadow-md">
          <h3 className="text-xl font-semibold tracking-wide">{title}</h3>
          <button
            onClick={onClose}
            className="hover:bg-white/20 p-2 rounded-full transition-all"
          >
            <X size={22} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
              {error}
            </div>
          )}
          <JobForm
            initialData={jobData}
            onSubmit={handleSubmission}
            onCancel={onClose}
            isEditing={!!jobData?.id}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from {
            transform: translateY(30px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.35s ease-out;
        }
      `}</style>
    </div>
  );
}

export default JobModal;

