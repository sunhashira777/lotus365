import { Loading } from '@/components';
import InnerMarketRow from '@/components/marketComponents/InnerMarketRow';
import MarketPanel from '@/components/marketComponents/MarketPanel';
import MobOpenBets from '@/components/MobOpenBets';
import InnerHeading from '@/containers/Mobile/InnerHeading';
import { useFetchMyBetsData } from '@/hooks/useFetchMyBetsData';
import useGameDetailsHook from '@/hooks/useGameDetailsHook';
import { reactIcons } from '@/utils/icons';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import moment from 'moment';

const GameDetailsPage = () => {
  const {
    isLoadingEventDetails,
    mapMarketData,
    sessionMarkets,
    eventName,
    startTime,
    inplay,
    sessionMinBetAmount,
    sessionMaxBetAmount,
  } = useGameDetailsHook();

  const { eventId } = useParams();

  const [activeTab, setActiveTab] = useState(1);

  // 🔥 NEW STATE
  const [liveView, setLiveView] = useState(null);

  const { total } = useFetchMyBetsData({
    take: 1,
    eventId: eventId,
  });

  // ✅ AUTO OPEN TV WHEN INPLAY
  useEffect(() => {
    if (inplay) {
      setLiveView('score');
    } else {
      setLiveView(null);
    }
  }, [inplay]);

  return (
    <>
      {isLoadingEventDetails && <Loading />}

      <div className="flex-1">
        {/* ✅ DESKTOP HEADER */}
        <div className="hidden lg:flex flex-col bg-[#1E8067] text-white rounded-md">
          {/* TOP BAR */}
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex flex-col">
              <span className="font-semibold text-sm">{eventName}</span>
              <span className="text-xs opacity-80">
                {moment(startTime).format('DD MMM YYYY, hh:mm A')}
              </span>
            </div>

            {/* 🔥 ICONS */}
            <div className="flex items-center gap-4 text-lg">
              {/* TV */}
              <span
                onClick={() => inplay && setLiveView('tv')}
                className={`cursor-pointer ${
                  inplay ? 'text-white' : 'opacity-40 cursor-not-allowed'
                }`}
              >
                {reactIcons.tv}
              </span>

              {/* SCORE */}
              <span
                onClick={() => inplay && setLiveView('score')}
                className={`cursor-pointer ${
                  inplay ? 'text-white' : 'opacity-40 cursor-not-allowed'
                }`}
              >
                {reactIcons.TrendingUp}
              </span>

              {/* 🔥 LIVE BADGE */}
              {inplay && (
                <span className="ml-2 px-2 py-0.5 text-xs bg-red-500 rounded animate-pulse">
                  LIVE
                </span>
              )}
            </div>
          </div>

          {/* 🔥 LIVE VIEW AREA (AUTO OPEN) */}
          {inplay && liveView === 'tv' && (
            <iframe
              src={`https://e765432.diamondcricketid.com/dtv.php?id=${eventId}`}
              className="w-full"
              style={{ aspectRatio: '16/9', border: 'none' }}
              allow="autoplay; fullscreen"
            />
          )}

          {inplay && liveView === 'score' && (
            <div className="bg-black text-white text-center py-10">
              Live Score / Stats Coming Soon
            </div>
          )}
        </div>

        {/* ✅ MOBILE HEADER */}
        <div className="lg:hidden">
          <InnerHeading
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            openBetCount={total || 0}
          />
        </div>

        {/* ✅ MARKET */}
        {(activeTab === 1 || window.innerWidth >= 1024) && (
          <div className="bg-innerBg flex-1 h-fit rounded-[36px]">
            <div className="space-y-0.5">
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

              {/* SESSION */}
              {sessionMarkets.length > 0 && (
                <div className="mb-4 border shadow-lg border-primary-light bg-primary/10 rounded-lg">
                  <div className="bg-marketHead mb-1">
                    <div className="py-1 px-5 text-sm flex items-center justify-between border-b-[2px]">
                      <div className="font-bold">Sessions</div>

                      <div className="flex gap-2">
                        <span className="w-[55px] text-center font-semibold">
                          No
                        </span>
                        <span className="w-[55px] text-center font-semibold">
                          Yes
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
        )}

        {/* MOBILE OPEN BETS */}
        {activeTab === 2 && (
          <div className="lg:hidden">
            <MobOpenBets eventId={eventId} activeTabSlip={'openBets'} />
          </div>
        )}
      </div>
    </>
  );
};

export default GameDetailsPage;
