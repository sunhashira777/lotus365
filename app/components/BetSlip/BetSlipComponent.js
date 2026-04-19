import useBetPlaceHook from '@/hooks/useBetPlaceHook';
import { reactIcons } from '@/utils/icons';
import { formatNumber } from '@/utils/marketFormaterHelpers';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import BetProcessing from '../NewModals/BetProcessing'; // ✅ ADD THIS
import { FormControlLabel, Switch } from '@mui/material';
import { useSelector } from 'react-redux';

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

  const balanceInfo = useSelector((s) => s.wallet);
  const mainBalance = balanceInfo?.mainBalance ?? 0;
  const exposure = balanceInfo?.exposure ?? 0;
  const lockedAmount = balanceInfo?.lockedAmount ?? 0;
  const totalBalance = Number(
    (mainBalance - Math.abs(exposure) - Math.abs(lockedAmount)).toFixed(2),
  );
  const [processing, setProcessing] = useState(false); // ✅ NEW STATE

  const { runnerName, marketName, betOn, rate, stake, min, max, marketType } =
    betDetails;
  const handlePlaceBetWithProcessing = async () => {
    if (!stake || !rate) return;

    setProcessing(true);

    const startTime = Date.now();

    try {
      const result = await handlePlaceBet();

      const elapsed = Date.now() - startTime;
      const remaining = 6000 - elapsed;

      if (remaining > 0) {
        await new Promise((res) => setTimeout(res, remaining));
      }

      setProcessing(false);

      if (result?.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (err) {
      setProcessing(false);
      toast.error('Something went wrong');
    }
  };
  console.log('stakesArr', min, max);
  return (
    <div>
      {rate && (
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
              <p> Max Market: {max} </p>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <p
                  className={`font-bold ${
                    betPL > 0
                      ? 'text-green-600'
                      : betPL < 0
                      ? 'text-red-600'
                      : ''
                  }`}
                >
                  {formatNumber(betPL)}
                </p>
                <p>{betOn === 'BACK' ? 'Profit' : 'Liability'}</p>
              </div>
              <div className="text-14 font-bold flex items-center gap-2">
                Avail Bal :{' '}
                <p className="text-green-600">{formatNumber(totalBalance)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Odds */}

              {/* <label className="text-12 font-[200]">Odds</label> */}
              <div className="relative rounded-sm overflow-hidden bg-white">
                <input
                  type="text"
                  disabled
                  value={rate || ''}
                  className="outline-none rounded-sm w-full h-[26px]  px-8 py-2"
                />
              </div>

              {/* Stake */}
              <div className="flex ">
                {/* <label className="text-12 font-[200]">Stake</label> */}
                <input
                  type="number"
                  value={String(stake || '')}
                  onChange={(e) => handleStakeChange(e.target.value)}
                  className="border text-center  h-[26px]"
                />
              </div>

              {/* Reset */}
            </div>

            {/* Stakes */}
            <div className="bg-white p-3 grid grid-cols-4 gap-2 mt-2">
              {Array.isArray(stakesArr) &&
                stakesArr.map(({ label, value }, idx) => (
                  <button
                    key={idx}
                    onClick={() => increaseStake(Number(value))}
                    className="bg-[#000000] text-white text-10"
                  >
                    {formatNumber(label)}
                  </button>
                ))}
              <button
                onClick={() => increaseStake(Number(min))}
                className="p-0.5 text-[10px] rounded-sm bg-[#4CAF50] text-white"
              >
                MIN STAKE
              </button>
              <button
                onClick={() => increaseStake(Number(max))}
                className="p-0.5 text-[10px] rounded-sm bg-[#334579] text-white"
              >
                MAX STAKE
              </button>
              <button
                onClick={handleClear}
                className="p-0.5 text-[10px] rounded-sm bg-[#FF0000] text-white"
              >
                CLEAR
              </button>
              <button
                onClick={handleClear}
                className="p-0.5 text-[10px] rounded-sm bg-[#018000] text-white"
              >
                EDIT STAKE
              </button>
            </div>

            {/* Buttons */}
            <div className="flex justify-between mt-2 gap-2">
              <button
                onClick={handleReset}
                className=" px-4 py-1 w-full rounded-md border border-black"
              >
                Cancel
              </button>

              <button
                disabled={isLoading || !stake || !rate}
                onClick={handlePlaceBetWithProcessing} // ✅ FIXED HERE
                className="bg-[#5C996F] text-center text-white  flex justify-center w-full rounded-md items-center gap-2"
              >
                {isLoading && (
                  <AiOutlineLoading3Quarters className="animate-spin" />
                )}
                Place Bet
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ✅ MODAL */}
      {processing && <BetProcessing isOpen={processing} />}
    </div>
  );
};

export default BetSlipComponent;
