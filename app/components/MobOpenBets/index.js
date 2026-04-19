import { useFetchMyBetsData } from '@/hooks/useFetchMyBetsData';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';

const MobOpenBets = ({ eventId, setOpenBetCount, activeTabSlip }) => {
  const [activeTab, setActiveTab] = useState(1);

  const { betsData, loading } = useFetchMyBetsData({
    take: 100,
    eventId,
    activeTabSlip,
  });

  const matchOddsData =
    betsData?.filter(
      (item) =>
        item?.marketName !== 'bookmaker' && item?.marketName !== 'session',
    ) || [];

  const bookmakerData =
    betsData?.filter((item) => item?.marketName === 'bookmaker') || [];

  const fancyData =
    betsData?.filter((item) => item?.marketName === 'session') || [];

  const filteredBets =
    activeTab === 1
      ? matchOddsData
      : activeTab === 2
      ? bookmakerData
      : fancyData;

  useEffect(() => {
    setOpenBetCount && setOpenBetCount(betsData?.length || 0);
  }, [betsData]);

  if (loading) {
    return (
      <div className="w-full my-4 text-center text-sm text-gray-500">
        Loading bets...
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* 🔥 TOP FILTER */}
      <div className="flex items-center gap-2 px-3 py-2 border-b">
        <input type="checkbox" />
        <span className="text-sm">Average Odds</span>
      </div>

      {/* 🔥 TABS */}
      <div className="grid grid-cols-3 text-sm font-semibold">
        {['Matched', 'Bookmaker', 'Fancy'].map((tab, i) => (
          <div
            key={i}
            onClick={() => setActiveTab(i + 1)}
            className={`text-center py-2 cursor-pointer transition ${
              activeTab === i + 1
                ? 'bg-yellow-400 text-black'
                : 'bg-[#1E8067] text-white'
            }`}
          >
            {tab}
          </div>
        ))}
      </div>

      {/* 🔥 TABLE HEADER */}
      <div className="grid grid-cols-[1.4fr_1fr_0.8fr_0.8fr] px-3 py-2 text-xs font-bold bg-gray-100 border-b">
        <span>Date</span>
        <span>Selection</span>
        <span className="text-center">Odds</span>
        <span className="text-center">Stake</span>
      </div>

      {/* 🔥 BET LIST */}
      <div className="max-h-[300px] overflow-y-auto">
        {filteredBets?.length > 0 ? (
          filteredBets.map((item, index) => {
            const isBack = item?.betOn?.toLowerCase() === 'back';

            return (
              <div
                key={index}
                className={`grid grid-cols-[1.4fr_1fr_0.8fr_0.8fr] px-3 py-2 text-xs border-b ${
                  isBack ? 'bg-blue-200' : 'bg-pink-200'
                }`}
              >
                <span className="truncate">
                  {dayjs(item?.created_at).format('DD/MM HH:mm')}
                </span>

                <span className="truncate" title={item?.selection}>
                  {item?.selection}
                </span>

                <span className="text-center font-semibold">{item?.odds}</span>

                <span className="text-center font-semibold">
                  ₹{item?.amount}
                </span>
              </div>
            );
          })
        ) : (
          <div className="text-center py-4 text-sm text-gray-500">
            No bets available
          </div>
        )}
      </div>
    </div>
  );
};

MobOpenBets.propTypes = {
  eventId: PropTypes.string,
  setOpenBetCount: PropTypes.func,
  activeTabSlip: PropTypes.string,
};

export default MobOpenBets;
