import { usePlaceBetMutation } from '@/api/betPlaceApi';
import { setBetDetails, setBetPL } from '@/api/Slices/betSlice';
import { setTriggerId } from '@/api/Slices/triggerSlice';
import { useGetStakeSetQuery } from '@/api/stakesApi';
import { useCallback, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
const defaultStakes = [
  { label: '100', value: '100' },
  { label: '1000', value: '1000' },
  { label: '5000', value: '5000' },
  { label: '10000', value: '10000' },
  { label: '25000', value: '25000' },
  { label: '50000', value: '50000' },
  { label: '75000', value: '75000' },
  { label: '100000', value: '100000' },
  // { label: '500000', value: '500000' },
];
const useBetPlaceHook = () => {
  const { eventId } = useParams();
  const [acceptOddsChange, setAcceptOddsChange] = useState(true);
  const dispatch = useDispatch();
  const betDetails = useSelector((s) => s.betPlace.betDetails);
  const betPL = useSelector((s) => s.betPlace.betPL);
  const { data: stakes, isLoading: stakesLoader } = useGetStakeSetQuery();
  const stakesArr = useMemo(
    () =>
      stakes?.stakeSet?.length ? stakes?.stakeSet?.slice(0, 8) : defaultStakes,
    [stakes],
  );

  const [placeBet, { isLoading }] = usePlaceBetMutation();
  // const isDemoUser = useIsDemoUser();
  const handlePlaceBet = useCallback(async () => {
    const { min, max, ...betPayload } = betDetails;

    try {
      const res = await placeBet({
        ...betPayload,
        acceptOddsChange,
      }).unwrap();

      dispatch(setTriggerId(10));

      return {
        success: true,
        message: res?.message || 'Bet placed successfully',
      };
    } catch (err) {
      return {
        success: false,
        message: err?.data?.message || 'Failed to place bet',
      };
    } finally {
      dispatch(setBetDetails({}));
      dispatch(setBetPL(0));
    }
  }, [betDetails, acceptOddsChange, placeBet, dispatch]);

  const handleClear = useCallback(() => {
    dispatch(setBetDetails({ ...betDetails, stake: '' }));
    dispatch(setBetPL(0));
  }, [betDetails, dispatch]);

  const handleReset = useCallback(() => {
    dispatch(setBetDetails({}));
    dispatch(setBetPL(0));
  }, [dispatch]);

  const handleStakeChange = useCallback(
    (value) => {
      if (value === '' || /^\d*$/.test(value)) {
        dispatch(
          setBetDetails({
            ...betDetails,
            stake: value,
          }),
        );
      }
    },
    [betDetails, dispatch],
  );

  const increaseStake = useCallback(
    (value) => {
      dispatch(
        setBetDetails({
          ...betDetails,
          stake: Number(betDetails.stake || 0) + value,
        }),
      );
    },
    [betDetails, dispatch],
  );

  const increaseOdds = useCallback(() => {
    const current = Number(betDetails.rate || 0);
    const next = Number((current + 0.01).toFixed(2));

    dispatch(
      setBetDetails({
        ...betDetails,
        rate: next,
      }),
    );
  }, [betDetails, dispatch]);

  const decreaseOdds = useCallback(() => {
    const current = Number(betDetails.rate || 0);
    const next = Math.max(0, current - 0.01);

    dispatch(
      setBetDetails({
        ...betDetails,
        rate: Number(next.toFixed(2)),
      }),
    );
  }, [betDetails, dispatch]);

  return {
    acceptOddsChange,
    setAcceptOddsChange,
    // setIsLiveTvOpen,

    // redux data
    betDetails,
    betPL,

    // isLiveTvOpen,
    isLoading,
    stakesLoader,
    stakesArr,

    // isDemoUser,

    // handlers
    handleStakeChange,
    handlePlaceBet,
    handleClear,
    handleReset,
    increaseStake,
    increaseOdds,
    decreaseOdds,
  };
};

export default useBetPlaceHook;
