import { useEffect, useState } from 'react';
import { getAuthData, isLoggedIn } from '@/utils/apiHandlers';
import { getQueryString } from '@/utils/formatter';
import { useSelector } from 'react-redux';

let getAllBetsDataBool = false;

export const useFetchMyBetsData = ({
  take = 10,
  eventId,
  type, // CURRENT / PAST
  activeTabSlip,
}) => {
  const [betsData, setBetsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState();
  const login = isLoggedIn();
  const bets = useSelector((state) => state.bet?.selectedBet);

  const getAllBets = async () => {
    if (getAllBetsDataBool) return;
    getAllBetsDataBool = true;

    setLoading(true);

    try {
      const params = getQueryString({
        page: 0,
        limit: take,
        betTime: type ? type.toUpperCase() : 'CURRENT',
        eventId: eventId,
        // sport: sport,
      });

      const response = await getAuthData(`/bet/history?${params}`);

      if (response?.status === 200) {
        let data = response?.data?.bets || [];

        // ✅ filter by eventId (since API doesn't support it directly)
        if (eventId) {
          data = data.filter((item) => item?.eventId == eventId);
        }
        setTotal(response?.data?.pagination?.totalItems);
        setBetsData(data);
      }
    } catch (err) {
      console.error('Error fetching bets:', err);
    } finally {
      setLoading(false);
      getAllBetsDataBool = false;
    }
  };

  useEffect(() => {
    if (login) {
      getAllBets();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [take, bets, eventId, type, activeTabSlip]);
  return { betsData, loading, refetch: getAllBets, login, total };
};
