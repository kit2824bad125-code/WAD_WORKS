import React from 'react';
import { Star } from 'lucide-react';

interface RatingStarsProps {
  rating: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  showNumber?: boolean;
  reviewCount?: number;
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  max = 5,
  size = 'md',
  showNumber = false,
  reviewCount,
  interactive = false,
  onRatingChange,
}) => {
  const sizeClass = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-6 h-6',
  }[size];

  return (
    <div className="inline-flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: max }).map((_, i) => {
          const starValue = i + 1;
          const isFilled = rating >= starValue;
          const isHalf = !isFilled && rating >= starValue - 0.5;

          return (
            <button
              key={i}
              type="button"
              disabled={!interactive}
              onClick={() => interactive && onRatingChange?.(starValue)}
              className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'} focus:outline-none`}
            >
              <Star
                className={`${sizeClass} ${
                  isFilled
                    ? 'text-amber-400 fill-amber-400'
                    : isHalf
                    ? 'text-amber-400 fill-amber-400/50'
                    : 'text-slate-200 fill-slate-100'
                }`}
              />
            </button>
          );
        })}
      </div>

      {showNumber && (
        <span className="text-sm font-bold text-slate-900">
          {rating > 0 ? rating.toFixed(1) : 'New'}
        </span>
      )}

      {reviewCount !== undefined && (
        <span className="text-xs text-slate-500">
          ({reviewCount})
        </span>
      )}
    </div>
  );
};
