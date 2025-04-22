import { useState } from "react";
import ChatInterface from "../componets/ChatInterface";

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
		<div className="bg-gradient-to-b from-blue-50 to-white min-h-screen py-8 sm:py-12">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="text-center mb-6 sm:mb-8">
					<h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
						{getExpertTitle()}
					</h1>
					<p className="mt-3 sm:mt-4 text-base sm:text-lg text-gray-600">
						{getExpertDescription()}
					</p>
				</div>

				{/* Expert Selection Tabs/Buttons */}
				<div className="flex flex-col sm:flex-row justify-center mb-6 space-y-2 sm:space-y-0 sm:space-x-4">
					<button
						onClick={() => setSelectedExpert("subsidy")}
						className={`w-full sm:w-auto px-6 py-2 rounded-md font-medium transition-colors ${
							selectedExpert === "subsidy"
								? "bg-blue-600 text-white shadow-md"
								: "bg-white text-blue-600 hover:bg-blue-50 border border-blue-200"
						}`}
					>
						Subsidy Expert
					</button>
					<button
						onClick={() => setSelectedExpert("general")}
						className={`w-full sm:w-auto px-6 py-2 rounded-md font-medium transition-colors ${
							selectedExpert === "general"
								? "bg-amber-600 text-white shadow-md"
								: "bg-white text-amber-600 hover:bg-amber-50 border border-amber-200"
						}`}
					>
						General Solar Expert
					</button>
				</div>

				<div className="chat-interface-container">
					<ChatInterface
						expertType={selectedExpert} // Pass the selected expert type
						selectedQuestion={selectedQuestion}
						clearSelectedQuestion={() => setSelectedQuestion(null)}
					/>
				</div>

				<div className="mt-10 sm:mt-12 max-w-3xl mx-auto bg-white p-4 sm:p-6 rounded-lg shadow-md">
					<h2 className="text-lg sm:text-xl font-semibold text-gray-900">
						Common Questions for{" "}
						{selectedExpert === "subsidy" ? "Subsidy" : "General"} Expert
					</h2>
					<div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
						{commonQuestions.map((question, index) => (
							<div
								key={`${selectedExpert}-${index}`}
								className={`p-2.5 sm:p-3 rounded-lg transition-all cursor-pointer border border-transparent hover:shadow-sm ${
									selectedExpert === "subsidy"
										? "bg-blue-50 hover:bg-blue-100 hover:border-blue-200"
										: "bg-amber-50 hover:bg-amber-100 hover:border-amber-200"
								}`}
								onClick={() => handleQuestionClick(question)}
							>
								<p
									className={`text-sm sm:text-base font-medium flex items-center ${
										selectedExpert === "subsidy"
											? "text-blue-800"
											: "text-amber-800"
									}`}
								>
									<span className="mr-2">→</span>
									{question}
								</p>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default ChatPage;
