import BlueButton from '@/components/common/BlueButton';
import PinkButton from '@/components/common/PinkButton';
import React from 'react';

type Props = {
  runnerName?: string;
  exposure?: number;
  toggleBetSlip?: () => void;
};

function MarketRow({ toggleBetSlip, runnerName, exposure = 0 }: Props) {
  return (
    <div className="flex justify-between items-center bg-[#371F0A] py-2 rounded-[100px] border-b-[2px]">
      <div className="flex px-4 justify-between items-center">
        <div className="text-xs font-bold">{runnerName}</div>
      </div>
      <div className="flex flex-1 justify-end px-5 gap-4">
        <div className={`${exposure >= 0 ? 'text-green-500' : 'text-red-500'}`}>{exposure}</div>
        <div className="flex gap-2 xl:gap-3 xxl:gap-4">
          <div className="flex flex-1 gap-2 xl:gap-4">
            <div onClick={toggleBetSlip} className="max-md:hidden">
              <BlueButton />
            </div>
            <div onClick={toggleBetSlip} className="max-md:hidden">
              <BlueButton />
            </div>
            <div onClick={toggleBetSlip}>
              <BlueButton />
            </div>
          </div>
          <div className="flex flex-1 justify-between gap-2 xl:gap-4">
            <div onClick={toggleBetSlip} className="max-md:hidden">
              <PinkButton />
            </div>
            <div onClick={toggleBetSlip} className="max-md:hidden">
              <PinkButton />
            </div>
            <div onClick={toggleBetSlip}>
              <PinkButton />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MarketRow;
