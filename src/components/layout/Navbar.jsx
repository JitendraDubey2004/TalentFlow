// src/components/layout/Navbar.jsx

import { Link, useLocation } from "react-router-dom";

const navItems = [
  { name: "Jobs Board", path: "/jobs" },
  { name: "Candidates", path: "/candidates" },
  { name: "Assessments", path: "/assessments" },
];

function Navbar() {
  const location = useLocation();

  return (
    <nav className="backdrop-blur-md bg-white/80 shadow-md sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo + Subtitle */}
          <Link to="/" className="flex flex-col items-start">
            <span className="text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-linear-to-r from-indigo-600 to-purple-600 hover:opacity-90 transition-opacity">
              TALENTFLOW
            </span>
            <span className="text-xs text-gray-500 mt-0.5 tracking-wide">
              a mini hiring platform
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-2 lg:space-x-4 items-center">
            {navItems.map((item) => {
              const isActive =
                location.pathname.startsWith(item.path) &&
                item.path !== "/";

              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    ${
                      isActive
                        ? "bg-linear-to-r from-indigo-600 to-purple-600 text-white shadow-md"
                        : "text-gray-600 hover:text-indigo-600 hover:bg-indigo-50"
                    }`}
                >
                  {item.name}
                  {isActive && (
                    <span className="absolute inset-x-2 bottom-0 h-0.5 bg-white/70 rounded-full animate-pulse"></span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2 rounded-md text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 transition">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
