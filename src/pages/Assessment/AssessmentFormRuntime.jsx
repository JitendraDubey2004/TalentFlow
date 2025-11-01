// src/pages/Assessment/AssessmentFormRuntime.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import QuestionRenderer from "../../components/AssessmentModule/QuestionRenderer";

// Utility to decide when to show conditional questions
const shouldRenderQuestion = (question, allResponses) => {
  const { condition } = question;
  if (!condition?.targetQId) return true;

  const targetResponse = allResponses[condition.targetQId];
  const requiredValue = condition.value;

  if (condition.operator === "===")
    return String(targetResponse) === String(requiredValue);
  if (condition.operator === "!==")
    return String(targetResponse) !== String(requiredValue);

  return true;
};

// Validation rules
const validateResponse = (question, response) => {
  const { validation, type } = question;
  const value = response;

  if (
    validation?.required &&
    (value === null ||
      value === undefined ||
      value === "" ||
      (Array.isArray(value) && value.length === 0))
  ) {
    return "This field is required.";
  }

  if (!value) return null;

  if (type === "numeric" && !isNaN(value)) {
    const numValue = parseFloat(value);
    if (validation?.min !== undefined && numValue < validation.min)
      return `Value must be at least ${validation.min}.`;
    if (validation?.max !== undefined && numValue > validation.max)
      return `Value must be at most ${validation.max}.`;
  }

  if (
    ["short-text", "long-text"].includes(type) &&
    validation?.maxLength !== undefined &&
    String(value).length > validation.maxLength
  ) {
    return `Response must be under ${validation.maxLength} characters.`;
  }

  return null;
};

// Main Component
export default function AssessmentFormRuntime() {
  const { jobId } = useParams();
  const jobIdInt = parseInt(jobId);
  const [runtimeState, setRuntimeState] = useState({
    assessmentStructure: null,
    formResponses: {},
    validationErrors: {},
  });
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ Use relative or absolute API base depending on environment
  const API_BASE =
    import.meta.env.DEV
      ? "/api"
      : `${window.location.origin}/api`; // Ensures correct path on Vercel/Netlify

  // Fetch assessment data
  const fetchAssessment = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/assessments/${jobIdInt}`);
      if (!response.ok) throw new Error(`Server returned ${response.status}`);
      const data = await response.json();
      setRuntimeState({
        assessmentStructure: data,
        formResponses: {},
        validationErrors: {},
      });
    } catch (error) {
      console.error("❌ Assessment fetch error:", error);
    } finally {
      setLoading(false);
    }
  }, [API_BASE, jobIdInt]);

  useEffect(() => {
    fetchAssessment();
  }, [fetchAssessment]);

  const handleResponseChange = (questionId, value) => {
    setRuntimeState((prev) => ({
      ...prev,
      formResponses: { ...prev.formResponses, [questionId]: value },
      validationErrors: { ...prev.validationErrors, [questionId]: null },
    }));
  };

  const runValidation = (structure, responses) => {
    const errors = {};
    structure.sections.forEach((section) => {
      section.questions.forEach((question) => {
        if (shouldRenderQuestion(question, responses)) {
          const response = responses[question.id];
          const error = validateResponse(question, response);
          if (error) errors[question.id] = error;
        }
      });
    });
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const errors = runValidation(
      runtimeState.assessmentStructure,
      runtimeState.formResponses
    );

    if (Object.keys(errors).length > 0) {
      setRuntimeState((prev) => ({ ...prev, validationErrors: errors }));
      setIsSubmitting(false);
      alert("Please fix the errors in the form.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/assessments/${jobIdInt}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId: jobIdInt,
          candidateId: 1000,
          responses: runtimeState.formResponses,
        }),
      });

      if (!response.ok) throw new Error("Failed to submit assessment.");
      alert("✅ Assessment submitted successfully!");
    } catch (error) {
      alert(`Submission Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading State
  if (loading)
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] text-indigo-600">
        <div className="animate-spin h-10 w-10 border-4 border-indigo-600 border-t-transparent rounded-full mb-4"></div>
        <p className="text-lg font-medium">Loading Assessment...</p>
      </div>
    );

  if (!runtimeState.assessmentStructure)
    return (
      <div className="text-center p-12 text-red-600 text-lg">
        ❌ Assessment not found or is empty.
      </div>
    );

  // Main Form UI
  return (
    <div className="w-screen min-h-[calc(100vh-64px)] bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4 sm:px-8">
      <motion.div
        className="max-w-5xl mx-auto bg-white shadow-2xl rounded-2xl p-10 border border-indigo-100"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-2">
          📝 Complete Your Assessment
        </h1>
        <p className="text-center text-gray-600 mb-10">
          Answer all required questions for Job ID:{" "}
          <span className="font-semibold text-indigo-600">{jobId}</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-8">
          {runtimeState.assessmentStructure.sections.map(
            (section, sectionIndex) => (
              <motion.div
                key={`section-${section.id || sectionIndex}`}
                className="bg-gray-50 border border-indigo-100 rounded-xl shadow-sm p-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <h2 className="text-2xl font-semibold text-indigo-700 mb-4 border-b border-indigo-100 pb-2">
                  {section.title}
                </h2>

                <div className="space-y-6">
                  {section.questions.map((question, qIndex) => (
                    <QuestionRenderer
                      key={`question-${section.id || sectionIndex}-${question.id || qIndex}`}
                      question={question}
                      onChange={handleResponseChange}
                      response={runtimeState.formResponses[question.id]}
                      validationError={
                        runtimeState.validationErrors[question.id]
                      }
                      isPreview={false}
                      allResponses={runtimeState.formResponses}
                    />
                  ))}
                </div>
              </motion.div>
            )
          )}

          {/* Submit Button */}
          <div className="flex justify-center pt-4">
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: isSubmitting ? 1 : 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={`w-full sm:w-1/2 py-3.5 rounded-xl font-semibold text-lg tracking-wide shadow-md transition-all duration-300
              ${
                isSubmitting
                  ? "bg-gradient-to-r from-indigo-300 to-purple-300 text-gray-200 cursor-not-allowed"
                  : "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white hover:shadow-lg hover:shadow-indigo-300/50"
              }`}
            >
              {isSubmitting ? (
                <span className="flex justify-center items-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    ></path>
                  </svg>
                  Submitting...
                </span>
              ) : (
                "Submit Assessment"
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}



