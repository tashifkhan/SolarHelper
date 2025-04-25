import React, { useState, useRef, useEffect } from "react";
import {
	Send,
	User,
	Bot,
	Paperclip,
	Smile,
	Maximize2,
	Minimize2,
	Sun,
	ChevronDown,
	AlertCircle, // Import AlertCircle for error display
} from "lucide-react";
import { motion } from "framer-motion"; // Import motion for error animation
import ReactMarkdown from "react-markdown"; // Import ReactMarkdown
import { ExpertType } from "../pages/ChatPage";

interface Message {
	text: string;
	sender: "user" | "assistant";
	timestamp: Date;
}

// Define the structure for chat history items expected by the backend
interface ChatHistoryItem {
	prompt?: string | null; // Allow null for initial system message if needed, though we handle it client-side
	answer?: string | null;
}

interface ChatInterfaceProps {
	expertType: ExpertType;
	selectedQuestion: string | null;
	clearSelectedQuestion: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
	expertType,
	selectedQuestion,
	clearSelectedQuestion,
}) => {
	const getInitialMessage = (type: ExpertType): Message => ({
		text:
			type === "subsidy"
				? "Hello! I'm your Solar Subsidies Expert. How can I help you today with information about solar subsidies in India?"
				: "Hello! I'm your General Solar Expert. How can I assist you today with information about solar energy?",
		sender: "assistant",
		timestamp: new Date(),
	});

	const [messages, setMessages] = useState<Message[]>([
		getInitialMessage(expertType),
	]);
	const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>([]); // State for backend history
	const [inputMessage, setInputMessage] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [isFullScreen, setIsFullScreen] = useState(false);
	const [showScrollButton, setShowScrollButton] = useState(false);
	const [apiError, setApiError] = useState<string | null>(null); // State for API errors
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	const chatContainerRef = useRef<HTMLDivElement>(null);

	// Update initial message and reset history/error when expertType changes
	useEffect(() => {
		setMessages([getInitialMessage(expertType)]);
		setChatHistory([]); // Reset history for the new expert
		setApiError(null); // Clear any previous errors
		setInputMessage(""); // Clear input field
	}, [expertType]);

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

	// Auto-scroll when in fullscreen
	useEffect(() => {
		if (isFullScreen) {
			messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
		}
	}, [messages, isFullScreen]);

	// Track scroll position to toggle button
	useEffect(() => {
		const el = chatContainerRef.current;
		if (!el) return;
		const onScroll = () => {
			const atBottom = el.scrollHeight - el.scrollTop <= el.clientHeight + 20;
			setShowScrollButton(!atBottom);
		};
		el.addEventListener("scroll", onScroll);
		return () => el.removeEventListener("scroll", onScroll);
	}, []);

	const handleSendMessage = async (e: React.FormEvent) => {
		e.preventDefault();
		setApiError(null); // Clear previous errors on new message send

		if (!inputMessage.trim()) return;

		const userMessageText = inputMessage;
		// Add user message to UI
		const userMessage: Message = {
			text: userMessageText,
			sender: "user",
			timestamp: new Date(),
		};

		setMessages([...messages, userMessage]);
		setInputMessage("");
		setIsLoading(true);

		// Prepare request for backend
		const endpoint =
			expertType === "subsidy"
				? "http://localhost:8000/subsidy-enquiry"
				: "http://localhost:8000/general-solar-enquiry";

		const requestBody = {
			prompt: userMessageText,
			response: chatHistory, // Send the current history
		};

		try {
			const response = await fetch(endpoint, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(requestBody),
			});

			const result = await response.json();

			if (!response.ok) {
				throw new Error(result.detail || `API Error: ${response.status}`);
			}

			// Add assistant message to UI
			const assistantMessage: Message = {
				text: result.answer,
				sender: "assistant",
				timestamp: new Date(),
			};
			setMessages((prevMessages) => [...prevMessages, assistantMessage]);

			// Update chat history state with the history returned from backend
			setChatHistory(result.prev_responses);
		} catch (error: any) {
			console.error("API Error:", error);
			setApiError(
				error.message || "Failed to connect to the expert. Please try again."
			);
		} finally {
			setIsLoading(false);
			// Focus the input after processing
			if (inputRef.current) {
				inputRef.current.focus();
			}
		}
	};

	const toggleFullScreen = () => {
		setIsFullScreen(!isFullScreen);
	};

	// Determine styles based on expertType
	const isSubsidyExpert = expertType === "subsidy";
	const headerGradient = isSubsidyExpert
		? "from-blue-600 to-indigo-600"
		: "from-amber-600 to-yellow-600"; // Amber/Yellow gradient
	const expertTitle = isSubsidyExpert
		? "Solar Subsidy Expert"
		: "General Solar Expert";
	const expertDescription = isSubsidyExpert
		? "Ask me anything about solar subsidies in India"
		: "Ask me anything about solar energy";
	const expertIcon = isSubsidyExpert ? (
		<Bot className="h-6 w-6 mr-2" />
	) : (
		<Sun className="h-6 w-6 mr-2" />
	); // Sun icon for general
	const inputPlaceholder = isSubsidyExpert
		? "Ask about solar subsidies in your state..."
		: "Ask about how solar panels work, benefits, etc...";
	const assistantIconBg = isSubsidyExpert ? "bg-blue-100" : "bg-amber-100"; // Amber background
	const assistantIconColor = isSubsidyExpert
		? "text-blue-600"
		: "text-amber-600"; // Amber icon color
	const loadingColor = isSubsidyExpert ? "bg-blue-400" : "bg-amber-400"; // Amber loading dots
	const sendButtonGradient = isSubsidyExpert
		? "from-blue-600 to-indigo-600"
		: "from-amber-600 to-yellow-600"; // Amber/Yellow send button

	return (
		<div
			className={`flex flex-col ${
				isFullScreen
					? "fixed inset-0 z-50 h-screen max-h-screen pb-24 sm:pb-0"
					: "h-[500px] sm:h-[600px] max-w-4xl mx-auto"
			}
				rounded-lg sm:rounded-xl shadow-lg overflow-hidden border border-gray-100 bg-white transition-all duration-300`}
			style={{ isolation: "isolate" }}
		>
			<div
				className={`bg-gradient-to-r ${headerGradient} p-3 sm:p-4 text-white flex justify-between items-center`}
			>
				<div>
					<h2 className="text-lg sm:text-xl font-semibold flex items-center">
						{expertIcon} {expertTitle}
					</h2>
					<p className="text-xs sm:text-sm opacity-90">{expertDescription}</p>
				</div>
				<button
					onClick={toggleFullScreen}
					className="p-1.5 sm:p-2 rounded-full hover:bg-white/10 transition-colors"
					aria-label={isFullScreen ? "Exit full screen" : "Enter full screen"}
				>
					{isFullScreen ? (
						<Minimize2 className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
					) : (
						<Maximize2 className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
					)}
				</button>
			</div>

			{/* Add Error Display Area */}
			{apiError && (
				<motion.div
					initial={{ opacity: 0, y: -10 }}
					animate={{ opacity: 1, y: 0 }}
					className="p-2 sm:p-3 bg-red-100 border-b border-red-200 text-red-800 text-xs sm:text-sm flex items-center"
					role="alert"
				>
					<AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
					<span className="font-medium">Error:</span>&nbsp;{apiError}
				</motion.div>
			)}

			<div
				ref={chatContainerRef}
				className="flex-1 p-3 sm:p-4 overflow-y-auto bg-gray-50 relative scroll-smooth"
				style={{
					backgroundImage:
						'url(\'data:image/svg+xml,%3Csvg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="%23f0f0f0" fill-opacity="0.6" fill-rule="evenodd"%3E%3Ccircle cx="3" cy="3" r="3"/%3E%3Ccircle cx="13" cy="13" r="3"/%3E%3C/g%3E%3C/svg%3E\')',
					height: isFullScreen
						? `calc(100vh - 110px - 4rem ${apiError ? "- 40px" : ""})`
						: `calc(500px - 110px ${apiError ? "- 40px" : ""})`,
					overflowY: "auto",
					overscrollBehavior: "contain",
				}}
			>
				{messages.map((message, index) => (
					<div
						key={index}
						className={`mb-3 sm:mb-4 flex ${
							message.sender === "user" ? "justify-end" : "justify-start"
						}`}
					>
						<div
							className={`p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl max-w-[85%] sm:max-w-xs md:max-w-md lg:max-w-lg ${
								message.sender === "user"
									? "bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-br-none shadow-md"
									: "bg-white border border-gray-100 rounded-bl-none shadow-md"
							}`}
						>
							<div className="flex items-center mb-1">
								{message.sender === "assistant" ? (
									<div
										className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full ${assistantIconBg} flex items-center justify-center mr-1 sm:mr-0`}
									>
										{isSubsidyExpert ? (
											<Bot
												className={`h-3 w-3 sm:h-3.5 sm:w-3.5 ${assistantIconColor}`}
											/>
										) : (
											<Sun
												className={`h-3 w-3 sm:h-3.5 sm:w-3.5 ${assistantIconColor}`}
											/>
										)}
									</div>
								) : (
									<div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-blue-200 flex items-center justify-center mr-1 sm:mr-0">
										<User className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-blue-700" />
									</div>
								)}
								<span
									className={`text-[11px] sm:text-xs ml-1 sm:ml-1.5 ${
										message.sender === "user"
											? "text-blue-100"
											: "text-gray-500"
									}`}
								>
									{message.sender === "user" ? "You" : expertTitle} •{" "}
									{message.timestamp.toLocaleTimeString([], {
										hour: "2-digit",
										minute: "2-digit",
									})}
								</span>
							</div>
							<div
								className={`prose prose-sm sm:prose-base max-w-none ${
									message.sender === "user" ? "prose-invert" : "text-gray-800"
								}`}
							>
								<ReactMarkdown>{message.text}</ReactMarkdown>
							</div>
						</div>
					</div>
				))}
				{isLoading && (
					<div className="flex justify-start mb-3 sm:mb-4">
						<div className="bg-white border border-gray-100 p-3 sm:p-4 rounded-xl sm:rounded-2xl rounded-bl-none shadow-md">
							<div className="flex space-x-1.5 sm:space-x-2">
								<div
									className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full ${loadingColor} animate-bounce`}
									style={{ animationDelay: "0ms" }}
								></div>
								<div
									className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full ${loadingColor} animate-bounce`}
									style={{ animationDelay: "300ms" }}
								></div>
								<div
									className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full ${loadingColor} animate-bounce`}
									style={{ animationDelay: "600ms" }}
								></div>
							</div>
						</div>
					</div>
				)}
				<div ref={messagesEndRef} />
				{!isFullScreen && showScrollButton && (
					<button
						onClick={() =>
							messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
						}
						className="absolute bottom-4 right-4 bg-white p-2 rounded-full shadow-md"
						aria-label="Scroll to bottom"
					>
						<ChevronDown className="h-5 w-5 text-gray-600" />
					</button>
				)}
			</div>

			<form
				onSubmit={handleSendMessage}
				className="border-t border-gray-100 p-2 sm:p-3 bg-white sticky bottom-0"
			>
				<div className="flex items-center space-x-1.5 sm:space-x-2 bg-gray-50 rounded-full px-2 sm:px-3 py-1 border border-gray-200 hover:border-blue-300 focus-within:border-blue-400 transition-colors">
					<button
						type="button"
						className="text-gray-400 hover:text-blue-500 transition-colors p-1.5 sm:p-2"
					>
						<Smile className="h-4 w-4 sm:h-5 sm:w-5" />
					</button>
					<input
						ref={inputRef}
						type="text"
						value={inputMessage}
						onChange={(e) => setInputMessage(e.target.value)}
						placeholder={inputPlaceholder}
						className="flex-1 py-2 sm:py-2.5 bg-transparent border-none focus:outline-none text-sm sm:text-base text-gray-800 placeholder:text-sm"
					/>
					<button
						type="button"
						className="text-gray-400 hover:text-blue-500 transition-colors p-1.5 sm:p-2"
					>
						<Paperclip className="h-4 w-4 sm:h-5 sm:w-5" />
					</button>
					<button
						type="submit"
						disabled={!inputMessage.trim() || isLoading}
						className={`bg-gradient-to-r ${sendButtonGradient} text-white rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center disabled:opacity-50 transition-all hover:shadow-md flex-shrink-0`}
					>
						<Send className="h-4 w-4 sm:h-5 sm:w-5" />
					</button>
				</div>
			</form>
		</div>
	);
};

export default ChatInterface;
