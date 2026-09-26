import { useEffect, useState } from 'react';
import { HiEye, HiHeart } from 'react-icons/hi2';
import { supabase } from '../lib/supabaseClient';

let pageVisitRequest;

function recordPageVisit() {
  if (!pageVisitRequest) {
    pageVisitRequest = supabase.rpc('record_portfolio_visit');
  }
  return pageVisitRequest;
}

export default function PortfolioEngagement() {
  const [visits, setVisits] = useState(null);
  const [likes, setLikes] = useState(null);
  const [likePending, setLikePending] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let active = true;

    if (!supabase) {
      setHasError(true);
      return () => {
        active = false;
      };
    }

    const loadStats = async () => {
      try {
        const [visitResult, statsResult] = await Promise.all([
          recordPageVisit(),
          supabase.from('portfolio_stats').select('like_count').eq('id', true).single(),
        ]);

        if (!active) return;

        if (visitResult.error) {
          console.error('[PortfolioEngagement] visit count failed:', visitResult.error.message);
          setHasError(true);
        } else {
          setVisits(Number(visitResult.data));
        }

        if (statsResult.error) {
          console.error('[PortfolioEngagement] likes count failed:', statsResult.error.message);
          setHasError(true);
        } else {
          setLikes(Number(statsResult.data.like_count));
        }
      } catch (error) {
        console.error('[PortfolioEngagement] stats request failed:', error);
        if (active) setHasError(true);
      }
    };

    loadStats();

    return () => {
      active = false;
    };
  }, []);

  const handleLike = async () => {
    if (!supabase || likePending) return;

    setLikePending(true);
    try {
      const { data, error } = await supabase.rpc('record_portfolio_like');
      if (error) {
        console.error('[PortfolioEngagement] like failed:', error.message);
        setHasError(true);
        return;
      }
      setLikes(Number(data));
    } catch (error) {
      console.error('[PortfolioEngagement] like request failed:', error);
      setHasError(true);
    } finally {
      setLikePending(false);
    }
  };

  return (
    <section
      aria-label="Portfolio engagement"
      className="border-y border-neutral-200/80 bg-stone-50/80 dark:border-white/[0.06] dark:bg-ink-900/30"
    >
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-4 px-4 py-6 sm:px-6 lg:justify-end lg:px-8">
        <div className="inline-flex items-center gap-2 text-sm text-neutral-600 dark:text-glow-100/65">
          <HiEye className="size-5 text-primary-500" aria-hidden="true" />
          <span>Visits</span>
          <span className="font-semibold tabular-nums text-neutral-900 dark:text-white">
            {visits?.toLocaleString() ?? '—'}
          </span>
        </div>

        <button
          type="button"
          onClick={handleLike}
          disabled={!supabase || likePending}
          aria-label={`Like this portfolio. ${likes?.toLocaleString() ?? 'No'} likes`}
          className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-50 disabled:cursor-wait disabled:opacity-60 dark:border-rose-400/20 dark:bg-white/[0.04] dark:text-rose-300 dark:hover:bg-rose-400/10"
        >
          <HiHeart className="size-5" aria-hidden="true" />
          <span>Like</span>
          <span className="tabular-nums">{likes?.toLocaleString() ?? '—'}</span>
        </button>

        {hasError && (
          <span role="status" className="w-full text-center text-xs text-amber-700 dark:text-amber-300">
            Engagement counts are temporarily unavailable.
          </span>
        )}
      </div>
    </section>
  );
}
