import React from "react";
import ChatInterface from "../componets/ChatInterface";

const ChatPage = () => {
	return (
		<div className="bg-gradient-to-b from-blue-50 to-white min-h-screen py-12">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="text-center mb-8">
					<h1 className="text-3xl font-bold text-gray-900">
						Chat with Solar Subsidy Expert
					</h1>
					<p className="mt-4 text-lg text-gray-600">
						Get instant answers to all your questions about solar subsidies and
						government incentives
					</p>
				</div>

				<ChatInterface />

				<div className="mt-12 max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
					<h2 className="text-xl font-semibold text-gray-900">
						Common Questions
					</h2>
					<div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="p-3 bg-blue-50 rounded-lg">
							<p className="font-medium text-blue-800">
								How much subsidy can I get for my home?
							</p>
						</div>
						<div className="p-3 bg-blue-50 rounded-lg">
							<p className="font-medium text-blue-800">
								What documents do I need to apply?
							</p>
						</div>
						<div className="p-3 bg-blue-50 rounded-lg">
							<p className="font-medium text-blue-800">
								Do commercial installations qualify?
							</p>
						</div>
						<div className="p-3 bg-blue-50 rounded-lg">
							<p className="font-medium text-blue-800">
								How long does the subsidy process take?
							</p>
						</div>
						<div className="p-3 bg-blue-50 rounded-lg">
							<p className="font-medium text-blue-800">
								Are there state-specific subsidies?
							</p>
						</div>
						<div className="p-3 bg-blue-50 rounded-lg">
							<p className="font-medium text-blue-800">
								What is the PM-KUSUM scheme?
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ChatPage;
