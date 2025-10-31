// src/components/CandidateModule/Timeline.jsx
import React from "react";

//  Stage colors with gradients
const StageColors = {
  applied: "from-indigo-500 to-indigo-400",
  screen: "from-purple-500 to-purple-400",
  tech: "from-blue-500 to-blue-400",
  offer: "from-yellow-500 to-yellow-400",
  hired: "from-green-600 to-green-400",
  rejected: "from-red-600 to-red-400",
  default: "from-gray-400 to-gray-300",
};

const TimelineItem = ({ event, isLast }) => {
  const date = new Date(event.timestamp).toLocaleString();
  const gradient = StageColors[event.newStage] || StageColors.default;

  return (
    <div className="flex relative group">
    
      {!isLast && (
        <div className="absolute left-2.5 top-4 w-0.5 h-full bg-linear-to-b from-indigo-200 to-transparent"></div>
      )}

      <div
        className={`w-5 h-5 rounded-full bg-linear-to-r ${gradient} shadow-md shadow-indigo-300/40 group-hover:scale-110 transform transition-transform duration-300 absolute left-0 z-10`}
        title={event.newStage}
      ></div>

      <div className="ml-10 pb-10 flex-1">
        <div className="bg-white/70 backdrop-blur-md border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 rounded-xl p-4 relative">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              {event.isInitial
                ? "Application Submitted"
                : `Stage: ${event.newStage.toUpperCase()}`}
            </h4>
            <span className="text-xs text-gray-400 font-medium">{date}</span>
          </div>

          {/* Optional Note Section */}
          {event.note && (
            <p className="mt-3 text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 shadow-inner">
              💬 {event.note}
            </p>
          )}

          {/* Hover highlight effect */}
          <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-10 bg-linear-to-r from-indigo-500 to-purple-500 transition-opacity duration-300"></div>
        </div>
      </div>
    </div>
  );
};

function Timeline({ timeline }) {
  return (
    <div className="bg-white/80 backdrop-blur-md border border-gray-100 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500">
      {/* Title */}
      <h3 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2 border-b border-gray-200 pb-3">
        <span className="w-3 h-3 bg-indigo-500 rounded-full"></span>
        Timeline of Changes
      </h3>

      {/* Timeline Items */}
      <div className="relative pt-2">
        {timeline.length > 0 ? (
          timeline.map((event, index) => (
            <TimelineItem
              key={index}
              event={event}
              isLast={index === timeline.length - 1}
            />
          ))
        ) : (
          <p className="text-gray-500 text-sm italic mt-4">
            No timeline events available.
          </p>
        )}
      </div>
    </div>
  );
}

export default Timeline;

