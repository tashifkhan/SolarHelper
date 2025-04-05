import ComparisonTool from "../componets/ComparisonTool";
import { Link } from "react-router-dom";
import { BarChart3, LineChart, ArrowRight } from "lucide-react";

const ComparisonPage = () => {
	return (
		<div className="bg-gradient-to-b from-blue-50 to-white min-h-screen py-12">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="text-center mb-8">
					<h1 className="text-3xl font-bold text-gray-900">
						Solar Products Comparison
					</h1>
					<p className="mt-4 text-lg text-gray-600">
						Compare different solar solutions and find the perfect one for your
						home
					</p>
				</div>

				<div className="mb-12 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
					<div className="bg-white rounded-lg shadow-md p-6">
						<div className="flex items-center">
							<div className="flex-shrink-0">
								<BarChart3 className="h-8 w-8 text-blue-500" />
							</div>
							<div className="ml-4">
								<h2 className="text-lg font-medium text-gray-900">
									Compare Features
								</h2>
								<p className="mt-1 text-sm text-gray-500">
									Evaluate different solar panels based on efficiency, warranty,
									and features
								</p>
							</div>
						</div>
					</div>

					<div className="bg-white rounded-lg shadow-md p-6">
						<div className="flex items-center">
							<div className="flex-shrink-0">
								<LineChart className="h-8 w-8 text-green-500" />
							</div>
							<div className="ml-4">
								<h2 className="text-lg font-medium text-gray-900">
									Subsidy-Adjusted Pricing
								</h2>
								<p className="mt-1 text-sm text-gray-500">
									See the actual costs after accounting for available government
									subsidies
								</p>
							</div>
						</div>
					</div>
				</div>

				<ComparisonTool />

				<div className="mt-16 max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-8">
					<h2 className="text-2xl font-semibold text-gray-900 mb-6">
						Need Personalized Advice?
					</h2>
					<p className="text-gray-600">
						Our comparison tool shows general information about popular solar
						panel options. For a personalized recommendation based on your
						specific needs, location, and budget, use our AI recommendation
						engine.
					</p>

					<div className="mt-8 flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
						<Link
							to="/recommendations"
							className="inline-flex items-center px-5 py-2 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
						>
							Get Personalized Recommendation
						</Link>

						<Link
							to="/chat"
							className="inline-flex items-center px-5 py-2 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
						>
							Chat with Subsidy Expert
							<ArrowRight className="ml-2 h-4 w-4" />
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ComparisonPage;
