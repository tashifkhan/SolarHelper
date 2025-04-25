import ComparisonTool from "../componets/ComparisonTool";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const ComparisonPage = () => {
	return (
		<div className="bg-gradient-to-b from-blue-100 to-white min-h-screen py-12">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className="text-center mb-12"
				>
					<h1 className="text-4xl font-bold text-gray-900 tracking-tight">
						Solar Products <span className="text-blue-600">Comparison</span>
					</h1>
					<p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
						Compare different solar solutions and find the perfect one for your
						home
					</p>
				</motion.div>

				{/* Removed the static feature comparison cards section */}

				<ComparisonTool />

				<motion.div
					initial={{ opacity: 0 }}
					whileInView={{ opacity: 1 }}
					viewport={{ once: true }}
					transition={{ delay: 0.3 }}
					className="mt-20 max-w-3xl mx-auto bg-gradient-to-br from-blue-50 to-white shadow-xl rounded-2xl p-8 border border-blue-100"
				>
					<div className="flex items-center space-x-3 mb-6">
						<Sparkles className="h-6 w-6 text-blue-500" />
						<h2 className="text-2xl font-bold text-gray-900">
							Need Personalized Advice?
						</h2>
					</div>
					<p className="text-gray-600 text-lg">
						Our comparison tool shows general information about popular solar
						panel options. For a personalized recommendation based on your
						specific needs, location, and budget, use our AI recommendation
						engine.
					</p>

					<div className="mt-10 flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
						<motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
							<Link
								to="/recommendations"
								className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 shadow-md transition-all duration-200"
							>
								Get Personalized Recommendation
							</Link>
						</motion.div>

						<motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
							<Link
								to="/chat"
								className="inline-flex items-center px-6 py-3 border border-gray-200 text-base font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 shadow-sm transition-all duration-200"
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
