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
	const container = {
		hidden: { opacity: 0 },
		show: {
			opacity: 1,
			transition: { staggerChildren: 0.1 },
		},
	};

	const item = {
		hidden: { opacity: 0, y: 20 },
		show: { opacity: 1, y: 0 },
	};

	return (
		<div className="bg-gradient-to-b from-blue-100 to-white min-h-screen py-16">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className="text-center mb-12"
				>
					<motion.span
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.3 }}
						className="inline-block bg-blue-100 text-blue-800 text-sm font-medium px-4 py-1.5 rounded-full mb-4"
					>
						Powered by AI
					</motion.span>
					<h1 className="text-4xl font-bold text-gray-900 sm:text-5xl tracking-tight">
						Solar <span className="text-blue-600">Recommendation Engine</span>
					</h1>
					<p className="mt-5 text-xl text-gray-600 max-w-3xl mx-auto">
						Get personalized solar recommendations tailored to your specific
						requirements and location
					</p>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2 }}
					className="mb-16 max-w-4xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100"
				>
					<div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5 flex items-center">
						<BarChart2 className="h-6 w-6 text-blue-100" />
						<h2 className="text-xl font-semibold text-white ml-2">
							How Our Recommendation Engine Works
						</h2>
					</div>
					<div className="px-6 py-8">
						<motion.div
							variants={container}
							initial="hidden"
							animate="show"
							className="grid grid-cols-1 md:grid-cols-3 gap-8"
						>
							<motion.div
								variants={item}
								whileHover={{ scale: 1.03 }}
								className="flex flex-col items-center text-center p-5 rounded-xl bg-gray-50 hover:bg-blue-50 transition-all duration-300 border border-gray-100 shadow-sm"
							>
								<div className="flex h-16 w-16 items-center justify-center rounded-xl bg-blue-100 text-blue-600 mb-3">
									<MapPin className="h-8 w-8" />
								</div>
								<h3 className="mt-3 text-lg font-semibold text-gray-900">
									Location Analysis
								</h3>
								<p className="mt-2 text-gray-600">
									We analyze solar radiation levels in your location based on
									pincode and historical weather data
								</p>
							</motion.div>

							<motion.div
								variants={item}
								whileHover={{ scale: 1.03 }}
								className="flex flex-col items-center text-center p-5 rounded-xl bg-gray-50 hover:bg-blue-50 transition-all duration-300 border border-gray-100 shadow-sm"
							>
								<div className="flex h-16 w-16 items-center justify-center rounded-xl bg-blue-100 text-blue-600 mb-3">
									<Activity className="h-8 w-8" />
								</div>
								<h3 className="mt-3 text-lg font-semibold text-gray-900">
									Energy Requirement
								</h3>
								<p className="mt-2 text-gray-600">
									We calculate your energy needs from your electricity bill and
									usage patterns to right-size your system
								</p>
							</motion.div>

							<motion.div
								variants={item}
								whileHover={{ scale: 1.03 }}
								className="flex flex-col items-center text-center p-5 rounded-xl bg-gray-50 hover:bg-blue-50 transition-all duration-300 border border-gray-100 shadow-sm"
							>
								<div className="flex h-16 w-16 items-center justify-center rounded-xl bg-blue-100 text-blue-600 mb-3">
									<Database className="h-8 w-8" />
								</div>
								<h3 className="mt-3 text-lg font-semibold text-gray-900">
									Data-Driven Results
								</h3>
								<p className="mt-2 text-gray-600">
									Our AI models recommend the optimal solar solution within your
									budget from thousands of possible configurations
								</p>
							</motion.div>
						</motion.div>
					</div>
				</motion.div>

				<div id="recommendation-engine-section" className="scroll-mt-6">
					<RecommendationEngine />
				</div>

				{/* Auto scroll to recommendation engine on page load for mobile devices */}
				<div className="hidden">
					{(() => {
						useEffect(() => {
							const isMobile = window.innerWidth < 768;

							if (isMobile) {
								setTimeout(() => {
									document
										.getElementById("recommendation-engine-section")
										?.scrollIntoView({
											behavior: "smooth",
										});
								}, 500);
							}
						}, []);
						return null;
					})()}
				</div>

				<motion.div
					initial={{ opacity: 0 }}
					whileInView={{ opacity: 1 }}
					viewport={{ once: true }}
					transition={{ delay: 0.3 }}
					className="mt-20 max-w-4xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100"
				>
					<div className="px-8 py-8">
						<h3 className="text-2xl font-bold text-gray-900">
							Why Trust Our{" "}
							<span className="text-blue-600">Recommendations</span>?
						</h3>
						<p className="mt-4 text-gray-600 text-lg">
							Our recommendation engine is powered by data from thousands of
							successful solar installations across India. We take into account
							local weather patterns, seasonal variations, and the latest solar
							technologies to provide you with accurate and reliable
							recommendations tailored to your specific needs.
						</p>

						<h4 className="mt-10 text-xl font-semibold text-gray-900">
							After getting your recommendation:
						</h4>
						<motion.ul
							variants={container}
							initial="hidden"
							whileInView="show"
							viewport={{ once: true }}
							className="mt-6 space-y-4"
						>
							<motion.li
								variants={item}
								className="flex bg-gray-50 p-5 rounded-xl hover:shadow-md transition-shadow duration-300 border border-gray-100"
							>
								<div className="flex-shrink-0">
									<div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
										<CheckCircle className="h-6 w-6 text-green-600" />
									</div>
								</div>
								<div className="ml-5">
									<p className="text-base text-gray-700">
										<span className="font-semibold text-gray-900">
											Compare offerings
										</span>{" "}
										from verified solar installers in your area with detailed
										price breakdowns and warranty information
									</p>
								</div>
							</motion.li>

							<motion.li
								variants={item}
								className="flex bg-gray-50 p-5 rounded-xl hover:shadow-md transition-shadow duration-300 border border-gray-100"
							>
								<div className="flex-shrink-0">
									<div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
										<CheckCircle className="h-6 w-6 text-green-600" />
									</div>
								</div>
								<div className="ml-5">
									<p className="text-base text-gray-700">
										<span className="font-semibold text-gray-900">
											Learn about subsidies
										</span>{" "}
										you're eligible for based on your location and system with
										step-by-step guidance on application procedures
									</p>
								</div>
							</motion.li>

							<motion.li
								variants={item}
								className="flex bg-gray-50 p-5 rounded-xl hover:shadow-md transition-shadow duration-300 border border-gray-100"
							>
								<div className="flex-shrink-0">
									<div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
										<CheckCircle className="h-6 w-6 text-green-600" />
									</div>
								</div>
								<div className="ml-5">
									<p className="text-base text-gray-700">
										<span className="font-semibold text-gray-900">
											Get connected
										</span>{" "}
										with financing options and installation experts who can help
										you make your solar transition smooth and hassle-free
									</p>
								</div>
							</motion.li>
						</motion.ul>

						<div className="mt-12 flex justify-center">
							<motion.div
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.98 }}
							>
								<Link
									to="/chat"
									className="inline-flex items-center px-6 py-3.5 border border-transparent text-base font-medium rounded-xl shadow-md text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
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
