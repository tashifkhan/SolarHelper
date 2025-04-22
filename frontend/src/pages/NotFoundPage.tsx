import { Link } from "react-router-dom";
import { Home, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

const NotFoundPage = () => {
	return (
		<div className="flex items-center justify-center min-h-[calc(100vh-8rem)] bg-gradient-to-br from-red-50 to-yellow-50 dark:from-gray-900 dark:to-gray-800 px-4 sm:px-6 lg:px-8">
			<motion.div
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="text-center p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-lg w-full border border-gray-100 dark:border-gray-700"
			>
				<AlertTriangle className="mx-auto h-16 w-16 text-red-500 dark:text-red-400 mb-6" />
				<h1 className="text-6xl font-bold text-red-600 dark:text-red-500">
					404
				</h1>
				<h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
					Page Not Found
				</h2>
				<p className="mt-6 text-base leading-7 text-gray-600 dark:text-gray-300">
					Sorry, we couldn’t find the page you’re looking for. It might have
					been moved or deleted.
				</p>
				<div className="mt-10 flex items-center justify-center gap-x-6">
					<Link
						to="/"
						className="inline-flex items-center rounded-md bg-blue-600 dark:bg-blue-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 dark:hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
					>
						<Home className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
						Go back home
					</Link>
					<Link
						to="/contact"
						className="text-sm font-semibold text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400"
					>
						Contact support <span aria-hidden="true">&rarr;</span>
					</Link>
				</div>
			</motion.div>
		</div>
	);
};

export default NotFoundPage;
