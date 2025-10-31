// src/pages/HomePage.jsx
import React from "react";
import HomeCard from "../components/ui/HomeCard";
import { Link } from "react-router-dom";
import heroBackground from "../assets/home.png";

const icons = {
  briefcase: "💼",
  users: "🧑‍🤝‍🧑",
  clipboard: "📝",
  star: "⭐",
};

const mockPopularJobs = [
  { id: 1, title: "Senior Frontend Engineer", applicants: 125, location: "Remote" },
  { id: 2, title: "Backend Services Developer", applicants: 98, location: "Bangalore" },
  { id: 3, title: "HR Business Partner", applicants: 72, location: "Mumbai" },
  { id: 4, title: "DevOps Specialist", applicants: 60, location: "Hybrid" },
];

const mockAssessments = [
  "JavaScript Core Concepts Quiz (30 min)",
  "API Design & Modeling Challenge (60 min)",
  "Communication & Teamwork Survey",
  "Numeric Reasoning Test",
];

const mockTrustedCompanies = [
  "TechGlobal", "InnovateCorp", "FuturePath", "DataLink", "Apex Solutions"
];

const mockFaqs = [
  {
    question: "How fast is the hiring process?",
    answer:
      "Our platform helps reduce time-to-hire by 40% through automated screening and structured assessments.",
  },
  {
    question: "Can I customize the candidate stages?",
    answer:
      "Yes, the candidate pipeline is fully customizable to match your company's unique hiring workflow.",
  },
  {
    question: "Is the data secure?",
    answer:
      "All data is stored securely in IndexedDB locally (Dexie), ensuring high privacy for the HR team.",
  },
];

//  Footer
const Footer = () => (
  <footer className="bg-[#1a1531] text-gray-300">
    <div className="max-w-7xl mx-auto py-12 px-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="space-y-4">
          <div className="text-3xl font-extrabold text-white tracking-tight">TALENTFLOW</div>
          <p className="text-sm text-gray-400">a mini hiring platform</p>
          <div className="flex space-x-3 mt-3">
            {["f", "in", "x", "yt"].map((icon, index) => (
              <div
                key={index}
                className="p-2 border border-gray-600 rounded-full hover:bg-indigo-600 hover:text-white transition-colors cursor-pointer text-sm"
              >
                {icon.toUpperCase()}
              </div>
            ))}
          </div>
        </div>

        {[ 
          {
            title: "PRODUCT",
            items: [
              { label: "Job Posting", path: "/jobs" },
              { label: "Contests", path: "#" },
              { label: "Database", path: "#" },
            ],
          },
          {
            title: "GET TO KNOW US",
            items: [
              { label: "Careers", path: "/jobs" },
              { label: "Contact Support", path: "#" },
              { label: "Job Seekers", path: "/candidates" },
            ],
          },
          {
            title: "RESOURCES",
            items: [
              { label: "Help Center", path: "#" },
              { label: "Blogs", path: "#" },
            ],
          },
        ].map((section, i) => (
          <div key={i}>
            <h3 className="text-lg font-semibold text-white mb-4">{section.title}</h3>
            <ul className="space-y-3 text-sm">
              {section.items.map((item, j) => (
                <li key={j}>
                  <Link to={item.path} className="hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-12 pt-8 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center text-sm">
        <p>&copy; 2025 TALENTFLOW | All rights reserved.</p>
        <div className="mt-4 md:mt-0 space-x-4">
          {["Privacy policy", "Terms & Conditions", "Terms of service", "Disclosure Policy"].map(
            (link, i) => (
              <a key={i} href="#" className="hover:text-white transition">
                {link}
              </a>
            )
          )}
        </div>
      </div>
    </div>
  </footer>
);

function HomePage() {
  return (
    <>
      {/* HERO SECTION  */}
      <section
        className="relative w-screen h-screen bg-cover bg-center flex flex-col items-center justify-center text-white overflow-hidden"
        style={{
          backgroundImage: `url(${heroBackground})`,
          backgroundAttachment: "fixed",
        }}
      >
        <div className="absolute inset-0 bg-linear-to-br from-indigo-900/80 via-indigo-800/60 to-purple-900/80 backdrop-blur-sm"></div>

        <div className="relative text-center max-w-4xl px-6 animate-fadeIn">
          <h1 className="text-6xl font-extrabold mb-6 leading-tight drop-shadow-lg">
            Let's hire your next great candidate
          </h1>
          <p className="text-xl font-light text-gray-200 mb-10">
            A hiring platform built to solve for{" "}
            <span className="font-semibold text-white">relevancy</span>,{" "}
            <span className="font-semibold text-white">volume</span>, and{" "}
            <span className="font-semibold text-white">speed</span> of hiring.
          </p>
          <div className="flex justify-center">
            <Link
              to="/jobs"
              className="bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-10 rounded-full text-lg shadow-lg hover:shadow-2xl transition-transform transform hover:scale-105"
            >
              Start Managing Jobs
            </Link>
          </div>
        </div>
      </section>

      {/*  CORE FEATURES  */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-extrabold text-gray-900 text-center mb-6">
            Welcome to TALENTFLOW
          </h2>
          <p className="text-lg text-gray-500 text-center mb-12">
            Your mini hiring platform to manage jobs, candidates, and assessments.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <HomeCard
              title="Jobs Board"
              description="View, create, edit, reorder, and archive all job postings. Manage deep links and statuses."
              to="/jobs"
              icon={icons.briefcase}
            />
            <HomeCard
              title="Candidate Pipeline"
              description="Track 1000+ candidates, filter by stage, and manage their progress via the Kanban board."
              to="/candidates"
              icon={icons.users}
            />
            <HomeCard
              title="Assessment Builder"
              description="Design job-specific quizzes with various question types, validation, and conditional logic."
              to="/assessments"
              icon={icons.clipboard}
            />
          </div>
        </div>
      </section>

      {/*  MOST POPULAR JOBS */}
      <section className="py-20 bg-linear-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-10">
            Most Popular Jobs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {mockPopularJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-l-4 border-indigo-500 hover:-translate-y-1"
              >
                <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
                <p className="text-gray-600 mt-1">
                  {job.location} • {job.applicants} Applicants
                </p>
                <Link
                  to={`/jobs/${job.id}`}
                  className="mt-3 inline-block text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  View Details →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/*  POPULAR ASSESSMENTS */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Popular Assessments</h2>
          <ul className="space-y-4">
            {mockAssessments.map((assessment, i) => (
              <li
                key={i}
                className="flex items-center bg-gray-50 p-5 rounded-xl shadow-md hover:shadow-xl transition-all hover:-translate-y-1"
              >
                <span className="text-yellow-500 text-2xl mr-4">{icons.star}</span>
                <p className="text-gray-700">{assessment}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/*  COMPANIES */}
      <section className="py-20 bg-linear-to-r from-indigo-50 to-purple-50">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-10">
            Trusted by Top Companies
          </h2>
          <div className="flex flex-wrap justify-center gap-10">
            {mockTrustedCompanies.map((company, i) => (
              <span
                key={i}
                className="text-xl font-semibold text-gray-600 hover:text-indigo-700 transition transform hover:scale-110"
              >
                {company}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ  */}
      <section className="py-20 bg-indigo-50">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-10">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {mockFaqs.map((faq, i) => (
              <details
                key={i}
                className="bg-white p-5 rounded-xl shadow-md cursor-pointer group hover:shadow-lg transition"
              >
                <summary className="font-semibold text-gray-800 flex justify-between items-center list-none">
                  {faq.question}
                  <span className="text-indigo-600 group-open:rotate-180 transform transition-transform">
                    &#9660;
                  </span>
                </summary>
                <p className="pt-3 text-gray-600 border-t mt-2">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default HomePage;



