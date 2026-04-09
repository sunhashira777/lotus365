/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  fetchBetDetailsAction,
  fetchCurrentCalculationAction,
  init,
  setBetPlacementSuccess,
} from '@/redux/actions';
import { isLoggedIn, postAuthData } from '@/utils/apiHandlers';
import { reactIcons } from '@/utils/icons';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { betValidationSchema } from '@/utils/validation';
import { isYupError, parseYupError } from '@/utils/Yup';
import { calcCurrentBetStats } from '@/utils/helper';
import BetProcessing from '../NewModals/BetProcessing';
import BetEditStake from '../NewModals/BetEditStake';
import MobOpenBets from '../MobOpenBets';
import { useParams } from 'react-router-dom';
import { numberWithCommas } from '@/utils/numberWithCommas';
import BetSlipComponent from './BetSlipComponent';

const BetSlip = () => {
  const isLogin = isLoggedIn();
  const { eventId } = useParams();
  const [isOpen, setIsOpen] = useState(false);
  const [openEditStake, setOpenEditStake] = useState(false);
  const balanceInfo = useSelector((s) => s.wallet);
  const mainBalance = balanceInfo?.mainBalance ?? 0;
  const exposure = balanceInfo?.exposure ?? 0;
  const lockedAmount = balanceInfo?.lockedAmount ?? 0;
  const totalBalance = Number(
    (mainBalance - Math.abs(exposure) - Math.abs(lockedAmount)).toFixed(2),
  );
  const [stakebutton, setStakeButton] = useState([
    { text: '100', value: 100 },
    { text: '200', value: 200 },
    { text: '300', value: 300 },
    { text: '400', value: 400 },
    { text: '500', value: 500 },
    { text: '600', value: 600 },
    { text: '700', value: 700 },
    { text: '800', value: 800 },
  ]);
  const [activeTab, setActiveTab] = useState('betslip');
  const [betData, setBetData] = useState({});
  const [currentBetWinLossDatas, setCurrentBetWinLossData] = useState(null);
  const bets = useSelector((state) => state);
  console.log('userbets', bets);
  const dispatch = useDispatch();
  const [enent_ID, setEnent_ID] = useState(false);
  const [loading, setIsloading] = useState(false);
  const userInfo = useSelector((state) => state?.user?.profile);
  const [formError, setFormError] = useState({
    stake: '',
  });

  useEffect(() => {
    setActiveTab('betslip');
  }, [bets?.betPlace?.betdetails?.selectionId]);

  useEffect(() => {
    if (bets?.length == 0) {
      dispatch(fetchCurrentCalculationAction({}));
    }
  }, [bets?.length]);

  const increaseStake = () => {
    if (betData.stake > 0) {
      setBetData((prevBet) => ({ ...prevBet, stake: prevBet.stake + 50 }));
    }
  };

  useEffect(() => {
    if (userInfo) {
      const timer = setTimeout(() => {
        setBetData({ ...betData, currency: userInfo?.currency_type });
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [userInfo, betData]);

  const decreaseStake = () => {
    if (betData.stake > 50) {
      setBetData((prevBet) => ({ ...prevBet, stake: prevBet.stake - 50 }));
    }
  };

  const handleRemoveBet = (selectionId) => {
    const updatedBets = bets?.filter(
      (item) => item.selectionId !== selectionId,
    );
    setFormError({});
    dispatch(fetchBetDetailsAction(updatedBets));
    dispatch(fetchCurrentCalculationAction({}));
  };

  const handleChange = (e) => {
    let inputValue = e.target.value;
    setFormError((prev) => ({
      ...prev,
      stake: null,
    }));
    if (
      (betData?.market === 'Match Odds' || 'MATCH_ODDS') &&
      betData?._marketData?.inplay === false &&
      inputValue > 1
    ) {
      inputValue = e.target.value > 1 ? e.target.value : e.target.value;
      setBetData({ ...betData, stake: inputValue });
    } else {
      setBetData({ ...betData, stake: inputValue });
    }
    setFormError({
      ...formError,
      [name]: '',
    });
  };

  const handleProfitzero = () => {
    dispatch(fetchCurrentCalculationAction(null));
  };
  const handleRestrictedGames = async (gameId) => {
    if (userInfo?.sports_setting?.includes(gameId)) {
      return true;
    } else {
      return false;
    }
  };
  const placeBet = async (e) => {
    e.preventDefault();

    const checkRestriction = await handleRestrictedGames(betData?.gameId);
    if (checkRestriction) {
      toast.error('Betting on this sport is not permitted.');
      setIsloading(false);
      return;
    }

    if (userInfo.betLock) {
      toast.error('Betting is currently locked. You cannot place a bet.');
      return;
    }

    setIsloading(true);
    setFormError({});

    let data =
      betData?.market == 'bookmaker'
        ? {
            ...betData,
            stake: Number(betData?.stake),
            price: betData.price / 100 + 1,
          }
        : { ...betData, stake: Number(betData?.stake) };

    data.stake = Number(data?.stake);

    if (data?.stake !== 0 && data?.price !== 0) {
      try {
        await betValidationSchema.validate(
          {
            ...data,
            minimumBet:
              userInfo.currency_type === 'HKD'
                ? (betData?.minimumBet || 0) / 10
                : betData?.minimumBet || 0,
            maximumBet:
              userInfo.currency_type === 'HKD'
                ? (betData?.maximumBet || Infinity) / 100
                : betData?.maximumBet || Infinity,
          },
          { abortEarly: false },
        );

        // 1️⃣ Start both API and 6-second delay together
        const payload = {
          ...data,
          marketName: data?.market,
          runnerName: data?.selection,
          marketType: data?.market === 'Match Odds' ? 'NORMAL' : 'FANCY',
          rate: data?.price,
        };
        const apiCall = postAuthData('/bet/place', payload);
        const delay = new Promise((resolve) => setTimeout(resolve, 6000));

        // 2️⃣ Wait for both to complete
        const [response] = await Promise.all([apiCall, delay]);

        // 3️⃣ Handle API response
        if (response.status === 200) {
          setIsloading(false);
          toast.success('Bet Placed Successfully');
          handleRemoveBet(data.selectionId);
          dispatch(fetchCurrentCalculationAction({}));
          dispatch(fetchBetDetailsAction([]));
          dispatch(init([]));
          handleProfitzero();
          dispatch(setBetPlacementSuccess());
        } else {
          setIsloading(false);
          toast.dismiss();
          toast.error(response?.data?.error || 'Something went wrong');
        }
      } catch (error) {
        if (isYupError(error)) {
          setFormError(parseYupError(error));
        } else {
          toast.error('An error occurred while placing the bet');
        }
        setIsloading(false);
      }
    } else {
      setIsloading(false);
      toast.dismiss();
      toast.error('Cannot place bet due to missing odds');
    }
  };

  const handleIncrease = () => {
    if (betData?.price > 1) {
      if (betData?.market == 'Match Odds') {
        setBetData((prevData) => ({
          ...prevData,
          price: parseFloat((prevData.price + 0.01).toFixed(2)),
        }));
      } else {
        return;
      }
    } else {
      toast.dismiss();
      toast.error('Odds should be greater than 1');
    }
  };

  const handleDecrease = () => {
    if (betData?.price > 1) {
      if (betData?.market == 'Match Odds') {
        setBetData((prevData) => ({
          ...prevData,
          price: parseFloat((prevData.price - 0.01).toFixed(2)),
        }));
      } else {
        return;
      }
    } else {
      toast.dismiss();
      toast.error('Odds should be greater than 1');
    }
  };

  useEffect(() => {
    if (betData) {
      const calculationData = calcCurrentBetStats({ ...betData });
      dispatch(fetchCurrentCalculationAction(calculationData));
      setCurrentBetWinLossData(calculationData);
    }
  }, [betData, bets]);

  useEffect(() => {
    const localStakeData = JSON.parse(
      localStorage.getItem('localBetStakeData'),
    );
    if (localStakeData && Array.isArray(localStakeData)) {
      setStakeButton(localStakeData);
    }
  }, [openEditStake]);

  return (
    <>
      <div className=" pb-2 text-12 ">
        {isLogin && (
          <div className="w-full">
            {/* Header */}
            <div
              onClick={() => setIsOpen(!isOpen)}
              className="bg-[#026B4F] flex items-center justify-between px-3 py-2 cursor-pointer"
            >
              <h1 className="text-white text-sm">
                Available Credit: {numberWithCommas(totalBalance)}
              </h1>

              <div
                className={`text-white text-2xl transition-transform duration-300 ${
                  isOpen ? 'rotate-180' : ''
                }`}
              >
                {reactIcons?.downArrow}
              </div>
            </div>

            {/* Accordion Content */}
            <div
              className={`overflow-hidden transition-all duration-300 ${
                isOpen ? 'max-h-40 py-2' : 'max-h-0'
              } bg-white px-3`}
            >
              <div className="text-black text-sm space-y-1">
                <p>Balance: {numberWithCommas(totalBalance)}</p>
                <p>Exposure: {numberWithCommas(exposure)}</p>
              </div>
            </div>
          </div>
        )}

        <h1 className="border-b border-[#777]  py-1 text-16 mt-2  text-black">
          Bet Slip
        </h1>

        <div className="flex items-center justify-between mt-2">
          <div className="flex">
            <div
              onClick={() => setActiveTab('betslip')}
              className={`${
                activeTab === 'betslip' ? 'bg-white' : 'bg-[#DEDBD7]'
              }  text-12 py-2 px-[15px] rounded cursor-pointer`}
            >
              Betslip
            </div>
            <button
              onClick={() => setActiveTab('openBets')}
              disabled={!isLogin}
              className={`${
                activeTab === 'openBets' ? 'bg-white' : 'bg-[#DEDBD7]'
              } text-12 py-2 px-[15px] rounded cursor-pointer`}
            >
              Open Bets
            </button>
          </div>
          <button
            onClick={() => setOpenEditStake(true)}
            disabled={!isLogin}
            className="bg-[#1E8067] px-2 py-1 rounded text-white font-bold text-[13px]"
          >
            Edit Stakes
          </button>
        </div>
        {/* main div */}

        {activeTab !== 'openBets' && <BetSlipComponent />}

        <div className={`${activeTab === 'betslip' ? 'hidden' : ''}`}>
          <MobOpenBets eventId={eventId} activeTabSlip={activeTab} />
        </div>
      </div>

      {loading && <BetProcessing isOpen={loading} />}
      {openEditStake && (
        <BetEditStake
          isOpen={openEditStake}
          handleClose={() => setOpenEditStake(false)}
          stakebutton={stakebutton}
          setStakeButton={setStakeButton}
        />
      )}
    </>
  );
};

export default BetSlip;
