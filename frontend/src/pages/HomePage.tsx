import HeroSection from "../componets/Header";
import SavingsCalculator from "../componets/SavingsCalculator";
import CommunitySection from "../componets/CommunitySection";
import RecommendationEngine from "../componets/RecommendationEngine"; // Import Recommendation Engine
import { Link } from "react-router-dom"; // For teasers
import { ArrowRight } from "lucide-react"; // Example icons

const HomePage = () => {
	return (
		// App.tsx handles the main background gradient
		// Add padding-top to account for fixed navbar
		<div className="pt-16 space-y-16 md:space-y-24 lg:space-y-32 pb-16 md:pb-24">
			{/* HeroSection already updated */}
			<HeroSection />

			{/* Features Section (Example Implementation with Dark Mode) */}

			{/* Recommendation Engine */}
			<RecommendationEngine />

			{/* SavingsCalculator already updated */}
			<SavingsCalculator />

			{/* Comparison Teaser (Example Implementation with Dark Mode) */}
			<ComparisonTeaser />

			{/* CommunitySection already updated */}
			<CommunitySection />
		</div>
	);
};

// Example ComparisonTeaser with Dark Mode
const ComparisonTeaser = () => {
	return (
		// Adjusted background gradient
		<div className="bg-gradient-to-r from-cyan-50 to-blue-100 dark:from-gray-800 dark:to-blue-900 py-16 sm:py-24">
			<div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
				{/* Adjusted text colors */}
				<h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
					Compare Solar Products Side-by-Side
				</h2>
				<p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto mb-8">
					Evaluate different solar panels and inverters based on efficiency,
					warranty, price, and features to make an informed decision.
				</p>
				<Link
					to="/compare"
					// Adjusted button styles
					className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-full shadow-md text-white bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
				>
					Compare Products Now
					<ArrowRight className="ml-2 h-5 w-5" />
				</Link>
			</div>
		</div>
	);
};

export default HomePage;
