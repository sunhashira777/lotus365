import GradientHeading from '@/components/GradientHeading';
import { getAuthData } from '@/utils/apiHandlers';
import { getImage } from '@/utils/imagekit';
import React, { useEffect, useState } from 'react';

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({});

  const fetchNotifications = async () => {
    try {
      setLoading(true);

      const res = await getAuthData(
        '/notifications?type=Information&page=0&limit=10',
      );

      if (res?.status === 200) {
        const apiData = res?.data?.data;
        const apiPagination = res?.data?.pagination;

        // ✅ HANDLE OBJECT / NULL / ARRAY SAFELY
        const safeData = Array.isArray(apiData)
          ? apiData
          : Object.keys(apiData || {}).length
          ? Object.values(apiData)
          : [];

        setNotifications(safeData);
        setPagination(apiPagination || {});
      }
    } catch (error) {
      console.log('Notification Error 👉', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const isEmpty =
    !loading && (notifications.length === 0 || pagination?.total === 0);

  return (
    <div>
      <div className="w-full lg:max-w-[570px]">
        <GradientHeading heading={'Notification'} />
      </div>

      {/* LOADING */}
      {loading && (
        <div className="p-3 text-center">Loading notifications...</div>
      )}

      {/* EMPTY STATE */}
      {isEmpty && (
        <div className="bg-[#1e80671f] p-2 rounded">
          <div className="bg-white rounded flex flex-col items-center justify-center gap-2 p-3">
            <img
              className="h-[74px] w-[94px]"
              src={getImage('/images/rightDrawer/notifIcon.svg')}
              alt=""
            />
            <p className="text-18 font-bold text-center">
              No notification yet!
            </p>
            <p className="text-12 text-center max-w-[200px] leading-4">
              Check this section for updates, news and general notification
            </p>
          </div>
        </div>
      )}

      {/* LIST */}
      {!loading && notifications.length > 0 && (
        <div className="flex flex-col gap-2 mt-2">
          {notifications.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded p-3 shadow-sm border"
            >
              <p className="font-bold text-14">{item.title}</p>
              <p className="text-12 text-gray-600 mt-1">{item.body}</p>

              <p className="text-[10px] text-gray-400 mt-2">
                {new Date(item.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationPage;
