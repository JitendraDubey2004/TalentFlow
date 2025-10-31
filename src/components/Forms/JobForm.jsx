// src/components/Forms/JobForm.jsx

import React, { useState } from "react";
import { Loader2 } from "lucide-react";

const slugify = (text) =>
  text.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^\w-]+/g, "");

const allTags = [
  "Frontend",
  "Backend",
  "Fullstack",
  "Remote",
  "Urgent",
  "Lead",
  "Design",
  "Marketing",
];

function JobForm({ initialData = {}, onSubmit, onCancel, isEditing }) {
  const safeInitialData = initialData || {};

  const [formData, setFormData] = useState({
    title: "",
    status: "active",
    ...safeInitialData,
    tags: safeInitialData.tags || [],
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTagChange = (tag) => {
    setFormData((prev) => {
      const tags = prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag];
      return { ...prev, tags };
    });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Job title is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    const dataToSend = {
      ...formData,
      slug: slugify(formData.title),
    };

    try {
      await onSubmit(dataToSend);
      onCancel();
    } catch (err) {
      setErrors({
        submit: err.message || "An unexpected error occurred during submission.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-white/70 backdrop-blur-lg p-6 rounded-xl shadow-inner"
    >
      {/* Submission Error */}
      {errors.submit && (
        <p className="text-red-600 text-sm font-medium bg-red-50 border border-red-200 px-3 py-2 rounded-lg">
          ⚠️ {errors.submit}
        </p>
      )}

      {/* Job Title */}
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-semibold text-gray-800 mb-1"
        >
          Job Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g. Frontend Developer"
          className={`mt-1 block w-full border ${
            errors.title ? "border-red-500" : "border-gray-300"
          } rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-gray-50/60`}
          disabled={isSubmitting}
        />
        {errors.title && (
          <p className="text-red-500 text-xs mt-1">{errors.title}</p>
        )}
      </div>

      {/* Status */}
      <div>
        <label
          htmlFor="status"
          className="block text-sm font-semibold text-gray-800 mb-1"
        >
          Status
        </label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="block w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50/60 transition-all"
          disabled={isSubmitting}
        >
          <option value="active">Active</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-semibold text-gray-800 mb-2">
          Tags
        </label>
        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => handleTagChange(tag)}
              className={`text-sm font-medium px-3 py-1.5 rounded-full border transition-all duration-200 ${
                formData.tags.includes(tag)
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-md hover:bg-indigo-500"
                  : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
              }`}
              disabled={isSubmitting}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end items-center gap-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2.5 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-all"
          disabled={isSubmitting}
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="px-5 py-2.5 rounded-lg font-semibold text-white bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-md hover:shadow-lg transform hover:scale-105 transition-all flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Saving...
            </>
          ) : isEditing ? (
            "💾 Save Changes"
          ) : (
            "🚀 Create Job"
          )}
        </button>
      </div>
    </form>
  );
}

export default JobForm;
