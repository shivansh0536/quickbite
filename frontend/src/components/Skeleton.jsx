const Skeleton = ({ className = '', variant = 'rectangular', animation = 'pulse' }) => {
    const baseClasses = 'bg-gray-200';
    const animationClasses = animation === 'pulse' ? 'animate-pulse' : '';

    const variantClasses = {
        rectangular: 'rounded',
        circular: 'rounded-full',
        text: 'rounded h-4'
    };

    return (
        <div
            className={`${baseClasses} ${animationClasses} ${variantClasses[variant]} ${className}`}
        />
    );
};

export const RestaurantCardSkeleton = () => {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <Skeleton className="w-full h-48" />
            <div className="p-4 space-y-3">
                <Skeleton className="h-6 w-3/4" variant="text" />
                <Skeleton className="h-4 w-1/2" variant="text" />
                <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-20" variant="text" />
                    <Skeleton className="h-4 w-16" variant="text" />
                </div>
            </div>
        </div>
    );
};

export const MenuItemSkeleton = () => {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden flex">
            <Skeleton className="w-32 h-32 flex-shrink-0" />
            <div className="p-4 flex-grow space-y-2">
                <Skeleton className="h-5 w-3/4" variant="text" />
                <Skeleton className="h-4 w-full" variant="text" />
                <Skeleton className="h-4 w-2/3" variant="text" />
                <div className="flex items-center justify-between mt-2">
                    <Skeleton className="h-6 w-16" variant="text" />
                    <Skeleton className="h-8 w-24" />
                </div>
            </div>
        </div>
    );
};

export const OrderCardSkeleton = () => {
    return (
        <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
            <div className="flex justify-between items-start">
                <div className="space-y-2 flex-grow">
                    <Skeleton className="h-6 w-48" variant="text" />
                    <Skeleton className="h-4 w-32" variant="text" />
                </div>
                <Skeleton className="h-8 w-24" />
            </div>
            <div className="border-t pt-4 space-y-2">
                <Skeleton className="h-4 w-full" variant="text" />
                <Skeleton className="h-4 w-3/4" variant="text" />
            </div>
            <div className="flex justify-between items-center pt-2">
                <Skeleton className="h-6 w-24" variant="text" />
                <Skeleton className="h-10 w-32" />
            </div>
        </div>
    );
};

export default Skeleton;
