import { useFetchMyBetsData } from '@/hooks/useFetchMyBetsData';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';

const AllGroupedBets = ({ eventId, setOpenBetCount, type }) => {
  const [activeTab, setActiveTab] = useState(1);

  const { betsData, loading } = useFetchMyBetsData({
    take: 100,
    eventId,
    type,
  });

  // ✅ FIXED FILTERS
  const matchOddsData =
    betsData?.filter(
      (item) =>
        item?.marketType !== 'BOOKMAKER' && item?.marketType !== 'FANCY',
    ) || [];

  const bookmakerData =
    betsData?.filter((item) => item?.marketType === 'BOOKMAKER') || [];

  const fancyData =
    betsData?.filter((item) => item?.marketType === 'FANCY') || [];

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
      <div className="w-full my-4 text-center text-sm text-gray-500 font-poppins">
        Loading bets...
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-[5px]">
        <input type="checkbox" />
        <label className="text-14">Average Odds</label>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-3">
        <div
          onClick={() => setActiveTab(1)}
          className={`text-14 flex-center py-2 ${
            activeTab === 1 ? 'bg-[#f4d821]' : 'bg-[#1E8067] text-white'
          }`}
        >
          Matched
        </div>

        <div
          onClick={() => setActiveTab(2)}
          className={`text-14 flex-center py-2 ${
            activeTab === 2 ? 'bg-[#f4d821]' : 'bg-[#1E8067] text-white'
          }`}
        >
          Bookmaker
        </div>

        <div
          onClick={() => setActiveTab(3)}
          className={`text-14 flex-center py-2 ${
            activeTab === 3 ? 'bg-[#f4d821]' : 'bg-[#1E8067] text-white'
          }`}
        >
          Fancy
        </div>
      </div>

      {/* Table */}
      <div className="px-2">
        <div className="w-full my-2 pb-4 overflow-x-auto">
          <table className="w-full min-w-[700px] table-auto text-14">
            <thead>
              <tr className="text-left font-bold">
                <th>Date/Time</th>
                <th>Selection</th>
                <th>Odds</th>
                <th>Stake</th>
                <th>Profit</th>
                <th>Liability</th>
              </tr>
            </thead>

            <tbody>
              {filteredBets?.length > 0 ? (
                filteredBets.map((item, index) => (
                  <tr
                    key={item?.id || index}
                    className={`${
                      item?.betOn?.toLowerCase() === 'back'
                        ? 'bg-[#A7D8FD]'
                        : 'bg-[#F9C9D4]'
                    } text-12 border-t`}
                  >
                    {/* ✅ FIXED */}
                    <td>
                      {item?.placedAt
                        ? dayjs(item.placedAt).format('DD/MM/YY hh:mm')
                        : 'N/A'}
                    </td>

                    <td>{item?.selection || 'N/A'}</td>

                    <td>{item?.odds || '-'}</td>

                    <td>{item?.amount || '-'}</td>

                    <td>{item?.potentialProfit || '-'}</td>

                    <td>{item?.liability || '-'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-2 bg-[#DEE2E6]">
                    No bets available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

AllGroupedBets.propTypes = {
  eventId: PropTypes.string,
  setOpenBetCount: PropTypes.func,
  type: PropTypes.string,
};

export default AllGroupedBets;
