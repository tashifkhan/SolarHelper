import React, { useState } from "react";
import { motion } from "framer-motion";
import { Zap, ShieldCheck, Wrench } from "lucide-react"; // Example icons

// Placeholder data
const products = [
	{
		id: 1,
		name: "SolarPanel Alpha",
		brand: "Brand A",
		efficiency: 21.5,
		warranty: 25,
		price: 25000,
		features: ["High Efficiency", "Durable", "Good Low Light Performance"],
	},
	{
		id: 2,
		name: "SolarPanel Beta",
		brand: "Brand B",
		efficiency: 20.0,
		warranty: 20,
		price: 22000,
		features: ["Cost-Effective", "Reliable"],
	},
	{
		id: 3,
		name: "SolarPanel Gamma",
		brand: "Brand C",
		efficiency: 22.0,
		warranty: 30,
		price: 28000,
		features: ["Top Tier Efficiency", "Longest Warranty", "Premium Build"],
	},
];

const ComparisonTool: React.FC = () => {
	const [selectedProducts, setSelectedProducts] = useState<number[]>([1, 3]); // Default selected

	const toggleProductSelection = (productId: number) => {
		setSelectedProducts(
			(prev) =>
				prev.includes(productId)
					? prev.filter((id) => id !== productId)
					: [...prev, productId].slice(-3) // Limit to 3 selections
		);
	};

	const displayedProducts = products.filter((p) =>
		selectedProducts.includes(p.id)
	);

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ delay: 0.2 }}
			// Adjusted background and border
			className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100 dark:border-gray-700"
		>
			{/* Product Selection */}
			<div className="mb-8">
				{/* Adjusted text color */}
				<h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-3">
					Select products to compare (up to 3):
				</h3>
				<div className="flex flex-wrap gap-3">
					{products.map((product) => (
						<button
							key={product.id}
							onClick={() => toggleProductSelection(product.id)}
							// Adjusted button styles for selected/unselected
							className={`px-4 py-2 rounded-full border text-sm transition-colors duration-150 ${
								selectedProducts.includes(product.id)
									? "bg-blue-100 dark:bg-blue-900 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300"
									: "bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600"
							}`}
						>
							{product.name}
						</button>
					))}
				</div>
			</div>

			{/* Comparison Table */}
			{displayedProducts.length > 0 ? (
				<div className="overflow-x-auto">
					<table className="w-full min-w-[600px] border-collapse">
						<thead>
							{/* Adjusted header background and border */}
							<tr className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
								{/* Adjusted header text color */}
								<th className="p-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300 w-1/4">
									Feature
								</th>
								{displayedProducts.map((product) => (
									<th
										key={product.id}
										className="p-4 text-center text-sm font-semibold text-gray-600 dark:text-gray-300 w-1/4"
									>
										{product.name}
										<span className="block text-xs font-normal text-gray-400 dark:text-gray-500">
											{product.brand}
										</span>
									</th>
								))}
							</tr>
						</thead>
						<tbody>
							{/* Efficiency Row */}
							{/* Adjusted border color */}
							<tr className="border-b border-gray-100 dark:border-gray-700">
								{/* Adjusted feature text color */}
								<td className="p-4 text-sm font-medium text-gray-800 dark:text-gray-200 flex items-center">
									<Zap className="h-4 w-4 mr-2 text-yellow-500 dark:text-yellow-400" />{" "}
									Efficiency
								</td>
								{displayedProducts.map((product) => (
									// Adjusted value text color
									<td
										key={product.id}
										className="p-4 text-center text-sm text-gray-700 dark:text-gray-300"
									>
										{product.efficiency}%
									</td>
								))}
							</tr>
							{/* Warranty Row */}
							{/* Adjusted border color */}
							<tr className="border-b border-gray-100 dark:border-gray-700">
								{/* Adjusted feature text color */}
								<td className="p-4 text-sm font-medium text-gray-800 dark:text-gray-200 flex items-center">
									<ShieldCheck className="h-4 w-4 mr-2 text-green-500 dark:text-green-400" />{" "}
									Warranty
								</td>
								{displayedProducts.map((product) => (
									// Adjusted value text color
									<td
										key={product.id}
										className="p-4 text-center text-sm text-gray-700 dark:text-gray-300"
									>
										{product.warranty} years
									</td>
								))}
							</tr>
							{/* Price Row */}
							{/* Adjusted border color */}
							<tr className="border-b border-gray-100 dark:border-gray-700">
								{/* Adjusted feature text color */}
								<td className="p-4 text-sm font-medium text-gray-800 dark:text-gray-200 flex items-center">
									₹ Price (Est.)
								</td>
								{displayedProducts.map((product) => (
									// Adjusted value text color
									<td
										key={product.id}
										className="p-4 text-center text-sm text-gray-700 dark:text-gray-300"
									>
										₹{product.price.toLocaleString()}
									</td>
								))}
							</tr>
							{/* Features Row */}
							{/* Adjusted border color */}
							<tr className="border-b border-gray-100 dark:border-gray-700">
								{/* Adjusted feature text color */}
								<td className="p-4 text-sm font-medium text-gray-800 dark:text-gray-200 flex items-center">
									<Wrench className="h-4 w-4 mr-2 text-blue-500 dark:text-blue-400" />{" "}
									Key Features
								</td>
								{displayedProducts.map((product) => (
									<td
										key={product.id}
										className="p-4 text-center text-sm text-gray-700 dark:text-gray-300"
									>
										<ul className="list-disc list-inside text-left inline-block">
											{product.features.map((feature, idx) => (
												<li key={idx}>{feature}</li>
											))}
										</ul>
									</td>
								))}
							</tr>
							{/* Add more rows as needed */}
						</tbody>
					</table>
				</div>
			) : (
				// Adjusted placeholder text color
				<p className="text-center text-gray-500 dark:text-gray-400 py-8">
					Select at least one product to start comparing.
				</p>
			)}
		</motion.div>
	);
};

export default ComparisonTool;
