import React, { useState, useEffect } from "react";
import { X, Download } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
	prompt: () => Promise<void>;
	userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

const InstallPrompt = () => {
	const [installPrompt, setInstallPrompt] =
		useState<BeforeInstallPromptEvent | null>(null);
	const [showPrompt, setShowPrompt] = useState(false);
	const [isIOS, setIsIOS] = useState(false);

	useEffect(() => {
		// Check if it's iOS device
		const isIOSDevice =
			/iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
		setIsIOS(isIOSDevice);

		// For non-iOS devices, use the beforeinstallprompt event
		if (!isIOSDevice) {
			const handler = (e: Event) => {
				e.preventDefault();
				setInstallPrompt(e as BeforeInstallPromptEvent);
				setShowPrompt(true);
			};

			window.addEventListener("beforeinstallprompt", handler);

			// Check if already installed as PWA
			if (
				window.matchMedia("(display-mode: standalone)").matches ||
				(window.navigator as any).standalone === true
			) {
				setShowPrompt(false);
			} else {
				// Show prompt after 30 seconds of browsing
				const timer = setTimeout(() => {
					if (installPrompt) {
						setShowPrompt(true);
					}
				}, 30000);

				return () => clearTimeout(timer);
			}

			return () => window.removeEventListener("beforeinstallprompt", handler);
		} else {
			// For iOS, show iOS-specific installation instructions
			// Check if already in standalone mode (installed)
			if ((window.navigator as any).standalone !== true) {
				// Show iOS prompt after 15 seconds
				const timer = setTimeout(() => {
					setShowPrompt(true);
				}, 15000);

				return () => clearTimeout(timer);
			}
		}
	}, [installPrompt]);

	const handleInstall = async () => {
		if (!isIOS && installPrompt) {
			await installPrompt.prompt();
			const choiceResult = await installPrompt.userChoice;

			if (choiceResult.outcome === "accepted") {
				console.log("User accepted the install prompt");
			} else {
				console.log("User dismissed the install prompt");
			}

			setInstallPrompt(null);
			setShowPrompt(false);
		}
	};

	const handleDismiss = () => {
		setShowPrompt(false);
		// Don't show again for 7 days
		localStorage.setItem(
			"installPromptDismissed",
			(Date.now() + 7 * 24 * 60 * 60 * 1000).toString()
		);
	};

	if (!showPrompt) {
		return null;
	}

	return (
		<div className="fixed bottom-16 left-4 right-4 sm:bottom-4 sm:left-auto sm:right-4 sm:w-96 bg-white rounded-lg shadow-lg z-50 border border-blue-100">
			<div className="p-4">
				<div className="flex justify-between items-start">
					<h3 className="text-lg font-medium text-gray-900 flex items-center">
						<Download className="h-5 w-5 text-blue-500 mr-2" />
						Install Solar Helper
					</h3>
					<button
						onClick={handleDismiss}
						className="text-gray-400 hover:text-gray-500"
					>
						<X className="h-5 w-5" />
					</button>
				</div>

				{isIOS ? (
					<div className="mt-3">
						<p className="text-sm text-gray-600">
							Install this app on your iPhone: tap{" "}
							<span className="font-semibold">Share</span> and then{" "}
							<span className="font-semibold">Add to Home Screen</span>.
						</p>
						<div className="mt-4 flex items-center">
							<div className="mr-2 text-blue-600 text-xl">↑</div>
							<span className="text-sm text-gray-600">
								Tap the share button above
							</span>
						</div>
					</div>
				) : (
					<div className="mt-3">
						<p className="text-sm text-gray-600">
							Install Solar Helper app for a faster, app-like experience with
							offline capabilities.
						</p>
						<button
							onClick={handleInstall}
							className="mt-3 w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
						>
							Install App
							<Download className="ml-2 h-4 w-4" />
						</button>
					</div>
				)}
			</div>
		</div>
	);
};

export default InstallPrompt;
