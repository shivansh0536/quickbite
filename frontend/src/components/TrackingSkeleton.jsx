const TrackingSkeleton = () => {
    return (
        <div className="max-w-4xl mx-auto px-4 py-8 animate-pulse">
            <div className="flex justify-between items-center mb-8">
                <div className="space-y-3">
                    <div className="h-8 bg-gray-200 rounded w-48"></div>
                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                </div>
                <div className="h-8 bg-gray-200 rounded w-24"></div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
                <div className="flex justify-between items-center relative">
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -z-10"></div>
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="flex flex-col items-center bg-white px-2">
                            <div className="w-10 h-10 rounded-full bg-gray-200 mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded w-20"></div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
                    <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
                    <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
                    <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
                    <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrackingSkeleton;
