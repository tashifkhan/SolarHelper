import React, { useState, useEffect, useRef } from "react";
import {
	Calculator,
	TrendingUp,
	Zap,
	Save,
	Leaf,
	MapPin,
	Check,
	AlertCircle,
	CloudSun,
	Home,
	Loader,
} from "lucide-react";
import { motion } from "framer-motion";
import { loadPyodide } from "pyodide";
import getPincodeLocation from "../ultils/evaluate-pincode";
import getLatLonFromPincode from "../ultils/evaluate-location";
import { getUnitsForBillFromPincode } from "../ultils/evaluate-units";
import calculateCarbonSavings from "../ultils/evaulate-carbon";

const SavingsCalculator = () => {
	const [monthlyBill, setMonthlyBill] = useState("");
	const [pincode, setPincode] = useState("");
	const [pincodeLocation, setPincodeLocation] = useState<string | null>(null);
	const [showResults, setShowResults] = useState(false);
	const [animateNumbers, setAnimateNumbers] = useState(false);
	const [loading, setLoading] = useState(false);
	const [apiError, setApiError] = useState<string | null>(null);
	const [monthlyUnitsConsumed, setMonthlyUnitsConsumed] = useState<
		number | null
	>(null);
	const [monthlyEnergyGenerated, setMonthlyEnergyGenerated] = useState<
		number | null
	>(null);
	const [calculatedValues, setCalculatedValues] = useState({
		monthly: 0,
		annual: 0,
		lifetime: 0,
		carbonKg: 0,
		trees: 0,
	});
	const [pyodide, setPyodide] = useState<any | null>(null);
	const [pyodideLoading, setPyodideLoading] = useState(true);
	const [pyodideError, setPyodideError] = useState<string | null>(null);
	const [predictEnergyFunc, setPredictEnergyFunc] = useState<any | null>(null);

	const pyodideLoadInitiated = useRef(false);

	useEffect(() => {
		if (pyodideLoadInitiated.current || pyodide || pyodideError) {
			if (pyodideError && pyodideLoading) {
				setPyodideLoading(false);
			}
			return;
		}
		pyodideLoadInitiated.current = true;
		setPyodideLoading(true);
		setPyodideError(null);

		console.log("Loading Pyodide from CDN...");

		const initializePyodide = async () => {
			try {
				// use matching CDN version
				const CDN_INDEX = "https://cdn.jsdelivr.net/pyodide/v0.27.5/full/";
				const pyodideInstance = await loadPyodide({
					indexURL: CDN_INDEX,
				});
				console.log("Pyodide loaded from CDN. Loading packages...");

				await pyodideInstance.loadPackage([
					"micropip",
					"pandas",
					"scikit-learn",
					"lightgbm",
					"numpy",
				]);
				console.log("Packages loaded via CDN");

				// fetch & run Python script
				const resp = await fetch("/pyodide/predict_energy.py");
				if (!resp.ok) {
					throw new Error(`Fetch script failed: ${resp.status}`);
				}
				const script = await resp.text();
				await pyodideInstance.runPythonAsync(script);

				const predictFunc = pyodideInstance.globals.get(
					"predict_energy_for_location"
				);
				if (!predictFunc) {
					throw new Error("predict_energy_for_location not found");
				}

				setPredictEnergyFunc(() => predictFunc);
				setPyodide(pyodideInstance);
			} catch (error: any) {
				console.error("Pyodide init error:", error);
				setPyodideError(
					`Failed to initialize engine: ${error.message}. Check network or CDN availability.`
				);
			} finally {
				setPyodideLoading(false);
			}
		};

		initializePyodide();

		return () => {};
	}, [pyodide, pyodideError]);

	useEffect(() => {
		if (showResults) {
			setAnimateNumbers(true);
		} else {
			setAnimateNumbers(false);
		}
	}, [showResults]);

	const handlePincodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setPincode(value);
		setApiError(null);
		if (value.length === 6) {
			const location = getPincodeLocation(value);
			setPincodeLocation(location);
			if (!location) {
				setApiError("Could not determine location for this pincode.");
			}
		} else {
			setPincodeLocation(null);
		}
	};

	const handleCalculate = async (e: React.FormEvent) => {
		e.preventDefault();
		setApiError(null);
		setShowResults(false);

		if (pyodideLoading) {
			setApiError("Prediction engine is still loading. Please wait.");
			return;
		}

		if (!pyodide || !predictEnergyFunc || pyodideError) {
			setApiError(
				pyodideError || "Prediction engine is not available. Cannot calculate."
			);
			return;
		}

		if (
			!monthlyBill ||
			parseInt(monthlyBill) <= 0 ||
			!pincode ||
			pincode.length !== 6 ||
			!pincodeLocation
		) {
			setApiError(
				"Please enter a valid monthly bill and a valid 6-digit pincode."
			);
			return;
		}

		setLoading(true);

		try {
			const billAmount = parseInt(monthlyBill);

			const coordinates = await getLatLonFromPincode(pincode);
			if (!coordinates) {
				throw new Error(`Could not fetch coordinates for pincode ${pincode}.`);
			}

			const unitsConsumed = await getUnitsForBillFromPincode(
				billAmount,
				pincode
			);
			if (unitsConsumed === null || unitsConsumed <= 0) {
				throw new Error(
					`Could not estimate energy consumption for the provided bill and pincode.`
				);
			}
			setMonthlyUnitsConsumed(unitsConsumed);

			console.log("Calling Pyodide function predict_energy_for_location...");
			let energyDataJs = null;
			try {
				const energyDataPy = await predictEnergyFunc(
					coordinates.lat,
					coordinates.lon
				);
				if (energyDataPy && typeof energyDataPy.toJs === "function") {
					energyDataJs = energyDataPy.toJs({
						dict_converter: Object.fromEntries,
					});
					if (typeof energyDataPy.destroy === "function") {
						energyDataPy.destroy();
					}
				} else {
					throw new Error(
						"Prediction function did not return a valid result object."
					);
				}
				console.log("Pyodide prediction result (JS Object):", energyDataJs);

				if (energyDataJs.error) {
					throw new Error(
						`Prediction error from Python: ${energyDataJs.error}`
					);
				}
				if (
					energyDataJs.energy_generated === undefined ||
					energyDataJs.energy_generated === null
				) {
					throw new Error(
						"Prediction successful but did not return 'energy_generated'."
					);
				}
			} catch (pyError: any) {
				console.error("Error during Pyodide function execution:", pyError);
				const errorMessage = pyError?.message || pyError.toString();
				if (pyError.constructor?.name === "PythonError") {
					console.error("Python Traceback (if available):", pyError.message);
				}
				throw new Error(
					`Prediction engine calculation failed: ${errorMessage}`
				);
			}

			const generated = Math.round(energyDataJs.energy_generated ?? 0);
			setMonthlyEnergyGenerated(generated);

			const energySavedKwh = Math.min(generated, unitsConsumed);
			const monthly =
				unitsConsumed > 0
					? Math.round((energySavedKwh / unitsConsumed) * billAmount)
					: 0;
			const annual = monthly * 12;
			const lifetime = annual * 25;

			const annualEnergySavedKwh = energySavedKwh * 12;
			const { co2SavedKg, treesEquivalent } =
				calculateCarbonSavings(annualEnergySavedKwh);

			setCalculatedValues({
				monthly,
				annual,
				lifetime,
				carbonKg: Math.round(co2SavedKg),
				trees: Math.round(treesEquivalent),
			});

			setShowResults(true);
		} catch (error: any) {
			console.error("Calculation handle error:", error);
			setApiError(
				error.message ||
					"An error occurred during calculation. Please try again."
			);
			setShowResults(false);
			setMonthlyUnitsConsumed(null);
			setMonthlyEnergyGenerated(null);
		} finally {
			setLoading(false);
		}
	};

	const resetCalculator = () => {
		setMonthlyBill("");
		setPincode("");
		setPincodeLocation(null);
		setShowResults(false);
		setLoading(false);
		setApiError(null);
		setMonthlyUnitsConsumed(null);
		setMonthlyEnergyGenerated(null);
		setCalculatedValues({
			monthly: 0,
			annual: 0,
			lifetime: 0,
			carbonKg: 0,
			trees: 0,
		});
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

				{pyodideLoading && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						className="mb-6 p-4 bg-yellow-100 border border-yellow-300 text-yellow-800 rounded-lg flex items-center justify-center text-sm"
						role="status"
					>
						<Loader className="h-5 w-5 mr-2 animate-spin flex-shrink-0" />
						Initializing prediction engine... (Loading local files)
					</motion.div>
				)}
				{pyodideError && !pyodideLoading && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						className="mb-6 p-4 bg-red-100 border border-red-300 text-red-800 rounded-lg flex items-center text-sm"
						role="alert"
					>
						<AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
						{pyodideError}
					</motion.div>
				)}

				<div className="mt-16 max-w-4xl mx-auto">
					<motion.form
						onSubmit={handleCalculate}
						className="space-y-8 bg-white p-8 rounded-2xl shadow-lg border border-gray-100"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.2 }}
					>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
										onChange={(e) => {
											setMonthlyBill(e.target.value);
											setApiError(null);
										}}
										className="pl-14 py-4 block w-full rounded-2xl text-lg border-gray-300 shadow-md focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
										placeholder="Enter average bill"
										required
									/>
								</div>
							</div>

							<div>
								<label
									htmlFor="pincode"
									className="block text-lg font-medium text-gray-700 mb-2 ml-1"
								>
									Pincode
								</label>
								<div className="mt-1 relative rounded-xl shadow-sm">
									<div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
										<MapPin className="h-6 w-6 text-blue-500" />
									</div>
									<input
										type="text"
										name="pincode"
										id="pincode"
										value={pincode}
										onChange={handlePincodeChange}
										className="pl-14 py-4 block w-full rounded-2xl text-lg border-gray-300 shadow-md focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
										placeholder="Enter 6-digit pincode"
										maxLength={6}
										pattern="\d{6}"
										required
									/>
								</div>
								{pincodeLocation && pincode.length === 6 && (
									<motion.div
										initial={{ opacity: 0, y: 5 }}
										animate={{ opacity: 1, y: 0 }}
										className="mt-2 inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium"
									>
										<Check className="h-4 w-4 mr-1.5" />
										{pincodeLocation}
									</motion.div>
								)}
							</div>
						</div>

						{apiError && (
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								className="mt-4 p-3 bg-red-100 border border-red-300 text-red-800 rounded-lg flex items-center text-sm"
								role="alert"
							>
								<AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
								{apiError}
							</motion.div>
						)}

						<motion.button
							type="submit"
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
							disabled={
								pyodideLoading ||
								!!pyodideError ||
								loading ||
								!monthlyBill ||
								!pincode ||
								pincode.length !== 6 ||
								!pincodeLocation
							}
							className="w-full flex justify-center items-center py-4 px-6 border border-transparent rounded-full shadow-md text-lg font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
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
									Calculating...
								</>
							) : (
								<>
									Calculate Savings
									<Calculator className="ml-3 h-6 w-6" />
								</>
							)}
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
								Your Potential Savings & Impact
							</h3>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
								<motion.div
									className="bg-blue-50 p-6 rounded-xl shadow-sm border border-blue-100"
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.4, delay: 0.1 }}
								>
									<div className="flex items-center mb-2">
										<Home className="h-5 w-5 text-blue-600 mr-2" />
										<p className="text-base text-blue-700 font-medium">
											Estimated Monthly Consumption
										</p>
									</div>
									<span className="text-3xl font-bold text-blue-800">
										{animateNumbers
											? monthlyUnitsConsumed?.toLocaleString() ?? "N/A"
											: "0"}{" "}
										kWh
									</span>
								</motion.div>
								<motion.div
									className="bg-yellow-50 p-6 rounded-xl shadow-sm border border-yellow-100"
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.4, delay: 0.2 }}
								>
									<div className="flex items-center mb-2">
										<CloudSun className="h-5 w-5 text-yellow-600 mr-2" />
										<p className="text-base text-yellow-700 font-medium">
											Estimated Monthly Generation
										</p>
									</div>
									<span className="text-3xl font-bold text-yellow-800">
										{animateNumbers
											? monthlyEnergyGenerated?.toLocaleString() ?? "N/A"
											: "0"}{" "}
										kWh
									</span>
								</motion.div>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
										borderColor: "border-green-200",
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
										borderColor: "border-blue-200",
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
										borderColor: "border-purple-200",
									},
								].map((item, idx) => (
									<motion.div
										key={idx}
										className={`bg-gradient-to-br ${item.gradient} p-6 rounded-xl shadow-sm border ${item.borderColor} hover:shadow-md transition-all duration-300`}
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ duration: 0.4, delay: 0.1 * idx + 0.3 }}
										whileHover={{ y: -4 }}
									>
										<p className={`text-base ${item.textColor} font-medium`}>
											{item.title}
										</p>
										<motion.div
											className="flex items-baseline mt-3"
											initial={{ scale: 0.9 }}
											animate={{ scale: 1 }}
											transition={{ duration: 0.5, delay: 0.4 + 0.1 * idx }}
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
								<h4 className="text-xl font-semibold text-gray-800 mb-4 text-center">
									Environmental Impact (Annual)
								</h4>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									<div className="flex items-center bg-gray-50 p-4 rounded-lg border border-gray-200">
										<div className="bg-gray-200 p-3 rounded-xl">
											<TrendingUp className="h-6 w-6 text-gray-600" />
										</div>
										<div className="ml-4">
											<span className="text-base text-gray-500">
												Carbon Offset
											</span>
											<p className="text-2xl font-medium text-gray-800">
												{animateNumbers
													? calculatedValues.carbonKg.toLocaleString()
													: "0"}{" "}
												kg CO₂
											</p>
										</div>
									</div>
									<div className="flex items-center bg-green-50 p-4 rounded-lg border border-green-200">
										<div className="bg-green-100 p-3 rounded-xl">
											<Leaf className="h-6 w-6 text-green-600" />
										</div>
										<div className="ml-4">
											<span className="text-base text-green-600">
												Equivalent Trees Planted
											</span>
											<p className="text-2xl font-medium text-green-700">
												{animateNumbers
													? calculatedValues.trees.toLocaleString()
													: "0"}{" "}
												trees
											</p>
										</div>
									</div>
								</div>

								<div className="mt-10 text-center">
									<motion.button
										onClick={resetCalculator}
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
