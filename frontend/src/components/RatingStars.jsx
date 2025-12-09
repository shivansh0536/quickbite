import { Star, StarHalf } from 'lucide-react';

const RatingStars = ({ rating, size = 16, className = "" }) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
        <div className={`flex items-center ${className}`}>
            {[...Array(fullStars)].map((_, i) => (
                <Star key={`full-${i}`} size={size} className="text-yellow-400 fill-current" />
            ))}
            {hasHalfStar && (
                <div className="relative">
                    <Star size={size} className="text-gray-300" />
                    <div className="absolute top-0 left-0 overflow-hidden" style={{ width: '50%' }}>
                        <Star size={size} className="text-yellow-400 fill-current" />
                    </div>
                </div>
            )}
            {[...Array(emptyStars)].map((_, i) => (
                <Star key={`empty-${i}`} size={size} className="text-gray-300" />
            ))}
        </div>
    );
};

export default RatingStars;
