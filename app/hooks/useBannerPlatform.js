import { useEffect, useState } from 'react';

export const useBannerPlatform = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 1080);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return isMobile
    ? { platform: 'AppBanner', isMobile }
    : { platform: 'WebBanner', isMobile };
};
