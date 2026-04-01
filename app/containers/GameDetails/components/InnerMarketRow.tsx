import { MarketType } from '@/types/betPlace';
import { Market, Runner } from '@/types/market';
import React, { useState } from 'react';
import { useInnerMarketRow } from '../Hooks/useInnerMarketRow';
import OddButton from '@/components/OddButton';
import BetSlip from '@/components/BetSlip';
import BookListModal from '@/components/BookListModal';
import { formatNumber } from '@/utils';
import BottomSheetModal from '@/components/common/BottomSheetModal';
import { useDispatch } from 'react-redux';
import { resetBetDetails } from '@/store/slices/betSlice';
interface InnerMarketRowProps {
  marketData: Market;
  runnersData: Runner;
  oddsClassName?: string;
  reverseOddsOrder?: boolean;
  marketCategory: MarketType;
  min?: string | number | null;
  max?: string | number | null;
}
const InnerMarketRow: React.FC<InnerMarketRowProps> = ({
  marketData,
  runnersData,
  oddsClassName = 'justify-center',
  reverseOddsOrder = false,
  marketCategory,
  min,
  max,
}) => {
  const {
    totalOdds,
    renderOdds,
    runnerName,
    selectionId,
    betDetails,
    exposureFromBookset,
    totalExposure,
    blockedStatus,
    handleSetBetDetails,
  } = useInnerMarketRow({
    reverseOddsOrder,
    marketData,
    runnersData,
    marketCategory,
    min,
    max,
  });
  const dispatch = useDispatch();
  const handleClose = () => {
    dispatch(resetBetDetails());
  };
  if (!runnersData) return null;
  const [openBookModal, setOpenBookModal] = useState(false);

  return (
    <>
      <div className=" border-b-[2px] md:last:border-b border-primary-light py-1 sm:py-2 px-2 bg-inplay-rowBg rounded-full">
        <div className="flex justify-between items-center text-inplay-rowText">
          <div title={runnerName} className="text-xs font-semibold mx-2 capitalize">
            {runnerName}
          </div>

          {/* Odds Section */}
          <div className={`w-max md:min-w-[440px] flex gap-2 ${oddsClassName}`}>
            <div className="relative flex items-center gap-2 mr-5 md:mr-0">
              {marketCategory !== 'FANCY' && totalExposure ? (
                <div
                  className={`bg-primary/20 rounded px-2 py-0.5 xl:absolute -left-2 xl:-translate-x-full text-xs font-bold flex items-center ${totalExposure < 0 ? 'text-red-500' : 'text-green-500'}`}
                >
                  {formatNumber(totalExposure)}
                </div>
              ) : null}

              {/* FANCY BOOK BUTTON */}
              {marketCategory === 'FANCY' && (
                <button
                  onClick={() => setOpenBookModal(true)}
                  disabled={exposureFromBookset === 0}
                  className="bg-btn-gradient text-white disabled:opacity-30 rounded-full px-3 py-1 md:absolute -left-2 md:-translate-x-full text-11 shadow-xl font-bold flex items-center"
                >
                  Book
                </button>
              )}

              <div className="relative flex items-center gap-2 xl:gap-3">
                {renderOdds.map(({ type, items }) =>
                  (items ?? []).map((odd, index) => (
                    <OddButton
                      key={`${type}-${index}`}
                      runnersData={runnersData}
                      marketId={marketData?.marketId}
                      oddsCount={totalOdds}
                      price={odd.price}
                      size={odd.size}
                      type={type}
                      disabled={odd.price ? false : true}
                      position={type === 'back' ? items.length - index : index + 1}
                      onClick={() => {
                        // document.documentElement.scrollTop = 0;
                        // document.body.scrollTop = 0;
                        // window.scrollTo({ top: 0, behavior: 'smooth' });
                        handleSetBetDetails(
                          odd.price,
                          type.toUpperCase(),
                          marketCategory === 'FANCY' ? odd.size : null,
                          index
                        );
                      }}
                    />
                  ))
                )}

                {blockedStatus && (
                  <div className="capitalize rounded-md md:rounded-full absolute inset-0 backdrop-blur-sm bg-btn-gradient text-black flex items-center justify-center text-sm font-semibold">
                    {blockedStatus}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <BottomSheetModal
        isOpen={
          betDetails.selectionId === selectionId && betDetails.marketId === marketData.marketId
        }
        onClose={handleClose}
      >
        {/* MOBILE BET SLIP */}
        {betDetails.selectionId === selectionId && betDetails.marketId === marketData.marketId && (
          <div className="block lg:hidden border-b border-primary-light">
            <BetSlip />
          </div>
        )}
      </BottomSheetModal>

      {openBookModal && (
        <BookListModal
          open={openBookModal}
          onClose={() => setOpenBookModal(false)}
          selectionId={selectionId}
        />
      )}
    </>
  );
};

export default React.memo(InnerMarketRow, (prev, next) => {
  return (
    prev.marketData.marketId === next.marketData.marketId &&
    prev.runnersData === next.runnersData &&
    prev.marketCategory === next.marketCategory &&
    prev.min === next.min &&
    prev.max === next.max
  );
});
