import CommunitySection from "../componets/CommunitySection";
import { MessageSquare, Users, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

const CommunityPage = () => {
	return (
		<div className="bg-gradient-to-b from-blue-50 to-white min-h-screen py-12">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="text-center mb-8">
					<h1 className="text-3xl font-bold text-gray-900">Solar Community</h1>
					<p className="mt-4 text-lg text-gray-600">
						Connect with fellow solar enthusiasts and learn from their
						experiences
					</p>
				</div>

				<div className="mb-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
					<div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
						<div className="p-6">
							<div className="flex items-center">
								<Users className="h-6 w-6 text-blue-500" />
								<h2 className="ml-3 text-lg font-medium text-gray-900">
									Join Discussions
								</h2>
							</div>
							<p className="mt-4 text-gray-600">
								Connect with thousands of solar users across India. Share
								experiences, ask questions, and learn from others.
							</p>
							<Link
								to="/community/forums"
								className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-800"
							>
								Browse Forums
								<svg
									className="ml-2 h-4 w-4"
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
							</Link>
						</div>
					</div>

					<div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
						<div className="p-6">
							<div className="flex items-center">
								<MessageSquare className="h-6 w-6 text-green-500" />
								<h2 className="ml-3 text-lg font-medium text-gray-900">
									Expert Advice
								</h2>
							</div>
							<p className="mt-4 text-gray-600">
								Get answers to your solar questions from certified experts and
								experienced installers.
							</p>
							<Link
								to="/chat"
								className="mt-4 inline-flex items-center text-green-600 hover:text-green-800"
							>
								Chat with Expert
								<svg
									className="ml-2 h-4 w-4"
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
							</Link>
						</div>
					</div>

					<div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
						<div className="p-6">
							<div className="flex items-center">
								<BookOpen className="h-6 w-6 text-yellow-500" />
								<h2 className="ml-3 text-lg font-medium text-gray-900">
									Resource Library
								</h2>
							</div>
							<p className="mt-4 text-gray-600">
								Access our comprehensive collection of guides, articles, and
								case studies about solar energy.
							</p>
							<Link
								to="/community/resources"
								className="mt-4 inline-flex items-center text-yellow-600 hover:text-yellow-800"
							>
								Browse Resources
								<svg
									className="ml-2 h-4 w-4"
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
							</Link>
						</div>
					</div>
				</div>

				<CommunitySection />

				<div className="mt-16 max-w-4xl mx-auto">
					<div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl shadow-xl overflow-hidden">
						<div className="px-6 py-12 text-center sm:px-12">
							<h2 className="text-2xl font-semibold text-white">
								Share Your Solar Success Story
							</h2>
							<p className="mt-4 text-lg text-blue-100">
								Inspire others by sharing your experience with solar energy.
								Your story could help someone make the right decision.
							</p>
							<button className="mt-8 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-blue-700 bg-white hover:bg-blue-50">
								Submit Your Story
							</button>
						</div>
					</div>
				</div>

				<div className="mt-16 max-w-3xl mx-auto">
					<h2 className="text-2xl font-bold text-gray-900 text-center">
						Upcoming Solar Events
					</h2>
					<div className="mt-8 grid grid-cols-1 gap-6">
						<div className="bg-white shadow-lg rounded-lg overflow-hidden">
							<div className="px-6 py-4 border-b border-gray-200">
								<div className="flex justify-between items-center">
									<h3 className="text-lg font-semibold text-gray-900">
										Solar India Expo 2023
									</h3>
									<span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
										Upcoming
									</span>
								</div>
								<p className="mt-1 text-sm text-gray-600">
									December 15-17, 2023 • New Delhi
								</p>
							</div>
							<div className="px-6 py-4">
								<p className="text-gray-700">
									The largest solar energy exhibition in India featuring the
									latest technologies, panel discussions, and networking
									opportunities.
								</p>
								<button className="mt-4 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
									Register Interest
								</button>
							</div>
						</div>

						<div className="bg-white shadow-lg rounded-lg overflow-hidden">
							<div className="px-6 py-4 border-b border-gray-200">
								<div className="flex justify-between items-center">
									<h3 className="text-lg font-semibold text-gray-900">
										Solar Subsidies Webinar
									</h3>
									<span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
										Online
									</span>
								</div>
								<p className="mt-1 text-sm text-gray-600">
									November 30, 2023 • 3:00 PM IST
								</p>
							</div>
							<div className="px-6 py-4">
								<p className="text-gray-700">
									Learn about the latest solar subsidies and incentives
									available in different states across India. Expert panel will
									answer your questions live.
								</p>
								<button className="mt-4 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
									Register Now
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CommunityPage;
