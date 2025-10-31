// src/components/CandidateModule/CandidateList.jsx

import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { List, AutoSizer } from 'react-virtualized';
import { useLiveQuery } from 'dexie-react-hooks';
import db from '../../api/db/dexie';

//  Row Renderer 
const RowRenderer = ({ index, key, style, parent }) => {
  const { filteredCandidates } = parent.props.itemData;
  const candidate = filteredCandidates[index];
  if (!candidate) return null;

  return (
    <div
      key={key}
      style={style}
      className="px-5 py-4 border-b border-gray-100 hover:bg-indigo-50/40 transition-colors duration-200"
    >
      <Link
        to={`/candidates/${candidate.id}`}
        className="flex justify-between items-center"
      >
        <div>
          <div className="text-base font-semibold text-gray-800 hover:text-indigo-600 transition-colors">
            {candidate.name}
          </div>
          <div className="text-sm text-gray-500">{candidate.email}</div>
        </div>

        <div
          className={`px-3 py-1 text-xs font-medium rounded-full shadow-sm ${
            candidate.stage === 'hired'
              ? 'bg-green-100 text-green-800'
              : candidate.stage === 'rejected'
              ? 'bg-red-100 text-red-800'
              : 'bg-indigo-100 text-indigo-800'
          }`}
        >
          {candidate.stage.toUpperCase()}
        </div>
      </Link>
    </div>
  );
};

function CandidateList() {
  const [searchTerm, setSearchTerm] = useState('');

  const candidates = useLiveQuery(() => db.candidates.toArray(), []);

  //  Filter candidates with memoization
  const filteredCandidates = useMemo(() => {
    if (!candidates) return [];
    if (!searchTerm) return candidates;

    const lowerSearchTerm = searchTerm.toLowerCase();
    return candidates.filter(
      (c) =>
        c.name.toLowerCase().includes(lowerSearchTerm) ||
        c.email.toLowerCase().includes(lowerSearchTerm)
    );
  }, [candidates, searchTerm]);

  const itemCount = filteredCandidates.length;

  //  Loading State
  if (!candidates) {
    return (
      <div className="w-screen min-h-[calc(100vh-64px)] flex flex-col items-center justify-center bg-linear-to-b from-gray-50 to-gray-100">
        <div className="text-indigo-600 font-medium text-lg animate-pulse">
          Loading Candidates...
        </div>
      </div>
    );
  }

  return (
    <div className="w-screen min-h-[calc(100vh-64px)] bg-linear-to-b from-gray-50 via-white to-gray-100 flex flex-col p-8 overflow-y-auto">
      <div className="flex-1 bg-white shadow-xl rounded-2xl p-8 border border-gray-100">

        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <h3 className="text-2xl font-extrabold text-gray-800 tracking-tight">
            Candidate List{' '}
            <span className="text-indigo-600">
              ({itemCount})
            </span>
          </h3>

          {/* Search Input */}
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              placeholder="🔍  Search by Name or Email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-gray-300 rounded-xl py-2.5 px-4 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all placeholder-gray-400"
            />
          </div>
        </div>

        {/* Candidate List */}
        {itemCount > 0 ? (
          <div
            className="rounded-xl border border-gray-200 overflow-hidden shadow-inner"
            style={{ height: 600, width: '100%' }}
          >
            <AutoSizer>
              {({ width, height }) => (
                <List
                  width={width}
                  height={height}
                  rowCount={itemCount}
                  rowHeight={70}
                  rowRenderer={RowRenderer}
                  itemData={{ filteredCandidates }}
                  style={{ overflowX: 'hidden' }}
                />
              )}
            </AutoSizer>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <div className="text-4xl mb-3">😕</div>
            <p className="text-base font-medium">No candidates found for this search.</p>
            <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CandidateList;

