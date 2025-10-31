// src/components/Modal/JobModal.jsx

import React from "react";
import JobForm from "../Forms/JobForm";
import { X } from "lucide-react";

function JobModal({ isOpen, onClose, jobData, onJobSubmitted }) {
  if (!isOpen) return null;

  const handleSubmission = async (data) => {
    const isEditing = !!jobData?.id;
    const url = isEditing ? `/api/jobs/${jobData.id}` : "/api/jobs";
    const method = isEditing ? "PATCH" : "POST";

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "API call failed.");
    }

    onJobSubmitted();
  };

  const title = jobData ? "✏️ Edit Job" : "🚀 Create New Job";

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn"
      onClick={onClose}
    >
      {/* Modal Container */}
      <div
        className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl w-[90%] sm:w-[500px] transform transition-all animate-slideUp relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-linear-to-r from-indigo-600 to-purple-600 rounded-t-2xl flex justify-between items-center text-white shadow-md">
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
          <JobForm
            initialData={jobData}
            onSubmit={handleSubmission}
            onCancel={onClose}
            isEditing={!!jobData?.id}
          />
        </div>
      </div>

      {/* Custom Animations */}
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
