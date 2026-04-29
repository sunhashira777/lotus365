import { openModal } from '@/redux/Slices/modalSlice';
import { isLoggedIn, postAuthData } from '@/utils/apiHandlers';
import { showToast } from '@/utils/toastHandler';
import { useDispatch, useSelector } from 'react-redux';

const useCasinoGame = ({ setLoading, setIframeHtml }) => {
  const user = useSelector((state) => state?.user?.profile);
  const dispatch = useDispatch();

  const handleGameClick = async (game) => {
    if (!isLoggedIn()) {
      dispatch(openModal('login'));
      return;
    }

    setLoading(true);

    try {
      const payload = {
        platform: /Mobi|Android|iPhone/i.test(navigator.userAgent)
          ? 'mobile'
          : 'desktop',
        gameid: game?.game_id,
        id: user?.id,
      };

      const res = await postAuthData('/casino/launch', payload);
      console.log('api respomce', res);

      if ((res?.status === 200 || res?.status === 201) && res?.data?.data) {
        const raw = res.data.data;
        const json = JSON.parse(raw.substring(raw.indexOf('{')));

        window.history.pushState({ game: true }, '');

        const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport"
    content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
</head>
<body style="margin:0;padding:0;overflow:hidden;">
  ${json.gameHtml || ''}
  <script>
    ${json.gameScript || ''}

    function forceContainerHeight() {
      const el = document.getElementById("egamings_container");
      if (el) {
        el.style.height = "100vh";
        el.style.maxHeight = "100vh";
        el.style.width = "100vw";
      }
    }

    forceContainerHeight();
    setTimeout(forceContainerHeight, 100);
    setTimeout(forceContainerHeight, 500);
    setTimeout(forceContainerHeight, 1000);

    setTimeout(() => window.dispatchEvent(new Event('resize')), 300);
    setTimeout(() => window.dispatchEvent(new Event('resize')), 1000);
  </script>
</body>
</html>
        `;

        setIframeHtml(html);
      } else {
        showToast('error', 'Game launch failed');
      }
    } catch (err) {
      console.error(err);
      showToast?.('error', 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const closeGame = () => {
    setIframeHtml(null);
    window.history.back();
  };

  return {
    handleGameClick,
    closeGame,
  };
};

export default useCasinoGame;
