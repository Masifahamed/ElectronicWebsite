import React from 'react'
import { useState } from 'react';
import { Star } from 'lucide-react';
const UserReviews = () => {
    const [isWritingReview, setIsWritingReview] = useState(false);
    // Add these state variables to your component
    const [userRating, setUserRating] = useState(0);
    const [userReview, setUserReview] = useState('');
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);
    const [productReviews, setProductReviews] = useState([]);
    // Function to update product rating (you need to implement this based on your data structure)
    const updateProductRating = (productId, newRating, reviewCount) => {
      // Update your products array with new rating and review count
      // This depends on how you're managing your products data
      console.log(`Updating product ${productId} with rating ${newRating} and ${reviewCount} reviews`);
    };
    // Handle review submission
    const handleSubmitReview = async () => {
        if (!userRating || !userReview.trim()) return;

        setIsSubmittingReview(true);

        try {
            // Get current user from localStorage
            const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

            const newReview = {
                id: Date.now().toString(),
                productId: selectedProduct._id,
                userName: currentUser.name || 'Anonymous User',
                userEmail: currentUser.email || '',
                rating: userRating,
                comment: userReview.trim(),
                date: new Date().toISOString(),
                verified: false
            };

            const updatedReviews = [...productReviews, newReview];
            setProductReviews(updatedReviews);

            // Save to localStorage
            localStorage.setItem(`productReviews_${selectedProduct._id}`, JSON.stringify(updatedReviews));

            // Update product rating (average)
            const totalRating = updatedReviews.reduce((sum, review) => sum + review.rating, 0);
            const averageRating = (totalRating / updatedReviews.length).toFixed(1);

            // Update product in your products array (you'll need to implement this)
            updateProductRating(selectedProduct.id, parseFloat(averageRating), updatedReviews.length);

            // Reset form
            setUserRating(0);
            setUserReview('');
            setIsWritingReview(false);

        } catch (error) {
            console.error('Error submitting review:', error);
        } finally {
            setIsSubmittingReview(false);
        }
    };
    return (
        <>
            {/* Rating Summary */}
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                className={`w-5 h-5 ${i < Math.floor(selectedProduct.rating)
                                    ? 'text-yellow-400 fill-yellow-400'
                                    : 'text-gray-300'
                                    }`}
                            />
                        ))}
                    </div>
                    <span className="text-lg text-gray-600 ml-3">
                        {selectedProduct.rating} ({selectedProduct.reviews || 0} reviews)
                    </span>
                </div>
                <button
                    onClick={() => setIsWritingReview(!isWritingReview)}
                    className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                >
                    {isWritingReview ? 'Cancel Review' : 'Write a Review'}
                </button>
            </div>

            {/* Write Review Section */}
            {isWritingReview && (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h3 className="font-semibold text-gray-800 mb-3">Write Your Review</h3>
                    <div className="space-y-4">
                        {/* Star Rating Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Your Rating
                            </label>
                            <div className="flex space-x-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setUserRating(star)}
                                        className="focus:outline-none"
                                    >
                                        <Star
                                            className={`w-8 h-8 ${star <= userRating
                                                ? 'text-yellow-400 fill-yellow-400'
                                                : 'text-gray-300'
                                                } hover:text-yellow-500 transition-colors`}
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Review Text */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Your Review
                            </label>
                            <textarea
                                value={userReview}
                                onChange={(e) => setUserReview(e.target.value)}
                                placeholder="Share your experience with this product..."
                                rows="4"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                            />
                        </div>

                        {/* Submit Review Button */}
                        <button
                            onClick={handleSubmitReview}
                            disabled={!userRating || !userReview.trim() || isSubmittingReview}
                            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
                        </button>
                    </div>
                </div>
            )}

            {/* Existing Reviews Section */}
            <div className="border-t border-gray-200 pt-4">
                <h3 className="font-semibold text-gray-800 mb-4">
                    Customer Reviews ({productReviews.length})
                </h3>

                {productReviews.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">
                        No reviews yet. Be the first to review this product!
                    </p>
                ) : (
                    <div className="space-y-4 max-h-60 overflow-y-auto">
                        {productReviews.map((review, index) => (
                            <div key={index} className="border-b border-gray-100 pb-4 last:border-b-0">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center">
                                        <div className="flex">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`w-4 h-4 ${i < review.rating
                                                        ? 'text-yellow-400 fill-yellow-400'
                                                        : 'text-gray-300'
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-sm text-gray-600 ml-2">
                                            by {review.userName}
                                        </span>
                                    </div>
                                    <span className="text-xs text-gray-500">
                                        {new Date(review.date).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="text-gray-700 text-sm">{review.comment}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    )
}

export default UserReviews