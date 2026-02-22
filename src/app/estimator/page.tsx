export default function EstimatorLegacyPage() {
    return (
        <main className="flex-1 flex items-center justify-center px-4 py-12">
            <div className="card text-center max-w-md">
                <div className="text-4xl mb-4">🌾</div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">Estimator</h2>
                <p className="text-gray-500">
                    Please use <a href="/estimate" className="text-green-600 font-semibold hover:underline">/estimate</a> to access the profitability estimator.
                </p>
            </div>
        </main>
    );
}
