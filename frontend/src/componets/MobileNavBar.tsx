import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, LineChart, Users, MessageCircle, Sun, Plus } from "lucide-react";

const MobileNavBar = () => {
	const location = useLocation();
	const [isFabOpen, setIsFabOpen] = useState(false);

	const isActive = (path: string) => {
		return location.pathname === path;
	};

	return (
		<div className="fixed bottom-0 left-0 right-0 z-50 sm:hidden pb-safe">
			{/* Floating Action Button Menu */}
			<div
				className={`absolute bottom-20 left-0 right-0 flex justify-center transition-all duration-300 z-50 ${
					isFabOpen
						? "opacity-100 scale-100"
						: "opacity-0 scale-0 pointer-events-none"
				}`}
			>
				<div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-3xl shadow-xl p-3 mx-auto grid grid-cols-3 gap-4 mb-2 border border-gray-100 dark:border-gray-700">
					<FabAction
						icon={<LineChart className="h-5 w-5" />}
						label="Savings"
						to="/calculator"
						onClick={() => setIsFabOpen(false)}
						color="bg-gradient-to-tr from-blue-600 to-blue-500 dark:from-blue-500 dark:to-blue-400"
					/>
					<FabAction
						icon={<Sun className="h-5 w-5" />}
						label="Compare"
						to="/compare"
						onClick={() => setIsFabOpen(false)}
						color="bg-gradient-to-tr from-cyan-600 to-cyan-500 dark:from-cyan-500 dark:to-cyan-400"
					/>
					<FabAction
						icon={<MessageCircle className="h-5 w-5" />}
						label="Expert"
						to="/chat"
						onClick={() => setIsFabOpen(false)}
						color="bg-gradient-to-tr from-green-600 to-green-500 dark:from-green-500 dark:to-green-400"
					/>
				</div>
			</div>

			{/* Backdrop for FAB menu */}
			{isFabOpen && (
				<div
					className="fixed inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300"
					onClick={() => setIsFabOpen(false)}
				/>
			)}

			{/* Main bottom navigation */}
			<div className="flex items-center justify-around bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-t border-gray-200 dark:border-gray-700 pb-6 pt-2 px-4 shadow-lg">
				<TabButton
					to="/"
					label="Home"
					icon={
						<Home
							className={`h-6 w-6 transition-colors duration-200 ${
								isActive("/")
									? "text-blue-600 dark:text-blue-400"
									: "text-gray-500 dark:text-gray-400"
							}`}
						/>
					}
					active={isActive("/")}
				/>

				<TabButton
					to="/recommendations"
					label="Recommend"
					icon={
						<LineChart
							className={`h-6 w-6 transition-colors duration-200 ${
								isActive("/recommendations")
									? "text-blue-600 dark:text-blue-400"
									: "text-gray-500 dark:text-gray-400"
							}`}
						/>
					}
					active={isActive("/recommendations")}
				/>

				{/* Center FAB button */}
				<div className="relative flex flex-col items-center -mt-7">
					<button
						onClick={() => setIsFabOpen(!isFabOpen)}
						className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-500 dark:from-blue-500 dark:to-cyan-400 flex items-center justify-center shadow-lg border-4 border-white dark:border-gray-800 focus:outline-none transform transition-transform duration-300 active:scale-95"
						aria-label="Open actions menu"
					>
						<Plus
							className={`h-7 w-7 text-white transform transition-transform duration-300 ${
								isFabOpen ? "rotate-45" : ""
							}`}
						/>
					</button>
					<span className="text-xs font-medium text-gray-600 dark:text-gray-400 mt-1">
						Actions
					</span>
				</div>

				<TabButton
					to="/community"
					label="Community"
					icon={
						<Users
							className={`h-6 w-6 transition-colors duration-200 ${
								isActive("/community")
									? "text-blue-600 dark:text-blue-400"
									: "text-gray-500 dark:text-gray-400"
							}`}
						/>
					}
					active={isActive("/community")}
				/>

				<TabButton
					to="/chat"
					label="Chat"
					icon={
						<MessageCircle
							className={`h-6 w-6 transition-colors duration-200 ${
								isActive("/chat")
									? "text-blue-600 dark:text-blue-400"
									: "text-gray-500 dark:text-gray-400"
							}`}
						/>
					}
					active={isActive("/chat")}
				/>
			</div>
		</div>
	);
};

// Tab button component for main navigation
const TabButton = ({
	to,
	label,
	icon,
	active,
}: {
	to: string;
	label: string;
	icon: React.ReactNode;
	active: boolean;
}) => {
	return (
		<Link
			to={to}
			className="flex flex-col items-center justify-center px-3 py-1 no-ripple"
		>
			{icon}
			<div className="flex flex-col items-center">
				<span
					className={`text-xs mt-1 font-medium transition-colors duration-200 ${
						active
							? "text-blue-600 dark:text-blue-400"
							: "text-gray-600 dark:text-gray-400"
					}`}
				>
					{label}
				</span>
				<span
					className={`h-1 w-6 rounded-full mt-1 transition-all duration-300 ${
						active ? "bg-blue-500 dark:bg-blue-400" : "bg-transparent"
					}`}
				></span>
			</div>
		</Link>
	);
};

// Floating action button item component
const FabAction = ({
	icon,
	label,
	to,
	onClick,
	color,
}: {
	icon: React.ReactNode;
	label: string;
	to: string;
	onClick: () => void;
	color: string;
}) => {
	return (
		<Link
			to={to}
			onClick={onClick}
			className="flex flex-col items-center p-2 no-ripple"
		>
			<div
				className={`w-14 h-14 rounded-full ${color} flex items-center justify-center shadow-md mb-1 active:scale-95 transition-transform duration-150`}
			>
				<div className="text-white">{icon}</div>
			</div>
			<span className="text-xs font-medium text-gray-700 dark:text-gray-300">
				{label}
			</span>
		</Link>
	);
};

export default MobileNavBar;
