/* eslint-disable react-hooks/exhaustive-deps */
import GradientHeading from '@/components/GradientHeading';
import Pagination from '@/containers/Pagination';
import { getAuthData, isLoggedIn } from '@/utils/apiHandlers';
import { getQueryString } from '@/utils/formatter';
import { reactIcons } from '@/utils/icons';
import { getImage } from '@/utils/imagekit';
import { numberWithCommas } from '@/utils/numberWithCommas';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useSelector } from 'react-redux';

function AccountStatement() {
  const startDatePickerRef = useRef(null);
  const endDatePickerRef = useRef(null);

  const [sportFilter, setSportFilter] = useState('');
  const [startDate, setStartDate] = useState(() => {
    const today = new Date();
    today.setDate(today.getDate() - 2);
    return today;
  });
  const [endDate, setEndDate] = useState(new Date());

  const [statementData, setStatementData] = useState([]);
  const [page, setPage] = useState(1);
  const take = 10;

  const [pagination, setPagination] = useState({
    totalCount: 0,
  });

  useEffect(() => {
    if (startDate && endDate) {
      getTransactionList();
    }
  }, [page, startDate, endDate, sportFilter]);
  const getRecordType = () => {
    if (sportFilter === 'settling') return 'Transaction';
    if (sportFilter === 'Casino') return 'Casino';
    if (sportFilter) return 'Sports';
    return '';
  };
  const getTransactionList = async () => {
    if (!isLoggedIn()) return;

    try {
      const params = getQueryString({
        page,
        limit: take,
        fromDate: moment(startDate).startOf('day').toISOString(),
        toDate: moment(endDate).endOf('day').toISOString(),
        recordType: getRecordType(),
      });

      const response = await getAuthData(`/users/me/transactions?${params}`);

      if (response?.status === 200) {
        setStatementData(response?.data?.data || []);
        setPagination({
          totalCount: response?.data?.pagination?.totalItems || 0,
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen mx-1 md:mx-0 w-full">
      <div className="pb-2 md:py-2">
        <h1 className="text-18 md:text-24 font-bold mt-4 md:mt-0">
          <GradientHeading heading={'Account Statement'} />
        </h1>
      </div>

      {/* DATE FILTER */}
      <div className="flex gap-[5px] items-center w-full mb-2">
        <div className="w-full">
          <p className="text-14">From Date</p>
          <DatePicker
            ref={startDatePickerRef}
            className="px-3 py-1 w-full h-10 border"
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            dateFormat="dd-MM-yyyy"
          />
        </div>

        <div className="w-full">
          <p className="text-14">To Date</p>
          <DatePicker
            ref={endDatePickerRef}
            className="px-3 py-1 w-full h-10 border"
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            dateFormat="dd-MM-yyyy"
          />
        </div>
      </div>

      {/* FILTER */}
      <div className="flex gap-[5px] items-center w-full mb-3">
        <div className="w-full">
          <p className="text-14">Type</p>
          <select
            className="px-3 py-1 w-full h-10 border"
            value={sportFilter}
            onChange={(e) => setSportFilter(e.target.value)}
          >
            <option value="">All</option>
            <option value="settling">Deposit/Withdrawal</option>
            <option value="Cricket">Cricket</option>
            <option value="Soccer">Soccer</option>
            <option value="Tennis">Tennis</option>
            <option value="Casino">Casino</option>
          </select>
        </div>
      </div>

      {/* TABLE */}
      <div className="data-table overflow-x-auto">
        <table className="border-collapse w-full">
          <thead>
            <tr className="bg-gray-500 text-white">
              <th>#</th>
              <th>Date</th>
              <th>Description</th>
              <th>Credit</th>
              <th>Debit</th>
              <th>Balance</th>
              <th>Remark</th>
            </tr>
          </thead>

          <tbody>
            {statementData.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center">
                  No Data
                </td>
              </tr>
            ) : (
              statementData.map((item, index) => {
                const isCredit = item.type === 'Credit';

                return (
                  <tr key={index} className="text-center border">
                    <td>{index + 1}</td>

                    <td>
                      {moment(item.timestamp).format('DD/MM/YYYY, hh:mm A')}
                    </td>

                    <td>{item.narration}</td>

                    {/* CREDIT */}
                    <td className="text-green-600">
                      {isCredit ? numberWithCommas(item.amount) : 0}
                    </td>

                    {/* DEBIT */}
                    <td className="text-red-600">
                      {!isCredit ? numberWithCommas(item.amount) : 0}
                    </td>

                    {/* BALANCE */}
                    <td>{numberWithCommas(item.availableBalance)}</td>

                    {/* REMARK */}
                    <td>{item.context || '-'}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      {statementData.length > 0 && (
        <Pagination
          pageCount={pagination.totalCount}
          setPageNumber={setPage}
          take={take}
        />
      )}
    </div>
  );
}

export default AccountStatement;
