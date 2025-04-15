import { useState, useEffect } from "react";
import { X, Download, ExternalLink } from "lucide-react";

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
		<div className="fixed bottom-16 inset-x-4 sm:bottom-4 sm:left-auto sm:right-4 sm:w-96 bg-white rounded-xl shadow-xl z-50 border border-blue-100 transition-all duration-300 animate-fade-in-up">
			<div className="relative p-5">
				<button
					onClick={handleDismiss}
					className="absolute right-3 top-3 text-gray-400 hover:text-gray-500 bg-gray-100 rounded-full p-1 transition-colors"
				>
					<X className="h-4 w-4" />
				</button>

				<div className="flex items-center mb-3">
					<div className="bg-gradient-to-br from-blue-500 to-cyan-400 p-2 rounded-lg">
						<Download className="h-5 w-5 text-white" />
					</div>
					<h3 className="ml-3 text-lg font-semibold text-gray-900">
						Install Solar Helper
					</h3>
				</div>

				{isIOS ? (
					<div>
						<p className="text-sm text-gray-600">
							Install this app on your iPhone for a better experience:
						</p>
						<div className="mt-4 flex items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
							<div className="mr-3 text-blue-500 flex items-center">
								<ExternalLink className="h-5 w-5" />
							</div>
							<div className="text-sm">
								<p className="text-gray-700 font-medium">
									Tap the share button
								</p>
								<p className="text-gray-500">
									Then "Add to Home Screen" to install
								</p>
							</div>
						</div>
						<div className="mt-4 flex justify-center">
							<button
								onClick={handleDismiss}
								className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
							>
								Maybe later
							</button>
						</div>
					</div>
				) : (
					<div>
						<p className="text-sm text-gray-600">
							Install Solar Helper for faster access with offline capabilities.
						</p>
						<div className="mt-4 flex justify-between items-center">
							<button
								onClick={handleDismiss}
								className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
							>
								Not now
							</button>
							<button
								onClick={handleInstall}
								className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-colors"
							>
								Install App
								<Download className="ml-2 h-4 w-4" />
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default InstallPrompt;
