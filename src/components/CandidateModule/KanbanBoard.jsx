import React from 'react';
import { DndContext, useDraggable, useDroppable, closestCenter } from '@dnd-kit/core';
import { Link } from 'react-router-dom';

const STAGES = [
  { id: 'applied', title: 'Applied', color: 'from-blue-100 to-blue-50 border-blue-400' },
  { id: 'screen', title: 'Screen', color: 'from-purple-100 to-purple-50 border-purple-400' },
  { id: 'tech', title: 'Technical', color: 'from-orange-100 to-orange-50 border-orange-400' },
  { id: 'offer', title: 'Offer', color: 'from-yellow-100 to-yellow-50 border-yellow-400' },
  { id: 'hired', title: 'Hired', color: 'from-green-100 to-green-50 border-green-400' },
  { id: 'rejected', title: 'Rejected', color: 'from-red-100 to-red-50 border-red-400' },
];

//  Draggable Candidate Card 
const CandidateCard = ({ candidate }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `candidate-${candidate.id}`,
    data: { candidate, currentStage: candidate.stage },
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 50,
        boxShadow: '0 8px 14px rgba(0, 0, 0, 0.15)',
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`p-4 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transform transition-all duration-200 ${
        isDragging ? 'opacity-60' : ''
      }`}
      {...attributes}
      {...listeners}
    >
      <Link
        to={`/candidates/${candidate.id}`}
        className="block text-sm font-semibold text-gray-800 hover:text-indigo-600"
      >
        {candidate.name}
      </Link>
      <div className="text-xs text-gray-500 mt-1">{candidate.email}</div>
    </div>
  );
};

//  Droppable Column 
const StageColumn = ({ stage, candidates }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: stage.id,
    data: { stageId: stage.id },
  });

  return (
    <div
      ref={setNodeRef}
      className={`p-4 rounded-2xl flex-1 min-w-[280px] bg-linear-to-b ${stage.color} border-2 transition-all duration-300 ${
        isOver ? 'scale-[1.02] shadow-lg border-indigo-500' : 'shadow-sm'
      }`}
    >
      <h3 className="text-lg font-bold mb-4 text-gray-800 flex items-center justify-between">
        {stage.title}
        <span className="text-sm bg-white text-gray-800 px-2 py-0.5 rounded-md shadow-sm font-medium">
          {candidates.length}
        </span>
      </h3>

      <div
        className={`min-h-[120px] space-y-3 transition-all duration-300 ${
          isOver ? 'bg-white/60 rounded-lg p-2' : ''
        }`}
      >
        {candidates.length > 0 ? (
          candidates.map((candidate) => (
            <CandidateCard key={candidate.id} candidate={candidate} />
          ))
        ) : (
          <div className="text-xs text-gray-500 italic text-center mt-4">
            No candidates
          </div>
        )}
      </div>
    </div>
  );
};

//  Main Kanban Board 
function KanbanBoard({ allCandidates, onStageChange }) {
  const candidatesByStage = STAGES.reduce((acc, stage) => {
    acc[stage.id] = allCandidates.filter((c) => c.stage === stage.id);
    return acc;
  }, {});

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over) return;

    const candidateId = active.data.current.candidate.id;
    const newStageId = over.data.current.stageId || over.id;
    const oldStageId = active.data.current.currentStage;

    if (newStageId !== oldStageId) {
      onStageChange(candidateId, newStageId);
    }
  };

  return (
    <div className="w-screen min-h-[calc(100vh-64px)] bg-gray-50 flex flex-col p-8 overflow-y-auto">


      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div className="flex space-x-6 overflow-x-auto p-4 bg-white rounded-2xl shadow-lg border border-gray-200">
          {STAGES.map((stage) => (
            <StageColumn
              key={stage.id}
              stage={stage}
              candidates={candidatesByStage[stage.id] || []}
            />
          ))}
        </div>
      </DndContext>
    </div>
  );
}

export default KanbanBoard;

