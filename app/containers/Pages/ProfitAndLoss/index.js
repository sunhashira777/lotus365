/* eslint-disable */
import GradientHeading from '@/components/GradientHeading';
import Pagination from '@/containers/Pagination';

import { getAuthData, isLoggedIn } from '@/utils/apiHandlers';
import { formatDate, formatNumber } from '@/utils/marketFormaterHelpers';
import moment from 'moment';
import React, { useCallback, useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useSelector } from 'react-redux';

function ProfitAndLoss() {
  const [activeTab, setActiveTab] = useState(null);
  const [showEvents, setShowEvents] = useState(false);
  const [profitLoss, setProfitLossData] = useState([]);
  const User = useSelector((state) => state?.user?.profile);
  const [profitData, setProfitData] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const take = 15;
  const handleTabClick = (id) => {
    setActiveTab(id);
    setShowEvents(true);
  };
  const [pagination, setPagination] = useState({
    totalCount: 0,
  });

  let totalProfitLoss = 0;

  const tabberMenu = [
    { id: 'Cricket', title: 'Cricket', earning: '0.00' },
    { id: 'Soccer', title: 'Football', earning: '0.00' },
    { id: 'Tennis', title: 'Tennis', earning: '0.00' },
  ];

  // =========================
  // LIST API (UNCHANGED)
  // =========================
  useEffect(() => {
    getProfitLoss(page);
  }, [activeTab, page, take, startDate, endDate, User]);

  const getProfitLoss = async (page) => {
    const islogin = isLoggedIn();
    if (!islogin) return;

    try {
      const url = `/reports/event/profitloss?limit=${take}&offset=${
        (page - 1) * take
      }&gameType=SPORTS&sport=${
        activeTab === 'Cricket'
          ? 'Cricket'
          : activeTab === 'Soccer'
          ? 'Soccer'
          : activeTab === 'Tennis'
          ? 'Tennis'
          : 'Cricket'
      }`;

      const dateFilter =
        startDate && endDate
          ? `&startDate=${moment(startDate).format(
              'YYYY-MM-DD',
            )}&endDate=${moment(endDate).add(1, 'day').format('YYYY-MM-DD')}`
          : '';

      const response = await getAuthData(url + dateFilter);

      if (response?.status === 200) {
        // ✅ FIXED LINE
        const data = response?.data?.eventProfitLoss || [];
        setTotal(response?.data?.pagination?.totalCount || 0);
        const formattedData = data.map((entry) => {
          const profit = Number(entry.totalProfitLoss || 0);

          return {
            ...entry,
            type: profit >= 0 ? 'profit' : 'loss',
            amount: Math.abs(profit),
            createdAt: entry.lastBetTime,
          };
        });

        setProfitLossData(formattedData);

        setPagination({
          totalCount: response?.data?.pagination?.totalItems || 0,
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  // =========================
  // NEW SUMMARY API (ONLY CHANGE)
  // =========================
  const getProfitsData = useCallback(async () => {
    const islogin = isLoggedIn();
    if (!islogin) return;

    try {
      const dateFilter =
        startDate && endDate
          ? `?fromDate=${moment(startDate).format(
              'YYYY-MM-DD',
            )}&toDate=${moment(endDate).format('YYYY-MM-DD')}`
          : '';

      const response = await getAuthData(`/bet/sport-summary${dateFilter}`);

      if (response?.status === 200) {
        const apiData = response?.data?.data || [];

        // RESET
        tabberMenu.forEach((item) => {
          item.earning = '0.00';
        });

        // MAP
        apiData.forEach((entry) => {
          const found = tabberMenu.find(
            (t) => t.id.toLowerCase() === entry.sport.toLowerCase(),
          );

          if (found) {
            found.earning = Number(entry.totalProfit || 0).toFixed(2);
          }
        });

        setProfitData([...tabberMenu]); // trigger UI update
      } else {
        setProfitData([]);
      }
    } catch (e) {
      console.error(e);
      setProfitData([]);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    getProfitsData();
  }, [getProfitsData]);

  // =========================
  // APPLY DATA TO TABLE
  // =========================
  const displayTabs = profitData.length > 0 ? profitData : tabberMenu;

  displayTabs.forEach((event) => {
    totalProfitLoss += parseFloat(event.earning);
  });
  // =========================
  return (
    <div className="min-h-screen mx-1 md:mx-0">
      <div className="w-full ">
        <GradientHeading heading={' Betting Profit and Loss'} />
      </div>

      <div className="flex gap-[5px] items-center w-full mb-2">
        <div className="w-full">
          <p className="text-14">From Date</p>
          <DatePicker
            className="px-3 text-14 font-medium py-1 w-full h-10 rounded-[4px] border border-gray-300"
            selected={startDate}
            onChange={(date) => setStartDate(date)}
          />
        </div>
        <div className="w-full">
          <p className="text-14">To Date</p>
          <DatePicker
            className="px-3 text-14 font-medium py-1 w-full h-10 rounded-[4px] border border-gray-300"
            selected={endDate}
            onChange={(date) => setEndDate(date)}
          />
        </div>
      </div>

      <button
        onClick={() => {
          getProfitLoss(1);
          getProfitsData();
        }}
        className="bg-primary-1300 text-16 h-10 flex-center rounded-[4px] w-full text-white"
      >
        SEARCH
      </button>

      <div className="data-table">
        <div className="tab-body max-w-full">
          <div className="tabber min-h-[350px] flex justify-between bg-white overflow-hidden rounded-lg flex-col md:flex-row">
            <div className="tabber-menu w-full min-w-[147px] md:min-w-[221px]">
              {/* 👉 SHOW SPORTS LIST */}
              {!showEvents && (
                <>
                  <div className="grid grid-cols-2 gap-[1px] mt-2">
                    <div className="text-white font-bold flex-center text-14 bg-[#8f8f8f] py-1">
                      EVENT
                    </div>
                    <div className="text-white font-bold flex-center text-14 bg-[#8f8f8f] py-1">
                      P&L
                    </div>
                  </div>

                  <ul className="border border-[#e9e9e9]">
                    {displayTabs.map((item, index) => (
                      <li
                        key={item.id}
                        onClick={() => handleTabClick(item.id)}
                        className={`grid grid-cols-2 text-14 cursor-pointer ${
                          index % 2 ? 'bg-white' : 'bg-[#f1f0f0]'
                        }`}
                      >
                        <div className="flex-center py-2 border-r ">
                          <button className="bg-primary-1300 text-center w-[200px] rounded-md py-1 text-white">
                            {' '}
                            {item.title}
                          </button>
                        </div>

                        <div
                          className={`flex-center ${
                            item.earning > 0
                              ? 'text-green-600'
                              : item.earning < 0
                              ? 'text-red-600'
                              : ''
                          }`}
                        >
                          {item.earning}
                        </div>
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {/* 👉 SHOW EVENT TABLE */}
              {showEvents && (
                <div className="mt-2">
                  {/* Back Button */}
                  <button
                    onClick={() => setShowEvents(false)}
                    className="mb-2 text-sm text-blue-600 underline"
                  >
                    ← Back
                  </button>

                  <div className="border border-gray-300 rounded-sm overflow-hidden">
                    {/* Header */}
                    <div className="grid grid-cols-4 bg-[#8f8f8f] text-white font-bold text-14">
                      <div className="p-2 border-r">Date</div>
                      <div className="p-2 border-r">Event Name</div>
                      <div className="p-2 border-r text-center">P & L</div>
                      <div className="p-2 text-center">Show Bets</div>
                    </div>

                    {/* Rows */}
                    {profitLoss?.map((item, index) => (
                      <div
                        key={item.id}
                        className={`grid grid-cols-4 text-12 ${
                          index % 2 ? 'bg-white' : 'bg-[#f1f0f0]'
                        }`}
                      >
                        <div className="p-2 border-r">
                          {formatDate(item.createdAt)}
                        </div>
                        <div className="p-2 border-r">{item.eventName}</div>

                        <div
                          className={`p-2 border-r text-center ${
                            item?.totalProfitLoss > 0
                              ? 'text-green-600'
                              : item?.totalProfitLoss < 0
                              ? 'text-red-600'
                              : ''
                          }`}
                        >
                          {formatNumber(item?.totalProfitLoss)}
                        </div>

                        <div className="p-2 text-center">
                          <button className="bg-yellow-400 px-3 py-1 rounded font-semibold">
                            Show Bets
                          </button>
                        </div>
                      </div>
                    ))}

                    {profitLoss?.length === 0 && (
                      <div className="p-4 text-center text-gray-500">
                        No events available
                      </div>
                    )}
                  </div>
                  {profitLoss?.length > 0 && (
                    <Pagination
                      pageCount={total}
                      setPageNumber={setPage}
                      take={take}
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfitAndLoss;
