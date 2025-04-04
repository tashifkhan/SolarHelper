import React from "react";
import {
	Sun,
	Home,
	Battery,
	LineChart,
	Users,
	BookOpen,
	ArrowRight,
} from "lucide-react";
import Header from "./componets/Header";
import RecommendationEngine from "./componets/RecommendationEngine";
import SavingsCalculator from "./componets/SavingsCalculator";
import ComparisonTool from "./componets/ComparisonTool";
import CommunitySection from "./componets/CommunitySection";

function App() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
			<nav className="bg-white shadow-sm">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between h-16 items-center">
						<div className="flex items-center">
							<Sun className="h-8 w-8 text-yellow-500" />
							<span className="ml-2 text-xl font-bold text-gray-800">
								Solar Helper
							</span>
						</div>
						<div className="hidden md:flex items-center space-x-8">
							<a href="#features" className="text-gray-600 hover:text-gray-900">
								Features
							</a>
							<a
								href="#calculator"
								className="text-gray-600 hover:text-gray-900"
							>
								Calculator
							</a>
							<a href="#compare" className="text-gray-600 hover:text-gray-900">
								Compare
							</a>
							<a
								href="#community"
								className="text-gray-600 hover:text-gray-900"
							>
								Community
							</a>
							<button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
								Get Started
							</button>
						</div>
					</div>
				</div>
			</nav>

			<Header />

			<div className="py-12 bg-white">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center">
						<h2 className="text-3xl font-bold text-gray-900">
							Why Choose Solar Helper?
						</h2>
						<p className="mt-4 text-lg text-gray-600">
							Empowering your solar journey with AI-driven insights
						</p>
					</div>

					<div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
						{[
							{
								icon: <Home className="h-8 w-8 text-blue-500" />,
								title: "Personalized Recommendations",
								description:
									"Get AI-powered suggestions tailored to your home's unique characteristics",
							},
							{
								icon: <Battery className="h-8 w-8 text-green-500" />,
								title: "Battery Solutions",
								description:
									"Find the perfect energy storage solution for uninterrupted power",
							},
							{
								icon: <LineChart className="h-8 w-8 text-purple-500" />,
								title: "ROI Calculator",
								description:
									"Calculate your potential savings and return on investment",
							},
						].map((feature, index) => (
							<div
								key={index}
								className="bg-gray-50 p-6 rounded-xl hover:shadow-lg transition-shadow"
							>
								<div className="flex items-center justify-center w-12 h-12 bg-white rounded-xl">
									{feature.icon}
								</div>
								<h3 className="mt-4 text-lg font-medium text-gray-900">
									{feature.title}
								</h3>
								<p className="mt-2 text-gray-600">{feature.description}</p>
							</div>
						))}
					</div>
				</div>
			</div>

			<RecommendationEngine />
			<SavingsCalculator />
			<ComparisonTool />
			<CommunitySection />

			<footer className="bg-gray-900 text-white py-12">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
						<div>
							<div className="flex items-center">
								<Sun className="h-8 w-8 text-yellow-500" />
								<span className="ml-2 text-xl font-bold">Solar Helper</span>
							</div>
							<p className="mt-4 text-gray-400">
								Simplifying solar adoption in India with AI-powered insights
							</p>
						</div>
						<div>
							<h3 className="text-lg font-semibold mb-4">Quick Links</h3>
							<ul className="space-y-2">
								<li>
									<a
										href="#features"
										className="text-gray-400 hover:text-white"
									>
										Features
									</a>
								</li>
								<li>
									<a
										href="#calculator"
										className="text-gray-400 hover:text-white"
									>
										Calculator
									</a>
								</li>
								<li>
									<a href="#compare" className="text-gray-400 hover:text-white">
										Compare
									</a>
								</li>
								<li>
									<a
										href="#community"
										className="text-gray-400 hover:text-white"
									>
										Community
									</a>
								</li>
							</ul>
						</div>
						<div>
							<h3 className="text-lg font-semibold mb-4">Resources</h3>
							<ul className="space-y-2">
								<li>
									<a href="#" className="text-gray-400 hover:text-white">
										Blog
									</a>
								</li>
								<li>
									<a href="#" className="text-gray-400 hover:text-white">
										Case Studies
									</a>
								</li>
								<li>
									<a href="#" className="text-gray-400 hover:text-white">
										FAQs
									</a>
								</li>
								<li>
									<a href="#" className="text-gray-400 hover:text-white">
										Support
									</a>
								</li>
							</ul>
						</div>
						<div>
							<h3 className="text-lg font-semibold mb-4">Contact</h3>
							<ul className="space-y-2">
								<li className="text-gray-400">contact@solarhelper.in</li>
								<li className="text-gray-400">+91 XXX XXX XXXX</li>
							</ul>
						</div>
					</div>
					<div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
						<p>© 2025 Solar Helper. All rights reserved.</p>
					</div>
				</div>
			</footer>
		</div>
	);
}

export default App;
