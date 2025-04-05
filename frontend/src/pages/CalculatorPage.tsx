import React from "react";
import SavingsCalculator from "../componets/SavingsCalculator";
import { ArrowRight, Info } from "lucide-react";
import { Link } from "react-router-dom";

const CalculatorPage = () => {
	return (
		<div className="bg-gradient-to-b from-blue-50 to-white min-h-screen py-12">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="text-center mb-8">
					<h1 className="text-3xl font-bold text-gray-900">
						Solar Savings Calculator
					</h1>
					<p className="mt-4 text-lg text-gray-600">
						Find out how much you could save by switching to solar energy
					</p>
				</div>

				<div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-8 max-w-3xl mx-auto">
					<div className="flex">
						<div className="flex-shrink-0">
							<Info className="h-5 w-5 text-blue-600" />
						</div>
						<div className="ml-3">
							<p className="text-sm text-blue-700">
								Enter your average monthly electricity bill to calculate
								potential savings with solar power. The calculator estimates
								savings based on average solar production in India and current
								electricity rates.
							</p>
						</div>
					</div>
				</div>

				<SavingsCalculator />

				<div className="mt-16 max-w-3xl mx-auto">
					<h2 className="text-2xl font-bold text-gray-900 mb-6">
						Frequently Asked Questions
					</h2>

					<div className="space-y-6">
						<div className="bg-white shadow rounded-lg p-6">
							<h3 className="text-lg font-medium text-gray-900">
								How accurate are these calculations?
							</h3>
							<p className="mt-2 text-gray-600">
								Our calculator provides estimates based on average solar
								radiation data for India, typical system efficiency, and current
								electricity rates. Actual savings may vary based on your
								specific location, roof orientation, and local weather patterns.
							</p>
						</div>

						<div className="bg-white shadow rounded-lg p-6">
							<h3 className="text-lg font-medium text-gray-900">
								Does this include government subsidies?
							</h3>
							<p className="mt-2 text-gray-600">
								The basic calculator doesn't factor in subsidies. To get
								estimates including available government subsidies for your
								area, use our recommendation engine or chat with our subsidy
								expert.
							</p>
							<div className="mt-4">
								<Link
									to="/chat"
									className="inline-flex items-center text-blue-600 hover:text-blue-800"
								>
									Chat with our subsidy expert
									<ArrowRight className="ml-2 h-4 w-4" />
								</Link>
							</div>
						</div>

						<div className="bg-white shadow rounded-lg p-6">
							<h3 className="text-lg font-medium text-gray-900">
								How is the carbon offset calculated?
							</h3>
							<p className="mt-2 text-gray-600">
								Carbon offset is calculated based on the average CO₂ emissions
								from coal-based electricity generation in India, which is
								approximately 0.7 kg CO₂ per kWh. We estimate the kWh your solar
								system would produce and calculate the emissions avoided.
							</p>
						</div>

						<div className="bg-white shadow rounded-lg p-6">
							<h3 className="text-lg font-medium text-gray-900">
								What about maintenance costs?
							</h3>
							<p className="mt-2 text-gray-600">
								The calculator shows gross savings before maintenance costs.
								Typical maintenance costs for residential solar systems in India
								range from ₹3,000 to ₹5,000 per year, which includes cleaning
								and basic system checks.
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CalculatorPage;
