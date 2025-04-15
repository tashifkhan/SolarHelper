import RecommendationEngine from "../componets/RecommendationEngine";
import { Link } from "react-router-dom";
import {
	Activity,
	MapPin,
	Database,
	ChevronRight,
	BarChart2,
} from "lucide-react";

const RecommendationsPage = () => {
	return (
		<div className="bg-gradient-to-b from-blue-50 to-white min-h-screen py-16">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="text-center mb-12">
					<span className="inline-block bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full mb-3">
						Powered by AI
					</span>
					<h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
						Solar Recommendation Engine
					</h1>
					<p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
						Get personalized solar recommendations tailored to your specific
						requirements and location
					</p>
				</div>

				<div className="mb-16 max-w-4xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden">
					<div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-5 flex items-center">
						<BarChart2 className="h-6 w-6 text-blue-100" />
						<h2 className="text-xl font-semibold text-white ml-2">
							How Our Recommendation Engine Works
						</h2>
					</div>
					<div className="px-6 py-8">
						<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
							<div className="flex flex-col items-center text-center p-4 rounded-xl bg-gray-50 hover:bg-blue-50 transition-colors duration-200">
								<div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100 text-blue-600 mb-2">
									<MapPin className="h-7 w-7" />
								</div>
								<h3 className="mt-3 text-base font-medium text-gray-900">
									Location Analysis
								</h3>
								<p className="mt-2 text-sm text-gray-600">
									We analyze solar radiation levels in your location based on
									pincode and historical weather data
								</p>
							</div>

							<div className="flex flex-col items-center text-center p-4 rounded-xl bg-gray-50 hover:bg-blue-50 transition-colors duration-200">
								<div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100 text-blue-600 mb-2">
									<Activity className="h-7 w-7" />
								</div>
								<h3 className="mt-3 text-base font-medium text-gray-900">
									Energy Requirement
								</h3>
								<p className="mt-2 text-sm text-gray-600">
									We calculate your energy needs from your electricity bill and
									usage patterns to right-size your system
								</p>
							</div>

							<div className="flex flex-col items-center text-center p-4 rounded-xl bg-gray-50 hover:bg-blue-50 transition-colors duration-200">
								<div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100 text-blue-600 mb-2">
									<Database className="h-7 w-7" />
								</div>
								<h3 className="mt-3 text-base font-medium text-gray-900">
									Data-Driven Results
								</h3>
								<p className="mt-2 text-sm text-gray-600">
									Our AI models recommend the optimal solar solution within your
									budget from thousands of possible configurations
								</p>
							</div>
						</div>
					</div>
				</div>

				<RecommendationEngine />

				<div className="mt-16 max-w-4xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
					<div className="px-8 py-8">
						<h3 className="text-2xl font-bold text-gray-900">
							Why Trust Our Recommendations?
						</h3>
						<p className="mt-4 text-gray-600">
							Our recommendation engine is powered by data from thousands of
							successful solar installations across India. We take into account
							local weather patterns, seasonal variations, and the latest solar
							technologies to provide you with accurate and reliable
							recommendations tailored to your specific needs.
						</p>

						<h4 className="mt-8 text-xl font-semibold text-gray-900">
							After getting your recommendation:
						</h4>
						<ul className="mt-4 space-y-4">
							<li className="flex bg-gray-50 p-4 rounded-xl">
								<div className="flex-shrink-0">
									<div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
										<svg
											className="h-6 w-6 text-green-600"
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
								</div>
								<div className="ml-4">
									<p className="text-base text-gray-700">
										<span className="font-medium text-gray-900">
											Compare offerings
										</span>{" "}
										from verified solar installers in your area with detailed
										price breakdowns and warranty information
									</p>
								</div>
							</li>
							<li className="flex bg-gray-50 p-4 rounded-xl">
								<div className="flex-shrink-0">
									<div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
										<svg
											className="h-6 w-6 text-green-600"
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
								</div>
								<div className="ml-4">
									<p className="text-base text-gray-700">
										<span className="font-medium text-gray-900">
											Learn about subsidies
										</span>{" "}
										you're eligible for based on your location and system with
										step-by-step guidance on application procedures
									</p>
								</div>
							</li>
							<li className="flex bg-gray-50 p-4 rounded-xl">
								<div className="flex-shrink-0">
									<div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
										<svg
											className="h-6 w-6 text-green-600"
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
								</div>
								<div className="ml-4">
									<p className="text-base text-gray-700">
										<span className="font-medium text-gray-900">
											Get connected
										</span>{" "}
										with financing options and installation experts who can help
										you make your solar transition smooth and hassle-free
									</p>
								</div>
							</li>
						</ul>

						<div className="mt-10 flex justify-center">
							<Link
								to="/chat"
								className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-md text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-colors duration-200"
							>
								Chat with Solar Expert
								<ChevronRight className="ml-2 h-5 w-5" />
							</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default RecommendationsPage;
