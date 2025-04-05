import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
	Menu,
	X,
	Sun,
	Calculator,
	LineChart,
	Users,
	MessageCircle,
	ChevronLeft,
} from "lucide-react";

const Navbar = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [appMode, setAppMode] = useState(false);
	const location = useLocation();

	// Check if the app is running in standalone/installed PWA mode
	useEffect(() => {
		if (
			window.matchMedia("(display-mode: standalone)").matches ||
			(window.navigator as any).standalone === true
		) {
			setAppMode(true);
		}
	}, []);

	// For mobile app-like feel, show back button instead of menu on internal pages
	const isHomePage = location.pathname === "/";
	const pageTitle = getPageTitle(location.pathname);

	// Get page title based on current route
	function getPageTitle(path: string): string {
		switch (path) {
			case "/":
				return "Solar Helper";
			case "/calculator":
				return "Solar Savings";
			case "/recommendations":
				return "Recommendations";
			case "/compare":
				return "Compare Solutions";
			case "/community":
				return "Community";
			case "/chat":
				return "Chat with Expert";
			default:
				return "Solar Helper";
		}
	}

	return (
		<nav className="bg-white shadow-md">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between h-16">
					<div className="flex">
						{/* Mobile: Show hamburger menu on home page or back button on other pages */}
						<div
							className="sm:hidden flex items-center"
							style={{ minWidth: "40px" }}
						>
							{isHomePage ? (
								<button
									onClick={() => setIsOpen(!isOpen)}
									type="button"
									className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
									aria-expanded="false"
								>
									{isOpen ? (
										<X className="block h-6 w-6" aria-hidden="true" />
									) : (
										<Menu className="block h-6 w-6" aria-hidden="true" />
									)}
								</button>
							) : (
								<button
									onClick={() => window.history.back()}
									className="text-gray-500 hover:text-gray-700 focus:outline-none"
								>
									<ChevronLeft className="h-6 w-6" />
								</button>
							)}
						</div>

						{/* Logo - smaller on mobile for app-like feel */}
						<Link to="/" className="flex-shrink-0 flex items-center">
							<Sun className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-500" />
							<span className="ml-2 text-lg sm:text-xl font-bold text-gray-900">
								{appMode && !isHomePage ? pageTitle : "SolarHelper"}
							</span>
						</Link>

						{/* Desktop navigation links */}
						<div className="hidden sm:ml-6 sm:flex sm:space-x-8">
							<Link
								to="/calculator"
								className={`border-transparent hover:text-blue-600 hover:border-blue-600 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
									location.pathname === "/calculator"
										? "text-blue-600 border-blue-600"
										: "text-gray-600"
								}`}
							>
								<Calculator className="mr-1 h-4 w-4" />
								Savings Calculator
							</Link>
							<Link
								to="/recommendations"
								className={`border-transparent hover:text-blue-600 hover:border-blue-600 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
									location.pathname === "/recommendations"
										? "text-blue-600 border-blue-600"
										: "text-gray-600"
								}`}
							>
								<LineChart className="mr-1 h-4 w-4" />
								Recommendations
							</Link>
							<Link
								to="/compare"
								className={`border-transparent hover:text-blue-600 hover:border-blue-600 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
									location.pathname === "/compare"
										? "text-blue-600 border-blue-600"
										: "text-gray-600"
								}`}
							>
								<Sun className="mr-1 h-4 w-4" />
								Compare Solutions
							</Link>
							<Link
								to="/community"
								className={`border-transparent hover:text-blue-600 hover:border-blue-600 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
									location.pathname === "/community"
										? "text-blue-600 border-blue-600"
										: "text-gray-600"
								}`}
							>
								<Users className="mr-1 h-4 w-4" />
								Community
							</Link>
							<Link
								to="/chat"
								className={`border-transparent hover:text-blue-600 hover:border-blue-600 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
									location.pathname === "/chat"
										? "text-blue-600 border-blue-600"
										: "text-gray-600"
								}`}
							>
								<MessageCircle className="mr-1 h-4 w-4" />
								Chat with Expert
							</Link>
						</div>
					</div>

					{/* On non-home mobile pages, show page title right-aligned */}
					{!isHomePage && (
						<div className="sm:hidden flex items-center justify-end flex-1 text-right pr-2">
							<h1 className="text-lg font-semibold text-gray-900">
								{pageTitle}
							</h1>
						</div>
					)}

					{/* Empty div to balance the flex layout */}
					<div className="sm:hidden" style={{ minWidth: "40px" }}></div>
				</div>
			</div>

			{/* Mobile menu panel */}
			{isHomePage && isOpen && (
				<div className="sm:hidden">
					<div className="pt-2 pb-3 space-y-1">
						<Link
							to="/calculator"
							className={`${
								location.pathname === "/calculator"
									? "bg-blue-50 border-blue-500 text-blue-700"
									: "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
							} block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
							onClick={() => setIsOpen(false)}
						>
							<Calculator className="inline-block mr-1 h-4 w-4" />
							Savings Calculator
						</Link>
						<Link
							to="/recommendations"
							className={`${
								location.pathname === "/recommendations"
									? "bg-blue-50 border-blue-500 text-blue-700"
									: "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
							} block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
							onClick={() => setIsOpen(false)}
						>
							<LineChart className="inline-block mr-1 h-4 w-4" />
							Recommendations
						</Link>
						<Link
							to="/compare"
							className={`${
								location.pathname === "/compare"
									? "bg-blue-50 border-blue-500 text-blue-700"
									: "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
							} block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
							onClick={() => setIsOpen(false)}
						>
							<Sun className="inline-block mr-1 h-4 w-4" />
							Compare Solutions
						</Link>
						<Link
							to="/community"
							className={`${
								location.pathname === "/community"
									? "bg-blue-50 border-blue-500 text-blue-700"
									: "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
							} block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
							onClick={() => setIsOpen(false)}
						>
							<Users className="inline-block mr-1 h-4 w-4" />
							Community
						</Link>
						<Link
							to="/chat"
							className={`${
								location.pathname === "/chat"
									? "bg-blue-50 border-blue-500 text-blue-700"
									: "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
							} block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
							onClick={() => setIsOpen(false)}
						>
							<MessageCircle className="inline-block mr-1 h-4 w-4" />
							Chat with Expert
						</Link>
					</div>
				</div>
			)}
		</nav>
	);
};

export default Navbar;
