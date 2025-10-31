// src/components/Forms/CandidateForm.jsx

import React, { useState } from 'react';

function CandidateForm({ onSubmit, onCancel, isSubmitting }) {
 const [formData, setFormData] = useState({
  name: '',
  email: '',
 });
 const [errors, setErrors] = useState({});

 const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData(prev => ({ ...prev, [name]: value }));
 };

 const validate = () => {
  const newErrors = {};
  if (!formData.name.trim()) newErrors.name = 'Name is required.';
  if (!formData.email.trim() || !formData.email.includes('@')) newErrors.email = 'Valid email is required.';
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
 };

 const handleSubmit = (e) => {
  e.preventDefault();
  if (!validate()) return;
  
  // Pass data back to the modal for API submission
  onSubmit(formData);
 };

 return (
  <form onSubmit={handleSubmit} className="p-0">
   <h2 className="text-2xl font-bold mb-6 text-gray-800">Add New Candidate</h2>
   
   {/* Name Field */}
   <div className="mb-4">
    <label htmlFor="name" className="block text-sm font-semibold text-gray-700">Full Name</label>
    <input
     type="text"
     id="name"
     name="name"
     value={formData.name}
     onChange={handleChange}
     className={`mt-1 block w-full border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm p-3 text-base focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors`}
     disabled={isSubmitting}
    />
    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
   </div>

   {/* Email Field */}
   <div className="mb-6">
    <label htmlFor="email" className="block text-sm font-semibold text-gray-700">Email Address</label>
    <input
     type="email"
     id="email"
     name="email"
     value={formData.email}
     onChange={handleChange}
     className={`mt-1 block w-full border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm p-3 text-base focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors`}
     disabled={isSubmitting}
    />
    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
   </div>
   
   {/* Action Buttons */}
   <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
    <button
     type="button"
     onClick={onCancel}
     className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
     disabled={isSubmitting}
    >
     Cancel
    </button>
    <button
     type="submit"
     className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 font-semibold shadow-md"
     disabled={isSubmitting}
    >
     {isSubmitting ? 'Adding...' : 'Add Candidate'}
    </button>
   </div>
  </form>
 );
}

export default CandidateForm;