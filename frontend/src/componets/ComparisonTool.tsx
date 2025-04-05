import { Check, Info } from "lucide-react";
import { useState } from "react";

const ComparisonTool = () => {
	const [showSubsidyInfo, setShowSubsidyInfo] = useState(false);

	const products = [
		{
			name: "Tata Power Solar",
			type: "Monocrystalline",
			efficiency: "21.5%",
			warranty: "25 years",
			price: "₹45,000",
			subsidyEligible: true,
			subsidyAmount: "₹14,588",
			netPrice: "₹30,412",
			features: [
				"High efficiency",
				"Weather resistant",
				"Anti-reflective coating",
				"PID resistant",
				"Salt mist resistant",
			],
		},
		{
			name: "Andi Solar",
			type: "Polycrystalline",
			efficiency: "19.8%",
			warranty: "25 years",
			price: "₹40,000",
			subsidyEligible: true,
			subsidyAmount: "₹14,588",
			netPrice: "₹25,412",
			features: [
				"Cost-effective",
				"Weather resistant",
				"Anti-reflective coating",
				"PID resistant",
			],
		},
		{
			name: "Vikram Solar",
			type: "Monocrystalline PERC",
			efficiency: "20.8%",
			warranty: "25 years",
			price: "₹42,500",
			subsidyEligible: true,
			subsidyAmount: "₹14,588",
			netPrice: "₹27,912",
			features: [
				"High efficiency",
				"Weather resistant",
				"Anti-reflective coating",
				"PID resistant",
				"Enhanced low-light performance",
			],
		},
	];

	return (
		<div className="py-16 bg-gradient-to-br from-blue-50 to-white" id="compare">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="text-center">
					<h2 className="text-3xl font-bold text-gray-900">
						Compare Solar Products
					</h2>
					<p className="mt-4 text-lg text-gray-600">
						Find the perfect solar solution for your needs
					</p>
				</div>

				{/* Subsidy Information Banner */}
				<div className="mt-8 bg-blue-50 rounded-lg p-4 border border-blue-200">
					<div className="flex items-start">
						<div className="flex-shrink-0">
							<Info className="h-6 w-6 text-blue-600" />
						</div>
						<div className="ml-3">
							<h3 className="text-lg font-medium text-blue-800">
								Solar Subsidy Information
							</h3>
							<div className="mt-2 text-blue-700">
								<p>
									Government subsidies can significantly reduce your solar
									installation costs. Currently, residential systems up to 3kW
									are eligible for a subsidy of ₹14,588 per kW.
								</p>
								<button
									className="mt-2 text-blue-800 underline font-medium"
									onClick={() => setShowSubsidyInfo(!showSubsidyInfo)}
								>
									{showSubsidyInfo ? "Hide details" : "Show more details"}
								</button>

								{showSubsidyInfo && (
									<div className="mt-3 text-sm bg-white p-4 rounded-md border border-blue-100">
										<h4 className="font-semibold mb-2">
											Subsidy Details by System Size:
										</h4>
										<ul className="space-y-1">
											<li>
												• Up to 3 kW: ₹14,588 per kW (40% of benchmark cost)
											</li>
											<li>
												• Above 3 kW to 10 kW: ₹7,294 per kW (20% of benchmark
												cost)
											</li>
											<li>• Above 10 kW: No central financial assistance</li>
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

										<h4 className="font-semibold mt-3 mb-2">How to Apply:</h4>
										<p>
											Contact your local DISCOM or visit the National Portal for
											Rooftop Solar to apply online.
										</p>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>

				<div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
					{products.map((product, index) => (
						<div
							key={index}
							className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-all hover:scale-105 hover:shadow-xl"
						>
							<div className="px-6 py-8">
								<h3 className="text-2xl font-bold text-gray-900 text-center">
									{product.name}
								</h3>

								{/* Price Information */}
								<div className="mt-4 text-center">
									<p className="text-lg text-gray-600 line-through">
										{product.price}/kW
									</p>
									<div className="flex justify-center items-center space-x-2">
										<p className="text-5xl font-extrabold text-gray-900">
											{product.netPrice}
										</p>
										<span className="text-xl font-medium text-gray-500">
											/kW
										</span>
									</div>
									<p className="mt-1 text-sm text-green-600 font-medium">
										After subsidy of {product.subsidyAmount}/kW
									</p>
								</div>

								{/* Specifications */}
								<div className="mt-4 space-y-2 bg-gray-50 p-3 rounded-md">
									<p className="text-center text-gray-700">
										<span className="font-medium">Type:</span> {product.type}
									</p>
									<p className="text-center text-gray-700">
										<span className="font-medium">Efficiency:</span>{" "}
										{product.efficiency}
									</p>
									<p className="text-center text-gray-700">
										<span className="font-medium">Warranty:</span>{" "}
										{product.warranty}
									</p>
								</div>

								<ul className="mt-8 space-y-4">
									{product.features.map((feature, featureIndex) => (
										<li key={featureIndex} className="flex items-center">
											<Check className="h-5 w-5 text-green-500" />
											<span className="ml-3 text-gray-700">{feature}</span>
										</li>
									))}
								</ul>

								<button className="mt-8 w-full bg-blue-600 text-white rounded-md py-3 hover:bg-blue-700 transition-colors font-medium">
									Get Quote
								</button>
							</div>
						</div>
					))}
				</div>

				{/* Call to Action */}
				<div className="mt-16 text-center">
					<p className="text-lg text-gray-700 mb-6">
						Not sure which solution fits your needs? Let our experts help you
						decide.
					</p>
					<a
						href="/recommendations"
						className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
					>
						Get Personalized Recommendations
					</a>
				</div>
			</div>
		</div>
	);
};

export default ComparisonTool;
