// src/components/Modal/CandidateModal.jsx

import React, { useState } from 'react';
import CandidateForm from '../Forms/CandidateForm';
import db from '../../api/db/dexie'; 

function CandidateModal({ isOpen, onClose, onCandidateAdded }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);

  if (!isOpen) return null;

  const handleSubmission = async (formData) => {
    setIsSubmitting(true);
    setApiError(null);

    try {
      //  Add candidate directly to Dexie database
      await db.candidates.add({
        name: formData.name,
        email: formData.email,
        stage: 'applied',
        appliedAt: new Date().toISOString(),
      });

     
      if (onCandidateAdded) onCandidateAdded();
      onClose();
    } catch (error) {
      console.error('Dexie Add Error:', error);
      setApiError('Failed to add candidate: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-gray-900 bg-opacity-70 flex items-center justify-center z-50 transition-opacity"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-md m-4 transform transition-transform"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-800">Add New Candidate</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 transition-colors"
            disabled={isSubmitting}
          >
            &times;
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {/* Error Display */}
          {apiError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
              <p className="text-sm">{apiError}</p>
            </div>
          )}

          {/* Candidate Form */}
          <CandidateForm
            onSubmit={handleSubmission}
            onCancel={onClose}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
}

export default CandidateModal;
