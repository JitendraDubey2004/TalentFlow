// src/components/ui/HomeCard.jsx

import { Link } from 'react-router-dom';

function HomeCard({ title, description, to, icon }) {
  return (
    <Link 
      to={to} 
      className="block p-6 bg-white border border-gray-200 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:scale-[1.02]"
    >
      <div className="flex items-center space-x-4 mb-3">
        {/* Placeholder for Icon (e.g., using a library like Heroicons) */}
        <div className="p-3 bg-indigo-100 rounded-full text-indigo-600">
            {icon || '✨'}
        </div>
        <h5 className="text-2xl font-bold tracking-tight text-gray-900">{title}</h5>
      </div>
      <p className="font-normal text-gray-700 mt-2">{description}</p>
      <p className="mt-4 text-indigo-600 font-semibold hover:text-indigo-800 transition-colors">
        Go to {title} &rarr;
      </p>
    </Link>
  );
}

export default HomeCard;