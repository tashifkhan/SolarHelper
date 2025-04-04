import { Check } from "lucide-react";

const ComparisonTool = () => {
	const products = [
		{
			name: "Tata Power Solar",
			type: "Monocrystalline",
			efficiency: "21.5%",
			warranty: "25 years",
			price: "₹45,000",
			features: [
				"High efficiency",
				"Weather resistant",
				"Anti-reflective coating",
				"PID resistant",
				"Salt mist resistant",
			],
		},
		{
			name: "Adani Solar",
			type: "Polycrystalline",
			efficiency: "19.8%",
			warranty: "25 years",
			price: "₹40,000",
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
		<div className="py-16 bg-gray-50" id="compare">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="text-center">
					<h2 className="text-3xl font-bold text-gray-900">
						Compare Solar Products
					</h2>
					<p className="mt-4 text-lg text-gray-600">
						Find the perfect solar solution for your needs
					</p>
				</div>

				<div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
					{products.map((product, index) => (
						<div
							key={index}
							className="bg-white rounded-lg shadow-lg overflow-hidden"
						>
							<div className="px-6 py-8">
								<h3 className="text-2xl font-bold text-gray-900 text-center">
									{product.name}
								</h3>
								<p className="mt-4 text-center text-5xl font-extrabold text-gray-900">
									{product.price}
									<span className="text-xl font-medium text-gray-500">/kW</span>
								</p>
								<p className="mt-4 text-center text-gray-500">
									Type: {product.type}
								</p>
								<p className="text-center text-gray-500">
									Efficiency: {product.efficiency}
								</p>
								<p className="text-center text-gray-500">
									Warranty: {product.warranty}
								</p>

								<ul className="mt-8 space-y-4">
									{product.features.map((feature, featureIndex) => (
										<li key={featureIndex} className="flex items-center">
											<Check className="h-5 w-5 text-green-500" />
											<span className="ml-3 text-gray-700">{feature}</span>
										</li>
									))}
								</ul>

								<button className="mt-8 w-full bg-blue-600 text-white rounded-md py-2 hover:bg-blue-700 transition-colors">
									Get Quote
								</button>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default ComparisonTool;
