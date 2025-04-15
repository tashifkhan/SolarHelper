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
	Home,
} from "lucide-react";

const Navbar = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [appMode, setAppMode] = useState(false);
	const [scrolled, setScrolled] = useState(false);
	const location = useLocation();

	// Check if the app is running in standalone/installed PWA mode
	useEffect(() => {
		if (
			window.matchMedia("(display-mode: standalone)").matches ||
			(window.navigator as any).standalone === true
		) {
			setAppMode(true);
		}

		// Add scroll listener for glass effect
		const handleScroll = () => {
			setScrolled(window.scrollY > 10);
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
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
		<nav
			className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
				scrolled
					? "bg-white/80 backdrop-blur-md shadow-lg"
					: "bg-white/60 backdrop-blur-sm"
			}`}
		>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between h-16">
					<div className="flex items-center">
						{/* Mobile: Show hamburger menu on home page or back button on other pages */}
						<div className="sm:hidden flex items-center mr-2">
							{isHomePage ? (
								<button
									onClick={() => setIsOpen(!isOpen)}
									type="button"
									className="no-ripple inline-flex items-center justify-center p-2 rounded-full text-gray-500 hover:text-blue-600 hover:bg-blue-50 focus:outline-none transition-colors duration-200"
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
									className="no-ripple inline-flex items-center justify-center p-2 rounded-full text-gray-500 hover:text-blue-600 hover:bg-blue-50 focus:outline-none transition-colors duration-200"
								>
									<ChevronLeft className="h-6 w-6" />
								</button>
							)}
						</div>

						{/* Logo with gradient and animation */}
						<Link to="/" className="flex-shrink-0 flex items-center group">
							<div className="bg-gradient-to-br from-blue-500 to-cyan-400 p-2 rounded-full shadow-md group-hover:shadow-blue-300/50 transition-all duration-300">
								<Sun className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
							</div>
							<span className="ml-2 text-lg sm:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500">
								{appMode && !isHomePage ? pageTitle : "SolarHelper"}
							</span>
						</Link>

						{/* Desktop navigation links */}
						<div className="hidden sm:ml-10 sm:flex sm:space-x-3 md:space-x-4 lg:space-x-6">
							<NavLink
								to="/"
								icon={<Home className="sm:mr-0 lg:mr-1.5 h-4 w-4" />}
								current={location.pathname === "/"}
							>
								Home
							</NavLink>
							<NavLink
								to="/calculator"
								icon={<Calculator className="sm:mr-0 lg:mr-1.5 h-4 w-4" />}
								current={location.pathname === "/calculator"}
							>
								Savings
							</NavLink>
							<NavLink
								to="/recommendations"
								icon={<LineChart className="sm:mr-0 lg:mr-1.5 h-4 w-4" />}
								current={location.pathname === "/recommendations"}
							>
								Recommendations
							</NavLink>
							<NavLink
								to="/compare"
								icon={<Sun className="sm:mr-0 lg:mr-1.5 h-4 w-4" />}
								current={location.pathname === "/compare"}
							>
								Compare
							</NavLink>
							<NavLink
								to="/community"
								icon={<Users className="sm:mr-0 lg:mr-1.5 h-4 w-4" />}
								current={location.pathname === "/community"}
							>
								Community
							</NavLink>
							<NavLink
								to="/chat"
								icon={<MessageCircle className="sm:mr-0 lg:mr-1.5 h-4 w-4" />}
								current={location.pathname === "/chat"}
							>
								Expert Chat
							</NavLink>
						</div>
					</div>

					{/* Empty div to balance the flex layout */}
					<div className="sm:hidden" style={{ minWidth: "40px" }}></div>
				</div>
			</div>

			{/* Mobile menu panel with animation */}
			<div
				className={`sm:hidden absolute w-full bg-white/95 backdrop-blur-md shadow-lg transition-all duration-300 ease-in-out overflow-hidden ${
					isHomePage && isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
				}`}
			>
				<div className="pt-2 pb-3 space-y-1 px-3">
					<MobileNavLink
						to="/"
						icon={<Home className="h-5 w-5 mr-3" />}
						current={location.pathname === "/"}
						onClick={() => setIsOpen(false)}
					>
						Home
					</MobileNavLink>
					<MobileNavLink
						to="/calculator"
						icon={<Calculator className="h-5 w-5 mr-3" />}
						current={location.pathname === "/calculator"}
						onClick={() => setIsOpen(false)}
					>
						Solar Savings
					</MobileNavLink>
					<MobileNavLink
						to="/recommendations"
						icon={<LineChart className="h-5 w-5 mr-3" />}
						current={location.pathname === "/recommendations"}
						onClick={() => setIsOpen(false)}
					>
						Recommendations
					</MobileNavLink>
					<MobileNavLink
						to="/compare"
						icon={<Sun className="h-5 w-5 mr-3" />}
						current={location.pathname === "/compare"}
						onClick={() => setIsOpen(false)}
					>
						Compare Solutions
					</MobileNavLink>
					<MobileNavLink
						to="/community"
						icon={<Users className="h-5 w-5 mr-3" />}
						current={location.pathname === "/community"}
						onClick={() => setIsOpen(false)}
					>
						Community
					</MobileNavLink>
					<MobileNavLink
						to="/chat"
						icon={<MessageCircle className="h-5 w-5 mr-3" />}
						current={location.pathname === "/chat"}
						onClick={() => setIsOpen(false)}
					>
						Chat with Expert
					</MobileNavLink>
				</div>
			</div>

			{/* Page title bar that appears below the navbar on mobile */}
			{!isHomePage && (
				<div className="sm:hidden pb-2 pt-1 bg-gradient-to-r from-blue-50 to-cyan-50 shadow-inner">
					<h1 className="text-center text-lg font-medium text-gray-800">
						{pageTitle}
					</h1>
				</div>
			)}
		</nav>
	);
};

// Helper component for desktop navigation links
const NavLink = ({
	to,
	children,
	icon,
	current,
}: {
	to: string;
	children: React.ReactNode;
	icon: React.ReactNode;
	current: boolean;
}) => {
	return (
		<Link
			to={to}
			className={`group relative flex items-center px-1 py-1 font-medium text-sm transition-colors duration-200 ${
				current ? "text-blue-600" : "text-gray-600 hover:text-blue-600"
			}`}
		>
			<span className="flex items-center">
				{icon}
				<span className={`${current ? "md:inline" : "md:hidden"} lg:inline`}>
					{children}
				</span>
			</span>
			<span
				className={`absolute left-0 bottom-0 h-0.5 bg-blue-500 rounded-full transition-all duration-300 ${
					current ? "w-full" : "w-0 group-hover:w-full"
				}`}
			/>
		</Link>
	);
};

// Helper component for mobile navigation links
const MobileNavLink = ({
	to,
	children,
	icon,
	current,
	onClick,
}: {
	to: string;
	children: React.ReactNode;
	icon: React.ReactNode;
	current: boolean;
	onClick: () => void;
}) => {
	return (
		<Link
			to={to}
			className={`no-ripple flex items-center rounded-lg px-4 py-3 text-base font-medium transition-colors duration-200 ${
				current ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:bg-gray-50"
			}`}
			onClick={onClick}
		>
			{icon}
			{children}
		</Link>
	);
};

export default Navbar;
