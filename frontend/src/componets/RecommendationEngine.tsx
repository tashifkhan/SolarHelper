import React, { useState } from 'react';
import { Sun, Home, Battery } from 'lucide-react';

const RecommendationEngine = () => {
  const [formData, setFormData] = useState({
    pincode: '',
    monthlyBill: '',
    roofSize: '',
    budget: ''
  });

  const [showRecommendation, setShowRecommendation] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowRecommendation(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="py-16 bg-gray-50" id="features">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">AI Recommendation Engine</h2>
          <p className="mt-4 text-lg text-gray-600">Get personalized solar solutions based on your needs</p>
        </div>

        <div className="mt-12">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="pincode" className="block text-sm font-medium text-gray-700">Pincode</label>
                <input
                  type="text"
                  name="pincode"
                  id="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter your pincode"
                />
              </div>

              <div>
                <label htmlFor="monthlyBill" className="block text-sm font-medium text-gray-700">Monthly Electricity Bill (₹)</label>
                <input
                  type="number"
                  name="monthlyBill"
                  id="monthlyBill"
                  value={formData.monthlyBill}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter your monthly bill"
                />
              </div>

              <div>
                <label htmlFor="roofSize" className="block text-sm font-medium text-gray-700">Roof Size (sq. ft)</label>
                <input
                  type="number"
                  name="roofSize"
                  id="roofSize"
                  value={formData.roofSize}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter your roof size"
                />
              </div>

              <div>
                <label htmlFor="budget" className="block text-sm font-medium text-gray-700">Budget Range (₹)</label>
                <input
                  type="number"
                  name="budget"
                  id="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter your budget"
                />
              </div>
            </div>

            <div className="text-center">
              <button
                type="submit"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Get Recommendations
                <Sun className="ml-2 h-5 w-5" />
              </button>
            </div>
          </form>

          {showRecommendation && (
            <div className="mt-12 bg-white shadow rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Your Personalized Recommendation</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center mb-4">
                    <Sun className="h-6 w-6 text-yellow-500" />
                    <h4 className="ml-2 text-lg font-medium">Solar Panel Setup</h4>
                  </div>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Recommended Capacity: 5kW</li>
                    <li>• Panel Type: Monocrystalline</li>
                    <li>• Number of Panels: 15</li>
                    <li>• Estimated Cost: ₹3,50,000</li>
                  </ul>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center mb-4">
                    <Battery className="h-6 w-6 text-green-500" />
                    <h4 className="ml-2 text-lg font-medium">Battery Solution</h4>
                  </div>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Battery Type: Lithium-ion</li>
                    <li>• Capacity: 10kWh</li>
                    <li>• Backup Duration: 8-10 hours</li>
                    <li>• Estimated Cost: ₹2,50,000</li>
                  </ul>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center mb-4">
                    <Home className="h-6 w-6 text-blue-500" />
                    <h4 className="ml-2 text-lg font-medium">Installation Details</h4>
                  </div>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Installation Time: 3-4 days</li>
                    <li>• Warranty: 25 years</li>
                    <li>• Annual Maintenance: ₹5,000</li>
                    <li>• Subsidy Available: ₹94,500</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecommendationEngine;