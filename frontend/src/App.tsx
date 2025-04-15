import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CalculatorPage from "./pages/CalculatorPage";
import RecommendationsPage from "./pages/RecommendationsPage";
import ComparisonPage from "./pages/ComparisonPage";
import CommunityPage from "./pages/CommunityPage";
import ChatPage from "./pages/ChatPage";
import Navbar from "./componets/Navbar";
import Footer from "./componets/Footer";
import MobileNavBar from "./componets/MobileNavBar";
import InstallPrompt from "./componets/InstallPrompt";
import { useEffect } from "react";

function App() {
	// Register service worker for PWA
	useEffect(() => {
		if ("serviceWorker" in navigator) {
			window.addEventListener("load", () => {
				navigator.serviceWorker
					.register("/service-worker.js")
					.then((registration) => {
						console.log(
							"ServiceWorker registration successful with scope:",
							registration.scope
						);
					})
					.catch((error) => {
						console.log("ServiceWorker registration failed:", error);
					});
			});
		} else {
			console.log("Service workers are not supported");
		}

		// For debugging PWA installation status
		if (window.matchMedia("(display-mode: standalone)").matches) {
			console.log("App is running in standalone mode (installed as PWA)");
		}
	}, []);

	return (
		<BrowserRouter>
			<div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 overflow-x-hidden">
				{/* Desktop Navbar */}
				<Navbar />

				{/* Main content with mobile padding adjustments */}
				<div className="pb-16 sm:pb-0">
					{/* Add padding at top for navbar and bottom for mobile nav */}
					<div className="pt-16 sm:pt-20">
						<Routes>
							<Route path="/" element={<HomePage />} />
							<Route path="/calculator" element={<CalculatorPage />} />
							<Route
								path="/recommendations"
								element={<RecommendationsPage />}
							/>
							<Route path="/compare" element={<ComparisonPage />} />
							<Route path="/community" element={<CommunityPage />} />
							<Route path="/chat" element={<ChatPage />} />
						</Routes>
					</div>
				</div>

				{/* PWA Install Prompt */}
				<InstallPrompt />

				{/* Mobile Navigation Bar */}
				<MobileNavBar />

				{/* Hide footer on mobile for more app-like feel */}
				<div className="hidden sm:block">
					<Footer />
				</div>
			</div>
		</BrowserRouter>
	);
}

export default App;
