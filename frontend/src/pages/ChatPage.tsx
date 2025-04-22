import { useState } from "react";
import ChatInterface from "../componets/ChatInterface";
import { Bot, Sun, HelpCircle } from "lucide-react"; // Added HelpCircle
import { motion } from "framer-motion";

export type ExpertType = "subsidy" | "general";

const ChatPage = () => {
	const [expertType, setExpertType] = useState<ExpertType>("subsidy");
	const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);

	const subsidyQuestions = [
		"What is the subsidy amount for a 3kW system?",
		"How do I apply for solar subsidy in Gujarat?",
		"Are commercial properties eligible for subsidies?",
		"What documents are needed for subsidy application?",
	];

	const generalQuestions = [
		"How do solar panels work?",
		"What are the benefits of solar energy?",
		"How much space do I need for solar panels?",
		"What is net metering?",
	];

	const handleQuestionClick = (question: string) => {
		setSelectedQuestion(question);
	};

	const clearSelectedQuestion = () => {
		setSelectedQuestion(null);
	};

	return (
		// Adjusted background
		<div className="bg-gradient-to-b from-purple-100 to-white dark:from-gray-900 dark:to-gray-800 min-h-screen py-12">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className="text-center mb-8"
				>
					{/* Adjusted text colors */}
					<h1 className="text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
						Chat with a Solar{" "}
						<span className="text-purple-600 dark:text-purple-400">Expert</span>
					</h1>
					<p className="mt-4 text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
						Get instant answers to your solar energy questions.
					</p>
				</motion.div>

				{/* Expert Type Selector */}
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.2 }}
					className="flex justify-center space-x-4 mb-8"
				>
					<button
						onClick={() => setExpertType("subsidy")}
						// Adjusted button styles for selected/unselected states
						className={`flex items-center px-5 py-3 rounded-full text-sm font-medium transition-all duration-200 border-2 ${
							expertType === "subsidy"
								? "bg-blue-600 dark:bg-blue-500 text-white border-blue-600 dark:border-blue-500 shadow-md"
								: "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
						}`}
					>
						<Bot className="h-5 w-5 mr-2" />
						Subsidy Expert
					</button>
					<button
						onClick={() => setExpertType("general")}
						// Adjusted button styles for selected/unselected states
						className={`flex items-center px-5 py-3 rounded-full text-sm font-medium transition-all duration-200 border-2 ${
							expertType === "general"
								? "bg-amber-600 dark:bg-amber-500 text-white border-amber-600 dark:border-amber-500 shadow-md"
								: "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
						}`}
					>
						<Sun className="h-5 w-5 mr-2" />
						General Expert
					</button>
				</motion.div>

				{/* Chat Interface Component (already updated) */}
				<motion.div
					initial={{ opacity: 0, scale: 0.95 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ delay: 0.3, duration: 0.4 }}
				>
					<ChatInterface
						expertType={expertType}
						selectedQuestion={selectedQuestion}
						clearSelectedQuestion={clearSelectedQuestion}
					/>
				</motion.div>

				{/* Suggested Questions */}
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.5 }}
					className="mt-12 max-w-4xl mx-auto"
				>
					{/* Adjusted text color */}
					<h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center">
						<HelpCircle className="h-5 w-5 mr-2 text-purple-500 dark:text-purple-400" />
						Suggested Questions:
					</h3>
					<div className="flex flex-wrap gap-2">
						{(expertType === "subsidy"
							? subsidyQuestions
							: generalQuestions
						).map((q, index) => (
							<button
								key={index}
								onClick={() => handleQuestionClick(q)}
								// Adjusted suggestion button styles
								className="px-4 py-2 rounded-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 hover:border-gray-300 dark:hover:border-gray-500 transition-all duration-150"
							>
								{q}
							</button>
						))}
					</div>
				</motion.div>
			</div>
		</div>
	);
};

export default ChatPage;
