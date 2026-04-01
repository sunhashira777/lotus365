import { useGetCatalogueByEventIdQuery } from '@/apis/catalogueApi';
import { formatRunners, getOrderedMarkets } from '@/helpers';
import { useIsDemoUser } from '@/hooks/useIsDemoUser';
import { useGetScorecardQuery } from '@/store/api/eventsApi';
import { FancyMarket, FancyMarketItem } from '@/Types';

import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export const marketTypes = ['match odds', 'bookmaker', 'mini bookmaker', 'over/under', 'set'];
const useCatalogData = (sportName?: string) => {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const [pollingInterval, setPollingInterval] = useState(2000);
  const [activeCatTab, setActiveCatTab] = useState('Fancy');
  const [activeTab, setActiveTab] = useState('All');
  const [showLiveScore, setShowLiveScore] = useState(true);
  const isDemoUser = useIsDemoUser();
  const { data: liveTvAndscore } = useGetScorecardQuery(Number(eventId), {
    skip: !eventId || isDemoUser,
  });
  const { data, isLoading: isLoadingEventDetails } = useGetCatalogueByEventIdQuery(
    { eventId: Number(eventId) },
    { pollingInterval }
  );

  // Catalogue fields
  const {
    startTime,
    inplay,
    eventName,
    markets = [],
    fancyMarkets = [],
    status,
  } = data?.catalogue ?? {};

  const { maxBetAmount, minBetAmount, sessionMaxBetAmount, sessionMinBetAmount } =
    data?.betConfig ?? {};

  // Market ordering
  const allMarkets = getOrderedMarkets(markets, marketTypes);

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
  }, [allMarkets, minBetAmount, maxBetAmount, sessionMinBetAmount, sessionMaxBetAmount]);

  // FANCY MARKETS
  const fancyMarketData = useMemo(() => {
    return (
      Object.entries(fancyMarkets)
        .filter(([marketName]) => activeTab === 'All' || marketName === activeTab)
        .map(([marketName, marketItems]) => ({
          marketName,
          markets: [...(marketItems as FancyMarketItem[])]
            .sort((a, b) => (a.sortPriority ?? 0) - (b.sortPriority ?? 0))
            .map((m) => ({
              ...m,
              runners: formatRunners(m),
            })),
        })) || []
    );
  }, [fancyMarkets, activeTab]);
  const sessionMarkets = useMemo(() => {
    const fancyMarkets = data?.catalogue?.fancyMarkets as Record<string, FancyMarket[]> | undefined;

    return Object.values(fancyMarkets ?? {})
      .flat()
      .sort((a: FancyMarket, b: FancyMarket) => (a.sortPriority ?? 0) - (b.sortPriority ?? 0))
      .map((m: FancyMarket) => ({
        ...m,
        runners: formatRunners(m),
      }));
  }, [data]);

  useEffect(() => {
    setActiveTab('All');
  }, [activeCatTab]);

  useEffect(() => {
    setPollingInterval(inplay ? 1000 : 2000);
  }, [inplay]);

  const liveScoreUrl = liveTvAndscore?.scorecardUrl;
  const liveTvUrl = liveTvAndscore?.liveTvUrl;

  useEffect(() => {
    if (status?.toLowerCase() === 'closed') {
      setTimeout(() => {
        navigate('/bet-history');
      }, 1000);
    }
  }, [status]);
  console.log('syat=sss', data?.catalogue);

  return {
    isLoadingEventDetails,
    activeCatTab,
    setActiveCatTab,
    activeTab,
    setActiveTab,
    showLiveScore,
    setShowLiveScore,

    // data
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
  };
};

export default useCatalogData;
