import { Link, useLocation } from "react-router-dom";
import {
	Home,
	Calculator,
	LineChart,
	Users,
	MessageCircle,
} from "lucide-react";

const MobileNavBar = () => {
	const location = useLocation();

	const isActive = (path: string) => {
		return location.pathname === path;
	};

	return (
		<div className="fixed bottom-0 left-0 right-0 z-50 sm:hidden">
			<div className="flex items-center justify-around bg-white border-t border-gray-200 py-2 px-6 shadow-lg">
				<Link
					to="/"
					className={`flex flex-col items-center justify-center px-3 py-2 no-ripple ${
						isActive("/") ? "text-blue-600" : "text-gray-600"
					}`}
				>
					<Home className="h-6 w-6" />
					<span className="text-xs mt-1">Home</span>
				</Link>

				<Link
					to="/calculator"
					className={`flex flex-col items-center justify-center px-3 py-2 no-ripple ${
						isActive("/calculator") ? "text-blue-600" : "text-gray-600"
					}`}
				>
					<Calculator className="h-6 w-6" />
					<span className="text-xs mt-1">Savings</span>
				</Link>

				<Link
					to="/recommendations"
					className={`flex flex-col items-center justify-center px-3 py-2 no-ripple ${
						isActive("/recommendations") ? "text-blue-600" : "text-gray-600"
					}`}
				>
					<LineChart className="h-6 w-6" />
					<span className="text-xs mt-1">Recommend</span>
				</Link>

				<Link
					to="/community"
					className={`flex flex-col items-center justify-center px-3 py-2 no-ripple ${
						isActive("/community") ? "text-blue-600" : "text-gray-600"
					}`}
				>
					<Users className="h-6 w-6" />
					<span className="text-xs mt-1">Community</span>
				</Link>

				<Link
					to="/chat"
					className={`flex flex-col items-center justify-center px-3 py-2 no-ripple ${
						isActive("/chat") ? "text-blue-600" : "text-gray-600"
					}`}
				>
					<MessageCircle className="h-6 w-6" />
					<span className="text-xs mt-1">Chat</span>
				</Link>
			</div>
		</div>
	);
};

export default MobileNavBar;
