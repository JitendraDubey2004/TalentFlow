// src/components/CandidateModule/NotesSection.jsx
import React, { useState } from "react";

const MOCK_MENTIONS = ["Alice HR", "Bob Recruiter", "Charlie Manager", "Dana Tech"];

function NotesSection({ candidateId }) {
  const [note, setNote] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const MENTION_BOX_STYLE = {
    position: "absolute",
    top: "100%",
    left: "0",
    width: "100%",
    zIndex: 20,
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setNote(value);

    const lastWordMatch = value.match(/@(\w+)$/);
    if (lastWordMatch) {
      const query = lastWordMatch[1].toLowerCase();
      const filteredSuggestions = MOCK_MENTIONS.filter((member) =>
        member.toLowerCase().startsWith(query)
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleSelectMention = (member) => {
    const newValue = note.replace(/@\w*$/, `@${member} `);
    setNote(newValue);
    setSuggestions([]);
  };

  const handleSaveNote = async () => {
    if (note.trim() === "") return;
    setIsLoading(true);
    console.log(`[Note Saved] Candidate ${candidateId}: ${note}`);
    await new Promise((resolve) => setTimeout(resolve, 700));
    setNote("");
    setIsLoading(false);
  };

  const renderNoteWithMentions = (text) => {
    const parts = text.split(/(@[\w\s]+)/g).filter((p) => p.length > 0);
    return parts.map((part, index) =>
      part.startsWith("@") ? (
        <span key={index} className="text-indigo-600 font-semibold">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-5">
        <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
          Notes & Interactions
        </h3>
        <span className="text-xs text-gray-400 font-medium">
          Candidate #{candidateId}
        </span>
      </div>

      {/* Textarea Input */}
      <div className="relative mb-5">
        <textarea
          value={note}
          onChange={handleInputChange}
          placeholder="Type your note here... use @ to mention a team member"
          className="w-full border border-gray-200 rounded-xl p-3 text-sm resize-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 shadow-sm transition-all duration-150"
          rows="4"
          disabled={isLoading}
        />

        {/* Mention Suggestion Dropdown */}
        {suggestions.length > 0 && (
          <div
            style={MENTION_BOX_STYLE}
            className="bg-white border border-indigo-300 rounded-lg shadow-lg mt-1 overflow-y-auto max-h-40 animate-fadeIn"
          >
            {suggestions.map((member) => (
              <div
                key={member}
                onClick={() => handleSelectMention(member)}
                className="p-2 text-sm cursor-pointer hover:bg-indigo-50 text-gray-800"
              >
                @{member}
              </div>
            ))}
          </div>
        )}
      </div>

      {/*   Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSaveNote}
          disabled={isLoading || note.trim() === ""}
          className={`group relative flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm shadow-md transition-all duration-300 overflow-hidden ${
            isLoading || note.trim() === ""
              ? "bg-indigo-300 cursor-not-allowed"
              : "bg-linear-to-r from-indigo-600 via-purple-600 to-pink-500 hover:scale-105 active:scale-95"
          } text-white`}
        >
          {!isLoading ? (
            <>
              <svg
                className="w-4 h-4 group-hover:rotate-6 transition-transform duration-200"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span className="tracking-wide group-hover:tracking-wider transition-all duration-300">
                Save Note
              </span>

              {/* Glow effect */}
              <span className="absolute inset-0 bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-30 blur-md transition-all duration-300"></span>
            </>
          ) : (
            <>
              <svg
                className="animate-spin h-4 w-4 text-white"
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
              <span>Saving...</span>
            </>
          )}
        </button>
      </div>

      {/* Notes Preview */}
      <div className="mt-6 border-t border-gray-100 pt-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Latest Note</h4>
        <div className="text-gray-700 text-sm bg-gray-50 p-3 rounded-lg border border-gray-200 whitespace-pre-wrap shadow-inner">
          {renderNoteWithMentions(
            note || "No notes currently stored for this session."
          )}
        </div>
      </div>
    </div>
  );
}

export default NotesSection;

