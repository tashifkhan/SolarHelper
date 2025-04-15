import React, { useState, useEffect } from "react";
import { Calculator, TrendingUp, Zap, Save, Leaf } from "lucide-react";

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
			className="py-16 bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-sm"
			id="calculator"
		>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="text-center">
					<span className="inline-block bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full mb-3">
						Calculate
					</span>
					<h2 className="text-3xl font-bold text-gray-900">
						Solar Savings Calculator
					</h2>
					<p className="mt-4 text-lg text-gray-600">
						Calculate your potential savings with solar power
					</p>
				</div>

				<div className="mt-12 max-w-xl mx-auto">
					<form
						onSubmit={handleCalculate}
						className="space-y-6 bg-white p-6 rounded-2xl shadow-md border border-gray-100"
					>
						<div>
							<label
								htmlFor="monthlyBill"
								className="block text-sm font-medium text-gray-700 mb-1 ml-1"
							>
								Monthly Electricity Bill (₹)
							</label>
							<div className="mt-1 relative rounded-xl shadow-sm">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<Zap className="h-5 w-5 text-gray-400" />
								</div>
								<input
									type="number"
									name="monthlyBill"
									id="monthlyBill"
									value={monthlyBill}
									onChange={(e) => setMonthlyBill(e.target.value)}
									className="pl-10 block w-full rounded-xl border-gray-300 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
									placeholder="Enter your average monthly bill"
								/>
							</div>
						</div>

						<button
							type="submit"
							className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-base font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
						>
							Calculate Savings
							<Calculator className="ml-2 h-5 w-5" />
						</button>
					</form>

					{showResults && (
						<div className="mt-10 bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
							<h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
								<Save className="h-5 w-5 mr-2 text-green-500" />
								Your Potential Savings
							</h3>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
								<div className="bg-gradient-to-br from-green-50 to-green-100 p-5 rounded-xl">
									<p className="text-sm text-green-700 font-medium">
										Monthly Savings
									</p>
									<div className="flex items-baseline mt-2">
										<span className="text-2xl sm:text-3xl font-bold text-green-700">
											₹
											{animateNumbers
												? calculatedValues.monthly.toLocaleString()
												: "0"}
										</span>
									</div>
								</div>

								<div className="bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-xl">
									<p className="text-sm text-blue-700 font-medium">
										Annual Savings
									</p>
									<div className="flex items-baseline mt-2">
										<span className="text-2xl sm:text-3xl font-bold text-blue-700">
											₹
											{animateNumbers
												? calculatedValues.annual.toLocaleString()
												: "0"}
										</span>
									</div>
								</div>

								<div className="bg-gradient-to-br from-purple-50 to-purple-100 p-5 rounded-xl">
									<p className="text-sm text-purple-700 font-medium">
										25-Year Savings
									</p>
									<div className="flex items-baseline mt-2">
										<span className="text-2xl sm:text-3xl font-bold text-purple-700">
											₹
											{animateNumbers
												? calculatedValues.lifetime.toLocaleString()
												: "0"}
										</span>
									</div>
								</div>

								<div className="bg-gradient-to-br from-amber-50 to-amber-100 p-5 rounded-xl">
									<p className="text-sm text-amber-700 font-medium">
										Carbon Offset (Annual)
									</p>
									<div className="flex items-baseline mt-2">
										<span className="text-2xl sm:text-3xl font-bold text-amber-700">
											{animateNumbers
												? calculatedValues.carbon.toLocaleString()
												: "0"}{" "}
											kg CO₂
										</span>
									</div>
								</div>
							</div>

							<div className="mt-6 pt-6 border-t border-gray-200">
								<div className="flex items-center">
									<div className="bg-blue-100 p-2 rounded-lg">
										<TrendingUp className="h-5 w-5 text-blue-600" />
									</div>
									<div className="ml-3">
										<span className="text-sm text-gray-500">
											Estimated payback period
										</span>
										<p className="text-xl font-medium text-gray-800">
											{animateNumbers ? calculatedValues.payback : "0"} years
										</p>
									</div>
								</div>
								<div className="mt-4 flex items-center">
									<div className="bg-green-100 p-2 rounded-lg">
										<Leaf className="h-5 w-5 text-green-600" />
									</div>
									<div className="ml-3">
										<span className="text-sm text-gray-500">
											Environmental impact
										</span>
										<p className="text-base text-gray-800">
											Equivalent to planting{" "}
											{Math.round(calculatedValues.carbon / 20)} trees annually
										</p>
									</div>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default SavingsCalculator;
