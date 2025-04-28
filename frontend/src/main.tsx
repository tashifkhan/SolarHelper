import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { loadPyodide } from "pyodide";

declare global {
	interface Window {
		pyodideInstance?: any;
		predictEnergyForLocation?: any;
	}
}

// initialize Pyodide & cache wasm + script in localStorage
const initPyodide = async () => {
	const CDN_INDEX = "https://cdn.jsdelivr.net/pyodide/v0.27.5/full/";
	const SCRIPT_KEY = "predict_energy_py";

	try {
		const py = await loadPyodide({ indexURL: CDN_INDEX });
		await py.loadPackage([
			"micropip",
			"pandas",
			"scikit-learn",
			"lightgbm",
			"numpy",
		]);

		let script = localStorage.getItem(SCRIPT_KEY);
		if (!script) {
			const r = await fetch("/pyodide/predict_energy.py");
			script = await r.text();
			try {
				localStorage.setItem(SCRIPT_KEY, script);
			} catch {}
		}
		await py.runPythonAsync(script);

		const fn = py.globals.get("predict_energy_for_location");
		window.pyodideInstance = py;
		window.predictEnergyForLocation = fn;
	} catch (e) {
		console.error("Pyodide init failed:", e);
	}
};
initPyodide();

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<App />
	</StrictMode>
);

if ("serviceWorker" in navigator) {
	window.addEventListener("load", () => {
		navigator.serviceWorker
			.register("/service-worker.js")
			.catch((err) => console.warn("SW registration failed:", err));
	});
}
