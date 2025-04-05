import { Sun, Home, Battery, LineChart } from "lucide-react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Header from "./componets/Header";
import RecommendationEngine from "./componets/RecommendationEngine";
import SavingsCalculator from "./componets/SavingsCalculator";
import ComparisonTool from "./componets/ComparisonTool";
import CommunitySection from "./componets/CommunitySection";
import ChatInterface from "./componets/ChatInterface";
import HomePage from "./pages/HomePage";
import CalculatorPage from "./pages/CalculatorPage";
import RecommendationsPage from "./pages/RecommendationsPage";
import ComparisonPage from "./pages/ComparisonPage";
import CommunityPage from "./pages/CommunityPage";
import ChatPage from "./pages/ChatPage";
import Navbar from "./componets/Navbar";
import Footer from "./componets/Footer";

function App() {
	return (
		<BrowserRouter>
			<div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
				<Navbar />

				<Routes>
					<Route path="/" element={<HomePage />} />
					<Route path="/calculator" element={<CalculatorPage />} />
					<Route path="/recommendations" element={<RecommendationsPage />} />
					<Route path="/compare" element={<ComparisonPage />} />
					<Route path="/community" element={<CommunityPage />} />
					<Route path="/chat" element={<ChatPage />} />
				</Routes>

				<Footer />
			</div>
		</BrowserRouter>
	);
}

export default App;
