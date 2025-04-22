import ComparisonTool from "../componets/ComparisonTool";
import { Link } from "react-router-dom";
import { BarChart3, LineChart, ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const ComparisonPage = () => {
	return (
		<div className="bg-gradient-to-b from-blue-100 to-white dark:from-gray-900 dark:to-gray-800 min-h-screen py-12">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className="text-center mb-12"
				>
					<h1 className="text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
						Solar Products{" "}
						<span className="text-blue-600 dark:text-blue-400">Comparison</span>
					</h1>
					<p className="mt-4 text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
						Compare different solar solutions and find the perfect one for your
						home
					</p>
				</motion.div>

				<div className="mb-16 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
					<motion.div
						whileHover={{ scale: 1.03 }}
						transition={{ type: "spring", stiffness: 300 }}
						className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700"
					>
						<div className="flex items-center">
							<div className="flex-shrink-0 bg-blue-100 dark:bg-blue-900 p-3 rounded-xl">
								<BarChart3 className="h-8 w-8 text-blue-600 dark:text-blue-400" />
							</div>
							<div className="ml-5">
								<h2 className="text-lg font-semibold text-gray-900 dark:text-white">
									Compare Features
								</h2>
								<p className="mt-2 text-gray-600 dark:text-gray-300">
									Evaluate different solar panels based on efficiency, warranty,
									and features
								</p>
							</div>
						</div>
					</motion.div>

					<motion.div
						whileHover={{ scale: 1.03 }}
						transition={{ type: "spring", stiffness: 300 }}
						className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700"
					>
						<div className="flex items-center">
							<div className="flex-shrink-0 bg-green-100 dark:bg-green-900 p-3 rounded-xl">
								<LineChart className="h-8 w-8 text-green-600 dark:text-green-400" />
							</div>
							<div className="ml-5">
								<h2 className="text-lg font-semibold text-gray-900 dark:text-white">
									Subsidy-Adjusted Pricing
								</h2>
								<p className="mt-2 text-gray-600 dark:text-gray-300">
									See the actual costs after accounting for available government
									subsidies
								</p>
							</div>
						</div>
					</motion.div>
				</div>

				<ComparisonTool />

				<motion.div
					initial={{ opacity: 0 }}
					whileInView={{ opacity: 1 }}
					viewport={{ once: true }}
					transition={{ delay: 0.3 }}
					className="mt-20 max-w-3xl mx-auto bg-gradient-to-br from-blue-50 to-white dark:from-gray-800 dark:to-gray-800/80 shadow-xl rounded-2xl p-8 border border-blue-100 dark:border-gray-700"
				>
					<div className="flex items-center space-x-3 mb-6">
						<Sparkles className="h-6 w-6 text-blue-500 dark:text-blue-400" />
						<h2 className="text-2xl font-bold text-gray-900 dark:text-white">
							Need Personalized Advice?
						</h2>
					</div>
					<p className="text-gray-600 dark:text-gray-300 text-lg">
						Our comparison tool shows general information about popular solar
						panel options. For a personalized recommendation based on your
						specific needs, location, and budget, use our AI recommendation
						engine.
					</p>

					<div className="mt-10 flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
						<motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
							<Link
								to="/recommendations"
								className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 shadow-md transition-all duration-200"
							>
								Get Personalized Recommendation
							</Link>
						</motion.div>

						<motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
							<Link
								to="/chat"
								className="inline-flex items-center px-6 py-3 border border-gray-200 dark:border-gray-600 text-base font-medium rounded-xl text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 shadow-sm transition-all duration-200"
							>
								Chat with Subsidy Expert
								<ArrowRight className="ml-2 h-4 w-4" />
							</Link>
						</motion.div>
					</div>
				</motion.div>
			</div>
		</div>
	);
};

export default ComparisonPage;
