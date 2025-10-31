// src/components/AssessmentModule/QuestionRenderer.jsx

import React from "react";

//  Conditional Logic Helper 
const shouldRenderQuestion = (question, allResponses) => {
  const { condition } = question;
  if (!condition || !condition.targetQId) return true;

  const targetResponse = allResponses[condition.targetQId];
  const requiredValue = condition.value;
  const operator = condition.operator;

  const compareValue =
    typeof targetResponse === "string" && !isNaN(targetResponse)
      ? parseFloat(targetResponse)
      : targetResponse;

  const requiredCompareValue =
    typeof requiredValue === "string" && !isNaN(requiredValue)
      ? parseFloat(requiredValue)
      : requiredValue;

  if (operator === "===") return compareValue === requiredCompareValue;
  if (operator === "!==") return compareValue !== requiredCompareValue;
  return true;
};

function QuestionRenderer({
  question,
  onChange,
  response,
  validationError,
  isPreview,
  allResponses = {},
}) {
  const { id, text, type, options, validation } = question;

  // Conditional skip
  if (!isPreview && !shouldRenderQuestion(question, allResponses)) {
    return null;
  }

  const ErrorMessage =
    validationError && (
      <p className="text-red-500 text-xs mt-2 font-medium">{validationError}</p>
    );

  let inputElement;

  switch (type) {
    case "short-text":
      inputElement = (
        <input
          type="text"
          value={response || ""}
          onChange={(e) => onChange(id, e.target.value)}
          placeholder={isPreview ? "Short answer" : undefined}
          maxLength={validation?.maxLength}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
        />
      );
      break;

    case "long-text":
      inputElement = (
        <textarea
          value={response || ""}
          onChange={(e) => onChange(id, e.target.value)}
          rows="4"
          placeholder={isPreview ? "Write a detailed answer..." : undefined}
          maxLength={validation?.maxLength}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
        />
      );
      break;

    case "numeric":
      inputElement = (
        <input
          type="number"
          value={response || ""}
          onChange={(e) => onChange(id, parseFloat(e.target.value))}
          placeholder={
            isPreview
              ? `Range: ${validation?.min || 0} to ${validation?.max || "N/A"}`
              : undefined
          }
          min={validation?.min}
          max={validation?.max}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
        />
      );
      break;

    case "single-choice":
      inputElement = (
        <div className="space-y-2">
          {options?.map((option, index) => (
            <label
              key={`${id}-opt-${index}`} 
              className="flex items-center text-sm cursor-pointer"
            >
              <input
                type="radio"
                name={`q-${id}`}
                value={option}
                checked={response === option}
                onChange={(e) => onChange(id, e.target.value)}
                className="mr-2 accent-indigo-500"
                disabled={isPreview}
              />
              <span className="text-gray-700">{option}</span>
            </label>
          ))}
        </div>
      );
      break;

    case "multi-choice":
      inputElement = (
        <div className="space-y-2">
          {options?.map((option, index) => (
            <label
              key={`${id}-multi-${index}`} 
              className="flex items-center text-sm cursor-pointer"
            >
              <input
                type="checkbox"
                name={`q-${id}`}
                value={option}
                checked={(response || []).includes(option)}
                onChange={() => {}} 
                className="mr-2 accent-indigo-500"
                disabled={isPreview}
              />
              <span className="text-gray-700">{option}</span>
            </label>
          ))}
        </div>
      );
      break;

    case "file-upload":
      inputElement = (
        <input
          type="file"
          disabled={isPreview}
          className="w-full text-sm border border-gray-300 p-2 rounded-md bg-gray-50 focus:ring-2 focus:ring-indigo-500 transition-all"
        />
      );
      break;

    default:
      inputElement = (
        <p className="text-red-500 text-sm">Unknown Question Type</p>
      );
      break;
  }

  return (
    <div
      className={`p-5 rounded-xl border mb-5 shadow-sm hover:shadow-md transition-all ${
        validationError
          ? "border-red-300 bg-red-50"
          : "border-gray-200 bg-white"
      }`}
    >
      <label className="block text-base font-semibold text-gray-800 mb-3">
        {text}
        {validation?.required && (
          <span className="text-red-500 ml-1 font-bold">*</span>
        )}
      </label>

      {inputElement}
      {ErrorMessage}
    </div>
  );
}

export default QuestionRenderer;
