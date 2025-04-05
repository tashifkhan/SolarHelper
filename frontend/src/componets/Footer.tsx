import { Link } from "react-router-dom";
import {
	Sun,
	Facebook,
	Twitter,
	Instagram,
	Linkedin,
	Mail,
} from "lucide-react";

const Footer = () => {
	return (
		<footer className="bg-gray-800 text-white">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
					<div className="col-span-1">
						<Link to="/" className="flex items-center">
							<Sun className="h-8 w-8 text-yellow-400" />
							<span className="ml-2 text-xl font-bold">SolarHelper</span>
						</Link>
						<p className="mt-4 text-gray-300">
							Making solar power accessible for every Indian household.
						</p>
						<div className="mt-6 flex space-x-4">
							<a href="#" className="text-gray-400 hover:text-white">
								<Facebook className="h-5 w-5" />
							</a>
							<a href="#" className="text-gray-400 hover:text-white">
								<Twitter className="h-5 w-5" />
							</a>
							<a href="#" className="text-gray-400 hover:text-white">
								<Instagram className="h-5 w-5" />
							</a>
							<a href="#" className="text-gray-400 hover:text-white">
								<Linkedin className="h-5 w-5" />
							</a>
						</div>
					</div>

					<div className="col-span-1">
						<h3 className="text-lg font-medium">Resources</h3>
						<ul className="mt-4 space-y-2">
							<li>
								<Link
									to="/calculator"
									className="text-gray-300 hover:text-white"
								>
									Savings Calculator
								</Link>
							</li>
							<li>
								<Link to="/compare" className="text-gray-300 hover:text-white">
									Product Comparison
								</Link>
							</li>
							<li>
								<Link
									to="/subsidies"
									className="text-gray-300 hover:text-white"
								>
									Subsidy Information
								</Link>
							</li>
							<li>
								<Link to="/blog" className="text-gray-300 hover:text-white">
									Blog
								</Link>
							</li>
						</ul>
					</div>

					<div className="col-span-1">
						<h3 className="text-lg font-medium">Company</h3>
						<ul className="mt-4 space-y-2">
							<li>
								<Link to="/about" className="text-gray-300 hover:text-white">
									About Us
								</Link>
							</li>
							<li>
								<Link to="/contact" className="text-gray-300 hover:text-white">
									Contact
								</Link>
							</li>
							<li>
								<Link to="/careers" className="text-gray-300 hover:text-white">
									Careers
								</Link>
							</li>
							<li>
								<Link to="/privacy" className="text-gray-300 hover:text-white">
									Privacy Policy
								</Link>
							</li>
						</ul>
					</div>

					<div className="col-span-1">
						<h3 className="text-lg font-medium">Contact Us</h3>
						<p className="mt-4 text-gray-300">
							Have questions? Get in touch with our solar experts.
						</p>
						<div className="mt-4 flex items-center">
							<Mail className="h-5 w-5 text-gray-400" />
							<a
								href="mailto:info@solarhelper.in"
								className="ml-2 text-gray-300 hover:text-white"
							>
								info@solarhelper.in
							</a>
						</div>
						<div className="mt-6">
							<Link
								to="/contact"
								className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-black bg-yellow-400 hover:bg-yellow-500"
							>
								Get in Touch
							</Link>
						</div>
					</div>
				</div>

				<div className="mt-12 border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between">
					<p className="text-gray-400">
						&copy; {new Date().getFullYear()} SolarHelper. All rights reserved.
					</p>
					<div className="mt-4 md:mt-0">
						<Link to="/terms" className="text-gray-400 hover:text-white mr-4">
							Terms of Service
						</Link>
						<Link to="/privacy" className="text-gray-400 hover:text-white">
							Privacy Policy
						</Link>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
