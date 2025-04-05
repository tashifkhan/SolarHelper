import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
	Menu,
	X,
	Sun,
	Calculator,
	LineChart,
	Users,
	MessageCircle,
} from "lucide-react";

const Navbar = () => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<nav className="bg-white shadow-md">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between h-16">
					<div className="flex">
						<Link to="/" className="flex-shrink-0 flex items-center">
							<Sun className="h-8 w-8 text-yellow-500" />
							<span className="ml-2 text-xl font-bold text-gray-900">
								SolarHelper
							</span>
						</Link>
						<div className="hidden sm:ml-6 sm:flex sm:space-x-8">
							<Link
								to="/calculator"
								className="border-transparent text-gray-600 hover:text-blue-600 hover:border-blue-600 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
							>
								<Calculator className="mr-1 h-4 w-4" />
								Savings Calculator
							</Link>
							<Link
								to="/recommendations"
								className="border-transparent text-gray-600 hover:text-blue-600 hover:border-blue-600 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
							>
								<LineChart className="mr-1 h-4 w-4" />
								Recommendations
							</Link>
							<Link
								to="/compare"
								className="border-transparent text-gray-600 hover:text-blue-600 hover:border-blue-600 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
							>
								<Sun className="mr-1 h-4 w-4" />
								Compare Solutions
							</Link>
							<Link
								to="/community"
								className="border-transparent text-gray-600 hover:text-blue-600 hover:border-blue-600 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
							>
								<Users className="mr-1 h-4 w-4" />
								Community
							</Link>
							<Link
								to="/chat"
								className="border-transparent text-gray-600 hover:text-blue-600 hover:border-blue-600 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
							>
								<MessageCircle className="mr-1 h-4 w-4" />
								Chat with Expert
							</Link>
						</div>
					</div>
					<div className="-mr-2 flex items-center sm:hidden">
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
					</div>
				</div>
			</div>

			{isOpen && (
				<div className="sm:hidden">
					<div className="pt-2 pb-3 space-y-1">
						<Link
							to="/calculator"
							className="bg-blue-50 border-blue-500 text-blue-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
							onClick={() => setIsOpen(false)}
						>
							<Calculator className="inline-block mr-1 h-4 w-4" />
							Savings Calculator
						</Link>
						<Link
							to="/recommendations"
							className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
							onClick={() => setIsOpen(false)}
						>
							<LineChart className="inline-block mr-1 h-4 w-4" />
							Recommendations
						</Link>
						<Link
							to="/compare"
							className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
							onClick={() => setIsOpen(false)}
						>
							<Sun className="inline-block mr-1 h-4 w-4" />
							Compare Solutions
						</Link>
						<Link
							to="/community"
							className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
							onClick={() => setIsOpen(false)}
						>
							<Users className="inline-block mr-1 h-4 w-4" />
							Community
						</Link>
						<Link
							to="/chat"
							className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
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
