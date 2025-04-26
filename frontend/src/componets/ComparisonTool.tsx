import {
	Check,
	Info,
	Loader2,
	Zap,
	ShieldCheck,
	Map,
	ArrowUpDown,
	Coins,
	Award,
	Sun,
	ChevronDown,
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Define interfaces for better type safety
interface Specification {
	type: string;
	efficiency: string;
	warranty: string;
}

interface Product {
	productName: string;
	originalPrice: string;
	subsidizedPrice: string;
	priceUnit: string;
	subsidyText: string;
	specifications: Specification;
	features: string[];
	buttonText: string;
	buttonAction: string;
}

interface StateData {
	state: string;
	operators: Product[];
}

const ComparisonTool = () => {
	const [showSubsidyInfo, setShowSubsidyInfo] = useState(false);
	const [allData, setAllData] = useState<StateData[]>([]);
	const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
	const [selectedState, setSelectedState] = useState<string>("Delhi");
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);

	// Fetch data on component mount
	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			setError(null);
			try {
				const response = await fetch("/comparision-data.json");
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				const data: StateData[] = await response.json();
				setAllData(data);
			} catch (e) {
				console.error("Failed to fetch comparison data:", e);
				setError(
					"Failed to load comparison data. Please try refreshing the page."
				);
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, []);

	// Filter products when allData or selectedState changes
	useEffect(() => {
		if (allData.length > 0) {
			const stateData = allData.find((item) => item.state === selectedState);
			setFilteredProducts(stateData ? stateData.operators : []);
		}
	}, [allData, selectedState]);

	const handleStateChange = (stateName: string) => {
		setSelectedState(stateName);
		setIsDropdownOpen(false);
	};

	const availableStates = allData.map((item) => item.state).sort();

	// Get top-rated product based on highest efficiency
	const getTopRatedProduct = () => {
		if (filteredProducts.length <= 1) return null;

		return filteredProducts.reduce((prev, current) => {
			const prevEff = prev.specifications.efficiency
				? parseFloat(prev.specifications.efficiency.replace("%", ""))
				: 0;
			const currEff = current.specifications.efficiency
				? parseFloat(current.specifications.efficiency.replace("%", ""))
				: 0;

			return prevEff > currEff ? prev : current;
		});
	};

	const topRatedProduct = getTopRatedProduct();

	return (
		<div className="py-10 bg-gradient-to-br from-blue-50 to-white" id="compare">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Header with animated gradient text */}
				<div className="text-center mb-12">
					<h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 tracking-tight">
						Compare Solar Products
					</h2>
					<p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
						Find the perfect solar solution for your needs based on your
						location
					</p>
				</div>

				{/* Enhanced State Selector */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className="max-w-md mx-auto mb-12"
				>
					<div className="bg-white p-5 rounded-xl shadow-md border border-gray-100">
						<div className="flex items-center gap-3 mb-4">
							<div className="bg-blue-100 p-2 rounded-full">
								<Map className="h-5 w-5 text-blue-600" />
							</div>
							<h3 className="text-lg font-semibold text-gray-800">
								Select Your Location
							</h3>
						</div>

						<p className="text-sm text-gray-500 mb-4">
							Solar products, pricing, and subsidies can vary by location.
							Select your state to see relevant options.
						</p>

						<div className="relative">
							<button
								onClick={() => setIsDropdownOpen(!isDropdownOpen)}
								className="w-full flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg text-left font-medium text-gray-700 hover:bg-blue-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
								disabled={
									loading || error !== null || availableStates.length === 0
								}
							>
								<span className="flex items-center">
									<Sun className="h-4 w-4 text-yellow-500 mr-2" />
									{selectedState || "Select State"}
								</span>
								<ChevronDown
									className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${
										isDropdownOpen ? "rotate-180" : ""
									}`}
								/>
							</button>

							{isDropdownOpen && availableStates.length > 0 && (
								<div className="absolute z-10 mt-1 w-full bg-white rounded-lg shadow-lg border border-gray-200 py-1 max-h-60 overflow-auto">
									{availableStates.map((stateName) => (
										<button
											key={stateName}
											className={`w-full text-left px-4 py-2 hover:bg-blue-50 transition-colors ${
												selectedState === stateName
													? "bg-blue-50 font-medium text-blue-700"
													: "text-gray-700"
											}`}
											onClick={() => handleStateChange(stateName)}
										>
											{stateName}
										</button>
									))}
								</div>
							)}
						</div>
					</div>
				</motion.div>

				{/* Subsidy Information Banner */}
				<div className="mb-12">
					<motion.div
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.2, duration: 0.5 }}
						className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-200 shadow-sm"
					>
						<div className="flex items-start">
							<div className="flex-shrink-0 bg-blue-100 p-2 rounded-full">
								<Info className="h-5 w-5 text-blue-600" />
							</div>
							<div className="ml-4 flex-1">
								<h3 className="text-lg font-semibold text-blue-800">
									Solar Subsidy Information
								</h3>
								<div className="mt-2 text-sm text-blue-700">
									<p>
										Government subsidies significantly reduce your solar
										installation costs. Prices shown reflect national guidelines
										where applicable, such as the PM Surya Ghar scheme offering
										₹14,588/kW for systems up to 3kW.
									</p>
									<button
										className="mt-3 inline-flex items-center text-blue-800 bg-blue-100 px-3 py-1 rounded-full text-xs font-medium hover:bg-blue-200 transition-colors"
										onClick={() => setShowSubsidyInfo(!showSubsidyInfo)}
									>
										{showSubsidyInfo ? "Hide details" : "Show subsidy details"}
										<ChevronDown
											className={`ml-1 h-3 w-3 transition-transform duration-200 ${
												showSubsidyInfo ? "rotate-180" : ""
											}`}
										/>
									</button>

									<AnimatePresence>
										{showSubsidyInfo && (
											<motion.div
												initial={{ opacity: 0, height: 0 }}
												animate={{ opacity: 1, height: "auto" }}
												exit={{ opacity: 0, height: 0 }}
												transition={{ duration: 0.3 }}
												className="overflow-hidden"
											>
												<div className="mt-3 bg-white p-4 rounded-lg border border-blue-100">
													<h4 className="font-semibold mb-2 text-blue-900">
														National Subsidy Guidelines (PM Surya Ghar):
													</h4>
													<ul className="space-y-1">
														<li>
															• Up to 3 kW: ₹14,588 per kW (Central Financial
															Assistance)
														</li>
														<li>
															• Above 3 kW to 10 kW: ₹7,294 per kW for the
															additional capacity
														</li>
														<li>
															• Above 10 kW: No central financial assistance
														</li>
														<li>
															• Note: State-specific subsidies might also apply.
														</li>
													</ul>
													<h4 className="font-semibold mt-3 mb-2">
														Eligibility Criteria:
													</h4>
													<ul className="space-y-1">
														<li>• Valid residential electricity connection</li>
														<li>• Installation by MNRE empanelled vendors</li>
														<li>
															• Grid-connected system with net metering facility
														</li>
													</ul>
													<h4 className="font-semibold mt-3 mb-2">
														How to Apply:
													</h4>
													<p>
														Contact your local DISCOM or visit the National
														Portal for Rooftop Solar to apply online.
													</p>
												</div>
											</motion.div>
										)}
									</AnimatePresence>
								</div>
							</div>
						</div>
					</motion.div>
				</div>

				{/* Loading and Error States - Enhanced */}
				{loading && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						className="mt-8 text-center py-12"
					>
						<div className="inline-flex items-center justify-center p-4 bg-blue-50 rounded-full mb-4">
							<Loader2 className="h-8 w-8 animate-spin text-blue-600" />
						</div>
						<p className="text-gray-600 text-lg">
							Loading solar vendors for {selectedState}...
						</p>
					</motion.div>
				)}

				{error && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						className="mt-8 text-center p-6 bg-red-50 rounded-xl border border-red-200"
					>
						<p className="text-red-600 font-medium">{error}</p>
						<button
							className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
							onClick={() => window.location.reload()}
						>
							Retry
						</button>
					</motion.div>
				)}

				{/* Product Comparison Grid - Completely Redesigned */}
				{!loading && !error && (
					<div className="mt-6">
						{filteredProducts.length > 0 ? (
							<>
								{/* Comparison Legend */}
								<div className="mb-6 flex items-center justify-center space-x-4 text-sm text-gray-500">
									<div className="flex items-center">
										<span className="w-3 h-3 bg-green-400 rounded-full mr-2"></span>
										<span>Best Efficiency</span>
									</div>
									<div className="flex items-center">
										<span className="w-3 h-3 bg-blue-400 rounded-full mr-2"></span>
										<span>Best Value</span>
									</div>
								</div>

								{/* Products Grid */}
								<div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
									{filteredProducts.map((product, index) => {
										// Determine if this product is top-rated
										const isTopRated =
											topRatedProduct &&
											topRatedProduct.productName === product.productName;

										return (
											<motion.div
												key={index}
												initial={{ opacity: 0, y: 20 }}
												animate={{ opacity: 1, y: 0 }}
												transition={{ duration: 0.4, delay: index * 0.1 }}
												className={`group relative bg-white rounded-xl shadow-lg overflow-hidden flex flex-col transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${
													isTopRated ? "ring-2 ring-green-400" : ""
												}`}
											>
												{/* Badges */}
												{isTopRated && (
													<div className="absolute top-3 right-3 z-10">
														<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
															<Award className="h-3.5 w-3.5 mr-1" />
															Best Efficiency
														</span>
													</div>
												)}

												{/* Card Header */}
												<div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 p-5 border-b">
													<h3 className="text-xl font-bold text-gray-800 text-center">
														{product.productName}
													</h3>
												</div>

												<div className="p-5 flex-grow flex flex-col">
													{/* Price Information - Enhanced */}
													<div className="mb-6">
														{product.subsidizedPrice &&
														product.subsidizedPrice !== "N/A" ? (
															<>
																<div className="flex justify-center mb-2">
																	<span className="inline-flex items-center text-xs font-medium text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full">
																		<Coins className="h-3.5 w-3.5 mr-1" />
																		Subsidy Applied
																	</span>
																</div>

																<div className="text-center">
																	<p className="text-xs text-gray-500 mb-1">
																		Effective Price
																	</p>
																	<div className="flex justify-center items-baseline">
																		<span className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
																			{product.subsidizedPrice}
																		</span>
																		{product.priceUnit && (
																			<span className="text-lg font-medium text-gray-500 ml-1">
																				{product.priceUnit}
																			</span>
																		)}
																	</div>

																	{product.originalPrice &&
																		product.originalPrice !== "N/A" && (
																			<p className="text-sm text-gray-400 line-through mt-1">
																				{product.originalPrice}
																				{product.priceUnit}
																			</p>
																		)}

																	{product.subsidyText && (
																		<div className="mt-2 flex justify-center">
																			<span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded">
																				{product.subsidyText}
																			</span>
																		</div>
																	)}
																</div>
															</>
														) : (
															<div className="text-center py-4">
																<p className="text-lg font-medium text-gray-700">
																	Contact for Pricing
																</p>
																<p className="text-xs text-gray-500 mt-1">
																	Requires custom quote
																</p>
															</div>
														)}
													</div>

													{/* Divider */}
													<div className="relative mb-6">
														<div className="absolute inset-0 flex items-center">
															<div className="w-full border-t border-gray-200"></div>
														</div>
														<div className="relative flex justify-center">
															<span className="px-2 bg-white text-xs font-medium text-gray-500 uppercase tracking-wider">
																<ArrowUpDown className="h-3.5 w-3.5 inline mr-1 text-gray-400" />
																Specifications
															</span>
														</div>
													</div>

													{/* Specifications - Redesigned */}
													<div className="mb-6 grid grid-cols-1 gap-3">
														{Object.entries(product.specifications)
															.filter(([_, value]) => value && value !== "N/A")
															.map(([key, value]) => {
																let icon;
																let colorClass;

																if (key === "type") {
																	icon = (
																		<Sun className="h-4 w-4 text-yellow-500" />
																	);
																	colorClass = "bg-yellow-50 border-yellow-100";
																} else if (key === "efficiency") {
																	icon = (
																		<Zap className="h-4 w-4 text-green-500" />
																	);
																	colorClass = "bg-green-50 border-green-100";
																} else if (key === "warranty") {
																	icon = (
																		<ShieldCheck className="h-4 w-4 text-blue-500" />
																	);
																	colorClass = "bg-blue-50 border-blue-100";
																} else {
																	icon = (
																		<Info className="h-4 w-4 text-gray-400" />
																	);
																	colorClass = "bg-gray-50 border-gray-100";
																}

																return (
																	<div
																		key={key}
																		className={`flex items-center p-2 rounded-lg border ${colorClass}`}
																	>
																		<div className="flex-shrink-0 mr-3">
																			{icon}
																		</div>
																		<div>
																			<p className="text-xs text-gray-500 capitalize">
																				{key}
																			</p>
																			<p className="text-sm font-medium text-gray-800">
																				{value}
																			</p>
																		</div>
																	</div>
																);
															})}
													</div>

													{/* Features */}
													<div className="flex-grow">
														<h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center">
															<Check className="h-3.5 w-3.5 text-gray-400 mr-1" />
															Key Features
														</h4>
														<ul className="space-y-2">
															{product.features
																.slice(0, 4)
																.map((feature, featureIndex) => (
																	<li
																		key={featureIndex}
																		className="flex items-start text-sm"
																	>
																		<span className="flex-shrink-0 h-5 w-5 relative mt-0.5">
																			<span className="absolute inset-0 flex items-center justify-center">
																				<Check className="h-3.5 w-3.5 text-green-500" />
																			</span>
																			<span className="absolute inset-0 rounded-full bg-green-50 opacity-30"></span>
																		</span>
																		<span className="ml-2 text-gray-600">
																			{feature}
																		</span>
																	</li>
																))}
															{product.features.length > 4 && (
																<li className="text-xs text-center text-blue-500 italic">
																	+{product.features.length - 4} more features
																</li>
															)}
														</ul>
													</div>

													{/* Button */}
													<div className="mt-6">
														<a
															href={
																product.buttonAction &&
																product.buttonAction !== "#"
																	? product.buttonAction
																	: undefined
															}
															target="_blank"
															rel="noopener noreferrer"
															className={`group relative block w-full text-center rounded-lg py-3 px-4 font-medium text-base transition-all duration-300 shadow-sm focus:outline-none ${
																product.buttonAction &&
																product.buttonAction !== "#"
																	? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700"
																	: "bg-gray-200 text-gray-500 cursor-not-allowed"
															}`}
															onClick={(e) => {
																if (
																	!product.buttonAction ||
																	product.buttonAction === "#"
																) {
																	e.preventDefault();
																}
															}}
														>
															<span className="relative z-10">
																{product.buttonText || "More Info"}
															</span>
															{product.buttonAction &&
																product.buttonAction !== "#" && (
																	<span className="absolute inset-0 rounded-lg overflow-hidden">
																		<span className="absolute inset-0 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"></span>
																	</span>
																)}
														</a>
													</div>
												</div>
											</motion.div>
										);
									})}
								</div>
							</>
						) : (
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100"
							>
								<div className="inline-flex items-center justify-center p-4 bg-blue-50 rounded-full mb-4">
									<Map className="h-6 w-6 text-blue-400" />
								</div>
								<h3 className="text-xl font-medium text-gray-700 mb-2">
									No vendors found in {selectedState}
								</h3>
								<p className="text-gray-500 max-w-md mx-auto">
									We couldn't find specific vendor information for your
									location. Please try a different state or contact national
									providers directly.
								</p>
							</motion.div>
						)}
					</div>
				)}

				{/* Call to Action - Enhanced */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6 }}
					className="mt-20 text-center"
				>
					<div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl shadow-lg p-8 max-w-3xl mx-auto transform hover:scale-[1.02] transition-transform duration-300">
						<h3 className="text-2xl font-bold mb-4">
							Need a Personalized Recommendation?
						</h3>
						<p className="text-blue-100 mb-8">
							Get a customized solar solution based on your specific energy
							needs, roof size, budget, and location with our AI-powered
							recommendation engine.
						</p>
						<a
							href="/recommendations"
							className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-lg shadow-md text-blue-700 bg-white hover:bg-blue-50 transition-all duration-200"
						>
							Get Your Custom Solar Plan
						</a>
					</div>
				</motion.div>
			</div>
		</div>
	);
};

export default ComparisonTool;
