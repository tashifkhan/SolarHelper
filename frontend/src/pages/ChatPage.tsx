import { useState } from "react";
import ChatInterface from "../componets/ChatInterface";
import { motion } from "framer-motion"; // You'll need to install framer-motion

export type ExpertType = "subsidy" | "general";

const ChatPage = () => {
	const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);
	const [selectedExpert, setSelectedExpert] = useState<ExpertType>("subsidy");

	const subsidyQuestions = [
		"How much subsidy can I get for my home?",
		"What documents do I need to apply?",
		"Do commercial installations qualify?",
		"How long does the subsidy process take?",
		"Are there state-specific subsidies?",
		"What is the PM-KUSUM scheme?",
	];

	const generalSolarQuestions = [
		"How do solar panels work?",
		"What are the benefits of solar energy?",
		"How much space do I need for solar panels?",
		"What is net metering?",
		"How long do solar panels last?",
		"What maintenance do solar panels require?",
	];

	const commonQuestions =
		selectedExpert === "subsidy" ? subsidyQuestions : generalSolarQuestions;

	const handleQuestionClick = (question: string) => {
		setSelectedQuestion(question);
		// Let the chat interface handle scrolling or focusing
	};

	const getExpertTitle = () => {
		return selectedExpert === "subsidy"
			? "Chat with Solar Subsidy Expert"
			: "Chat with General Solar Expert";
	};

	const getExpertDescription = () => {
		return selectedExpert === "subsidy"
			? "Get instant answers to all your questions about solar subsidies and government incentives."
			: "Ask anything about solar panels, installation, benefits, and technology.";
	};

	return (
		<div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-white min-h-screen pt-16 pb-8 sm:py-12">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className="text-center mb-8 sm:mb-10"
				>
					<h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-700">
						{getExpertTitle()}
					</h1>
					<p className="mt-3 sm:mt-4 text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
						{getExpertDescription()}
					</p>
				</motion.div>

				{/* Expert Selection Tabs/Buttons */}
				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.2 }}
					className="flex flex-col sm:flex-row justify-center mb-8 space-y-3 sm:space-y-0 sm:space-x-5"
				>
					<motion.button
						whileHover={{ scale: 1.03 }}
						whileTap={{ scale: 0.98 }}
						onClick={() => setSelectedExpert("subsidy")}
						className={`w-full sm:w-auto px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
							selectedExpert === "subsidy"
								? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-200"
								: "bg-white text-blue-700 hover:bg-blue-50 border border-blue-200 hover:shadow-md"
						}`}
					>
						<div className="flex items-center justify-center">
							<span className="material-icons-outlined mr-2 text-xl">
								{selectedExpert === "subsidy" ? "check_circle" : "payments"}
							</span>
							Subsidy Expert
						</div>
					</motion.button>
					<motion.button
						whileHover={{ scale: 1.03 }}
						whileTap={{ scale: 0.98 }}
						onClick={() => setSelectedExpert("general")}
						className={`w-full sm:w-auto px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
							selectedExpert === "general"
								? "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-200"
								: "bg-white text-amber-600 hover:bg-amber-50 border border-amber-200 hover:shadow-md"
						}`}
					>
						<div className="flex items-center justify-center">
							<span className="material-icons-outlined mr-2 text-xl">
								{selectedExpert === "general" ? "check_circle" : "wb_sunny"}
							</span>
							General Solar Expert
						</div>
					</motion.button>
				</motion.div>

				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.6, delay: 0.3 }}
					className="chat-interface-container bg-transparent rounded-2xl p-4 border border-none"
				>
					<ChatInterface
						expertType={selectedExpert}
						selectedQuestion={selectedQuestion}
						clearSelectedQuestion={() => setSelectedQuestion(null)}
					/>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.4 }}
					className="mt-10 sm:mt-12 max-w-3xl mx-auto"
				>
					<h2 className="text-xl sm:text-2xl font-semibold text-gray-900 flex items-center mb-6 px-1">
						<span
							className={`material-icons-outlined mr-3 text-2xl ${
								selectedExpert === "subsidy"
									? "text-blue-600"
									: "text-amber-500"
							}`}
						>
							lightbulb
						</span>
						Popular Questions
					</h2>
					<div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
						{commonQuestions.map((question, index) => (
							<motion.div
								key={`${selectedExpert}-${index}`}
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.97 }}
								className={`p-4 sm:p-5 rounded-xl transition-all cursor-pointer backdrop-blur-sm shadow-sm hover:shadow-md ${
									selectedExpert === "subsidy"
										? "bg-blue-50/70 hover:bg-blue-100/80 border border-blue-200"
										: "bg-amber-50/70 hover:bg-amber-100/80 border border-amber-200"
								}`}
								onClick={() => handleQuestionClick(question)}
							>
								<p
									className={`text-base sm:text-lg font-medium flex items-start ${
										selectedExpert === "subsidy"
											? "text-blue-800"
											: "text-amber-800"
									}`}
								>
									<span
										className={`material-icons-outlined mr-3 mt-0.5 ${
											selectedExpert === "subsidy"
												? "text-blue-600"
												: "text-amber-600"
										}`}
									>
										help_outline
									</span>
									{question}
								</p>
							</motion.div>
						))}
					</div>
				</motion.div>
			</div>
		</div>
	);
};

export default ChatPage;
