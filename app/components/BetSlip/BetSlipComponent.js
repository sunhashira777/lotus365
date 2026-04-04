import useBetPlaceHook from '@/hooks/useBetPlaceHook';
import { reactIcons } from '@/utils/icons';
import { formatNumber } from '@/utils/marketFormaterHelpers';
import React from 'react';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

const BetSlipComponent = () => {
  const {
    acceptOddsChange,
    setAcceptOddsChange,
    betDetails,
    betPL,
    isLoading,
    stakesLoader,
    stakesArr,
    handleStakeChange,
    handlePlaceBet,
    handleClear,
    handleReset,
    increaseStake,
    increaseOdds,
    decreaseOdds,
  } = useBetPlaceHook();
  const { runnerName, marketName, betOn, rate, stake, min, max, marketType } =
    betDetails;
  console.log('betDetails', betDetails);

  const isOddsChangeButtonDisabled =
    marketName?.toLowerCase() === 'match odds' &&
    marketType?.toLowerCase() === 'normal'
      ? false
      : true;
  return (
    <div>
      <div className="bg-white p-2">
        <div className="flex items-center gap-1">
          <div
            className={`${
              betOn === 'BACK' ? 'bg-[#a7d8fd]' : 'bg-[#f9c9d4]'
            } w-3 h-3`}
          ></div>
          <p>{betOn === 'BACK' ? 'back' : 'lay'}</p>
        </div>
        {/* <p className=" text-[13px] font-bold text-black">{runnerName}</p> */}
        <div
          className={`relative p-2 ${
            betOn === 'BACK' ? 'bg-[#a7d8fd]' : 'bg-[#f9c9d4]'
          } my-1`}
        >
          <div className="flex items-center justify-between text-12 font-lato ">
            <p> {runnerName}</p>
            <p> Max Market: 10000 </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex flex-col gap-1">
              <div className="flex justify-between">
                <label htmlFor="" className="text-12 font-[200]  ">
                  Odds
                </label>
              </div>
              <div className="relative rounded-md overflow-hidden bg-white">
                <input
                  type="text"
                  disabled
                  value={rate ? rate : ''}
                  className="outline-none   rounded-sm w-full h-[28px] max-w-[103px] px-8 py-2"
                />
                <button
                  type="button"
                  onClick={decreaseOdds}
                  className="absolute ay-center rounded-sm cursor-pointer h-[22px] w-[22px] left-1 bg-[#051316] font-bold  flex-center text-white"
                >
                  -
                </button>
                <button
                  type="button"
                  onClick={increaseOdds}
                  className="absolute ay-center rounded-sm cursor-pointer h-[22px] w-[22px] right-1 bg-[#051316] font-bold flex-center text-white"
                >
                  +
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="" className=" font-[200] text-12">
                Stake
              </label>
              <div className="relative rounded-md overflow-hidden">
                <input
                  type="number"
                  value={String(stake ? stake : '')}
                  onChange={(e) => handleStakeChange(e.target.value)}
                  placeholder="0"
                  className="outline-none border border-gray-200 text-center  max-w-[90px] rounded-sm w-full h-[26px] "
                />
              </div>
            </div>
            <div className="">
              <p className="text-black font-[200]">
                {betOn === 'BACK' ? 'Profit' : 'Liability'}
              </p>
              <p className="text-black text-12 font-bold">
                {formatNumber(betPL)}
              </p>
            </div>
            <div
              onClick={handleReset}
              className="bg-[#B2493E] text-white rounded-sm h-5 w-5 flex-center text-xl font-bold mt-auto mb-1"
            >
              {reactIcons.close}
            </div>
          </div>
          <div className="bg-white p-3 grid grid-cols-3 gap-y-3  gap-x-2 mt-2">
            {/* <button
              onClick={() => setBetData({ ...betData, stake: 100 })}
              className="border  bg-[#1E8067] h-[14px] text-white font-medium text-10 leading-none rounded-sm flex-center"
            >
              Min
            </button> */}
            {Array.isArray(stakesArr) &&
              stakesArr?.map(({ label, value }, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => increaseStake(value ? Number(value) : 0)}
                  className="border  rounded-sm h-[14px] text-white font-medium text-10 leading-none flex-center bg-[#1E8067]"
                >
                  {formatNumber(label)}
                </button>
              ))}
            {/* <button
              onClick={() => setBetData({ ...betData, stake: 25000 })}
              className="border text-10 h-[14px] leading-none text-white font-medium  bg-[#1E8067] rounded-sm flex-center"
            >
              Max
            </button> */}
            <button
              onClick={handleClear}
              className="text-12 font-medium h-[14px] flex items-center "
            >
              Clear
            </button>
          </div>
          <div className="flex items-center justify-between gap-2  mt-2">
            <button
              onClick={handleClear}
              className="bg-[#B2493E] text-white px-4 py-1 text-12 font-semibold rounded-sm shadow-[inset_-2px_-2px_#8d3a31]"
            >
              Remove All
            </button>
            <button
              disabled={isLoading || (stake && rate ? false : true)}
              onClick={handlePlaceBet}
              className={`text-white px-4 flex gap-2 items-center text-12 font-semibold shadow-[inset_-2px_-2px_#1E8067] py-1 rounded-sm ${
                stake === '' || stake === 0 ? 'bg-[#5c996f] ' : 'bg-[#5C996F] '
              }`}
            >
              {isLoading && (
                <AiOutlineLoading3Quarters className="animate-spin text-14" />
              )}{' '}
              Place Order
            </button>
          </div>
        </div>
      </div>

      {/* {!betData?.marketId && (
        <div className="text-14 bg-white p-2">
          Click on the odds to add selections to the betslip
        </div>
      )} */}
    </div>
  );
};

export default BetSlipComponent;
