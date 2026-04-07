import { Loading } from '@/components';
import InnerMarketRow from '@/components/marketComponents/InnerMarketRow';
import MarketPanel from '@/components/marketComponents/MarketPanel';
import useGameDetailsHook from '@/hooks/useGameDetailsHook';
import { reactIcons } from '@/utils/icons';
import React from 'react';

const GameDetailsPage = () => {
  const {
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
  } = useGameDetailsHook();

  return (
    <>
      {isLoadingEventDetails && <Loading />}
      <div className="flex-1">
        <div className="w-full bg-[linear-gradient(180deg,#1e8067,#1e8067_48.4%,#2f3332)] px-4 py-3 flex items-center justify-between rounded-md">
          {/* Left Section */}
          {inplay ? (
            <button className="border border-white/40 text-white px-3 py-1 rounded-md text-sm">
              In-Play
            </button>
          ) : (
            <div></div>
          )}

          <button className="flex items-center gap-2 border border-blue-300 px-4 py-1.5 rounded-md text-white shadow-md">
            {reactIcons.TrendingUp}
            Trade Bet
          </button>

          {/* Right Section */}
          <button className="text-white">{reactIcons.funnel}</button>
        </div>
        <div className="bg-innerBg flex-1 h-fit rounded-[36px]">
          {/* <BackButton textcolor="text-white" />
        <MatchHeader eventName={eventName} startTime={startTime} /> */}
          <div className="space-y-0.5">
            {/* {!isDemoUser && (
            <Scorecard
              liveScoreUrl={liveScoreUrl}
              liveTvUrl={liveTvUrl}
              type="game"
              isLive={inplay || false}
            />
          )} */}
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
                <div className="bg-marketHead mb-1">
                  <div className="py-1 px-5 text-sm flex items-center justify-between rounded-[100px] border-b-[2px] ">
                    <div className="font-bold">Sessions</div>
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
                <div className="space-y-0.5">
                  {sessionMarkets.map((market, idx) => {
                    const runners = market.runners?.[0];
                    return (
                      <InnerMarketRow
                        key={idx}
                        marketCategory={'FANCY'}
                        marketData={market}
                        runnersData={runners ?? {}}
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
    </>
  );
};

export default GameDetailsPage;
