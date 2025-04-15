import { useState } from "react";
import ChatInterface from "../componets/ChatInterface";

const ChatPage = () => {
	const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);

	const commonQuestions = [
		"How much subsidy can I get for my home?",
		"What documents do I need to apply?",
		"Do commercial installations qualify?",
		"How long does the subsidy process take?",
		"Are there state-specific subsidies?",
		"What is the PM-KUSUM scheme?",
	];

	const handleQuestionClick = (question: string) => {
		setSelectedQuestion(question);
		// Instead of scrolling the whole page, we'll let the chat interface handle this
		// No need to call scrollIntoView here
	};

	return (
		<div className="bg-gradient-to-b from-blue-50 to-white min-h-screen py-12">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="text-center mb-8">
					<h1 className="text-3xl font-bold text-gray-900">
						Chat with Solar Subsidy Expert
					</h1>
					<p className="mt-4 text-lg text-gray-600">
						Get instant answers to all your questions about solar subsidies and
						government incentives
					</p>
				</div>

				<div className="chat-interface-container">
					<ChatInterface
						selectedQuestion={selectedQuestion}
						clearSelectedQuestion={() => setSelectedQuestion(null)}
					/>
				</div>

				<div className="mt-12 max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
					<h2 className="text-xl font-semibold text-gray-900">
						Common Questions
					</h2>
					<div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
						{commonQuestions.map((question, index) => (
							<div
								key={index}
								className="p-3 bg-blue-50 rounded-lg transition-all hover:bg-blue-100 cursor-pointer border border-transparent hover:border-blue-200 hover:shadow-sm"
								onClick={() => handleQuestionClick(question)}
							>
								<p className="font-medium text-blue-800 flex items-center">
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
