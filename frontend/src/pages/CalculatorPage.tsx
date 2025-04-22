import SavingsCalculator from "../componets/SavingsCalculator";

const CalculatorPage = () => {
	return (
		// The main background is handled by App.tsx
		// Add padding or margins if needed
		<div className="py-8 md:py-12">
			{/* SavingsCalculator component already has dark mode styles */}
			<SavingsCalculator />
		</div>
	);
};

export default CalculatorPage;
