import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useDeviceWidth } from './useDeviceWidth';
import { useGetBooksetCalcQuery } from '@/api/booksetApi';
import { useCallback, useEffect, useMemo } from 'react';
import { calculateProfitLoss } from '@/utils/marketFormaterHelpers';
import { setBetDetails, setBetPL } from '@/api/Slices/betSlice';
import { setTriggerId } from '@/api/Slices/triggerSlice';

const useInnerMarketRow = ({
  marketData,
  runnersData,
  marketCategory,
  min,
  max,
  reverseOddsOrder,
}) => {
  const dispatch = useDispatch();
  const { eventId } = useParams();
  const width = useDeviceWidth();
  const isMobile = width < 768;
  const betDetails = useSelector((s) => s.betPlace.betDetails);
  const triggerId = useSelector((s) => s.trigger.triggerId);

  const {
    runnerName,
    status = '',
    back = [],
    lay = [],
    selectionId,
  } = runnersData;
  console.log('marketData', marketData);

  const allowedStatus = ['active', 'open', ''];
  const runnerStatus = status?.toLowerCase();
  const marketStatus = marketData?.marketStatus?.toLowerCase();
  const gameStatus = marketData?.gameStatus?.toLowerCase();
  const blockedStatus = !allowedStatus.includes(runnerStatus)
    ? runnerStatus
    : !allowedStatus.includes(marketStatus)
    ? marketStatus
    : // : !allowedStatus.includes(gameStatus)
      //   ? gameStatus
      null;
  const { data: booksetCalculation, refetch } = useGetBooksetCalcQuery({
    eventId: Number(eventId),
  });
  // ✅ exposure from API
  const exposureFromBookset = useMemo(() => {
    if (!booksetCalculation || !marketData?.marketId || !selectionId) return 0;

    const m = booksetCalculation.find(
      (x) => String(x.marketExternalId) === String(marketData.marketId),
    );

    if (!m) return 0;

    const sel = m.selections.find(
      (s) => String(s.selectionId) === String(selectionId),
    );

    return sel?.exposure ?? 0;
  }, [booksetCalculation, marketData?.marketId, selectionId]);

  // ✅ frontend calculation
  const calculatedPL = useMemo(() => {
    if (!betDetails?.stake) return 0;

    return (
      calculateProfitLoss(
        marketCategory,
        betDetails,
        eventId,
        selectionId,
        marketData?.marketId,
      ) ?? 0
    );
  }, [betDetails, marketCategory, eventId, selectionId, marketData?.marketId]);

  const totalExposure = exposureFromBookset + calculatedPL;

  // ✅ odds display
  const visibleBack = useMemo(
    () => (isMobile ? back.slice(0, 1) : back),
    [isMobile, back],
  );

  const visibleLay = useMemo(
    () => (isMobile ? lay.slice(0, 1) : lay),
    [isMobile, lay],
  );

  const totalOdds = visibleBack.length + visibleLay.length;

  const renderOdds = useMemo(() => {
    return reverseOddsOrder
      ? [
          { type: 'lay', items: visibleLay },
          { type: 'back', items: visibleBack },
        ]
      : [
          { type: 'back', items: visibleBack },
          { type: 'lay', items: visibleLay },
        ];
  }, [reverseOddsOrder, visibleBack, visibleLay]);
  const handleSetBetDetails = useCallback(
    (price, type, fancySize, position) => {
      if (!price) return;

      dispatch(
        setBetDetails({
          position,
          eventId,
          marketId: marketData.marketId,
          marketName: marketData.marketName,
          marketType: marketCategory,
          marketCategory: marketData?.marketCategory,
          selectionId,
          runnerName: runnersData.runnerName,
          rate: price,
          fancyPercentage: fancySize,
          betOn: type,
          stake: 0,
          acceptOddsChange: true,
          min,
          max,
        }),
      );
    },
    [
      dispatch,
      eventId,
      marketData,
      runnersData,
      marketCategory,
      selectionId,
      min,
      max,
    ],
  );

  useEffect(() => {
    if (triggerId === 10) {
      refetch();
      dispatch(setTriggerId(null));
    }
  }, [triggerId, refetch, dispatch]);

  useEffect(() => {
    if (betDetails?.selectionId === selectionId && calculatedPL) {
      dispatch(setBetPL(calculatedPL));
    }
  }, [betDetails, calculatedPL, selectionId, dispatch]);
  return {
    totalOdds,
    renderOdds,
    runnerName,
    selectionId,
    betDetails,
    exposureFromBookset,
    totalExposure,
    handleSetBetDetails,
    blockedStatus,
  };
};

export default useInnerMarketRow;
