import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import QuestionEditor from "../../components/AssessmentModule/QuestionEditor";
import QuestionRenderer from "../../components/AssessmentModule/QuestionRenderer";
import { PlusCircle, Save, Trash2 } from "lucide-react";

function AssessmentBuilder() {
  const { jobId } = useParams();
  const jobIdInt = parseInt(jobId, 10);

  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [builderState, setBuilderState] = useState({ sections: [] });
  const [nextQuestionId, setNextQuestionId] = useState(1);

  const allQuestionIds = builderState.sections.flatMap((s) =>
    s.questions.map((q) => q.id)
  );

  // ✅ Handle API base (works for both dev + production)
  const API_BASE =
    import.meta.env.MODE === "development"
      ? "/api"
      : `${window.location.origin}/api`;

  // === Fetch assessment ===
  const fetchAssessment = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/assessments/${jobIdInt}`);
      if (!response.ok) throw new Error("Failed to fetch assessment");
      const data = await response.json();

      const normalizedSections = (data.sections || []).map((s) => ({
        ...s,
        questions: Array.isArray(s.questions) ? s.questions : [],
      }));

      setBuilderState({ sections: normalizedSections });

      const allIds = normalizedSections.flatMap((s) =>
        s.questions.map((q) => q.id || 0)
      );
      const maxId = allIds.length > 0 ? Math.max(...allIds) : 0;
      setNextQuestionId(maxId + 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [API_BASE, jobIdInt]);

  useEffect(() => {
    fetchAssessment();
  }, [fetchAssessment]);

  // === CRUD Logic ===
  const updateQuestion = useCallback((sectionId, updatedQuestion) => {
    setBuilderState((prev) => {
      const newSections = prev.sections.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              questions: s.questions.map((q) =>
                q.id === updatedQuestion.id ? updatedQuestion : q
              ),
            }
          : s
      );
      return { ...prev, sections: newSections };
    });
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/assessments/${jobIdInt}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(builderState),
      });
      if (!response.ok) throw new Error("Failed to save assessment structure.");
      alert("✅ Assessment saved successfully!");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAssessment = async () => {
    if (!window.confirm("Are you sure you want to DELETE this assessment?"))
      return;
    try {
      setIsSaving(true);
      const response = await fetch(`${API_BASE}/assessments/${jobIdInt}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete assessment.");
      alert("Assessment deleted successfully!");
      setBuilderState({ sections: [] });
      setNextQuestionId(1);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  // === Section + Question handlers ===
  const addSection = () => {
    setBuilderState((prev) => ({
      ...prev,
      sections: [
        ...prev.sections,
        {
          id: Date.now(),
          title: `Section ${prev.sections.length + 1}`,
          questions: [],
        },
      ],
    }));
  };

  const deleteSection = (id) =>
    setBuilderState((prev) => ({
      ...prev,
      sections: prev.sections.filter((s) => s.id !== id),
    }));

  const updateSectionTitle = (id, newTitle) =>
    setBuilderState((prev) => ({
      ...prev,
      sections: prev.sections.map((s) =>
        s.id === id ? { ...s, title: newTitle } : s
      ),
    }));

  const addQuestion = (sectionId) => {
    const newQuestion = {
      id: nextQuestionId,
      text: `Question ${nextQuestionId}`,
      type: "short-text",
      validation: { required: false },
      options: [],
    };
    setBuilderState((prev) => ({
      ...prev,
      sections: prev.sections.map((s) =>
        s.id === sectionId
          ? { ...s, questions: [...s.questions, newQuestion] }
          : s
      ),
    }));
    setNextQuestionId((p) => p + 1);
  };

  const deleteQuestion = (sectionId, qid) =>
    setBuilderState((prev) => ({
      ...prev,
      sections: prev.sections.map((s) =>
        s.id === sectionId
          ? { ...s, questions: s.questions.filter((q) => q.id !== qid) }
          : s
      ),
    }));

  // === UI ===
  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen text-indigo-600 text-lg">
        Loading Builder...
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen text-red-600 text-lg">
        Error: {error}
      </div>
    );

  return (
    <div className="w-screen min-h-[calc(100vh-64px)] bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-8 overflow-y-auto">
      {/* Header */}
      <Motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-gray-200 pb-5"
      >
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4 md:mb-0">
          ✏️ Assessment Builder
          <span className="text-indigo-600 ml-2"> (Job #{jobId})</span>
        </h1>

        <div className="flex gap-3">
          {/* Delete Button */}
          <Motion.button
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.96 }}
            onClick={handleDeleteAssessment}
            disabled={isSaving || builderState.sections.length === 0}
            className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-700 text-white font-semibold px-5 py-2.5 rounded-xl shadow-md hover:from-red-600 hover:to-red-800 transition-all disabled:opacity-50"
          >
            <Trash2 size={18} />
            Delete
          </Motion.button>

          {/* Save Button */}
          <Motion.button
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.96 }}
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-semibold px-5 py-2.5 rounded-xl shadow-md hover:from-emerald-600 hover:to-green-700 transition-all disabled:opacity-50"
          >
            <Save size={18} />
            {isSaving ? "Saving..." : "Save"}
          </Motion.button>
        </div>
      </Motion.div>

      <p className="text-gray-600 mb-10 text-sm md:text-base">
        Build and preview interactive assessments below. Use sections to
        organize related questions.
      </p>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* --- Builder Panel --- */}
        <Motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white/70 backdrop-blur-lg border border-gray-200 rounded-2xl shadow-lg p-6"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              Question Editor
            </h2>
            <Motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              onClick={addSection}
              className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-xl shadow hover:from-indigo-600 hover:to-purple-700 transition-all"
            >
              <PlusCircle size={18} /> Add Section
            </Motion.button>
          </div>

          {builderState.sections.map((section) => (
            <Motion.div
              key={section.id}
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 200, damping: 18 }}
              className="mb-8 border border-gray-300 rounded-xl p-5 shadow-sm bg-white"
            >
              <div className="flex justify-between items-center mb-3">
                <input
                  type="text"
                  value={section.title}
                  onChange={(e) =>
                    updateSectionTitle(section.id, e.target.value)
                  }
                  className="text-xl font-bold p-1 border-b border-transparent focus:border-indigo-500 outline-none bg-transparent w-3/4"
                />
                <button
                  onClick={() => deleteSection(section.id)}
                  className="text-red-500 hover:text-red-700 text-sm font-medium"
                >
                  Delete
                </button>
              </div>

              {section.questions.map((q) => (
                <QuestionEditor
                  key={q.id}
                  question={q}
                  onUpdate={(u) => updateQuestion(section.id, u)}
                  onDelete={() => deleteQuestion(section.id, q.id)}
                  allQuestionIds={allQuestionIds}
                />
              ))}

              {section.questions.length === 0 && (
                <p className="text-gray-500 italic text-sm">
                  No questions yet in this section.
                </p>
              )}

              <Motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => addQuestion(section.id)}
                className="mt-4 flex items-center gap-2 bg-gradient-to-r from-teal-500 to-emerald-600 text-white font-semibold px-4 py-2 rounded-xl shadow-md hover:from-teal-600 hover:to-emerald-700 transition-all"
              >
                <PlusCircle size={18} /> Add Question
              </Motion.button>
            </Motion.div>
          ))}

          {builderState.sections.length === 0 && (
            <p className="text-gray-500 italic text-sm mt-6">
              Start by adding a section above.
            </p>
          )}
        </Motion.div>

        {/* --- Live Preview --- */}
        <Motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="border-l-4 border-indigo-400 p-6 bg-indigo-50/80 rounded-2xl shadow-inner"
        >
          <h2 className="text-2xl font-semibold text-indigo-800 mb-6">
            Live Preview
          </h2>

          {builderState.sections.length === 0 ? (
            <p className="text-gray-500 italic">
              Preview will appear here as you add sections and questions.
            </p>
          ) : (
            builderState.sections.map((section) => (
              <div key={section.id} className="mb-6">
                <h3 className="text-xl font-bold text-indigo-700 mb-3">
                  {section.title}
                </h3>
                {section.questions.map((question) => (
                  <QuestionRenderer
                    key={question.id}
                    question={question}
                    onChange={() => {}}
                    response={null}
                    isPreview={true}
                  />
                ))}
              </div>
            ))
          )}
        </Motion.div>
      </div>
    </div>
  );
}

export default AssessmentBuilder;



