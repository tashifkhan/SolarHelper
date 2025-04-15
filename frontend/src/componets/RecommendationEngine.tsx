import React, { useState } from "react";
import { Sun, Home, Battery, Zap, MapPin, CreditCard } from "lucide-react";

const RecommendationEngine = () => {
	const [formData, setFormData] = useState({
		pincode: "",
		monthlyBill: "",
		roofSize: "",
		budget: "",
	});

	const [showRecommendation, setShowRecommendation] = useState(false);
	const [loading, setLoading] = useState(false);

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
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	return (
		<div
			className="py-16 bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-sm"
			id="features"
		>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="text-center">
					<h2 className="text-3xl font-bold text-gray-900">
						AI Recommendation Engine
					</h2>
					<p className="mt-4 text-lg text-gray-600">
						Get personalized solar solutions based on your needs
					</p>
				</div>

				<div className="mt-12">
					<form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto">
						<div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<MapPin className="h-5 w-5 text-gray-400" />
								</div>
								<label
									htmlFor="pincode"
									className="block text-sm font-medium text-gray-700 mb-1 ml-1"
								>
									Pincode
								</label>
								<input
									type="text"
									name="pincode"
									id="pincode"
									value={formData.pincode}
									onChange={handleChange}
									className="pl-10 mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
									placeholder="Enter your pincode"
								/>
							</div>

							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<Zap className="h-5 w-5 text-gray-400" />
								</div>
								<label
									htmlFor="monthlyBill"
									className="block text-sm font-medium text-gray-700 mb-1 ml-1"
								>
									Monthly Electricity Bill (₹)
								</label>
								<input
									type="number"
									name="monthlyBill"
									id="monthlyBill"
									value={formData.monthlyBill}
									onChange={handleChange}
									className="pl-10 mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
									placeholder="Enter your monthly bill"
								/>
							</div>

							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<Home className="h-5 w-5 text-gray-400" />
								</div>
								<label
									htmlFor="roofSize"
									className="block text-sm font-medium text-gray-700 mb-1 ml-1"
								>
									Roof Size (sq. ft)
								</label>
								<input
									type="number"
									name="roofSize"
									id="roofSize"
									value={formData.roofSize}
									onChange={handleChange}
									className="pl-10 mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
									placeholder="Enter your roof size"
								/>
							</div>

							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<CreditCard className="h-5 w-5 text-gray-400" />
								</div>
								<label
									htmlFor="budget"
									className="block text-sm font-medium text-gray-700 mb-1 ml-1"
								>
									Budget Range (₹)
								</label>
								<input
									type="number"
									name="budget"
									id="budget"
									value={formData.budget}
									onChange={handleChange}
									className="pl-10 mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
									placeholder="Enter your budget"
								/>
							</div>
						</div>

						<div className="text-center">
							<button
								type="submit"
								disabled={loading}
								className="relative inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
							>
								{loading ? (
									<>
										<svg
											className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
										Get Recommendations
										<Sun className="ml-2 h-5 w-5" />
									</>
								)}
							</button>
						</div>
					</form>

					{showRecommendation && (
						<div className="mt-16 max-w-5xl mx-auto">
							<h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">
								Your Personalized Recommendation
							</h3>
							<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
								<div className="bg-white border border-gray-100 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow transform hover:-translate-y-1 duration-300">
									<div className="flex items-center mb-4">
										<div className="bg-yellow-100 p-3 rounded-lg">
											<Sun className="h-6 w-6 text-yellow-600" />
										</div>
										<h4 className="ml-3 text-lg font-medium">
											Solar Panel Setup
										</h4>
									</div>
									<ul className="space-y-3 text-gray-600">
										<li className="flex items-start">
											<div className="flex-shrink-0 h-5 w-5 text-green-500">
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
											<span className="ml-2">
												Recommended Capacity:{" "}
												<span className="font-semibold">5kW</span>
											</span>
										</li>
										<li className="flex items-start">
											<div className="flex-shrink-0 h-5 w-5 text-green-500">
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
											<span className="ml-2">
												Panel Type:{" "}
												<span className="font-semibold">Monocrystalline</span>
											</span>
										</li>
										<li className="flex items-start">
											<div className="flex-shrink-0 h-5 w-5 text-green-500">
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
											<span className="ml-2">
												Number of Panels:{" "}
												<span className="font-semibold">15</span>
											</span>
										</li>
										<li className="flex items-start">
											<div className="flex-shrink-0 h-5 w-5 text-green-500">
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
											<span className="ml-2">
												Estimated Cost:{" "}
												<span className="font-semibold">₹3,50,000</span>
											</span>
										</li>
									</ul>
								</div>

								<div className="bg-white border border-gray-100 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow transform hover:-translate-y-1 duration-300">
									<div className="flex items-center mb-4">
										<div className="bg-green-100 p-3 rounded-lg">
											<Battery className="h-6 w-6 text-green-600" />
										</div>
										<h4 className="ml-3 text-lg font-medium">
											Battery Solution
										</h4>
									</div>
									<ul className="space-y-3 text-gray-600">
										<li className="flex items-start">
											<div className="flex-shrink-0 h-5 w-5 text-green-500">
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
											<span className="ml-2">
												Battery Type:{" "}
												<span className="font-semibold">Lithium-ion</span>
											</span>
										</li>
										<li className="flex items-start">
											<div className="flex-shrink-0 h-5 w-5 text-green-500">
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
											<span className="ml-2">
												Capacity: <span className="font-semibold">10kWh</span>
											</span>
										</li>
										<li className="flex items-start">
											<div className="flex-shrink-0 h-5 w-5 text-green-500">
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
											<span className="ml-2">
												Backup Duration:{" "}
												<span className="font-semibold">8-10 hours</span>
											</span>
										</li>
										<li className="flex items-start">
											<div className="flex-shrink-0 h-5 w-5 text-green-500">
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
											<span className="ml-2">
												Estimated Cost:{" "}
												<span className="font-semibold">₹2,50,000</span>
											</span>
										</li>
									</ul>
								</div>

								<div className="bg-white border border-gray-100 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow transform hover:-translate-y-1 duration-300">
									<div className="flex items-center mb-4">
										<div className="bg-blue-100 p-3 rounded-lg">
											<Home className="h-6 w-6 text-blue-600" />
										</div>
										<h4 className="ml-3 text-lg font-medium">
											Installation Details
										</h4>
									</div>
									<ul className="space-y-3 text-gray-600">
										<li className="flex items-start">
											<div className="flex-shrink-0 h-5 w-5 text-green-500">
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
											<span className="ml-2">
												Installation Time:{" "}
												<span className="font-semibold">3-4 days</span>
											</span>
										</li>
										<li className="flex items-start">
											<div className="flex-shrink-0 h-5 w-5 text-green-500">
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
											<span className="ml-2">
												Warranty:{" "}
												<span className="font-semibold">25 years</span>
											</span>
										</li>
										<li className="flex items-start">
											<div className="flex-shrink-0 h-5 w-5 text-green-500">
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
											<span className="ml-2">
												Annual Maintenance:{" "}
												<span className="font-semibold">₹5,000</span>
											</span>
										</li>
										<li className="flex items-start">
											<div className="flex-shrink-0 h-5 w-5 text-green-500">
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
											<span className="ml-2">
												Subsidy Available:{" "}
												<span className="font-semibold text-green-600">
													₹94,500
												</span>
											</span>
										</li>
									</ul>
								</div>
							</div>

							<div className="mt-12 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 shadow-sm text-center">
								<p className="text-blue-800">
									Want to explore financing options for this recommendation?{" "}
									<a
										href="/chat"
										className="font-semibold underline hover:text-blue-600"
									>
										Chat with our expert
									</a>
								</p>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default RecommendationEngine;
