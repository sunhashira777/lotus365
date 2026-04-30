import { Footer, Loading, Navbar } from '@/components';
import { getAuthData } from '@/utils/apiHandlers';
import { casinoProviders } from '@/utils/constants';
import { reactIcons } from '@/utils/icons';
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';
import CasinoIframe from '@/components/CasinoIframe';
import useCasinoGame from './useCasinoGame';

const Casino = () => {
  const location = useLocation();
  const itemRefs = useRef([]);
  const loaderRef = useRef(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [casinoData, setCasinoData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [activeProvider, setActiveProvider] = useState('ALL');
  const [activeCategory, setActiveCategory] = useState('All');

  const [iframeHtml, setIframeHtml] = useState(null);

  const LIMIT = 50;
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  /* -------------------- Debounce Search -------------------- */
  const provider = location.state?.provider;
  const type = location.state?.type;
  console.log('provider', provider);
  useEffect(() => {
    if (type === 'provider') {
      setActiveProvider(provider);
      setActiveCategory('All');
      setSearchTerm('');
      setIframeHtml(null);
    } else if (type === 'category') {
      setActiveCategory(provider);
      setSearchTerm('');
      setIframeHtml(null);
    }
  }, [provider, type]);
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchTerm), 500);
    return () => clearTimeout(t);
  }, [searchTerm]);

  /* -------------------- Handle Browser Back -------------------- */
  useEffect(() => {
    const handleBack = () => {
      if (iframeHtml) {
        setIframeHtml(null);
      }
    };

    window.addEventListener('popstate', handleBack);
    return () => window.removeEventListener('popstate', handleBack);
  }, [iframeHtml]);

  /* -------------------- Providers -------------------- */
  const handleProviderClick = (provider) => {
    setActiveProvider(provider);
    setActiveCategory('All');
    setSearchTerm('');
    setIframeHtml(null);
  };

  /* -------------------- Categories -------------------- */
  const handleCategoryClick = (category, index) => {
    setActiveCategory(category?.category || 'All');
    setSearchTerm('');
    setIframeHtml(null);

    if (itemRefs.current[index]) {
      itemRefs.current[index].scrollIntoView({ behavior: 'smooth' });
    }
  };

  /* -------------------- Fetch Categories -------------------- */
  const getCategories = async () => {
    try {
      const params = new URLSearchParams();

      if (activeProvider.toLowerCase() !== 'all') {
        params.append('provider', activeProvider.toLowerCase());
      }

      const res = await getAuthData(`/casino/category?${params.toString()}`);

      // const categoriesArray = res?.games || [];
      const categoriesArray = res?.data?.games || [];
      // 🔥 FORMAT SAME AS OLD UI
      const formattedCategories = [
        { category: 'All' },
        ...categoriesArray.map((cat) => ({
          category: cat,
        })),
      ];

      setCategories(formattedCategories);
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch categories');
    }
  };
  /* -------------------- Fetch Games -------------------- */
  const getCasinoData = async (loadMore = false) => {
    if (loading || loadingMore || !hasMore) return;

    loadMore ? setLoadingMore(true) : setLoading(true);

    try {
      const page = loadMore ? Math.floor(offset / LIMIT) + 1 : 1;

      const params = new URLSearchParams();
      params.append('page', page);
      params.append('limit', LIMIT);
      params.append('status', 'ACTIVE');
      params.append('search', searchTerm);

      // ✅ PROVIDER FIX
      if (activeProvider.toLowerCase() !== 'all') {
        params.append('provider', activeProvider.toLowerCase());
      }

      const res = await getAuthData(`/casino/games?${params.toString()}`);
      const gamesArray = res?.data?.games || [];
      // 🔥 IMPORTANT mapping (old → new)
      const mappedGames = gamesArray.map((g) => ({
        ...g,
        game_id: g.externalId, // launch ke liye
        game_images: g.gameImage, // UI ke liye
      }));

      // 🔥 CATEGORY FILTER FIX
      const filteredGames =
        activeCategory === 'All'
          ? mappedGames
          : mappedGames.filter(
              (g) => g.category?.toLowerCase() === activeCategory.toLowerCase(),
            );

      setCasinoData((prev) =>
        loadMore ? [...prev, ...filteredGames] : filteredGames,
      );

      setOffset((prev) => (loadMore ? prev + LIMIT : LIMIT));

      if (mappedGames.length < LIMIT) setHasMore(false);
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch games');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };
  /* -------------------- Infinite Scroll -------------------- */
  useEffect(() => {
    if (!loaderRef.current || !hasMore) return;

    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && getCasinoData(true),
      { threshold: 1 },
    );

    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [hasMore, offset]);

  useEffect(() => {
    setOffset(0);
    setHasMore(true);
    setCasinoData([]);
    getCasinoData();
  }, [activeCategory, activeProvider, debouncedSearch]);

  useEffect(() => {
    getCategories();
  }, [activeProvider]);

  /* -------------------- Launch Game -------------------- */
  const { handleGameClick, closeGame } = useCasinoGame({
    setLoading,
    setIframeHtml,
  });

  /* -------------------- UI -------------------- */
  return (
    <div className="min-h-screen">
      <Navbar />

      {!iframeHtml ? (
        <>
          <div className="p-2">
            <div className="bg-[#249F62] py-1 px-3 rounded text-white font-bold flex gap-1">
              {reactIcons.play} Casino
            </div>

            <input
              className="w-full border mt-2 px-3 py-1"
              placeholder="Search Games"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            {/* Providers */}
            <div className="flex gap-1 mt-2 overflow-x-auto">
              {casinoProviders.map((p) => (
                <button
                  key={p}
                  onClick={() => handleProviderClick(p)}
                  className={`px-3 capitalize text-12 font-roboto py-1 whitespace-nowrap ${
                    activeProvider === p
                      ? 'bg-yellow-400'
                      : 'bg-[linear-gradient(180deg,#1e8067,#1e8067_48.4%,#2f3332)] text-white'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Categories */}
            <div className="flex mt-2 overflow-x-auto no-scrollbar px-1">
              {categories.map((cat, i) => (
                <div
                  key={i}
                  ref={(el) => (itemRefs.current[i] = el)}
                  onClick={() => handleCategoryClick(cat, i)}
                  className={`flex flex-col items-center justify-center 
        min-w-[80px] h-[60px] cursor-pointer 
        border transition-all
        ${
          activeCategory === cat.category
            ? 'bg-yellow-400 border-yellow-500 text-white'
            : 'bg-[#e9e9e9] border-gray-300'
        }`}
                >
                  {/* Icon */}
                  <img
                    src="/images/casino.svg"
                    alt={cat.category}
                    className="w-6 h-6 mb-1"
                  />

                  {/* Label */}
                  <span className="text-[12px] whitespace-nowrap font-medium text-center px-1">
                    {cat.category}
                  </span>
                </div>
              ))}
            </div>

            {/* Games */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
              {casinoData.map((game, i) => (
                <img
                  key={i}
                  src={game.game_images}
                  className="cursor-pointer"
                  onClick={() => handleGameClick(game)}
                />
              ))}
            </div>

            {hasMore && <div ref={loaderRef} className="h-10" />}
            {loading && <Loading isLoading />}
          </div>

          <Footer />
        </>
      ) : (
        /* ---------------- GAME VIEW ---------------- */
        <CasinoIframe
          iframeHtml={iframeHtml}
          onBack={() => {
            setIframeHtml(null);
            window.history.back();
          }}
        />
      )}
    </div>
  );
};

export default Casino;
