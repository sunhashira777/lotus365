import React from 'react';
import PropTypes from 'prop-types';
import InnerMarketRow from './InnerMarketRow';

const MarketPanel = ({
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
  return (
    <>
      <div className="bg-marketHead">
        <div className="py-1 px-5 text-sm flex items-center justify-between border-b-[2px]">
          {/* LEFT SIDE */}
          <div className="flex items-center">
            <div className="flex flex-col leading-[16px] text-[13px] font-bold">
              {marketName || 'Market'}
            </div>

            {variation !== 'secondary' && (
              <button
                disabled
                className="
                  bg-[#fb9201]
                  text-white
                  text-[10px]
                  rounded-[10px]
                  ml-[3px]
                  px-[3px]
                  py-[3px]
                  uppercase
                  flex items-center justify-center
                  leading-[1.2]
                  whitespace-nowrap
                  w-auto h-auto
                  cursor-not-allowed
                  opacity-70
                "
              >
                CASHOUT
              </button>
            )}
          </div>

          {/* RIGHT SIDE */}
          <div
            className="flex justify-center items-center gap-2 w-max md:w-full md:max-w-[415px] overflow-x-auto"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {variation && (
              <>
                <span className="w-[55px] xs:w-[70px] text-center font-bold flex flex-col leading-[16px] text-[13px]">
                  {variation === 'secondary' ? 'No' : 'BACK'}
                </span>
                <span className="w-[55px] xs:w-[70px] text-center font-bold flex flex-col leading-[16px] text-[13px]">
                  {variation === 'secondary' ? 'Yes' : 'LAY'}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* HIDE SCROLLBAR FOR WEBKIT */}
      <style>
        {`
          div::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>

      {runnersData.map((runner, idx) => (
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
    </>
  );
};

MarketPanel.propTypes = {
  eventName: PropTypes.string,
  marketName: PropTypes.string,
  marketData: PropTypes.shape({
    marketId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    marketName: PropTypes.string,
    marketStatus: PropTypes.string,
    gameStatus: PropTypes.string,
    marketCategory: PropTypes.string,
    min: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    max: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }),
  runnersData: PropTypes.arrayOf(
    PropTypes.shape({
      selectionId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      runnerId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      runnerName: PropTypes.string,
      status: PropTypes.string,
      back: PropTypes.array,
      lay: PropTypes.array,
    }),
  ),
  type: PropTypes.oneOf(['inner', 'outer']),
  min: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  max: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  variation: PropTypes.oneOf(['primary', 'secondary']),
  oddsClassName: PropTypes.string,
  marketCategory: PropTypes.oneOf(['NORMAL', 'FANCY']).isRequired,
  defaultExpanded: PropTypes.bool,
};

export default MarketPanel;
