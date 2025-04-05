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
	// Add touch ripple effect for mobile app-like feel
	useEffect(() => {
		const addRippleEffect = (event: MouseEvent) => {
			const target = event.currentTarget as HTMLElement;
			const ripple = document.createElement("span");
			const rect = target.getBoundingClientRect();

			const size = Math.max(rect.width, rect.height);
			const x = event.clientX - rect.left - size / 2;
			const y = event.clientY - rect.top - size / 2;

			ripple.style.width = ripple.style.height = `${size}px`;
			ripple.style.left = `${x}px`;
			ripple.style.top = `${y}px`;
			ripple.classList.add("ripple");

			const existingRipple = target.querySelector(".ripple");
			if (existingRipple) {
				existingRipple.remove();
			}

			target.appendChild(ripple);

			setTimeout(() => {
				ripple.remove();
			}, 600);
		};

		// Add event listeners to buttons
		const buttons = document.querySelectorAll("button, a");
		buttons.forEach((button) => {
			button.addEventListener("click", addRippleEffect as EventListener);
		});

		return () => {
			buttons.forEach((button) => {
				button.removeEventListener("click", addRippleEffect as EventListener);
			});
		};
	}, []);

	// Register service worker for PWA
	useEffect(() => {
		if ("serviceWorker" in navigator) {
			window.addEventListener("load", () => {
				navigator.serviceWorker
					.register("/service-worker.js")
					.then((_registration) => {
						console.log("ServiceWorker registration successful");
					})
					.catch((error) => {
						console.log("ServiceWorker registration failed:", error);
					});
			});
		}
	}, []);

	return (
		<BrowserRouter>
			<div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 overflow-x-hidden">
				{/* Desktop Navbar */}
				<Navbar />

				{/* Main content with mobile padding adjustments */}
				<div className="pb-16 sm:pb-0">
					{" "}
					{/* Add padding at bottom for mobile nav */}
					<Routes>
						<Route path="/" element={<HomePage />} />
						<Route path="/calculator" element={<CalculatorPage />} />
						<Route path="/recommendations" element={<RecommendationsPage />} />
						<Route path="/compare" element={<ComparisonPage />} />
						<Route path="/community" element={<CommunityPage />} />
						<Route path="/chat" element={<ChatPage />} />
					</Routes>
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
