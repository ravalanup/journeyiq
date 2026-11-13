import React, { useState } from 'react';
import { Trip, GuestFeedback } from '../types';
import { Star, Heart, CheckCircle2, Sparkles, Send, ArrowLeft } from 'lucide-react';

interface FeedbackPageProps {
  trip: Trip;
  onSubmitFeedback: (feedback: GuestFeedback) => void;
  onNavigateHome: () => void;
}

export const FeedbackPage: React.FC<FeedbackPageProps> = ({
  trip,
  onSubmitFeedback,
  onNavigateHome,
}) => {
  const [rating, setRating] = useState(5);
  const [selectedTags, setSelectedTags] = useState<string[]>([
    'Saved tons of line time',
    'Protected our Cinderella reservation',
    'Loved the real-time adaptation',
  ]);
  const [comment, setComment] = useState(
    'The automatic swap when Gemstone Mine closed was unbelievable. We never felt rushed and the kids stayed happy all day!'
  );
  const [submitted, setSubmitted] = useState(false);

  const availableTags = [
    'Saved tons of line time',
    'Protected our Cinderella reservation',
    'Loved the real-time adaptation',
    'Kids stayed energized',
    'Zero cross-park backtracking',
    'Clear and easy explanations',
  ];

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitFeedback({
      id: `fb-${Date.now()}`,
      tripId: trip.id,
      guestId: trip.guestId,
      overallRating: rating,
      paceSatisfaction: 5,
      diningSatisfaction: 5,
      adaptationSatisfaction: 5,
      tags: selectedTags,
      freeformComment: comment,
      timestamp: new Date().toISOString(),
    });
    setSubmitted(true);
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-white rounded-[32px] p-8 shadow-xl border border-slate-100 text-center space-y-3">
        <div className="w-14 h-14 rounded-3xl bg-[#0B2147] text-[#FFD700] flex items-center justify-center font-bold mx-auto shadow-md">
          <Heart className="w-7 h-7 text-[#FFD700]" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#0B2147] font-serif-magic">
          How was your JourneyIQ Experience?
        </h1>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Your feedback powers the continuous learning loop of our experience recommendation models.
        </p>
      </div>

      {submitted ? (
        <div className="bg-white rounded-[32px] p-10 shadow-xl border border-slate-100 text-center space-y-5 animate-in zoom-in-95">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-[#0B2147]">Thank you for your feedback!</h2>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Your telemetry has been recorded to optimize tomorrow&apos;s park capacity routing and personalized family recommendations.
          </p>
          <button
            onClick={onNavigateHome}
            className="px-6 py-3 bg-[#0B2147] text-[#FFD700] font-bold text-xs rounded-2xl hover:bg-[#0D2A5B] transition-colors"
          >
            Return to JourneyIQ Overview
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-[32px] p-8 shadow-xl border border-slate-100 space-y-6">
          {/* Star Rating */}
          <div className="text-center space-y-2">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
              Overall Journey Rating
            </label>
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-1.5 focus:outline-none transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= rating ? 'fill-[#FFD700] text-[#FFD700]' : 'text-slate-200'
                    }`}
                  />
                </button>
              ))}
            </div>
            <span className="text-xs font-bold text-[#0B2147]">
              {rating === 5
                ? '5/5 Magical & Flawlessly Optimized'
                : rating === 4
                ? '4/5 Great Experience'
                : `${rating}/5 Stars`}
            </span>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
              What stood out today?
            </label>
            <div className="flex flex-wrap gap-2">
              {availableTags.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                      isSelected
                        ? 'bg-[#0B2147] text-[#FFD700] border-[#0B2147]'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '}
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Comment */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
              Guest Story &amp; Details
            </label>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 focus:outline-none focus:border-[#00D1FF]"
              placeholder="Tell us what made your day special or what could be improved..."
            ></textarea>
          </div>

          <div className="pt-2 flex items-center justify-end">
            <button
              type="submit"
              className="px-6 py-3 bg-[#0B2147] text-[#FFD700] font-bold text-xs rounded-2xl hover:bg-[#0D2A5B] transition-colors flex items-center gap-2 shadow-md"
            >
              <Send className="w-3.5 h-3.5" /> Submit Feedback
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
