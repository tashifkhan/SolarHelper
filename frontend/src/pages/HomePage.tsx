import React from "react";
import Header from "../componets/Header";
import SavingsCalculator from "../componets/SavingsCalculator";
import RecommendationEngine from "../componets/RecommendationEngine";
import ComparisonTool from "../componets/ComparisonTool";
import CommunitySection from "../componets/CommunitySection";

const HomePage = () => {
	return (
		<div className="bg-gradient-to-b from-blue-50 to-white">
			<Header />
			<div className="py-8">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center">
						<h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
							Your Complete Solar Solution
						</h2>
						<p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
							Everything you need to make an informed decision about going solar
						</p>
					</div>

					<div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
						<div className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition-shadow">
							<div className="p-6">
								<div className="h-12 w-12 bg-blue-100 rounded-md flex items-center justify-center">
									<svg
										className="h-6 w-6 text-blue-600"
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
										/>
									</svg>
								</div>
								<h3 className="mt-4 text-lg font-medium text-gray-900">
									Calculate Savings
								</h3>
								<p className="mt-2 text-base text-gray-500">
									Find out how much you can save with solar panels based on your
									current electricity bill.
								</p>
								<a
									href="/calculator"
									className="mt-4 inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
								>
									Calculate Now
									<svg
										className="ml-1 h-4 w-4"
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 20 20"
										fill="currentColor"
									>
										<path
											fillRule="evenodd"
											d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
											clipRule="evenodd"
										/>
									</svg>
								</a>
							</div>
						</div>

						<div className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition-shadow">
							<div className="p-6">
								<div className="h-12 w-12 bg-green-100 rounded-md flex items-center justify-center">
									<svg
										className="h-6 w-6 text-green-600"
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
										/>
									</svg>
								</div>
								<h3 className="mt-4 text-lg font-medium text-gray-900">
									Get Recommendations
								</h3>
								<p className="mt-2 text-base text-gray-500">
									Receive personalized solar solutions based on your specific
									needs and location.
								</p>
								<a
									href="/recommendations"
									className="mt-4 inline-flex items-center text-sm font-medium text-green-600 hover:text-green-500"
								>
									Get Started
									<svg
										className="ml-1 h-4 w-4"
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 20 20"
										fill="currentColor"
									>
										<path
											fillRule="evenodd"
											d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
											clipRule="evenodd"
										/>
									</svg>
								</a>
							</div>
						</div>

						<div className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition-shadow">
							<div className="p-6">
								<div className="h-12 w-12 bg-yellow-100 rounded-md flex items-center justify-center">
									<svg
										className="h-6 w-6 text-yellow-600"
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
										/>
									</svg>
								</div>
								<h3 className="mt-4 text-lg font-medium text-gray-900">
									Chat with Expert
								</h3>
								<p className="mt-2 text-base text-gray-500">
									Get answers about solar subsidies and installation from our
									AI-powered assistant.
								</p>
								<a
									href="/chat"
									className="mt-4 inline-flex items-center text-sm font-medium text-yellow-600 hover:text-yellow-500"
								>
									Ask Now
									<svg
										className="ml-1 h-4 w-4"
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 20 20"
										fill="currentColor"
									>
										<path
											fillRule="evenodd"
											d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
											clipRule="evenodd"
										/>
									</svg>
								</a>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className="py-8">
				<SavingsCalculator />
			</div>
		</div>
	);
};

export default HomePage;
