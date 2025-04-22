import React, { useState } from "react";
import {
	Sun,
	Home,
	Battery,
	Zap,
	MapPin,
	CreditCard,
	Check,
	ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";
import getPincodeLocation from "../ultils/evaluate-pincode";

const RecommendationEngine = () => {
	const [formData, setFormData] = useState({
		pincode: "",
		monthlyBill: "",
		roofSize: "",
		budget: "",
	});

	const [showRecommendation, setShowRecommendation] = useState(false);
	const [loading, setLoading] = useState(false);
	const [currentStep, setCurrentStep] = useState(1);
	const [pincodeLocation, setPincodeLocation] = useState<string | null>(null);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);

		// Simulate API call
		setTimeout(() => {
			setShowRecommendation(true);
			setLoading(false);
		}, 1500);
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData({
			...formData,
			[name]: value,
		});

		// If pincode field is changed and has 6 digits, evaluate the location
		if (name === "pincode" && value.length === 6) {
			const location = getPincodeLocation(value);
			setPincodeLocation(location);
		} else if (name === "pincode" && value.length !== 6) {
			// Clear the location if the pincode is not 6 digits
			setPincodeLocation(null);
		}
	};

	const formSteps = [
		{ id: 1, title: "Location" },
		{ id: 2, title: "Energy Usage" },
		{ id: 3, title: "Property" },
		{ id: 4, title: "Budget" },
	];

	const nextStep = () => {
		if (currentStep < formSteps.length) {
			setCurrentStep(currentStep + 1);
		} else {
			handleSubmit(new Event("submit") as any);
		}
	};

	const prevStep = () => {
		if (currentStep > 1) {
			setCurrentStep(currentStep - 1);
		}
	};

	return (
		<div
			className="py-24 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-800 dark:via-gray-900 dark:to-indigo-900 rounded-3xl shadow-sm"
			id="recommendation-engine"
		>
			<div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
				<motion.div
					className="text-center"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
				>
					<h2 className="text-5xl font-bold text-gray-900 dark:text-white tracking-tight">
						AI Recommendation Engine
					</h2>
					<p className="mt-6 text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
						Get personalized solar solutions based on your needs
					</p>
				</motion.div>

				<div className="mt-20">
					{!showRecommendation && (
						<>
							<div className="max-w-5xl mx-auto mb-16">
								<div className="flex justify-between items-center px-4 md:px-16">
									{formSteps.map((step) => (
										<div
											key={step.id}
											className="flex flex-col items-center relative"
										>
											<div
												className={`w-12 h-12 rounded-full flex items-center justify-center z-10 text-lg font-medium transition-colors duration-300
													${
														currentStep >= step.id
															? "bg-blue-600 dark:bg-blue-500 text-white"
															: "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
													}`}
											>
												{currentStep > step.id ? (
													<Check className="w-6 h-6" />
												) : (
													step.id
												)}
											</div>
											<span
												className={`mt-3 text-base font-medium transition-colors duration-300 ${
													currentStep >= step.id
														? "text-blue-600 dark:text-blue-400"
														: "text-gray-500 dark:text-gray-400"
												}`}
											>
												{step.title}
											</span>
											{step.id < formSteps.length && (
												<div
													className={`absolute top-6 w-full h-[3px] left-1/2 -z-0 transition-colors duration-300
													${
														currentStep > step.id
															? "bg-blue-600 dark:bg-blue-500"
															: "bg-gray-200 dark:bg-gray-700"
													}`}
												></div>
											)}
										</div>
									))}
								</div>
							</div>

							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ duration: 0.3 }}
								className="max-w-5xl mx-auto px-6"
							>
								{currentStep === 1 && (
									<div className="space-y-6">
										<motion.div
											initial={{ x: -20, opacity: 0 }}
											animate={{ x: 0, opacity: 1 }}
											className="relative"
										>
											<div className="absolute bottom-4 left-4 flex items-center pointer-events-none">
												{!pincodeLocation && (
													<MapPin className="h-6 w-6 text-blue-500 dark:text-blue-400" />
												)}
											</div>
											<label
												htmlFor="pincode"
												className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2 ml-1"
											>
												Pincode
											</label>
											<input
												type="text"
												name="pincode"
												id="pincode"
												value={formData.pincode}
												onChange={handleChange}
												className="pl-14 py-4 mt-1 block w-full rounded-2xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 shadow-md text-lg focus:border-blue-500 focus:ring-blue-500 dark:focus:border-blue-400 dark:focus:ring-blue-400 transition-all duration-200"
												placeholder="Enter your pincode"
												maxLength={6}
											/>
											{pincodeLocation && (
												<motion.div
													initial={{ opacity: 0, y: 10, scale: 0.9 }}
													animate={{ opacity: 1, y: 0, scale: 1 }}
													transition={{
														type: "spring",
														stiffness: 500,
														damping: 25,
													}}
													className="mt-4 inline-flex items-center px-4 py-2.5 rounded-full bg-gradient-to-r from-green-50 to-emerald-100 dark:from-green-900 dark:to-emerald-800 border border-green-200 dark:border-green-700 shadow-sm"
												>
													<div className="mr-2 flex-shrink-0">
														<MapPin className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
													</div>
													<div className="flex flex-col">
														<span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
															Location Detected
														</span>
														<span className="text-base font-medium text-emerald-700 dark:text-emerald-300">
															{pincodeLocation}
														</span>
													</div>
													<motion.div
														initial={{ opacity: 0, scale: 0 }}
														animate={{ opacity: 1, scale: 1 }}
														transition={{ delay: 0.3 }}
														className="ml-3 bg-green-100 dark:bg-green-800 p-1 rounded-full"
													>
														<Check className="h-4 w-4 text-green-600 dark:text-green-300" />
													</motion.div>
												</motion.div>
											)}
										</motion.div>
									</div>
								)}

								{currentStep === 2 && (
									<div className="space-y-6">
										<motion.div
											initial={{ x: -20, opacity: 0 }}
											animate={{ x: 0, opacity: 1 }}
											className="relative"
										>
											<div className="absolute bottom-4 left-4 flex items-center pointer-events-none">
												<Zap className="h-6 w-6 text-blue-500 dark:text-blue-400" />
											</div>
											<label
												htmlFor="monthlyBill"
												className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2 ml-1"
											>
												Monthly Electricity Bill (₹)
											</label>
											<input
												type="number"
												name="monthlyBill"
												id="monthlyBill"
												value={formData.monthlyBill}
												onChange={handleChange}
												className="pl-14 py-4 mt-1 block w-full rounded-2xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 shadow-md text-lg focus:border-blue-500 focus:ring-blue-500 dark:focus:border-blue-400 dark:focus:ring-blue-400 transition-all duration-200"
												placeholder="Enter your monthly bill"
											/>
										</motion.div>
									</div>
								)}

								{currentStep === 3 && (
									<div className="space-y-6">
										<motion.div
											initial={{ x: -20, opacity: 0 }}
											animate={{ x: 0, opacity: 1 }}
											className="relative"
										>
											<div className="absolute bottom-4 left-4 flex items-center pointer-events-none">
												<Home className="h-6 w-6 text-blue-500 dark:text-blue-400" />
											</div>
											<label
												htmlFor="roofSize"
												className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2 ml-1"
											>
												Roof Size (sq. ft)
											</label>
											<input
												type="number"
												name="roofSize"
												id="roofSize"
												value={formData.roofSize}
												onChange={handleChange}
												className="pl-14 py-4 mt-1 block w-full rounded-2xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 shadow-md text-lg focus:border-blue-500 focus:ring-blue-500 dark:focus:border-blue-400 dark:focus:ring-blue-400 transition-all duration-200"
												placeholder="Enter your roof size"
											/>
										</motion.div>
									</div>
								)}

								{currentStep === 4 && (
									<div className="space-y-6">
										<motion.div
											initial={{ x: -20, opacity: 0 }}
											animate={{ x: 0, opacity: 1 }}
											className="relative"
										>
											<div className="absolute bottom-4 left-4 flex items-center pointer-events-none">
												<CreditCard className="h-6 w-6 text-blue-500 dark:text-blue-400" />
											</div>
											<label
												htmlFor="budget"
												className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2 ml-1"
											>
												Budget Range (₹)
											</label>
											<input
												type="number"
												name="budget"
												id="budget"
												value={formData.budget}
												onChange={handleChange}
												className="pl-14 py-4 mt-1 block w-full rounded-2xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 shadow-md text-lg focus:border-blue-500 focus:ring-blue-500 dark:focus:border-blue-400 dark:focus:ring-blue-400 transition-all duration-200"
												placeholder="Enter your budget"
											/>
										</motion.div>
									</div>
								)}

								<div className="flex justify-between mt-16">
									{currentStep > 1 && (
										<button
											onClick={prevStep}
											className="px-8 py-4 rounded-xl text-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-200"
										>
											Back
										</button>
									)}
									<div className={currentStep > 1 ? "ml-auto" : ""}>
										<button
											onClick={nextStep}
											disabled={
												loading ||
												(currentStep === 1 &&
													(!formData.pincode ||
														formData.pincode.length !== 6 ||
														!pincodeLocation))
											}
											className={`relative inline-flex items-center px-10 py-4 border border-transparent text-lg font-medium rounded-full shadow-md text-white bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 hover:from-blue-700 hover:to-indigo-700 dark:hover:from-blue-600 dark:hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:focus:ring-offset-gray-800 transition-all duration-200 ${
												currentStep === 1 &&
												(!formData.pincode ||
													formData.pincode.length !== 6 ||
													!pincodeLocation)
													? "opacity-70 cursor-not-allowed"
													: ""
											}`}
										>
											{loading ? (
												<>
													<svg
														className="animate-spin -ml-1 mr-3 h-6 w-6 text-white"
														xmlns="http://www.w3.org/2000/svg"
														fill="none"
														viewBox="0 0 24 24"
													>
														<circle
															className="opacity-25"
															cx="12"
															cy="12"
															r="10"
															stroke="currentColor"
															strokeWidth="4"
														></circle>
														<path
															className="opacity-75"
															fill="currentColor"
															d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
														></path>
													</svg>
													Processing...
												</>
											) : (
												<>
													{currentStep < formSteps.length ? (
														<>
															Next <ChevronRight className="ml-3 h-6 w-6" />
														</>
													) : (
														<>
															Get Recommendations{" "}
															<Sun className="ml-3 h-6 w-6" />
														</>
													)}
												</>
											)}
										</button>
									</div>
								</div>
							</motion.div>
						</>
					)}

					{showRecommendation && (
						<motion.div
							className="mt-12 max-w-6xl mx-auto px-4"
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5 }}
						>
							<h3 className="text-3xl font-semibold text-gray-900 dark:text-white mb-10 text-center">
								Your Personalized Recommendation
							</h3>
							<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
								{[
									{
										title: "Solar Panel Setup",
										icon: (
											<Sun className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
										),
										iconBg: "bg-yellow-100 dark:bg-yellow-900",
										items: [
											{ label: "Recommended Capacity", value: "5kW" },
											{ label: "Panel Type", value: "Monocrystalline" },
											{ label: "Number of Panels", value: "15" },
											{ label: "Estimated Cost", value: "₹3,50,000" },
										],
									},
									{
										title: "Battery Solution",
										icon: (
											<Battery className="h-8 w-8 text-green-600 dark:text-green-400" />
										),
										iconBg: "bg-green-100 dark:bg-green-900",
										items: [
											{ label: "Battery Type", value: "Lithium-ion" },
											{ label: "Capacity", value: "10kWh" },
											{ label: "Backup Duration", value: "8-10 hours" },
											{ label: "Estimated Cost", value: "₹2,50,000" },
										],
									},
									{
										title: "Installation Details",
										icon: (
											<Home className="h-8 w-8 text-blue-600 dark:text-blue-400" />
										),
										iconBg: "bg-blue-100 dark:bg-blue-900",
										items: [
											{ label: "Installation Time", value: "3-4 days" },
											{ label: "Warranty", value: "25 years" },
											{ label: "Annual Maintenance", value: "₹5,000" },
											{
												label: "Subsidy Available",
												value: "₹94,500",
												highlight: true,
											},
										],
									},
								].map((card, idx) => (
									<motion.div
										key={idx}
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ duration: 0.5, delay: 0.1 * idx }}
										whileHover={{ y: -8 }}
										className="bg-white dark:bg-gray-800 backdrop-blur-sm bg-opacity-80 dark:bg-opacity-80 border border-gray-100 dark:border-gray-700 rounded-2xl p-8 shadow-lg dark:shadow-gray-900/50 hover:shadow-xl transition-all duration-300"
									>
										<div className="flex items-center mb-6">
											<div className={`${card.iconBg} p-4 rounded-xl`}>
												{card.icon}
											</div>
											<h4 className="ml-4 text-xl font-medium text-gray-900 dark:text-white">
												{card.title}
											</h4>
										</div>
										<ul className="space-y-5 text-gray-600 dark:text-gray-300">
											{card.items.map((item, itemIdx) => (
												<motion.li
													key={itemIdx}
													initial={{ opacity: 0, x: -10 }}
													animate={{ opacity: 1, x: 0 }}
													transition={{ delay: 0.2 + itemIdx * 0.1 }}
													className="flex items-start"
												>
													<div className="flex-shrink-0 h-6 w-6 text-green-500 dark:text-green-400 mt-0.5">
														<svg
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
													<span className="ml-3 text-lg">
														{item.label}:{" "}
														<span
															className={`font-semibold ${
																item.highlight
																	? "text-green-600 dark:text-green-400"
																	: ""
															}`}
														>
															{item.value}
														</span>
													</span>
												</motion.li>
											))}
										</ul>
									</motion.div>
								))}
							</div>

							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.5, delay: 0.4 }}
								className="mt-16 bg-gradient-to-r from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-indigo-900 rounded-2xl p-8 shadow-md text-center"
							>
								<p className="text-xl text-blue-800 dark:text-blue-200">
									Want to explore financing options for this recommendation?{" "}
									<a
										href="/chat"
										className="font-semibold underline hover:text-blue-600 dark:hover:text-blue-100 transition-colors duration-200"
									>
										Chat with our expert
									</a>
								</p>
								<div className="mt-8">
									<button
										onClick={() => {
											setShowRecommendation(false);
											setCurrentStep(1);
										}}
										className="px-8 py-4 rounded-xl text-lg bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600 transition-all duration-200"
									>
										Start Over
									</button>
								</div>
							</motion.div>
						</motion.div>
					)}
				</div>
			</div>
		</div>
	);
};

export default RecommendationEngine;
