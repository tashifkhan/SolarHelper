import React, { useState, useEffect } from "react";
import { Calculator, TrendingUp, Zap, Save, Leaf } from "lucide-react";
import { motion } from "framer-motion";

const SavingsCalculator = () => {
	const [monthlyBill, setMonthlyBill] = useState("");
	const [showResults, setShowResults] = useState(false);
	const [animateNumbers, setAnimateNumbers] = useState(false);
	const [calculatedValues, setCalculatedValues] = useState({
		monthly: 0,
		annual: 0,
		lifetime: 0,
		carbon: 0,
		payback: 0,
	});

	useEffect(() => {
		if (showResults) {
			setAnimateNumbers(true);
		}
	}, [showResults]);

	const handleCalculate = (e: React.FormEvent) => {
		e.preventDefault();

		if (!monthlyBill || parseInt(monthlyBill) <= 0) return;

		const billAmount = parseInt(monthlyBill);
		const monthly = billAmount * 0.8;
		const annual = monthly * 12;
		const lifetime = annual * 25;
		const carbon = Math.round(annual * 0.7);
		const payback = Math.round(350000 / annual);

		setCalculatedValues({
			monthly,
			annual,
			lifetime,
			carbon,
			payback,
		});

		setShowResults(true);
	};

	return (
		<div
			className="py-24 bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-3xl shadow-sm"
			id="calculator"
		>
			<div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
				<motion.div
					className="text-center"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
				>
					<span className="inline-block bg-blue-100 text-blue-800 text-base font-medium px-4 py-1.5 rounded-full mb-4">
						Calculate
					</span>
					<h2 className="text-5xl font-bold text-gray-900 tracking-tight">
						Solar Savings Calculator
					</h2>
					<p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
						Calculate your potential savings with solar power
					</p>
				</motion.div>

				<div className="mt-16 max-w-4xl mx-auto">
					<motion.form
						onSubmit={handleCalculate}
						className="space-y-8 bg-white p-8 rounded-2xl shadow-lg border border-gray-100"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.2 }}
					>
						<div>
							<label
								htmlFor="monthlyBill"
								className="block text-lg font-medium text-gray-700 mb-2 ml-1"
							>
								Monthly Electricity Bill (₹)
							</label>
							<div className="mt-1 relative rounded-xl shadow-sm">
								<div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
									<Zap className="h-6 w-6 text-blue-500" />
								</div>
								<input
									type="number"
									name="monthlyBill"
									id="monthlyBill"
									value={monthlyBill}
									onChange={(e) => setMonthlyBill(e.target.value)}
									className="pl-14 py-4 block w-full rounded-2xl text-lg border-gray-300 shadow-md focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
									placeholder="Enter your average monthly bill"
								/>
							</div>
						</div>

						<motion.button
							type="submit"
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
							className="w-full flex justify-center py-4 px-6 border border-transparent rounded-full shadow-md text-lg font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
						>
							Calculate Savings
							<Calculator className="ml-3 h-6 w-6" />
						</motion.button>
					</motion.form>

					{showResults && (
						<motion.div
							className="mt-16 bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5 }}
						>
							<h3 className="text-2xl font-semibold text-gray-900 mb-8 flex items-center">
								<Save className="h-6 w-6 mr-3 text-green-500" />
								Your Potential Savings
							</h3>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
								{[
									{
										title: "Monthly Savings",
										value: `₹${
											animateNumbers
												? calculatedValues.monthly.toLocaleString()
												: "0"
										}`,
										gradient: "from-green-50 to-green-100",
										textColor: "text-green-700",
									},
									{
										title: "Annual Savings",
										value: `₹${
											animateNumbers
												? calculatedValues.annual.toLocaleString()
												: "0"
										}`,
										gradient: "from-blue-50 to-blue-100",
										textColor: "text-blue-700",
									},
									{
										title: "25-Year Savings",
										value: `₹${
											animateNumbers
												? calculatedValues.lifetime.toLocaleString()
												: "0"
										}`,
										gradient: "from-purple-50 to-purple-100",
										textColor: "text-purple-700",
									},
									{
										title: "Carbon Offset (Annual)",
										value: `${
											animateNumbers
												? calculatedValues.carbon.toLocaleString()
												: "0"
										} kg CO₂`,
										gradient: "from-amber-50 to-amber-100",
										textColor: "text-amber-700",
									},
								].map((item, idx) => (
									<motion.div
										key={idx}
										className={`bg-gradient-to-br ${item.gradient} p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300`}
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ duration: 0.4, delay: 0.1 * idx }}
										whileHover={{ y: -4 }}
									>
										<p className={`text-base ${item.textColor} font-medium`}>
											{item.title}
										</p>
										<motion.div
											className="flex items-baseline mt-3"
											initial={{ scale: 0.9 }}
											animate={{ scale: 1 }}
											transition={{ duration: 0.5, delay: 0.3 + 0.1 * idx }}
										>
											<span className={`text-3xl font-bold ${item.textColor}`}>
												{item.value}
											</span>
										</motion.div>
									</motion.div>
								))}
							</div>

							<motion.div
								className="mt-8 pt-6 border-t border-gray-200"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ duration: 0.5, delay: 0.5 }}
							>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									<div className="flex items-center">
										<div className="bg-blue-100 p-3 rounded-xl">
											<TrendingUp className="h-6 w-6 text-blue-600" />
										</div>
										<div className="ml-4">
											<span className="text-base text-gray-500">
												Estimated payback period
											</span>
											<p className="text-2xl font-medium text-gray-800">
												{animateNumbers ? calculatedValues.payback : "0"} years
											</p>
										</div>
									</div>
									<div className="flex items-center">
										<div className="bg-green-100 p-3 rounded-xl">
											<Leaf className="h-6 w-6 text-green-600" />
										</div>
										<div className="ml-4">
											<span className="text-base text-gray-500">
												Environmental impact
											</span>
											<p className="text-lg text-gray-800">
												Equivalent to planting{" "}
												{Math.round(calculatedValues.carbon / 20)} trees
												annually
											</p>
										</div>
									</div>
								</div>

								<div className="mt-10 text-center">
									<motion.button
										onClick={() => {
											setShowResults(false);
											setMonthlyBill("");
										}}
										className="px-8 py-4 rounded-xl text-lg bg-blue-600 text-white hover:bg-blue-700 transition-all duration-200"
										whileHover={{ scale: 1.02 }}
										whileTap={{ scale: 0.98 }}
									>
										Calculate Again
									</motion.button>
								</div>
							</motion.div>
						</motion.div>
					)}
				</div>
			</div>
		</div>
	);
};

export default SavingsCalculator;
