const CuisineTag = ({ cuisine, className = "" }) => {
    const getColors = (cuisine) => {
        const colors = {
            Italian: 'bg-red-100 text-red-800',
            Chinese: 'bg-red-100 text-red-800',
            Indian: 'bg-orange-100 text-orange-800',
            Mexican: 'bg-green-100 text-green-800',
            Japanese: 'bg-red-100 text-red-800',
            American: 'bg-blue-100 text-blue-800',
            Thai: 'bg-purple-100 text-purple-800',
            Mediterranean: 'bg-teal-100 text-teal-800',
            Vegetarian: 'bg-green-100 text-green-800',
            Healthy: 'bg-green-100 text-green-800',
            Dessert: 'bg-pink-100 text-pink-800',
            Beverages: 'bg-yellow-100 text-yellow-800',
        };
        return colors[cuisine] || 'bg-gray-100 text-gray-800';
    };

    return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getColors(cuisine)} ${className}`}>
            {cuisine}
        </span>
    );
};

export default CuisineTag;
