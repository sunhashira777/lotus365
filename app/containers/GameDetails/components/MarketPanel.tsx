import BetSlip from '@/components/BetSlip';
import { MarketType } from '@/types/betPlace';
import { Market, Runner } from '@/types/market';
import { Icons } from '@/utils/Icons';
import React, { useState } from 'react';
import InnerMarketRow from './InnerMarketRow';
import { valueFormatter } from '@/helpers';
type Variation = 'primary' | 'secondary';
interface MarketPanelProps {
  eventName?: string;
  marketName?: string;
  marketData: Market;
  runnersData: Runner[];
  type?: 'inner' | 'outer';
  min?: number | string | null;
  max?: number | string | null;
  variation?: Variation;
  oddsClassName?: string;
  marketCategory: MarketType;
  defaultExpanded?: boolean;
}

const MarketPanel: React.FC<MarketPanelProps> = ({
  eventName,
  marketName,
  marketData,
  runnersData,
  type = 'inner',
  min,
  max,
  variation,
  oddsClassName,
  marketCategory,
  defaultExpanded = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <div className="bg-market-gradient rounded-[16px]">
        <div className="flex justify-between items-center py-2 border border-white border-b-0 rounded-[20px] px-2 bg-black">
          <div className="flex gap-2 items-center">
            <div className="p-2 rounded-full bg-[#7F7F80]">
              <Icons.pin className="size-3" />
            </div>
            <div className="text-xs font-black uppercase">{marketName} </div>
          </div>
          <div className="px-2 text-xs font-bold space-x-2">
            <span>MIN: {min ? valueFormatter.format(Number(min)) : ''}</span>
            <span>MAX: {max ? valueFormatter.format(Number(max)) : ''}</span>
          </div>
        </div>
        <div className="py-1 px-5 text-sm flex items-center justify-between rounded-[100px] border-b-[2px] ">
          <div>
            {} {marketCategory === 'NORMAL' ? 'Market' : eventName}
          </div>
          <div className="flex justify-center items-center gap-2 w-max md:w-full md:max-w-[415px]">
            {variation && (
              <>
                <span className="w-[55px] xs:w-[70px] text-center">
                  {variation === 'secondary' ? 'No' : 'Back'}
                </span>
                <span className="w-[55px] xs:w-[70px] text-center">
                  {variation === 'secondary' ? 'Yes' : 'Lay'}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
      {runnersData.map((runner: Runner, idx: number) => (
        <InnerMarketRow
          key={runner.selectionId || idx}
          runnersData={runner}
          oddsClassName={oddsClassName}
          marketData={marketData}
          marketCategory={marketCategory}
          min={min}
          max={max}
        />
      ))}
      {isOpen && (
        <div className="xl:hidden pt-4">
          <BetSlip />
        </div>
      )}
    </>
  );
};

export default MarketPanel;
