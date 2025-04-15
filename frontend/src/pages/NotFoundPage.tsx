import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
	const navigate = useNavigate();

	return (
		<div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
			<h1 className="text-4xl font-bold text-gray-800 mb-4">
				404 - Page Not Found
			</h1>
			<p className="text-xl text-gray-600 mb-8">
				The page you're looking for doesn't exist or has been moved.
			</p>
			<button
				onClick={() => navigate("/")}
				className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
			>
				Return to Home
			</button>
		</div>
	);
};

export default NotFoundPage;
