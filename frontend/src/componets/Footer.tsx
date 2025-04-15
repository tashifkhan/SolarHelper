import { Link } from "react-router-dom";
import {
	Sun,
	Facebook,
	Twitter,
	Instagram,
	Linkedin,
	Mail,
	ArrowRight,
	Phone,
	MapPin,
} from "lucide-react";
import { useState } from "react";

const Footer = () => {
	const [email, setEmail] = useState("");

	const handleSubscribe = (e: React.FormEvent) => {
		e.preventDefault();
		// Subscription logic here
		console.log(`Subscribing email: ${email}`);
		setEmail("");
		// Show success notification or execute API call
	};

	return (
		<footer className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white">
			<div className="relative overflow-hidden">
				{/* Solar decoration elements */}
				<div className="absolute top-0 left-1/4 w-64 h-64 rounded-full bg-yellow-400 opacity-5"></div>
				<div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-yellow-300 opacity-5"></div>

				<div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-16 relative z-10">
					{/* Top section with logo, tagline and newsletter */}
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-10 pb-12 border-b border-blue-700">
						<div className="col-span-1 lg:col-span-1">
							<Link to="/" className="flex items-center">
								<Sun className="h-10 w-10 text-yellow-400" />
								<span className="ml-2 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-200">
									SolarHelper
								</span>
							</Link>
							<p className="mt-4 text-blue-100 max-w-md">
								Making solar power accessible for every Indian household with
								innovative solutions and transparent guidance.
							</p>
						</div>

						<div className="col-span-1 lg:col-span-2">
							<div className="bg-blue-800/30 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-blue-700/50">
								<h3 className="text-xl font-medium text-blue-100">
									Join our solar community
								</h3>
								<p className="mt-2 text-blue-200">
									Get updates on solar trends, incentives, and our latest
									offerings.
								</p>
								<form onSubmit={handleSubscribe} className="mt-4 flex gap-2">
									<input
										type="email"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										placeholder="Your email address"
										className="px-4 py-2 bg-blue-800/50 border border-blue-600 rounded-lg flex-grow text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
										required
									/>
									<button
										type="submit"
										className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-medium rounded-lg flex items-center transition-colors"
									>
										Subscribe
										<ArrowRight className="ml-1 h-4 w-4" />
									</button>
								</form>
							</div>
						</div>
					</div>

					{/* Main footer links */}
					<div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-10 py-12">
						<div className="col-span-1">
							<h3 className="text-lg font-medium text-blue-100 border-l-4 border-yellow-400 pl-3">
								Resources
							</h3>
							<ul className="mt-4 space-y-3">
								<li>
									<Link
										to="/calculator"
										className="text-blue-200 hover:text-yellow-300 transition-colors flex items-center"
									>
										<span className="w-1 h-1 rounded-full bg-blue-400 mr-2"></span>
										Savings Calculator
									</Link>
								</li>
								<li>
									<Link
										to="/compare"
										className="text-blue-200 hover:text-yellow-300 transition-colors flex items-center"
									>
										<span className="w-1 h-1 rounded-full bg-blue-400 mr-2"></span>
										Product Comparison
									</Link>
								</li>
								<li>
									<Link
										to="/subsidies"
										className="text-blue-200 hover:text-yellow-300 transition-colors flex items-center"
									>
										<span className="w-1 h-1 rounded-full bg-blue-400 mr-2"></span>
										Subsidy Information
									</Link>
								</li>
								<li>
									<Link
										to="/blog"
										className="text-blue-200 hover:text-yellow-300 transition-colors flex items-center"
									>
										<span className="w-1 h-1 rounded-full bg-blue-400 mr-2"></span>
										Blog
									</Link>
								</li>
							</ul>
						</div>

						<div className="col-span-1">
							<h3 className="text-lg font-medium text-blue-100 border-l-4 border-yellow-400 pl-3">
								Company
							</h3>
							<ul className="mt-4 space-y-3">
								<li>
									<Link
										to="/about"
										className="text-blue-200 hover:text-yellow-300 transition-colors flex items-center"
									>
										<span className="w-1 h-1 rounded-full bg-blue-400 mr-2"></span>
										About Us
									</Link>
								</li>
								<li>
									<Link
										to="/contact"
										className="text-blue-200 hover:text-yellow-300 transition-colors flex items-center"
									>
										<span className="w-1 h-1 rounded-full bg-blue-400 mr-2"></span>
										Contact
									</Link>
								</li>
								<li>
									<Link
										to="/careers"
										className="text-blue-200 hover:text-yellow-300 transition-colors flex items-center"
									>
										<span className="w-1 h-1 rounded-full bg-blue-400 mr-2"></span>
										Careers
									</Link>
								</li>
								<li>
									<Link
										to="/privacy"
										className="text-blue-200 hover:text-yellow-300 transition-colors flex items-center"
									>
										<span className="w-1 h-1 rounded-full bg-blue-400 mr-2"></span>
										Privacy Policy
									</Link>
								</li>
							</ul>
						</div>

						<div className="col-span-1 lg:col-span-2">
							<h3 className="text-lg font-medium text-blue-100 border-l-4 border-yellow-400 pl-3">
								Contact Us
							</h3>
							<p className="mt-4 text-blue-200">
								Have questions about going solar? Our expert team is ready to
								help.
							</p>
							<div className="mt-5 space-y-3">
								<div className="flex items-center">
									<div className="h-8 w-8 bg-blue-800/70 rounded-full flex items-center justify-center">
										<Mail className="h-4 w-4 text-yellow-300" />
									</div>
									<a
										href="mailto:info@solarhelper.in"
										className="ml-3 text-blue-100 hover:text-yellow-300 transition-colors"
									>
										info@solarhelper.in
									</a>
								</div>

								<div className="flex items-center">
									<div className="h-8 w-8 bg-blue-800/70 rounded-full flex items-center justify-center">
										<Phone className="h-4 w-4 text-yellow-300" />
									</div>
									<a
										href="tel:+919876543210"
										className="ml-3 text-blue-100 hover:text-yellow-300 transition-colors"
									>
										+91 9876 543 210
									</a>
								</div>

								<div className="flex items-center">
									<div className="h-8 w-8 bg-blue-800/70 rounded-full flex items-center justify-center">
										<MapPin className="h-4 w-4 text-yellow-300" />
									</div>
									<span className="ml-3 text-blue-100">
										123 Solar Street, New Delhi, India
									</span>
								</div>
							</div>
							<div className="mt-6">
								<Link
									to="/contact"
									className="inline-flex items-center px-5 py-2 border border-transparent text-sm font-medium rounded-full shadow-lg text-blue-900 bg-gradient-to-r from-yellow-300 to-yellow-500 hover:from-yellow-400 hover:to-yellow-600 transition-all"
								>
									Get Free Consultation
									<ArrowRight className="ml-2 h-4 w-4" />
								</Link>
							</div>
						</div>
					</div>

					{/* Social and bottom links */}
					<div className="pt-8 border-t border-blue-700">
						<div className="flex flex-col md:flex-row justify-between items-center">
							<div className="flex space-x-6 mb-4 md:mb-0">
								<a
									href="#"
									className="bg-blue-800/30 p-2 rounded-full hover:bg-yellow-400 hover:text-blue-900 transition-colors"
								>
									<Facebook className="h-5 w-5" />
								</a>
								<a
									href="#"
									className="bg-blue-800/30 p-2 rounded-full hover:bg-yellow-400 hover:text-blue-900 transition-colors"
								>
									<Twitter className="h-5 w-5" />
								</a>
								<a
									href="#"
									className="bg-blue-800/30 p-2 rounded-full hover:bg-yellow-400 hover:text-blue-900 transition-colors"
								>
									<Instagram className="h-5 w-5" />
								</a>
								<a
									href="#"
									className="bg-blue-800/30 p-2 rounded-full hover:bg-yellow-400 hover:text-blue-900 transition-colors"
								>
									<Linkedin className="h-5 w-5" />
								</a>
							</div>

							<div className="flex flex-col md:flex-row md:items-center text-center md:text-right">
								<p className="text-blue-300 text-sm">
									&copy; {new Date().getFullYear()} SolarHelper. All rights
									reserved.
								</p>
								<div className="mt-3 md:mt-0 md:ml-8 space-x-4">
									<Link
										to="/terms"
										className="text-blue-300 hover:text-yellow-300 text-sm"
									>
										Terms of Service
									</Link>
									<Link
										to="/privacy"
										className="text-blue-300 hover:text-yellow-300 text-sm"
									>
										Privacy Policy
									</Link>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
