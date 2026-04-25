import { useGetCatalogueByEventIdQuery } from '@/api/catalogueApi';
import { getMarketCategories } from '@/helpers/request';
import {
  formatRunners,
  getOrderedMarkets,
} from '@/utils/marketFormaterHelpers';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export const marketTypes = [
  'match odds',
  'bookmaker',
  'mini bookmaker',
  'over/under',
  'set',
];
const useGameDetailsHook = () => {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const [activeCategory, setActiveCategory] = useState('All');
  const [pollingInterval, setPollingInterval] = useState(2000);
  const { data, isLoading: isLoadingEventDetails } =
    useGetCatalogueByEventIdQuery(
      { eventId: Number(eventId) },
      { pollingInterval },
    );
  const {
    startTime,
    inplay,
    eventName,
    markets = [],
    fancyMarkets = [],
    status,
  } = data?.catalogue ?? {};

  const {
    maxBetAmount,
    minBetAmount,
    sessionMaxBetAmount,
    sessionMinBetAmount,
  } = data?.betConfig ?? {};

  const fancyMarketsData = {
    ...(fancyMarkets.Normal ? { Normal: fancyMarkets.Normal } : {}),
    ...(fancyMarkets.wpmarket ? { wpmarket: fancyMarkets.wpmarket } : {}),
    ...Object.fromEntries(
      Object.entries(fancyMarkets).filter(
        ([key]) =>
          key?.toLowerCase() !== 'normal' && key?.toLowerCase() !== 'wpmarket',
      ),
    ),
  };

  // Market ordering
  const allMarkets = getOrderedMarkets(markets, marketTypes);
  const fancyTabs = getMarketCategories(fancyMarketsData);
  // NORMAL MARKETS
  const mapMarketData = useMemo(() => {
    return (
      allMarkets?.map((m) => {
        const min = m?.minBetAmount ?? minBetAmount;
        const max = m?.maxBetAmount ?? maxBetAmount;
        const bookmakerMin = m?.sessionMinBetAmount ?? sessionMinBetAmount;
        const bookmakerMax = m?.sessionMaxBetAmount ?? sessionMaxBetAmount;

        const isBookmaker = m.marketType?.toLowerCase() === 'bookmaker';

        return {
          eventId: m.eventId,
          marketId: m.marketId,
          marketName: m.marketName,
          marketType: m.marketType,
          marketStartTime: m.marketStartTime,
          marketStatus: m.status,
          runners: formatRunners(m),
          min: isBookmaker ? bookmakerMin : min,
          max: isBookmaker ? bookmakerMax : max,
        };
      }) || []
    );
  }, [
    allMarkets,
    minBetAmount,
    maxBetAmount,
    sessionMinBetAmount,
    sessionMaxBetAmount,
  ]);
  const fancyMarketData = useMemo(() => {
    return (
      Object.entries(fancyMarkets)
        .filter(
          ([marketName]) =>
            activeCategory === 'All' || marketName === activeCategory,
        )
        .map(([marketName, marketItems]) => ({
          marketName,
          markets: [...marketItems]
            .sort((a, b) => (a.sortPriority ?? 0) - (b.sortPriority ?? 0))
            .map((m) => ({
              ...m,
              runners: formatRunners(m),
            })),
        })) || []
    );
  }, [fancyMarkets, activeCategory]);
  const sessionMarkets = useMemo(() => {
    const fancyMarkets = data?.catalogue?.fancyMarkets;

    return Object.values(fancyMarkets ?? {})
      .flat()
      .sort((a, b) => (a.sortPriority ?? 0) - (b.sortPriority ?? 0))
      .map((m) => ({
        ...m,
        runners: formatRunners(m),
      }));
  }, [data?.catalogue?.fancyMarkets]);

  useEffect(() => {
    setPollingInterval(inplay ? 1000 : 2000);
  }, [inplay]);
  const liveScoreUrl = null;
  const liveTvUrl = null;

  return {
    isLoadingEventDetails,
    liveScoreUrl,
    liveTvUrl,
    startTime,
    eventName,
    sessionMinBetAmount,
    sessionMaxBetAmount,
    minBetAmount,
    maxBetAmount,
    mapMarketData,
    fancyMarketData,
    sessionMarkets,
    inplay,
    fancyTabs,
    activeCategory,
    setActiveCategory,
  };
};

export default useGameDetailsHook;
