import React from 'react';
import MatchHeader from './components/MatchHeader';
import BettingContainer from '@/components/BettingContainer';
import BackButton from '@/components/common/BackButton';
import RulesFooter from '@/components/common/RulesFooter';
import useCatalogData from './Hooks/useCatalogData';
import MarketPanel from './components/MarketPanel';
import InnerMarketRow from './components/InnerMarketRow';
import { Runner } from '@/types/market';
import { useIsDemoUser } from '@/hooks/redux';
import Scorecard from './components/Scorecard';
type Props = {
  sportName?: string;
};

function GameDetails({ sportName }: Props) {
  const isDemoUser = useIsDemoUser();
  const {
    isLoadingEventDetails,

    activeCatTab,
    setActiveCatTab,
    activeTab,
    setActiveTab,
    showLiveScore,
    setShowLiveScore,
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
  } = useCatalogData(sportName);
  return (
    <div className="flex-1 flex flex-col lg:p-4 max-sm:pb-[80px]">
      <div className="bg-sports-bg-gradient flex flex-1  xl:pl-2 pt-3 p-1 rounded-[15px] lg:border border-white text-white">
        <div className="flex-1">
          <div className="bg-innerBg flex-1 h-fit rounded-[36px]">
            <BackButton textcolor="text-white" />
            <MatchHeader eventName={eventName} startTime={startTime} />
            <div className="space-y-1 sm:space-y-2">
              {!isDemoUser && (
                <Scorecard
                  liveScoreUrl={liveScoreUrl}
                  liveTvUrl={liveTvUrl}
                  type="game"
                  isLive={inplay || false}
                />
              )}
              {/* Normal Market */}
              {mapMarketData?.map((market, idx) => (
                <MarketPanel
                  key={idx}
                  marketName={market?.marketName || ''}
                  marketData={market}
                  runnersData={market?.runners || []}
                  variation="primary"
                  min={market.min}
                  max={market.max}
                  marketCategory={'NORMAL'}
                />
              ))}
              {/* {fancyMarketData?.map(({ marketName, markets }, idx) => {
    

                return ( */}
              {sessionMarkets.length > 0 && (
                <div className="mb-4 border md:border-0 shadow-lg border-primary-light bg-primary/10 rounded-lg">
                  <div className="bg-market-gradient rounded-[16px] mb-1">
                    <div className="flex justify-between items-center py-2 border border-white border-b-0 rounded-[20px] px-2 bg-black">
                      <div className="flex gap-2 items-center">
                        <div className="p-2 rounded-full bg-[#7F7F80]">
                          {/* <Icons.pin className="size-3" /> */}
                        </div>
                        <div className="text-xs font-black uppercase">
                          Session{' '}
                        </div>
                      </div>
                      <div className="px-2 text-xs font-bold space-x-2"></div>
                    </div>
                    <div className="py-1 px-5 text-sm flex items-center justify-between rounded-[100px] border-b-[2px] ">
                      <div>Market</div>
                      <div className="flex justify-center items-center gap-2 w-max md:w-full md:max-w-[415px]">
                        <span className="w-[55px] xs:w-[70px] text-center">
                          No
                        </span>
                        <span className="w-[55px] xs:w-[70px] text-center">
                          yes
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1 sm:space-y-2">
                    {sessionMarkets.map((market, idx) => {
                      const runners = market.runners?.[0];
                      return (
                        <InnerMarketRow
                          key={idx}
                          marketCategory={'FANCY'}
                          marketData={market}
                          runnersData={runners ?? ({} as Runner)}
                          reverseOddsOrder
                          min={sessionMinBetAmount}
                          max={sessionMaxBetAmount}
                        />
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* <BettingContainer liveTvUrl={liveTvUrl} isLive={(inplay && !isDemoUser) || false} /> */}
      </div>
      {/* <RulesFooter /> */}
    </div>
  );
}

export default GameDetails;
