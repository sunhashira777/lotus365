import GradientHeading from '@/components/GradientHeading';
import AllBetListModal from '@/components/NewModals/AllBetListModal';
import Pagination from '@/containers/Pagination';
import { getAuthData, isLoggedIn } from '@/utils/apiHandlers';
import { getQueryString } from '@/utils/formatter';
import { reactIcons } from '@/utils/icons';
import dayjs from 'dayjs';
import React, { useEffect, useRef, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function MyBets() {
  const startDatePickerRef = useRef(null);
  const endDatePickerRef = useRef(null);

  const [showAll, setShowAll] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);

  const [page, setPage] = useState(1);
  const take = 10;

  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 2);
    return d;
  });

  const [endDate, setEndDate] = useState(new Date());
  const [selectedSport, setSelectedSport] = useState('cricket');

  const [betsData, setBetsData] = useState({
    bets: [],
    totalCount: 0,
  });

  const getAllBets = async () => {
    if (!isLoggedIn()) return;

    try {
      const params = getQueryString({
        offset: (page - 1) * take,
        limit: take,
        status: 'past',
        sport:
          selectedSport === 'cricket'
            ? 'Cricket'
            : selectedSport === 'soccer'
            ? 'Soccer'
            : 'Tennis',
        startDate: startDate?.toISOString(),
        endDate: endDate?.toISOString(),
      });

      const response = await getAuthData(`/bet/GetAllEventsBets?${params}`);

      if (response?.status === 200) {
        setBetsData({
          bets: response?.data?.data || [],
          totalCount: response?.data?.total || 0,
        });
      }
    } catch (e) {
      console.error('API ERROR 👉', e);
    }
  };

  useEffect(() => {
    getAllBets();
  }, [page, selectedSport, startDate, endDate]);

  return (
    <>
      <div className="min-h-screen mx-1 md:mx-0">
        <div className="pb-2 md:py-2">
          <GradientHeading heading={'My Bets'} />
        </div>

        {/* Filters */}
        <div className="flex gap-[5px] items-center w-full mb-2">
          {/* FROM DATE */}
          <div className="w-full">
            <p className="text-14">From Date</p>
            <div className="relative">
              <DatePicker
                ref={startDatePickerRef}
                selected={startDate}
                onChange={(date) => {
                  setStartDate(date);
                  setPage(1);
                }}
                className="px-3 text-14 font-medium py-1 w-full h-10 rounded-[4px] border border-gray-300"
                dateFormat="dd-MM-yyyy"
                popperPlacement="bottom-start"
                portalId="root"
              />
              <span
                onClick={() => startDatePickerRef.current?.setFocus()}
                className="absolute right-2 top-2 cursor-pointer"
              >
                {reactIcons.calendar}
              </span>
            </div>
          </div>

          {/* TO DATE */}
          <div className="w-full">
            <p className="text-14">To Date</p>
            <div className="relative">
              <DatePicker
                ref={endDatePickerRef}
                selected={endDate}
                onChange={(date) => {
                  setEndDate(date);
                  setPage(1);
                }}
                className="px-3 text-14 font-medium py-1 w-full h-10 rounded-[4px] border border-gray-300"
                dateFormat="dd-MM-yyyy"
                popperPlacement="bottom-start"
                portalId="root"
              />
              <span
                onClick={() => endDatePickerRef.current?.setFocus()}
                className="absolute right-2 top-2 cursor-pointer"
              >
                {reactIcons.calendar}
              </span>
            </div>
          </div>
        </div>

        {/* FILTER TYPE */}
        <div className="flex gap-[5px] items-center w-full">
          <div className="w-full">
            <p className="text-14">Type</p>
            <select
              value={selectedSport}
              onChange={(e) => {
                setSelectedSport(e.target.value);
                setPage(1);
              }}
              className="px-3 text-14 font-medium py-1 w-full h-10 rounded-[4px] border border-gray-300"
            >
              <option value="cricket">Cricket</option>
              <option value="soccer">Soccer</option>
              <option value="tennis">Tennis</option>
            </select>
          </div>

          <div className="w-full">
            <div className="text-14 h-6"></div>
            <button
              onClick={() => setPage(1)}
              className="bg-primary-1300 text-16 h-10 flex-center rounded-[4px] w-full text-white"
            >
              APPLY
            </button>
          </div>
        </div>

        {/* EVENTS LIST */}
        <div className="my-4">
          {Array.isArray(betsData?.bets) && betsData.bets.length > 0 ? (
            betsData.bets.map((item, index) => (
              <div
                key={item?.event_id || index}
                onClick={() => {
                  setSelectedEventId(item?.event_id);
                  setShowAll(true);
                }}
                className="bg-white px-[10px] py-2 rounded-[5px] mb-2 flex justify-between gap-2 shadow-[0_1px_10px_rgba(0,0,0,0.2)] cursor-pointer"
              >
                <div className="flex gap-1">
                  <div className="font-semibold text-14 leading-4 ">
                    {index + 1 + (page - 1) * take}.
                  </div>

                  <div className="font-semibold text-14 ">
                    <h1 className="font-semibold text-14 leading-4 ">
                      {item?.event || 'N/A'}
                    </h1>

                    <p className="text-12 font-medium">
                      {item?.match_open_date
                        ? dayjs(item.match_open_date).format(
                            'DD-MM-YY hh:mm:ss',
                          )
                        : 'N/A'}
                    </p>

                    <p className="text-10 text-blue-500 font-semibold">
                      {item?.sport}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <div className="bg-primary-1300 px-3 text-white font-semibold h-7 flex-center text-10 rounded-sm">
                    Bets: {item?.bet_count}
                  </div>

                  <p className="text-10 text-gray-500">
                    {item?.last_updated
                      ? dayjs(item.last_updated).format('DD-MM-YY hh:mm')
                      : ''}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="p-1 mb-5 text-center text-14 bg-[#DAE1DF] border border-[#aaa]">
              No Event Found
            </div>
          )}

          {/* PAGINATION */}
          {betsData?.totalCount > 0 && (
            <Pagination
              pageCount={betsData?.totalCount}
              setPageNumber={setPage}
              take={take}
            />
          )}
        </div>
      </div>

      {/* MODAL */}
      {showAll && (
        <AllBetListModal
          isOpen={showAll}
          handleClose={() => setShowAll(false)}
          eventId={selectedEventId}
          type="past"
        />
      )}
    </>
  );
}

export default MyBets;
