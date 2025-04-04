import React, { useState } from 'react';
import { Calculator, TrendingUp } from 'lucide-react';

const SavingsCalculator = () => {
  const [monthlyBill, setMonthlyBill] = useState('');
  const [showResults, setShowResults] = useState(false);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    setShowResults(true);
  };

  return (
    <div className="py-16 bg-white" id="calculator">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Solar Savings Calculator</h2>
          <p className="mt-4 text-lg text-gray-600">Calculate your potential savings with solar power</p>
        </div>

        <div className="mt-12 max-w-lg mx-auto">
          <form onSubmit={handleCalculate} className="space-y-6">
            <div>
              <label htmlFor="monthlyBill" className="block text-sm font-medium text-gray-700">
                Monthly Electricity Bill (₹)
              </label>
              <div className="mt-1">
                <input
                  type="number"
                  name="monthlyBill"
                  id="monthlyBill"
                  value={monthlyBill}
                  onChange={(e) => setMonthlyBill(e.target.value)}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Enter your average monthly bill"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Calculate Savings
              <Calculator className="ml-2 h-5 w-5" />
            </button>
          </form>

          {showResults && (
            <div className="mt-8 bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Your Potential Savings</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Monthly Savings:</span>
                  <span className="text-green-600 font-semibold">₹{parseInt(monthlyBill) * 0.8}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Annual Savings:</span>
                  <span className="text-green-600 font-semibold">₹{parseInt(monthlyBill) * 0.8 * 12}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">25-Year Savings:</span>
                  <span className="text-green-600 font-semibold">₹{parseInt(monthlyBill) * 0.8 * 12 * 25}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Carbon Offset (Annual):</span>
                  <span className="text-green-600 font-semibold">{Math.round(parseInt(monthlyBill) * 0.8 * 0.7)} kg CO₂</span>
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                    <span className="ml-2 text-sm text-gray-500">
                      Estimated payback period: {Math.round(350000 / (parseInt(monthlyBill) * 0.8 * 12))} years
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SavingsCalculator;