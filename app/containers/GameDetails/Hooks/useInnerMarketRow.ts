import { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { RootState } from '@/store';
import { Market, Runner } from '@/types/market';
import { BetOn, MarketType } from '@/types/betPlace';

import { calculateProfitLoss } from '@/helpers/booksetCalculation';
import { setBetDetails, setBetPL } from '@/store/slices/betSlice';
import { setTriggerId } from '@/store/slices/triggerSlice';
import { useGetBooksetCalcQuery } from '@/store/api/booksetApi';
import { useDeviceWidth } from '@/hooks/useDeviceWidth';

interface UseInnerMarketRowProps {
  marketData: Market;
  runnersData: Runner;
  marketCategory: MarketType;
  min?: string | number | null;
  max?: string | number | null;
  reverseOddsOrder?: Boolean;
}

export const useInnerMarketRow = ({
  marketData,
  runnersData,
  marketCategory,
  min,
  max,
  reverseOddsOrder,
}: UseInnerMarketRowProps) => {
  const dispatch = useDispatch();
  const { eventId } = useParams();
  const width = useDeviceWidth();
  const isMobile = width < 768;

  const betDetails = useSelector((s: RootState) => s.betPlace.betDetails);
  const triggerId = useSelector((s: RootState) => s.trigger.triggerId);
  const { runnerName, status = '', back = [], lay = [], selectionId } = runnersData;

  const blockedStatuses = ['ball running', 'ballrunning', 'suspended', 'closed', 'inactive'];
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

  //api bookset
  const exposureFromBookset = useMemo(() => {
    if (!booksetCalculation || !marketData.marketId || !selectionId) return 0;

    const m = booksetCalculation.find(
      (x: any) => String(x.marketExternalId) === String(marketData.marketId)
    );
    if (!m) return 0;

    const sel = m.selections.find((s: any) => String(s.selectionId) === String(selectionId));
    return sel?.exposure ?? 0;
  }, [booksetCalculation, marketData.marketId, selectionId]);

  //exposure calculation frontend
  const calculatedPL = useMemo(() => {
    if (!betDetails?.stake) return 0;

    return (
      calculateProfitLoss(marketCategory, betDetails, eventId, selectionId, marketData.marketId) ??
      0
    );
  }, [betDetails, marketCategory, eventId, selectionId, marketData.marketId]);

  const totalExposure = exposureFromBookset + calculatedPL;

  //display odds
  const visibleBack = useMemo(() => (isMobile ? back.slice(0, 1) : back), [isMobile, back]);
  const visibleLay = useMemo(() => (isMobile ? lay.slice(0, 1) : lay), [isMobile, lay]);
  const totalOdds = visibleBack.length + visibleLay.length;

  const renderOdds = useMemo(() => {
    return reverseOddsOrder
      ? [
          { type: 'lay' as const, items: visibleLay },
          { type: 'back' as const, items: visibleBack },
        ]
      : [
          { type: 'back' as const, items: visibleBack },
          { type: 'lay' as const, items: visibleLay },
        ];
  }, [reverseOddsOrder, visibleBack, visibleLay]);

  const handleSetBetDetails = useCallback(
    (price?: number, type?: string, fancySize?: number | null, position?: number) => {
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
          betOn: type as BetOn,
          stake: 0,
          acceptOddsChange: true,
          min,
          max,
        })
      );
    },
    [dispatch, eventId, marketData, runnersData, marketCategory, selectionId, min, max]
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
// const allowedStatus = ['active', 'open', ''];

// const runnerStatus = status?.toLowerCase() || '';
// const marketStatus = marketData?.marketStatus?.toLowerCase() || '';

// const blockedStatus = !allowedStatus.includes(runnerStatus)
//   ? runnerStatus
//   : !allowedStatus.includes(marketStatus)
//     ? marketStatus
//     : null;
