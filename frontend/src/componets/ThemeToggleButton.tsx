import { Moon, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const ThemeToggleButton = () => {
	const { theme, toggleTheme } = useTheme();
	return (
		<button
			onClick={toggleTheme}
			aria-label="Toggle theme"
			className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none transition-colors duration-200"
		>
			{theme === "light" ? (
				<Moon className="h-5 w-5" />
			) : (
				<Sun className="h-5 w-5" />
			)}
		</button>
	);
};

export default ThemeToggleButton;
