import CommunitySection from "../componets/CommunitySection";
import {
	MessageSquare,
	Users,
	BookOpen,
	Calendar,
	ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const CommunityPage = () => {
	const container = {
		hidden: { opacity: 0 },
		show: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
			},
		},
	};

	const item = {
		hidden: { opacity: 0, y: 20 },
		show: { opacity: 1, y: 0 },
	};

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
						Solar{" "}
						<span className="text-blue-600 dark:text-blue-400">Community</span>
					</h1>
					<p className="mt-4 text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
						Connect with fellow solar enthusiasts and learn from their
						experiences
					</p>
				</motion.div>

				<motion.div
					variants={container}
					initial="hidden"
					animate="show"
					className="mb-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
				>
					<motion.div
						variants={item}
						className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700"
					>
						<div className="p-6">
							<div className="flex items-center">
								<div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-xl">
									<Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
								</div>
								<h2 className="ml-4 text-lg font-semibold text-gray-900 dark:text-white">
									Join Discussions
								</h2>
							</div>
							<p className="mt-4 text-gray-600 dark:text-gray-300">
								Connect with thousands of solar users across India. Share
								experiences, ask questions, and learn from others.
							</p>
							<motion.div
								whileHover={{ x: 5 }}
								transition={{ type: "spring", stiffness: 400 }}
							>
								<Link
									to="/community/forums"
									className="mt-6 inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
								>
									Browse Forums
									<ArrowRight className="ml-2 h-4 w-4" />
								</Link>
							</motion.div>
						</div>
					</motion.div>

					<motion.div
						variants={item}
						className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700"
					>
						<div className="p-6">
							<div className="flex items-center">
								<div className="bg-green-100 dark:bg-green-900 p-3 rounded-xl">
									<MessageSquare className="h-6 w-6 text-green-600 dark:text-green-400" />
								</div>
								<h2 className="ml-4 text-lg font-semibold text-gray-900 dark:text-white">
									Expert Advice
								</h2>
							</div>
							<p className="mt-4 text-gray-600 dark:text-gray-300">
								Get answers to your solar questions from certified experts and
								experienced installers.
							</p>
							<motion.div
								whileHover={{ x: 5 }}
								transition={{ type: "spring", stiffness: 400 }}
							>
								<Link
									to="/chat"
									className="mt-6 inline-flex items-center text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 font-medium"
								>
									Chat with Expert
									<ArrowRight className="ml-2 h-4 w-4" />
								</Link>
							</motion.div>
						</div>
					</motion.div>

					<motion.div
						variants={item}
						className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700"
					>
						<div className="p-6">
							<div className="flex items-center">
								<div className="bg-yellow-100 dark:bg-yellow-900 p-3 rounded-xl">
									<BookOpen className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
								</div>
								<h2 className="ml-4 text-lg font-semibold text-gray-900 dark:text-white">
									Resource Library
								</h2>
							</div>
							<p className="mt-4 text-gray-600 dark:text-gray-300">
								Access our comprehensive collection of guides, articles, and
								case studies about solar energy.
							</p>
							<motion.div
								whileHover={{ x: 5 }}
								transition={{ type: "spring", stiffness: 400 }}
							>
								<Link
									to="/community/resources"
									className="mt-6 inline-flex items-center text-yellow-600 dark:text-yellow-500 hover:text-yellow-800 dark:hover:text-yellow-400 font-medium"
								>
									Browse Resources
									<ArrowRight className="ml-2 h-4 w-4" />
								</Link>
							</motion.div>
						</div>
					</motion.div>
				</motion.div>

				<CommunitySection />

				<motion.div
					initial={{ opacity: 0 }}
					whileInView={{ opacity: 1 }}
					viewport={{ once: true }}
					className="mt-20 max-w-4xl mx-auto"
				>
					<div className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700 rounded-2xl shadow-xl overflow-hidden">
						<div className="px-8 py-12 text-center sm:px-12">
							<motion.h2
								initial={{ y: 20, opacity: 0 }}
								whileInView={{ y: 0, opacity: 1 }}
								transition={{ delay: 0.2 }}
								className="text-3xl font-bold text-white dark:text-white"
							>
								Share Your Solar Success Story
							</motion.h2>
							<motion.p
								initial={{ y: 20, opacity: 0 }}
								whileInView={{ y: 0, opacity: 1 }}
								transition={{ delay: 0.3 }}
								className="mt-4 text-xl text-blue-100 dark:text-blue-200"
							>
								Inspire others by sharing your experience with solar energy.
								Your story could help someone make the right decision.
							</motion.p>
							<motion.button
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								className="mt-8 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl shadow-lg text-blue-700 dark:text-blue-800 bg-white dark:bg-gray-100 hover:bg-blue-50 dark:hover:bg-gray-200 transition-all duration-200"
							>
								Submit Your Story
							</motion.button>
						</div>
					</div>
				</motion.div>

				<div className="mt-20 max-w-3xl mx-auto">
					<motion.div
						initial={{ opacity: 0 }}
						whileInView={{ opacity: 1 }}
						viewport={{ once: true }}
						className="text-center mb-10"
					>
						<h2 className="text-3xl font-bold text-gray-900 dark:text-white">
							Upcoming Solar Events
						</h2>
						<div className="mt-2 h-1 w-20 bg-blue-500 dark:bg-blue-400 mx-auto rounded-full"></div>
					</motion.div>

					<motion.div
						variants={container}
						initial="hidden"
						whileInView="show"
						viewport={{ once: true }}
						className="grid grid-cols-1 gap-8"
					>
						<motion.div
							variants={item}
							className="bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300"
						>
							<div className="px-6 py-5 border-b border-gray-200 dark:border-gray-600">
								<div className="flex justify-between items-center">
									<div className="flex items-center">
										<Calendar className="h-5 w-5 text-blue-500 dark:text-blue-400 mr-3" />
										<h3 className="text-xl font-semibold text-gray-900 dark:text-white">
											Solar India Expo 2023
										</h3>
									</div>
									<span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
										Upcoming
									</span>
								</div>
								<p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
									December 15-17, 2023 • New Delhi
								</p>
							</div>
							<div className="px-6 py-5">
								<p className="text-gray-700 dark:text-gray-300">
									The largest solar energy exhibition in India featuring the
									latest technologies, panel discussions, and networking
									opportunities.
								</p>
								<motion.button
									whileHover={{ scale: 1.03 }}
									whileTap={{ scale: 0.97 }}
									className="mt-5 px-5 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-200"
								>
									Register Interest
								</motion.button>
							</div>
						</motion.div>

						<motion.div
							variants={item}
							className="bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300"
						>
							<div className="px-6 py-5 border-b border-gray-200 dark:border-gray-600">
								<div className="flex justify-between items-center">
									<div className="flex items-center">
										<Calendar className="h-5 w-5 text-blue-500 dark:text-blue-400 mr-3" />
										<h3 className="text-xl font-semibold text-gray-900 dark:text-white">
											Solar Subsidies Webinar
										</h3>
									</div>
									<span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
										Online
									</span>
								</div>
								<p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
									November 30, 2023 • 3:00 PM IST
								</p>
							</div>
							<div className="px-6 py-5">
								<p className="text-gray-700 dark:text-gray-300">
									Learn about the latest solar subsidies and incentives
									available in different states across India. Expert panel will
									answer your questions live.
								</p>
								<motion.button
									whileHover={{ scale: 1.03 }}
									whileTap={{ scale: 0.97 }}
									className="mt-5 px-5 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-200"
								>
									Register Now
								</motion.button>
							</div>
						</motion.div>
					</motion.div>
				</div>
			</div>
		</div>
	);
};

export default CommunityPage;
