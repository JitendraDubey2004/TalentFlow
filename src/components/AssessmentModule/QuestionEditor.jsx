// src/components/AssessmentModule/QuestionEditor.jsx

import React, { useState, useEffect } from "react";

const QUESTION_TYPES = [
  { id: "short-text", label: "Short Text" },
  { id: "long-text", label: "Long Text" },
  { id: "numeric", label: "Numeric (Range)" },
  { id: "single-choice", label: "Single Choice" },
  { id: "multi-choice", label: "Multi-Choice" },
  { id: "file-upload", label: "File Upload (Stub)" },
];

function QuestionEditor({
  question = {},
  onUpdate = () => {},
  onDelete = () => {},
  allQuestionIds = [],
}) {
  const [formData, setFormData] = useState(question);

  useEffect(() => {
    setFormData(question);
  }, [question]);

  const updateFormDataAndNotify = (newFormData) => {
    setFormData(newFormData);
    onUpdate(newFormData);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const nextFormData = {
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    };
    updateFormDataAndNotify(nextFormData);
  };

  const handleValidationChange = (name, value) => {
    const nextValidation = {
      ...formData.validation,
      [name]: value,
    };
    updateFormDataAndNotify({
      ...formData,
      validation: nextValidation,
    });
  };

  const handleConditionChange = (name, value) => {
    const nextCondition = {
      ...formData.condition,
      [name]: value,
    };
    updateFormDataAndNotify({
      ...formData,
      condition: nextCondition,
    });
  };

  const handleOptionsChange = (e) => {
    const options = e.target.value.split("\n").filter((o) => o.trim() !== "");
    updateFormDataAndNotify({
      ...formData,
      options: options,
    });
  };

  const isChoiceType = ["single-choice", "multi-choice"].includes(formData.type);
  const isNumericType = formData.type === "numeric";
  const otherQuestionIds = allQuestionIds.filter((id) => id !== question.id);

  return (
    <div className="border border-indigo-200 p-5 rounded-2xl bg-linear-to-br from-white via-indigo-50 to-purple-50 mb-6 shadow-sm transition-all duration-200 hover:shadow-lg hover:border-indigo-300">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 border-b pb-2">
        <h4 className="font-semibold text-gray-900 text-lg">
          🧩 Question {question.id}
        </h4>
        <button
          onClick={() => onDelete(question.id)}
          className="text-red-500 hover:text-red-700 text-sm font-medium transition"
        >
          Delete ✖
        </button>
      </div>

      {/* Question Text */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Question Text
        </label>
        <input
          type="text"
          name="text"
          value={formData.text || ""}
          onChange={handleChange}
          placeholder="Enter your question..."
          className="w-full border border-gray-300 p-2 rounded-lg text-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 bg-white"
        />
      </div>

      {/* Question Type */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Question Type
        </label>
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="w-full border border-gray-300 p-2 rounded-lg text-sm bg-white focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
        >
          {QUESTION_TYPES.map((t) => (
            <option key={t.id} value={t.id}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      {/* Options (for Choice Types) */}
      {isChoiceType && (
        <div className="mb-4 bg-white border border-gray-200 rounded-xl p-3">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Options <span className="text-gray-400">(one per line)</span>
          </label>
          <textarea
            value={formData.options ? formData.options.join("\n") : ""}
            onChange={handleOptionsChange}
            rows="3"
            className="w-full border border-gray-300 p-2 rounded-lg text-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
            placeholder="Option 1&#10;Option 2&#10;Option 3"
          />
        </div>
      )}

      {/* Validation Rules */}
      <div className="mb-4 bg-white border border-gray-200 rounded-xl p-3">
        <h5 className="text-sm font-semibold mb-2 text-indigo-700">
          Validation & Rules ⚙️
        </h5>

        {/* Required Checkbox */}
        <div className="flex items-center mb-3">
          <input
            type="checkbox"
            name="required"
            checked={formData.validation?.required || false}
            onChange={handleChange}
            className="mr-2 accent-indigo-600"
          />
          <label className="text-sm text-gray-700">Required Field</label>
        </div>

        {/* Numeric Range */}
        {isNumericType && (
          <div className="flex space-x-3">
            <input
              type="number"
              placeholder="Min Value"
              value={formData.validation?.min || ""}
              onChange={(e) =>
                handleValidationChange(
                  "min",
                  parseInt(e.target.value) || undefined
                )
              }
              className="border border-gray-300 p-2 rounded-lg text-sm w-1/2 focus:ring-2 focus:ring-indigo-400"
            />
            <input
              type="number"
              placeholder="Max Value"
              value={formData.validation?.max || ""}
              onChange={(e) =>
                handleValidationChange(
                  "max",
                  parseInt(e.target.value) || undefined
                )
              }
              className="border border-gray-300 p-2 rounded-lg text-sm w-1/2 focus:ring-2 focus:ring-indigo-400"
            />
          </div>
        )}
      </div>

      {/* Conditional Logic */}
      <div className="bg-white border border-gray-200 rounded-xl p-3">
        <h6 className="text-sm font-semibold text-indigo-700 mb-2">
          Conditional Logic 🧠
        </h6>
        <p className="text-xs text-gray-500 mb-3">
          Show this question only if another question (Q#) meets a specific
          condition.
        </p>

        <div className="grid grid-cols-3 gap-2">
          <select
            value={formData.condition?.targetQId || ""}
            onChange={(e) =>
              handleConditionChange("targetQId", parseInt(e.target.value))
            }
            className="border border-gray-300 p-2 rounded-lg text-xs bg-white focus:ring-2 focus:ring-indigo-400"
          >
            <option value="">Target Q#</option>
            {otherQuestionIds.map((id) => (
              <option key={id} value={id}>
                Q{id}
              </option>
            ))}
          </select>

          <select
            value={formData.condition?.operator || ""}
            onChange={(e) => handleConditionChange("operator", e.target.value)}
            className="border border-gray-300 p-2 rounded-lg text-xs bg-white focus:ring-2 focus:ring-indigo-400"
          >
            <option value="">Condition</option>
            <option value="===">Is Equal To</option>
            <option value="!==">Is Not Equal To</option>
          </select>

          <input
            type="text"
            placeholder="Value (e.g., 'Yes')"
            value={formData.condition?.value || ""}
            onChange={(e) => handleConditionChange("value", e.target.value)}
            className="border border-gray-300 p-2 rounded-lg text-xs focus:ring-2 focus:ring-indigo-400"
          />
        </div>
      </div>
    </div>
  );
}

export default QuestionEditor;
