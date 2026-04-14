import { resetBetDetails } from '@/api/Slices/betSlice';
import useInnerMarketRow from '@/hooks/useInnerMarketRow';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import OddButton from './OddButton';
import { formatNumber } from '@/utils/marketFormaterHelpers';
import BetSlipComponent from '../BetSlip/BetSlipComponent';
import BookListModal from './BookListModal';
import { reactIcons } from '@/utils/icons';

const InnerMarketRow = ({
  marketData,
  runnersData,
  oddsClassName = 'justify-center',
  reverseOddsOrder = false,
  marketCategory,
  min,
  max,
}) => {
  const [openBookModal, setOpenBookModal] = useState(false);
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
  console.log('renderOdds', renderOdds);
  console.log(marketData, runnersData, 'runnersData');

  if (!runnersData) return null;

  return (
    <>
      <div className="px-2 bg-white">
        <div className="flex justify-between items-center text-inplay-rowText border-b border-[#ddd]">
          <div title={runnerName} className="text-[10px] font-semibold mx-2 ">
            {runnerName}
          </div>

          {/* Odds Section */}
          <div className={`w-max md:min-w-[440px] flex gap-2 ${oddsClassName}`}>
            <div className="relative flex items-center gap-2 mr-5 md:mr-0">
              {marketCategory !== 'FANCY' && totalExposure ? (
                <div
                  className={`bg-primary/20 rounded px-2 py-0.5 xl:absolute -left-2 xl:-translate-x-full text-xs font-bold flex items-center ${
                    totalExposure < 0 ? 'text-red-500' : 'text-green-500'
                  }`}
                >
                  {formatNumber(totalExposure)}
                </div>
              ) : null}

              {/* FANCY BOOK BUTTON */}
              {marketCategory === 'FANCY' && (
                <button
                  onClick={() => setOpenBookModal(true)}
                  disabled={exposureFromBookset === 0}
                  className="disabled:opacity-30"
                >
                  {reactIcons.ladder}
                </button>
              )}

              <div className="relative flex items-center gap-0.5">
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
                      position={
                        type === 'back' ? items.length - index : index + 1
                      }
                      onClick={() => {
                        // document.documentElement.scrollTop = 0;
                        // document.body.scrollTop = 0;
                        // window.scrollTo({ top: 0, behavior: 'smooth' });
                        handleSetBetDetails(
                          odd.price,
                          type.toUpperCase(),
                          marketCategory === 'FANCY' ? odd.size : null,
                          index,
                        );
                      }}
                    />
                  )),
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
      {betDetails.selectionId === selectionId &&
        betDetails.marketId === marketData.marketId && (
          <div className="block lg:hidden border-b border-primary-light">
            {' '}
            <BetSlipComponent />
          </div>
        )}
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

InnerMarketRow.propTypes = {
  marketData: PropTypes.shape({
    marketId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    marketName: PropTypes.string,
    marketStatus: PropTypes.string,
    gameStatus: PropTypes.string,
    marketCategory: PropTypes.string,
  }).isRequired,

  runnersData: PropTypes.shape({
    selectionId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    runnerId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    runnerName: PropTypes.string,
    status: PropTypes.string,
    back: PropTypes.array,
    lay: PropTypes.array,
  }).isRequired,

  oddsClassName: PropTypes.string,

  reverseOddsOrder: PropTypes.bool,

  marketCategory: PropTypes.string.isRequired, // e.g. 'NORMAL', 'FANCY'

  min: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

  max: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
export default React.memo(InnerMarketRow, (prev, next) => {
  return (
    prev.marketData.marketId === next.marketData.marketId &&
    prev.marketData.marketStatus === next.marketData.marketStatus &&
    prev.marketCategory === next.marketCategory &&
    prev.min === next.min &&
    prev.max === next.max &&
    prev.runnersData.status === next.runnersData.status &&
    prev.runnersData.back?.[0]?.price === next.runnersData.back?.[0]?.price &&
    prev.runnersData.lay?.[0]?.price === next.runnersData.lay?.[0]?.price
  );
});
