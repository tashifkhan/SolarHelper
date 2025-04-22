import { Users, MessageSquare, BookOpen } from "lucide-react";

const CommunitySection = () => {
	const posts = [
		{
			title: "How I reduced my electricity bill by 90%",
			author: "Rahul Sharma",
			date: "2 days ago",
			excerpt:
				"After installing a 5kW solar system, my monthly electricity bill dropped from ₹8,000 to just ₹800...",
		},
		{
			title: "Guide: Maintaining your solar panels",
			author: "Priya Patel",
			date: "1 week ago",
			excerpt:
				"Regular maintenance of your solar panels is crucial for optimal performance. Here's what you need to know...",
		},
		{
			title: "Latest solar subsidies in Maharashtra",
			author: "Amit Kumar",
			date: "3 days ago",
			excerpt:
				"The Maharashtra government has announced new solar subsidies for residential installations...",
		},
	];

	return (
		<div className="py-16 bg-white dark:bg-gray-800" id="community">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="text-center">
					<h2 className="text-3xl font-bold text-gray-900 dark:text-white">
						Join Our Solar Community
					</h2>
					<p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
						Learn from experts and share your solar journey
					</p>
				</div>

				<div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-3">
					{posts.map((post, index) => (
						<div
							key={index}
							className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 hover:shadow-lg dark:hover:shadow-gray-600/30 transition-shadow"
						>
							<h3 className="text-xl font-semibold text-gray-900 dark:text-white">
								{post.title}
							</h3>
							<div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
								<Users className="h-4 w-4 mr-1" />
								<span>{post.author}</span>
								<span className="mx-2">•</span>
								<span>{post.date}</span>
							</div>
							<p className="mt-3 text-gray-600 dark:text-gray-300">
								{post.excerpt}
							</p>
							<a
								href="#"
								className="mt-4 inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
							>
								Read more
								<svg
									className="ml-2 h-4 w-4"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M9 5l7 7-7 7"
									/>
								</svg>
							</a>
						</div>
					))}
				</div>

				<div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
					<div className="bg-blue-50 dark:bg-blue-900/50 rounded-lg p-8">
						<div className="flex items-center">
							<MessageSquare className="h-8 w-8 text-blue-600 dark:text-blue-400" />
							<h3 className="ml-3 text-xl font-semibold text-gray-900 dark:text-white">
								Ask the Experts
							</h3>
						</div>
						<p className="mt-4 text-gray-600 dark:text-gray-300">
							Get your solar-related questions answered by certified
							professionals and experienced users.
						</p>
						<button className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600">
							Ask a Question
						</button>
					</div>

					<div className="bg-green-50 dark:bg-green-900/50 rounded-lg p-8">
						<div className="flex items-center">
							<BookOpen className="h-8 w-8 text-green-600 dark:text-green-400" />
							<h3 className="ml-3 text-xl font-semibold text-gray-900 dark:text-white">
								Knowledge Hub
							</h3>
						</div>
						<p className="mt-4 text-gray-600 dark:text-gray-300">
							Access our comprehensive library of guides, tutorials, and case
							studies about solar power.
						</p>
						<button className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 dark:bg-green-500 hover:bg-green-700 dark:hover:bg-green-600">
							Browse Resources
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CommunitySection;
