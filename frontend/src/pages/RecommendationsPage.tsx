import RecommendationEngine from "../componets/RecommendationEngine";
import { Link } from "react-router-dom";
import { ArrowRight, Activity, MapPin, Database } from "lucide-react";

const RecommendationsPage = () => {
	return (
		<div className="bg-gradient-to-b from-blue-50 to-white min-h-screen py-12">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="text-center mb-8">
					<h1 className="text-3xl font-bold text-gray-900">
						AI Solar Recommendation Engine
					</h1>
					<p className="mt-4 text-lg text-gray-600">
						Get personalized solar recommendations tailored to your specific
						requirements
					</p>
				</div>

				<div className="mb-12 max-w-3xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
					<div className="bg-blue-600 px-6 py-4">
						<h2 className="text-xl font-semibold text-white">
							How Our Recommendation Engine Works
						</h2>
					</div>
					<div className="px-6 py-8">
						<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
							<div className="flex flex-col items-center text-center">
								<div className="flex h-12 w-12 items-center justify-center rounded-md bg-blue-100 text-blue-600">
									<MapPin className="h-6 w-6" />
								</div>
								<h3 className="mt-3 text-sm font-medium text-gray-900">
									Location Analysis
								</h3>
								<p className="mt-1 text-sm text-gray-500">
									We analyze solar radiation levels in your location based on
									pincode
								</p>
							</div>

							<div className="flex flex-col items-center text-center">
								<div className="flex h-12 w-12 items-center justify-center rounded-md bg-blue-100 text-blue-600">
									<Activity className="h-6 w-6" />
								</div>
								<h3 className="mt-3 text-sm font-medium text-gray-900">
									Energy Requirement
								</h3>
								<p className="mt-1 text-sm text-gray-500">
									We calculate your energy needs from your electricity bill and
									usage patterns
								</p>
							</div>

							<div className="flex flex-col items-center text-center">
								<div className="flex h-12 w-12 items-center justify-center rounded-md bg-blue-100 text-blue-600">
									<Database className="h-6 w-6" />
								</div>
								<h3 className="mt-3 text-sm font-medium text-gray-900">
									Data-Driven Results
								</h3>
								<p className="mt-1 text-sm text-gray-500">
									Our AI models recommend the optimal solar solution within your
									budget
								</p>
							</div>
						</div>
					</div>
				</div>

				<RecommendationEngine />

				<div className="mt-16 max-w-3xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
					<div className="px-6 py-8">
						<h3 className="text-xl font-semibold text-gray-900">
							Why Trust Our Recommendations?
						</h3>
						<p className="mt-3 text-gray-600">
							Our recommendation engine is powered by data from thousands of
							solar installations across India. We take into account local
							weather patterns, seasonal variations, and the latest solar
							technologies to provide you with accurate and reliable
							recommendations.
						</p>

						<h4 className="mt-6 text-lg font-medium text-gray-900">
							After getting your recommendation:
						</h4>
						<ul className="mt-4 space-y-3">
							<li className="flex">
								<div className="flex-shrink-0">
									<svg
										className="h-5 w-5 text-green-500"
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 20 20"
										fill="currentColor"
									>
										<path
											fillRule="evenodd"
											d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
											clipRule="evenodd"
										/>
									</svg>
								</div>
								<p className="ml-2 text-gray-600">
									<span className="font-medium">Compare offerings</span> from
									verified solar installers in your area
								</p>
							</li>
							<li className="flex">
								<div className="flex-shrink-0">
									<svg
										className="h-5 w-5 text-green-500"
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 20 20"
										fill="currentColor"
									>
										<path
											fillRule="evenodd"
											d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
											clipRule="evenodd"
										/>
									</svg>
								</div>
								<p className="ml-2 text-gray-600">
									<span className="font-medium">Learn about subsidies</span>{" "}
									you're eligible for based on your location and system
								</p>
							</li>
							<li className="flex">
								<div className="flex-shrink-0">
									<svg
										className="h-5 w-5 text-green-500"
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 20 20"
										fill="currentColor"
									>
										<path
											fillRule="evenodd"
											d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
											clipRule="evenodd"
										/>
									</svg>
								</div>
								<p className="ml-2 text-gray-600">
									<span className="font-medium">Get connected</span> with
									financing options and installation experts
								</p>
							</li>
						</ul>

						<div className="mt-8 text-center">
							<Link
								to="/chat"
								className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
							>
								Chat with Solar Expert
								<ArrowRight className="ml-2 h-5 w-5" />
							</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default RecommendationsPage;
