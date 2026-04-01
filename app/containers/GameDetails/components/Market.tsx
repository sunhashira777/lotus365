import { Icons } from '@/utils/Icons';
import React, { useState } from 'react';
import MarketRow from './MarketRow';
import NormalRow from './NormalRow';
import BetSlip from '@/components/BetSlip';

type Props = {
  type: string;
};

function Market({ type = 'Match Odds' }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <div className="bg-market-gradient rounded-[16px]">
        <div className="flex justify-between items-center py-2 border border-white border-b-0 rounded-[20px] px-2 bg-black">
          <div className="flex gap-2 items-center">
            <div className="p-2 rounded-full bg-[#7F7F80]">
              <Icons.pin className="size-3" />
            </div>
            <div className="text-xs font-black uppercase">{type}</div>
          </div>
          <div className="px-2 text-xs font-bold space-x-2">
            <span>MIN: 1</span>
            <span>MAX: 2</span>
          </div>
        </div>
        <div className="py-1 px-5 text-sm flex items-center justify-between rounded-[100px] border-b-[2px]">
          <div>Market</div>
          {type == 'Match Odds' ? (
            <div className="flex gap-2 xl:gap-3 xxl:gap-4">
              <div className="w-[50px] md:w-[184px] xl:w-[200px] text-center">Back</div>
              <div className="w-[50px] md:w-[184px] xl:w-[200px] text-center">Lay</div>
            </div>
          ) : (
            <div className="flex gap-2 xl:gap-3 xxl:gap-4">
              <div className="w-[50px] xl:w-[55px] text-center">Back</div>
              <div className="w-[50px] xl:w-[56px] text-center">Lay</div>
            </div>
          )}
        </div>
      </div>
      {type === 'Match Odds' ? (
        <>
          {' '}
          <MarketRow toggleBetSlip={() => setIsOpen(!isOpen)} runnerName="India" exposure={100.0} />
          <MarketRow runnerName="Australia" exposure={-100} />
        </>
      ) : (
        <>
          <NormalRow runnerName="India" />
          <NormalRow runnerName="Australia" />
        </>
      )}
      {isOpen && (
        <div className="xl:hidden pt-4">
          <BetSlip />
        </div>
      )}
    </div>
  );
}

export default Market;
