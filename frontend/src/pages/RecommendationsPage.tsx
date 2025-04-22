import RecommendationEngine from "../componets/RecommendationEngine";
import { Link } from "react-router-dom";
import {
	Activity,
	MapPin,
	Database,
	ChevronRight,
	BarChart2,
	CheckCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import { useEffect } from "react";

const RecommendationsPage = () => {
	return (
		// Adjusted background gradient for dark mode
		<div className="bg-gradient-to-b from-blue-100 to-white dark:from-gray-900 dark:to-gray-800 min-h-screen py-16">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<motion.div className="text-center mb-12">
					<motion.span className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm font-medium px-4 py-1.5 rounded-full mb-4">
						Powered by AI
					</motion.span>
					{/* Adjusted heading colors */}
					<h1 className="text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl tracking-tight">
						Solar{" "}
						<span className="text-blue-600 dark:text-blue-400">
							Recommendation Engine
						</span>
					</h1>
					{/* Adjusted paragraph color */}
					<p className="mt-5 text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
						Get personalized solar recommendations tailored to your specific
						requirements and location
					</p>
				</motion.div>

				<motion.div className="mb-16 max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-xl dark:shadow-gray-900/50 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700">
					{/* Header gradient remains, text is white */}
					<div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5 flex items-center">
						<BarChart2 className="h-6 w-6 text-blue-100" />
						<h2 className="text-xl font-semibold text-white ml-2">
							How Our Recommendation Engine Works
						</h2>
					</div>
					<div className="px-6 py-8">
						<motion.div className="grid grid-cols-1 md:grid-cols-3 gap-8">
							<motion.div className="flex flex-col items-center text-center p-5 rounded-xl bg-gray-50 dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-gray-600 transition-all duration-300 border border-gray-100 dark:border-gray-600 shadow-sm">
								{/* Adjusted icon background/color */}
								<div className="flex h-16 w-16 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 mb-3">
									<MapPin className="h-8 w-8" />
								</div>
								{/* Adjusted text colors */}
								<h3 className="mt-3 text-lg font-semibold text-gray-900 dark:text-white">
									Location Analysis
								</h3>
								<p className="mt-2 text-gray-600 dark:text-gray-400">
									We analyze solar radiation levels in your location based on
									pincode and historical weather data
								</p>
							</motion.div>

							<motion.div className="flex flex-col items-center text-center p-5 rounded-xl bg-gray-50 dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-gray-600 transition-all duration-300 border border-gray-100 dark:border-gray-600 shadow-sm">
								{/* Adjusted icon background/color */}
								<div className="flex h-16 w-16 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 mb-3">
									<Activity className="h-8 w-8" />
								</div>
								{/* Adjusted text colors */}
								<h3 className="mt-3 text-lg font-semibold text-gray-900 dark:text-white">
									Energy Requirement
								</h3>
								<p className="mt-2 text-gray-600 dark:text-gray-400">
									We calculate your energy needs from your electricity bill and
									usage patterns to right-size your system
								</p>
							</motion.div>

							<motion.div className="flex flex-col items-center text-center p-5 rounded-xl bg-gray-50 dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-gray-600 transition-all duration-300 border border-gray-100 dark:border-gray-600 shadow-sm">
								{/* Adjusted icon background/color */}
								<div className="flex h-16 w-16 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 mb-3">
									<Database className="h-8 w-8" />
								</div>
								{/* Adjusted text colors */}
								<h3 className="mt-3 text-lg font-semibold text-gray-900 dark:text-white">
									Data-Driven Results
								</h3>
								<p className="mt-2 text-gray-600 dark:text-gray-400">
									Our AI models recommend the optimal solar solution within your
									budget from thousands of possible configurations
								</p>
							</motion.div>
						</motion.div>
					</div>
				</motion.div>

				{/* RecommendationEngine component will have its own dark mode styles */}
				<div id="recommendation-engine-section" className="scroll-mt-6">
					<RecommendationEngine />
				</div>

				<motion.div className="mt-20 max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-xl dark:shadow-gray-900/50 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700">
					<div className="px-8 py-8">
						{/* Adjusted heading colors */}
						<h3 className="text-2xl font-bold text-gray-900 dark:text-white">
							Why Trust Our{" "}
							<span className="text-blue-600 dark:text-blue-400">
								Recommendations
							</span>
							?
						</h3>
						{/* Adjusted paragraph color */}
						<p className="mt-4 text-gray-600 dark:text-gray-300 text-lg">
							Our recommendation engine is powered by data from thousands of
							successful solar installations across India. We take into account
							local weather patterns, seasonal variations, and the latest solar
							technologies to provide you with accurate and reliable
							recommendations tailored to your specific needs.
						</p>

						{/* Adjusted heading color */}
						<h4 className="mt-10 text-xl font-semibold text-gray-900 dark:text-white">
							After getting your recommendation:
						</h4>
						<motion.ul className="mt-6 space-y-4">
							<motion.li className="flex bg-gray-50 dark:bg-gray-700 p-5 rounded-xl hover:shadow-md transition-shadow duration-300 border border-gray-100 dark:border-gray-600">
								<div className="flex-shrink-0">
									{/* Adjusted icon background/color */}
									<div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
										<CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
									</div>
								</div>
								<div className="ml-5">
									{/* Adjusted text colors */}
									<p className="text-base text-gray-700 dark:text-gray-300">
										<span className="font-semibold text-gray-900 dark:text-white">
											Compare offerings
										</span>{" "}
										from verified solar installers in your area with detailed
										price breakdowns and warranty information
									</p>
								</div>
							</motion.li>

							<motion.li className="flex bg-gray-50 dark:bg-gray-700 p-5 rounded-xl hover:shadow-md transition-shadow duration-300 border border-gray-100 dark:border-gray-600">
								<div className="flex-shrink-0">
									{/* Adjusted icon background/color */}
									<div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
										<CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
									</div>
								</div>
								<div className="ml-5">
									{/* Adjusted text colors */}
									<p className="text-base text-gray-700 dark:text-gray-300">
										<span className="font-semibold text-gray-900 dark:text-white">
											Learn about subsidies
										</span>{" "}
										you're eligible for based on your location and system with
										step-by-step guidance on application procedures
									</p>
								</div>
							</motion.li>

							<motion.li className="flex bg-gray-50 dark:bg-gray-700 p-5 rounded-xl hover:shadow-md transition-shadow duration-300 border border-gray-100 dark:border-gray-600">
								<div className="flex-shrink-0">
									{/* Adjusted icon background/color */}
									<div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
										<CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
									</div>
								</div>
								<div className="ml-5">
									{/* Adjusted text colors */}
									<p className="text-base text-gray-700 dark:text-gray-300">
										<span className="font-semibold text-gray-900 dark:text-white">
											Get connected
										</span>{" "}
										with financing options and installation experts who can help
										you make your solar transition smooth and hassle-free
									</p>
								</div>
							</motion.li>
						</motion.ul>

						<div className="mt-12 flex justify-center">
							<motion.div>
								<Link
									to="/chat"
									className="inline-flex items-center px-6 py-3.5 border border-transparent text-base font-medium rounded-xl shadow-md text-white bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 hover:from-blue-700 hover:to-indigo-700 dark:hover:from-blue-600 dark:hover:to-indigo-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:focus:ring-offset-gray-800"
								>
									Chat with Solar Expert
									<ChevronRight className="ml-2 h-5 w-5" />
								</Link>
							</motion.div>
						</div>
					</div>
				</motion.div>
			</div>
		</div>
	);
};

export default RecommendationsPage;
