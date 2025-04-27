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
	AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { ExpertType } from "../pages/ChatPage";

interface Message {
	text: string;
	sender: "user" | "assistant";
	timestamp: Date;
}

interface ChatHistoryItem {
	prompt?: string | null;
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
	const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>([]);
	const [inputMessage, setInputMessage] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [isFullScreen, setIsFullScreen] = useState(false);
	const [showScrollButton, setShowScrollButton] = useState(false);
	const [apiError, setApiError] = useState<string | null>(null);
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	const chatContainerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		setMessages([getInitialMessage(expertType)]);
		setChatHistory([]);
		setApiError(null);
		setInputMessage("");
	}, [expertType]);

	useEffect(() => {
		if (selectedQuestion) {
			setInputMessage(selectedQuestion);
			const timer = setTimeout(() => {
				handleSendMessage(new Event("submit") as any);
				clearSelectedQuestion();
			}, 100);
			return () => clearTimeout(timer);
		}
	}, [selectedQuestion]);

	useEffect(() => {
		const handleEscKey = (event: KeyboardEvent) => {
			if (event.key === "Escape" && isFullScreen) {
				setIsFullScreen(false);
			}
		};

		if (isFullScreen) {
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

	useEffect(() => {
		if (isFullScreen) {
			messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
		}
	}, [messages, isFullScreen]);

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
		setApiError(null);

		if (!inputMessage.trim()) return;

		const userMessageText = inputMessage;
		const userMessage: Message = {
			text: userMessageText,
			sender: "user",
			timestamp: new Date(),
		};

		setMessages([...messages, userMessage]);
		setInputMessage("");
		setIsLoading(true);

		const backendUrl = import.meta.env.VITE_BACKEND_URL;
		const endpoint = `${backendUrl}/chat`;

		const requestBody = {
			prompt: userMessageText,
			response: chatHistory,
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

			const assistantMessage: Message = {
				text: result.answer,
				sender: "assistant",
				timestamp: new Date(),
			};
			setMessages((prevMessages) => [...prevMessages, assistantMessage]);
			setChatHistory(result.prev_responses);
		} catch (error: any) {
			console.error("API Error:", error);
			setApiError(
				error.message || "Failed to connect to the expert. Please try again."
			);
		} finally {
			setIsLoading(false);
			if (inputRef.current) {
				inputRef.current.focus();
			}
		}
	};

	const toggleFullScreen = () => {
		setIsFullScreen(!isFullScreen);
	};

	const isSubsidyExpert = expertType === "subsidy";
	const headerGradient = isSubsidyExpert
		? "from-blue-500 via-blue-600 to-indigo-600"
		: "from-amber-500 via-amber-600 to-yellow-600";
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
	);
	const inputPlaceholder = isSubsidyExpert
		? "Ask about solar subsidies in your state..."
		: "Ask about how solar panels work, benefits, etc...";
	const assistantIconBg = isSubsidyExpert ? "bg-blue-100" : "bg-amber-100";
	const assistantIconColor = isSubsidyExpert
		? "text-blue-600"
		: "text-amber-600";
	const loadingColor = isSubsidyExpert ? "bg-blue-400" : "bg-amber-400";
	const sendButtonGradient = isSubsidyExpert
		? "from-blue-500 via-blue-600 to-indigo-600"
		: "from-amber-500 via-amber-600 to-yellow-600";
	const userMessageGradient = isSubsidyExpert
		? "from-blue-500 to-indigo-600"
		: "from-amber-500 to-yellow-600";

	return (
		<div
			className={`flex flex-col ${
				isFullScreen
					? "fixed inset-0 z-50 h-screen max-h-screen pb-24 sm:pb-0"
					: "h-[550px] sm:h-[650px] max-w-4xl mx-auto"
			}
				rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden border border-gray-200 bg-white transition-all duration-300`}
			style={{ isolation: "isolate" }}
		>
			<div
				className={`bg-gradient-to-r ${headerGradient} p-4 sm:p-5 text-white flex justify-between items-center backdrop-blur-sm bg-opacity-95`}
			>
				<div className="flex items-center space-x-3">
					<div className="bg-white/20 rounded-full p-2.5 shadow-inner">
						{expertIcon}
					</div>
					<div>
						<h2 className="text-lg sm:text-xl font-bold tracking-tight">
							{expertTitle}
						</h2>
						<p className="text-xs sm:text-sm opacity-90 mt-0.5 font-medium">
							{expertDescription}
						</p>
					</div>
				</div>
				<button
					onClick={toggleFullScreen}
					className="p-2.5 rounded-full hover:bg-white/20 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/50"
					aria-label={isFullScreen ? "Exit full screen" : "Enter full screen"}
				>
					{isFullScreen ? (
						<Minimize2 className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
					) : (
						<Maximize2 className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
					)}
				</button>
			</div>

			<AnimatePresence>
				{apiError && (
					<motion.div
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: "auto" }}
						exit={{ opacity: 0, height: 0 }}
						transition={{ duration: 0.3 }}
						className="p-3.5 sm:p-4 bg-red-50 border-b border-red-200 text-red-800 text-sm flex items-center"
						role="alert"
					>
						<AlertCircle className="h-5 w-5 mr-2.5 flex-shrink-0 text-red-500" />
						<span className="font-medium">Error:&nbsp;</span>
						{apiError}
					</motion.div>
				)}
			</AnimatePresence>

			<div
				ref={chatContainerRef}
				className="flex-1 p-4 sm:p-6 overflow-y-auto bg-gray-50/70 relative scroll-smooth"
				style={{
					backgroundImage:
						'url(\'data:image/svg+xml,%3Csvg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="%23f0f0f0" fill-opacity="0.6" fill-rule="evenodd"%3E%3Ccircle cx="3" cy="3" r="3"/%3E%3Ccircle cx="13" cy="13" r="3"/%3E%3C/g%3E%3C/svg%3E\')',
					backgroundSize: "30px 30px",
					height: isFullScreen
						? `calc(100vh - 110px - 4rem ${apiError ? "- 40px" : ""})`
						: `calc(550px - 110px ${apiError ? "- 40px" : ""})`,
					overflowY: "auto",
					overscrollBehavior: "contain",
				}}
			>
				<AnimatePresence>
					{messages.map((message, index) => (
						<motion.div
							key={index}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.3 }}
							className={`mb-5 sm:mb-6 flex ${
								message.sender === "user" ? "justify-end" : "justify-start"
							}`}
						>
							<div
								className={`p-4 sm:p-5 rounded-2xl max-w-[85%] sm:max-w-xs md:max-w-md lg:max-w-lg ${
									message.sender === "user"
										? `bg-gradient-to-br ${userMessageGradient} text-white rounded-br-none shadow-xl`
										: "bg-white border border-gray-100 rounded-bl-none shadow-md"
								}`}
								style={{
									boxShadow:
										message.sender === "user"
											? "0 12px 20px -5px rgba(59, 130, 246, 0.15), 0 4px 6px -2px rgba(59, 130, 246, 0.05)"
											: "0 12px 20px -5px rgba(0, 0, 0, 0.07), 0 4px 6px -2px rgba(0, 0, 0, 0.03)",
								}}
							>
								<div className="flex items-center mb-2">
									{message.sender === "assistant" ? (
										<div
											className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full ${assistantIconBg} flex items-center justify-center mr-2 shadow-sm`}
										>
											{isSubsidyExpert ? (
												<Bot
													className={`h-4 w-4 sm:h-4.5 sm:w-4.5 ${assistantIconColor}`}
												/>
											) : (
												<Sun
													className={`h-4 w-4 sm:h-4.5 sm:w-4.5 ${assistantIconColor}`}
												/>
											)}
										</div>
									) : (
										<div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-100 flex items-center justify-center mr-2 shadow-sm">
											<User className="h-4 w-4 sm:h-4.5 sm:w-4.5 text-blue-700" />
										</div>
									)}
									<span
										className={`text-xs sm:text-sm ml-1 font-medium ${
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
						</motion.div>
					))}
				</AnimatePresence>

				{isLoading && (
					<motion.div
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						className="flex justify-start mb-4 sm:mb-5"
					>
						<div className="bg-white border border-gray-100 p-4.5 sm:p-5 rounded-xl sm:rounded-2xl rounded-bl-none shadow-md backdrop-blur-sm">
							<div className="flex space-x-2.5 sm:space-x-3.5">
								<div
									className={`w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full ${loadingColor} animate-bounce`}
									style={{ animationDelay: "0ms" }}
								></div>
								<div
									className={`w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full ${loadingColor} animate-bounce`}
									style={{ animationDelay: "300ms" }}
								></div>
								<div
									className={`w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full ${loadingColor} animate-bounce`}
									style={{ animationDelay: "600ms" }}
								></div>
							</div>
						</div>
					</motion.div>
				)}
				<div ref={messagesEndRef} />
				{!isFullScreen && showScrollButton && (
					<motion.button
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						onClick={() =>
							messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
						}
						className="absolute bottom-5 right-5 bg-white p-2.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-200"
						aria-label="Scroll to bottom"
					>
						<ChevronDown className="h-5 w-5 text-gray-600" />
					</motion.button>
				)}
			</div>

			<form
				onSubmit={handleSendMessage}
				className="border-t border-gray-100 p-3.5 sm:p-4.5 bg-white sticky bottom-0 backdrop-blur-sm"
			>
				<div className="flex items-center space-x-2.5 sm:space-x-3.5 bg-gray-50 rounded-full px-4 sm:px-5 py-2 border border-gray-200 hover:border-blue-300 focus-within:border-blue-400 focus-within:ring-3 focus-within:ring-blue-100 transition-all shadow-sm">
					<button
						type="button"
						className="text-gray-400 hover:text-blue-500 transition-colors p-1.5 sm:p-2 hover:bg-gray-100 rounded-full focus:outline-none"
					>
						<Smile className="h-5 w-5 sm:h-5.5 sm:w-5.5" />
					</button>
					<input
						ref={inputRef}
						type="text"
						value={inputMessage}
						onChange={(e) => setInputMessage(e.target.value)}
						placeholder={inputPlaceholder}
						className="flex-1 py-2 sm:py-2.5 bg-transparent border-none focus:outline-none text-sm sm:text-base text-gray-800 placeholder:text-gray-400"
					/>
					<button
						type="button"
						className="text-gray-400 hover:text-blue-500 transition-colors p-1.5 sm:p-2 hover:bg-gray-100 rounded-full focus:outline-none"
					>
						<Paperclip className="h-5 w-5 sm:h-5.5 sm:w-5.5" />
					</button>
					<button
						type="submit"
						disabled={!inputMessage.trim() || isLoading}
						className={`bg-gradient-to-r ${sendButtonGradient} text-white rounded-full w-10.5 h-10.5 sm:w-12.5 sm:h-12.5 flex items-center justify-center disabled:opacity-50 transition-all hover:shadow-lg flex-shrink-0 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300`}
					>
						<Send className="h-5 w-5 sm:h-6 sm:w-6" />
					</button>
				</div>
			</form>
		</div>
	);
};

export default ChatInterface;
