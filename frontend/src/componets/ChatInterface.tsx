import React, { useState, useRef, useEffect } from "react";
import {
	Send,
	User,
	Bot,
	Paperclip,
	Smile,
	Maximize2,
	Minimize2,
} from "lucide-react";

interface Message {
	text: string;
	sender: "user" | "assistant";
	timestamp: Date;
}

interface ChatInterfaceProps {
	selectedQuestion: string | null;
	clearSelectedQuestion: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
	selectedQuestion,
	clearSelectedQuestion,
}) => {
	const [messages, setMessages] = useState<Message[]>([
		{
			text: "Hello! I'm your Solar Subsidies Expert. How can I help you today with information about solar subsidies in India?",
			sender: "assistant",
			timestamp: new Date(),
		},
	]);
	const [inputMessage, setInputMessage] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [isFullScreen, setIsFullScreen] = useState(false);
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	const chatContainerRef = useRef<HTMLDivElement>(null);

	// Sample responses about solar subsidies in India
	const subsidyResponses = {
		general:
			"In India, residential solar installations can get subsidies under the PM-KUSUM scheme and Rooftop Solar Programme Phase-II. The subsidy amount varies from 20% to 40% of the installation cost depending on system capacity and your state.",
		state:
			"Different states offer different subsidy amounts. For example, Gujarat offers 40% subsidy for systems up to 3kW, while Maharashtra offers up to 30% for residential installations.",
		application:
			"To apply for solar subsidies, you need to submit an application to your state nodal agency or electricity distribution company (DISCOM). Required documents include proof of ownership, electricity bill, and ID proof.",
		eligibility:
			"Generally, any residential consumer with a valid electricity connection is eligible for solar subsidies. The system size should typically match your sanctioned load.",
		commercial:
			"For commercial installations, the subsidy structure differs from residential. MSME units can get subsidies up to 15-20% in most states.",
		amount:
			"For residential installations, subsidies range from ₹14,588 per kW for systems up to 3 kW, and ₹7,294 per kW for systems between 3-10 kW.",
		timeline:
			"Once approved, subsidy amounts are typically disbursed within 30-90 days after successful installation and inspection of the solar system.",
		schemes:
			"Current active schemes include PM-KUSUM (for farmers), Grid-connected Rooftop Solar Programme Phase-II, and various state-specific schemes.",
		process:
			"The process involves: 1) Application to DISCOM, 2) Technical feasibility approval, 3) Installation, 4) Inspection, 5) Subsidy disbursement to your bank account.",
	};

	// Process selected question from parent component
	useEffect(() => {
		if (selectedQuestion) {
			setInputMessage(selectedQuestion);
			// Auto-send the question after a brief delay
			const timer = setTimeout(() => {
				handleSendMessage(new Event("submit") as any);
				clearSelectedQuestion();
			}, 100);
			return () => clearTimeout(timer);
		}
	}, [selectedQuestion]);

	// Handle full screen mode
	useEffect(() => {
		const handleEscKey = (event: KeyboardEvent) => {
			if (event.key === "Escape" && isFullScreen) {
				setIsFullScreen(false);
			}
		};

		if (isFullScreen) {
			// Only prevent scrolling on the body
			document.body.style.overflow = "hidden";
			window.addEventListener("keydown", handleEscKey);
		} else {
			document.body.style.overflow = "";
		}

		return () => {
			document.body.style.overflow = "";
			window.removeEventListener("keydown", handleEscKey);
		};
	}, [isFullScreen]);

	// Simulate AI response
	const generateResponse = (query: string): string => {
		// Convert query to lowercase for matching
		const queryLower = query.toLowerCase();

		// Check for keywords in the query
		if (
			queryLower.includes("state") ||
			queryLower.includes("gujarat") ||
			queryLower.includes("maharashtra")
		) {
			return subsidyResponses.state;
		} else if (
			queryLower.includes("apply") ||
			queryLower.includes("application") ||
			queryLower.includes("how to get") ||
			queryLower.includes("document")
		) {
			return subsidyResponses.application;
		} else if (
			queryLower.includes("eligible") ||
			queryLower.includes("eligibility") ||
			queryLower.includes("qualify")
		) {
			return subsidyResponses.eligibility;
		} else if (
			queryLower.includes("commercial") ||
			queryLower.includes("business") ||
			queryLower.includes("company")
		) {
			return subsidyResponses.commercial;
		} else if (
			queryLower.includes("amount") ||
			queryLower.includes("how much") ||
			queryLower.includes("money") ||
			queryLower.includes("subsidy can i get")
		) {
			return subsidyResponses.amount;
		} else if (
			queryLower.includes("time") ||
			queryLower.includes("when") ||
			queryLower.includes("timeline") ||
			queryLower.includes("how long")
		) {
			return subsidyResponses.timeline;
		} else if (
			queryLower.includes("scheme") ||
			queryLower.includes("program") ||
			queryLower.includes("initiative") ||
			queryLower.includes("pm-kusum")
		) {
			return subsidyResponses.schemes;
		} else if (
			queryLower.includes("process") ||
			queryLower.includes("step") ||
			queryLower.includes("procedure")
		) {
			return subsidyResponses.process;
		} else {
			return subsidyResponses.general;
		}
	};

	const handleSendMessage = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!inputMessage.trim()) return;

		// Add user message
		const userMessage: Message = {
			text: inputMessage,
			sender: "user",
			timestamp: new Date(),
		};

		setMessages([...messages, userMessage]);
		setInputMessage("");
		setIsLoading(true);

		// Simulate delay for "typing"
		setTimeout(() => {
			const responseText = generateResponse(userMessage.text);

			const assistantMessage: Message = {
				text: responseText,
				sender: "assistant",
				timestamp: new Date(),
			};

			setMessages((prevMessages) => [...prevMessages, assistantMessage]);
			setIsLoading(false);

			// Focus the input after receiving response
			if (inputRef.current) {
				inputRef.current.focus();
			}
		}, 1000);
	};

	const toggleFullScreen = () => {
		setIsFullScreen(!isFullScreen);
	};

	return (
		<div
			className={`flex flex-col ${
				isFullScreen
					? "fixed inset-0 z-50 h-screen max-h-screen pb-16 sm:pb-0"
					: "h-[600px] max-w-4xl mx-auto"
			} 
				rounded-xl shadow-lg overflow-hidden border border-gray-100 bg-white transition-all duration-300`}
			style={{ isolation: "isolate" }} // Ensures stacking context for z-index
		>
			<div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white flex justify-between items-center">
				<div>
					<h2 className="text-xl font-semibold flex items-center">
						<Bot className="h-6 w-6 mr-2" /> Solar Subsidy Expert
					</h2>
					<p className="text-sm opacity-90">
						Ask me anything about solar subsidies in India
					</p>
				</div>
				<button
					onClick={toggleFullScreen}
					className="p-2 rounded-full hover:bg-white/10 transition-colors"
					aria-label={isFullScreen ? "Exit full screen" : "Enter full screen"}
				>
					{isFullScreen ? (
						<Minimize2 className="h-5 w-5 text-white" />
					) : (
						<Maximize2 className="h-5 w-5 text-white" />
					)}
				</button>
			</div>

			<div
				ref={chatContainerRef}
				className="flex-1 p-4 overflow-y-auto bg-gray-50 relative scroll-smooth"
				style={{
					backgroundImage:
						'url(\'data:image/svg+xml,%3Csvg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="%23f0f0f0" fill-opacity="0.6" fill-rule="evenodd"%3E%3Ccircle cx="3" cy="3" r="3"/%3E%3Ccircle cx="13" cy="13" r="3"/%3E%3C/g%3E%3C/svg%3E\')',
					height: isFullScreen
						? "calc(100vh - 130px - 4rem)"
						: "calc(600px - 130px)",
					overflowY: "auto",
					overscrollBehavior: "contain", // Prevents scroll chaining
				}}
			>
				{messages.map((message, index) => (
					<div
						key={index}
						className={`mb-4 flex ${
							message.sender === "user" ? "justify-end" : "justify-start"
						}`}
					>
						<div
							className={`p-3.5 rounded-2xl max-w-xs md:max-w-md lg:max-w-lg ${
								message.sender === "user"
									? "bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-br-none shadow-md"
									: "bg-white border border-gray-100 rounded-bl-none shadow-md"
							}`}
						>
							<div className="flex items-center mb-1">
								{message.sender === "assistant" ? (
									<div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
										<Bot className="h-3.5 w-3.5 text-blue-600" />
									</div>
								) : (
									<div className="w-6 h-6 rounded-full bg-blue-200 flex items-center justify-center">
										<User className="h-3.5 w-3.5 text-blue-700" />
									</div>
								)}
								<span
									className={`text-xs ml-1.5 ${
										message.sender === "user"
											? "text-blue-100"
											: "text-gray-500"
									}`}
								>
									{message.sender === "user" ? "You" : "Solar Expert"} •{" "}
									{message.timestamp.toLocaleTimeString([], {
										hour: "2-digit",
										minute: "2-digit",
									})}
								</span>
							</div>
							<p
								className={`text-sm whitespace-pre-wrap ${
									message.sender === "user" ? "text-white" : "text-gray-800"
								}`}
							>
								{message.text}
							</p>
						</div>
					</div>
				))}
				{isLoading && (
					<div className="flex justify-start mb-4">
						<div className="bg-white border border-gray-100 p-4 rounded-2xl rounded-bl-none shadow-md">
							<div className="flex space-x-2">
								<div
									className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-bounce"
									style={{ animationDelay: "0ms" }}
								></div>
								<div
									className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-bounce"
									style={{ animationDelay: "300ms" }}
								></div>
								<div
									className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-bounce"
									style={{ animationDelay: "600ms" }}
								></div>
							</div>
						</div>
					</div>
				)}
				{messages.length > 4}
				<div ref={messagesEndRef} />
			</div>

			<form
				onSubmit={handleSendMessage}
				className="border-t border-gray-100 p-3 bg-white sticky bottom-0"
			>
				<div className="flex items-center space-x-2 bg-gray-50 rounded-full px-3 py-1 border border-gray-200 hover:border-blue-300 focus-within:border-blue-400 transition-colors">
					<button
						type="button"
						className="text-gray-400 hover:text-blue-500 transition-colors p-2"
					>
						<Smile className="h-5 w-5" />
					</button>
					<input
						ref={inputRef}
						type="text"
						value={inputMessage}
						onChange={(e) => setInputMessage(e.target.value)}
						placeholder="Ask about solar subsidies in your state..."
						className="flex-1 py-2.5 bg-transparent border-none focus:outline-none text-gray-800"
					/>
					<button
						type="button"
						className="text-gray-400 hover:text-blue-500 transition-colors p-2"
					>
						<Paperclip className="h-5 w-5" />
					</button>
					<button
						type="submit"
						disabled={!inputMessage.trim() || isLoading}
						className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full w-10 h-10 flex items-center justify-center disabled:opacity-50 transition-all hover:shadow-md"
					>
						<Send className="h-5 w-5" />
					</button>
				</div>
			</form>
		</div>
	);
};

export default ChatInterface;
