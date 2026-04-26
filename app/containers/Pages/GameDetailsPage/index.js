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
import 'swiper/css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
const GameDetailsPage = () => {
  const ALL_TABS = [
    'Fancy',
    'Premium Fancy',
    'Line Markets',
    'Session Markets',
    'Over Session Market',
    'Ball By Ball',
    'Fall Of Wicket',
    'Other Markets',
    'Total Advance',
    'Meter Markets',
    'Khado Markets',
    'Odd Event Markets',
  ];
  const {
    isLoadingEventDetails,
    mapMarketData,
    sessionMarkets,
    eventName,
    startTime,
    inplay,
    sessionMinBetAmount,
    sessionMaxBetAmount,
    fancyTabs,
    fancyMarketData,
    activeCategory,
    setActiveCategory,
  } = useGameDetailsHook();

  const { eventId } = useParams();

  const [activeTab, setActiveTab] = useState(1);

  // 🔥 NEW STATE
  const [liveView, setLiveView] = useState(null);

  const { total } = useFetchMyBetsData({
    take: 1,
    eventId: eventId,
  });
  const getFilteredMarkets = () => {
    if (!fancyMarketData?.length) return [];

    return fancyMarketData.filter((item) => {
      const name = item?.marketName?.toLowerCase() || '';

      switch (activeCategory) {
        case 'Fancy':
          return true;

        case 'Premium Fancy':
          return name.includes('premium');

        case 'Line Markets':
          return name.includes('line');

        case 'Session Markets':
          return name.includes('normal') || name.includes('session');

        case 'Over Session Market':
          return name.includes('over');

        case 'Ball By Ball':
          return name.includes('ball');

        case 'Fall Of Wicket':
          return name.includes('wicket');

        case 'Total Advance':
          return name.includes('total');

        case 'Meter Markets':
          return name.includes('meter');

        case 'Khado Markets':
          return name.includes('khado');

        case 'Odd Event Markets':
          return name.includes('odd');

        case 'Other Markets':
          return true;

        default:
          return true;
      }
    });
  };
  console.log('ACTIVE TAB:', activeCategory);
  console.log('FANCY DATA:', fancyMarketData);
  // ✅ AUTO OPEN TV WHEN INPLAY
  useEffect(() => {
    if (inplay) {
      setLiveView('score');
    } else {
      setLiveView(null);
    }
  }, [inplay]);
  const banners = [
    '/images/game/slide1.webp',
    '/images/game/slide2.jpeg',
    '/images/game/slide3.webp',
  ];
  return (
    <>
      {isLoadingEventDetails && <Loading />}
      <div className="w-full rounded-xl overflow-hidden">
        <Swiper
          modules={[Autoplay]}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          loop={true}
          slidesPerView={1}
        >
          {banners.map((img, index) => (
            <SwiperSlide key={index}>
              <img
                src={img}
                alt={`banner-${index}`}
                className="w-full h-full object-cover"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
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
              <div className="w-full overflow-x-auto bg-primary-1500 border-b">
                <div className="flex min-w-max">
                  {ALL_TABS.map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveCategory(tab)}
                      className={`px-4 py-2 text-xs whitespace-nowrap 
        border-r border-white/10 transition-all flex-shrink-0
        ${
          activeCategory === tab
            ? 'bg-primary-1400 text-black font-semibold'
            : 'bg-primary-1500 text-white'
        }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>
              {/* SESSION */}
              {getFilteredMarkets().length > 0 ? (
                getFilteredMarkets().map(({ marketName, markets }, idx) => (
                  <div
                    className="mb-4 border shadow-lg border-primary-light bg-primary/10 rounded-lg"
                    key={idx}
                  >
                    <div className="bg-marketHead mb-1">
                      <div className="py-1 px-5 text-sm flex items-center justify-between border-b-[2px]">
                        <div className="font-bold">{marketName}</div>

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
                      {markets.map((market, idx) => {
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
                ))
              ) : (
                <div className="text-center py-5 text-gray-400">
                  No Data Available
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
