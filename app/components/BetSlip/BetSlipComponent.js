import useBetPlaceHook from '@/hooks/useBetPlaceHook';
import { reactIcons } from '@/utils/icons';
import { formatNumber } from '@/utils/marketFormaterHelpers';
import React from 'react';
import toast from 'react-hot-toast';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import BetProcessing from '../NewModals/BetProcessing'; // ✅ ADD THIS

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

  const [processing, setProcessing] = React.useState(false); // ✅ NEW STATE

  const { runnerName, marketName, betOn, rate, stake, min, max, marketType } =
    betDetails;

  // ✅ WRAPPER FUNCTION (MAIN FIX)
  const handlePlaceBetWithProcessing = async () => {
    if (!stake || !rate) return;

    setProcessing(true);

    // run API + timer parallel
    const [result] = await Promise.all([
      handlePlaceBet(),
      new Promise((res) => setTimeout(res, 6000)),
    ]);

    setProcessing(false);

    // 👉 ab result show karo (delay ke baad)
    if (result?.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

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
            {/* Odds */}
            <div className="flex flex-col gap-1">
              <label className="text-12 font-[200]">Odds</label>
              <div className="relative rounded-md overflow-hidden bg-white">
                <input
                  type="text"
                  disabled
                  value={rate || ''}
                  className="outline-none rounded-sm w-full h-[28px] max-w-[103px] px-8 py-2"
                />
                <button
                  type="button"
                  onClick={decreaseOdds}
                  className="absolute left-1 h-[22px] w-[22px] bg-[#051316] text-white"
                >
                  -
                </button>
                <button
                  type="button"
                  onClick={increaseOdds}
                  className="absolute right-1 h-[22px] w-[22px] bg-[#051316] text-white"
                >
                  +
                </button>
              </div>
            </div>

            {/* Stake */}
            <div className="flex flex-col gap-1">
              <label className="text-12 font-[200]">Stake</label>
              <input
                type="number"
                value={String(stake || '')}
                onChange={(e) => handleStakeChange(e.target.value)}
                className="border text-center max-w-[90px] h-[26px]"
              />
            </div>

            {/* Profit */}
            <div>
              <p>{betOn === 'BACK' ? 'Profit' : 'Liability'}</p>
              <p className="font-bold">{formatNumber(betPL)}</p>
            </div>

            {/* Reset */}
            <div
              onClick={handleReset}
              className="bg-[#B2493E] text-white h-5 w-5 flex-center"
            >
              {reactIcons.close}
            </div>
          </div>

          {/* Stakes */}
          <div className="bg-white p-3 grid grid-cols-3 gap-2 mt-2">
            {Array.isArray(stakesArr) &&
              stakesArr.map(({ label, value }, idx) => (
                <button
                  key={idx}
                  onClick={() => increaseStake(Number(value))}
                  className="bg-[#1E8067] text-white text-10"
                >
                  {formatNumber(label)}
                </button>
              ))}
            <button onClick={handleClear}>Clear</button>
          </div>

          {/* Buttons */}
          <div className="flex justify-between mt-2">
            <button
              onClick={handleClear}
              className="bg-[#B2493E] text-white px-4 py-1"
            >
              Remove All
            </button>

            <button
              disabled={isLoading || !stake || !rate}
              onClick={handlePlaceBetWithProcessing} // ✅ FIXED HERE
              className="bg-[#5C996F] text-white px-4 py-1 flex items-center gap-2"
            >
              {isLoading && (
                <AiOutlineLoading3Quarters className="animate-spin" />
              )}
              Place Order
            </button>
          </div>
        </div>
      </div>

      {/* ✅ MODAL */}
      {processing && <BetProcessing isOpen={processing} />}
    </div>
  );
};

export default BetSlipComponent;
